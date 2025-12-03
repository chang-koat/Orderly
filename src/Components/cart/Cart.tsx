// src/Components/Cart/Cart.tsx
import React, { useEffect, useState } from "react";
import "./Cart.css";
import {
  Cart as ApiCart,
  fetchCart,
  removeFromCart,
  clearCart,
  createOrder,
} from "../../api";

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<ApiCart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string | null>(null);
  const [workingItemId, setWorkingItemId] = useState<number | null>(null);
  const [placingOrder, setPlacingOrder] = useState<boolean>(false);

  async function loadCart() {
    try {
      setLoading(true);
      setStatus(null);
      const data = await fetchCart();
      setCart(data);
    } catch (err) {
      console.error(err);
      setStatus("Could not load your cart. Please try again.");
      setCart(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  // compute subtotal either from cart.total (backend) or from items
  const subtotal = (() => {
    if (!cart) return "0.00";

    if (cart.total !== undefined && cart.total !== null) {
      return typeof cart.total === "string"
        ? cart.total
        : cart.total.toFixed(2);
    }

    const items = cart.items ?? [];
    const sum = items.reduce((acc, item) => {
      const price = parseFloat(item.product.price);
      if (Number.isNaN(price)) return acc;
      return acc + price * item.quantity;
    }, 0);
    return sum.toFixed(2);
  })();

  async function handleRemove(itemId: number) {
    try {
      setWorkingItemId(itemId);
      setStatus(null);
      const updated = await removeFromCart(itemId);
      setCart(updated);
    } catch (err) {
      console.error(err);
      setStatus("Could not remove item. Please try again.");
    } finally {
      setWorkingItemId(null);
    }
  }

  async function handleClear() {
    try {
      setStatus(null);
      const updated = await clearCart();
      setCart(updated);
    } catch (err) {
      console.error(err);
      setStatus("Could not clear cart. Please try again.");
    }
  }

  async function handleCheckout() {
    try {
      setPlacingOrder(true);
      setStatus(null);
      await createOrder();
      setStatus("Order placed successfully!");
      const updated = await fetchCart(); // backend should empty cart
      setCart(updated);
    } catch (err) {
      console.error(err);
      setStatus("Could not place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <div className="cart-page">
        <h2 className="cart-title">Your cart</h2>
        <p className="cart-status">Loading your cart…</p>
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (!cart || items.length === 0) {
    return (
      <div className="cart-page">
        <h2 className="cart-title">Your cart</h2>
        {status && <p className="cart-status">{status}</p>}
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">Your cart</h2>

      {status && <p className="cart-status">{status}</p>}

      <div className="cart-layout">
        {/* LEFT: items */}
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-main">
                <div className="cart-item-name">{item.product.name}</div>
                <div className="cart-item-description">
                  {item.product.description}
                </div>
                <div className="cart-item-price">
                  ${parseFloat(item.product.price).toFixed(2)} ×{" "}
                  {item.quantity}
                </div>
              </div>

              <button
                className="cart-remove-btn"
                onClick={() => handleRemove(item.id)}
                disabled={workingItemId === item.id}
              >
                {workingItemId === item.id ? "Removing…" : "Remove"}
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT: summary */}
        <aside className="cart-summary">
          <div className="cart-subtotal">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>

          <div className="cart-actions">
            <button className="cart-clear-btn" onClick={handleClear}>
              Clear cart
            </button>
            <button
              className="cart-checkout-btn"
              onClick={handleCheckout}
              disabled={placingOrder}
            >
              {placingOrder ? "Placing order…" : "Checkout"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;