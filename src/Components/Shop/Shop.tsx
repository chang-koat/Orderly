// src/Components/Shop/Shop.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Shop.css";

import { Store, Product, fetchProducts, addToCart } from "../../api";

interface LocationState {
  store?: Store;
}

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { store } = (location.state as LocationState) || {};

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadProducts() {
      // If someone hits /shop directly with no state, just stop
      if (!store) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setStatus(null);
        // backend expects ?store=<store UUID/name>
        const data = await fetchProducts(store.UUID);
        setProducts(data);
      } catch (err) {
        console.error(err);
        setStatus("Could not load products for this shop.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [store]);

  async function handleAddToCart(productId: number) {
    try {
      setAddingId(productId);
      setStatus(null);

      // calls POST /api/cart/add/ with { product_id, quantity }
      await addToCart({ productId, quantity: 1 });

      setStatus("Item added to cart.");
    } catch (err) {
      console.error(err);
      setStatus("Could not add item to cart. Please try again.");
    } finally {
      setAddingId(null);
    }
  }

  if (!store) {
    return (
      <div className="shop-page">
        <button className="shop-back-btn" onClick={() => navigate("/shops")}>
          ← Back to shops
        </button>
        <p>No shop selected.</p>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <button className="shop-back-btn" onClick={() => navigate("/shops")}>
        ← Back to shops
      </button>

      <div className="shop-header">
        <h2>{store.Name || "Shop"}</h2>
        <p>{store.Description || "All the essentials you'll need."}</p>
        {store.Address && (
          <p className="shop-subline">Online only · {store.Address}</p>
        )}
      </div>

      {status && <p className="shop-status">{status}</p>}

      {loading ? (
        <p className="shop-loading">Loading items…</p>
      ) : products.length === 0 ? (
        <p className="shop-empty">No items available in this shop yet.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              {product.image_url ? (
                <img
                  className="product-image"
                  src={product.image_url}
                  alt={product.name}
                />
              ) : (
                <div className="product-image product-placeholder">
                  No image
                </div>
              )}

              <div className="product-name">{product.name}</div>
              <div className="product-description">
                {product.description || "Customize pricing / details later"}
              </div>
              <div className="product-price">${product.price}</div>

              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product.id)}
                disabled={addingId === product.id}
              >
                {addingId === product.id ? "Adding…" : "Add to cart"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;