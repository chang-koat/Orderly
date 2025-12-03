// src/Components/Payment Pages/paymentpages.tsx
import React, { useEffect, useState } from "react";
import "./paymentpages.css";
import {
  PaymentMethod,
  fetchPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
} from "../../api";

const PaymentPage: React.FC = () => {
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [zip, setZip] = useState("");

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoadingMethods(true);
        setStatus(null);
        const data = await fetchPaymentMethods();
        setMethods(data);
      } catch (err) {
        console.error(err);
        setStatus("Could not load saved payment methods.");
        setMethods([]);
      } finally {
        setLoadingMethods(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nameOnCard || !cardNumber || !expiry) {
      setStatus("Please fill in name, card number, and expiry.");
      return;
    }

    try {
      setSaving(true);
      setStatus(null);

      const newMethod = await addPaymentMethod({
        name_on_card: nameOnCard,
        card_number: cardNumber,
        expiry,
        cvv,
        zip,
      });

      setMethods((prev) => [newMethod, ...prev]);

      // clear sensitive bits
      setCardNumber("");
      setCvv("");

      setStatus("Card saved successfully.");
    } catch (err) {
      console.error(err);
      setStatus("Could not save card. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      setDeletingId(id);
      setStatus(null);
      await deletePaymentMethod(id);
      setMethods((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      setStatus("Could not delete card. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="payment-page">
      <div className="payment-header">
        <h2 className="payment-title">Payment methods</h2>
        <p className="payment-subtitle">
          Save a card to use during checkout. This demo only stores the last 4
          digits, not the full card number or CVV.
        </p>
      </div>

      {status && <p className="payment-status">{status}</p>}

      <div className="payment-layout">
        {/* LEFT: add card */}
        <div className="payment-column">
          <div className="payment-panel">
            <h3 className="payment-panel-title">Add a card</h3>

            <form className="payment-form" onSubmit={handleSubmit}>
              <label className="payment-label">
                Name on card
                <input
                  type="text"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  className="payment-input"
                  placeholder="Chang Koat"
                  required
                />
              </label>

              <label className="payment-label">
                Card number
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="payment-input"
                  placeholder="4242 4242 4242 4242"
                  required
                />
              </label>

              <div className="payment-row">
                <label className="payment-label payment-row-item">
                  Expiry
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="payment-input"
                    placeholder="12/27"
                    required
                  />
                </label>

                <label className="payment-label payment-row-item">
                  CVV
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="payment-input"
                    placeholder="123"
                  />
                </label>
              </div>

              <label className="payment-label">
                ZIP code
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="payment-input"
                  placeholder="68102"
                />
              </label>

              <button
                className="payment-save-btn"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save card"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: saved cards */}
        <div className="payment-column">
          <div className="payment-panel">
            <h3 className="payment-panel-title">Saved cards</h3>

            {loadingMethods ? (
              <p>Loading your cards…</p>
            ) : methods.length === 0 ? (
              <p className="payment-empty">
                You don’t have any saved cards yet.
              </p>
            ) : (
              <div className="payment-card-list">
                {methods.map((m) => (
                  <div key={m.id} className="payment-card-item">
                    <div className="payment-card-main">
                      <div className="payment-card-name">
                        {m.name_on_card || "Saved card"}
                      </div>
                      <div className="payment-card-details">
                        <span>•••• {m.card_last4}</span>
                        <span> · Expires {m.expiry}</span>
                        {m.zip && <span> · {m.zip}</span>}
                      </div>
                      <div className="payment-card-meta">
                        Added {new Date(m.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <button
                      className="payment-delete-btn"
                      onClick={() => handleDelete(m.id)}
                      disabled={deletingId === m.id}
                    >
                      {deletingId === m.id ? "Removing…" : "Remove"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

