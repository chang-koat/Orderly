import React, { useState } from "react";
import api from "../../api";
import "./paymentpages.css";

interface PaymentForm {
  nameOnCard: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  billingAddress: string;
}

const PaymentPage: React.FC = () => {
  const [form, setForm] = useState<PaymentForm>({
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    billingAddress: "",
  });

  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setStatusType(null);

    if (!form.nameOnCard || !form.cardNumber || !form.expiry || !form.cvv) {
      setStatus("Please fill in all required card details.");
      setStatusType("error");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post("/api/payments/", {
        name_on_card: form.nameOnCard,
        card_number: form.cardNumber,
        expiry: form.expiry,
        cvv: form.cvv,
        billing_address: form.billingAddress,
      });

      console.log(response.data);
      setStatus("Payment processed successfully (demo).");
      setStatusType("success");
    } catch (err) {
      console.error(err);
      setStatus("Could not process payment. Please try again.");
      setStatusType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="payment-page">
      <div className="payment-card">
        <div className="payment-header">
          <h2>Checkout</h2>
          <p>Review your order and enter your payment details.</p>
        </div>

        <div className="payment-layout">
          {/* Order Summary */}
          <section className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items</span>
              <span>$32.00</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>$2.56</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>$34.56</span>
            </div>
            <p className="summary-note">* Demo values for class project</p>
          </section>

          {/* Payment Form */}
          <section className="payment-form-wrapper">
            <h3>Payment Details</h3>

            <form className="payment-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>
                  <span>Name on card *</span>
                  <input
                    name="nameOnCard"
                    value={form.nameOnCard}
                    onChange={handleChange}
                    type="text"
                    placeholder="Name on card"
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  <span>Card number *</span>
                  <input
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    type="text"
                    placeholder="1234 5678 9012 3456"
                  />
                </label>
              </div>

              <div className="form-row payment-grid">
                <label>
                  <span>Expiry (MM/YY) *</span>
                  <input
                    name="expiry"
                    value={form.expiry}
                    onChange={handleChange}
                    type="text"
                    placeholder="12/27"
                  />
                </label>

                <label>
                  <span>CVV *</span>
                  <input
                    name="cvv"
                    value={form.cvv}
                    onChange={handleChange}
                    type="password"
                    placeholder="123"
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  <span>Billing address</span>
                  <textarea
                    name="billingAddress"
                    value={form.billingAddress}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Street, city, state, ZIP"
                  />
                </label>
              </div>

              <button className="pay-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Pay $34.56"}
              </button>

              {status && (
                <p
                  className={`payment-status ${
                    statusType === "success" ? "status-success" : "status-error"
                  }`}
                >
                  {status}
                </p>
              )}
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};



export default PaymentPage;


