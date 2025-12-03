// src/Components/Shops/Shops.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Shops.css";

import { Store, fetchStores } from "../../api";

const Shops: React.FC = () => {
  const navigate = useNavigate();

  const [shops, setShops] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setStatus(null);

        // ✅ GET /api/stores/
        const data = await fetchStores();
        const normalized = data.map((s) => ({
          ...s,
          // fall back so we never render an empty name
          name: s.Name || s.UUID || "Unnamed shop",
        }));

        console.log("Shops from backend:", normalized);
        setShops(normalized);
      } catch (err: any) {
        console.error("Error loading shops:", err);
        // show the real error text if we have it
        const msg =
          typeof err?.message === "string"
            ? err.message
            : "Could not load shops. Please try again.";
        setStatus(msg);
        setShops([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredShops = shops.filter((shop) =>
    (shop.name || "").toLowerCase().includes(search.toLowerCase())
  );

  function handleOpenShop(shop: Store) {
    navigate("/shop", { state: { store: shop } });
  }

  return (
    <div className="shops-page">
      <header className="shops-header">
        <h1 className="shops-title">Featured Shops</h1>
        <div className="shops-search-wrapper">
          <input
            type="text"
            placeholder="Search shops"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shops-search-input"
          />
          <button className="shops-filter-btn" type="button">
            Filter
          </button>
        </div>
      </header>

      {status && (
        <p className="shops-status shops-status-error">
          {status}
        </p>
      )}

      {loading ? (
        <p className="shops-status">Loading shops…</p>
      ) : filteredShops.length === 0 ? (
        <p className="shops-status">No shops found.</p>
      ) : (
        <div className="shops-grid">
          {filteredShops.map((shop) => (
            <button
              key={shop.UUID}
              type="button"
              className="shop-card"
              onClick={() => handleOpenShop(shop)}
            >
              <div className="shop-card-image">
                {/* You can swap this for a real image field later */}
                <span className="shop-card-initial">
                  {(shop.name || "?")[0].toUpperCase()}
                </span>
              </div>
              <div className="shop-card-info">
                <div className="shop-card-name">{shop.name}</div>
                <div className="shop-card-desc">
                  {shop.Description || "Everything you need, in one place."}
                </div>
                <div className="shop-card-meta">
                  {shop.Address || "Online only"}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shops;
