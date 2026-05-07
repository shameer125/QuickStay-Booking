import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, Search, SlidersHorizontal } from "lucide-react";
import api from "../utils/api";
import RoomImg from "../components/RoomImg";
import "./SearchResults.css";

const PRICE_PRESETS = [
  { label: "Any price", min: null, max: null },
  { label: "Under $250", min: 0, max: 250 },
  { label: "$250 – $500", min: 250, max: 500 },
  { label: "$500+", min: 500, max: 100000 },
];

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const destination = (query.get("location") || "").trim();
  const checkIn = query.get("checkIn") || "";
  const checkOut = query.get("checkOut") || "";
  const guestsParam = query.get("guests") || "";

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [filters, setFilters] = useState({
    categories: [],
    priceLabel: "Any price",
    sort: "Recommended",
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const params = destination ? { location: destination } : {};
        const { data } = await api.get("/rooms", { params });
        setRooms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Search fetch error:", err);
        setFetchError("Unable to load listings. Check your connection.");
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [destination]);

  const filteredRooms = useMemo(() => {
    let result = [...rooms];
    const preset = PRICE_PRESETS.find(
      (p) => p.label === filters.priceLabel,
    );
    if (preset && preset.min != null && preset.max != null) {
      result = result.filter(
        (r) => r.price >= preset.min && r.price <= preset.max,
      );
    }

    if (destination) {
      const d = destination.toLowerCase();
      result = result.filter(
        (r) =>
          r.location?.city?.toLowerCase().includes(d) ||
          r.location?.country?.toLowerCase().includes(d) ||
          r.title?.toLowerCase().includes(d),
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((r) =>
        filters.categories.includes(r.category),
      );
    }

    switch (filters.sort) {
      case "Price Low to High":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Price High to Low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "Top Rated":
        result.sort(
          (a, b) =>
            (Number(b.rating) || 0) - (Number(a.rating) || 0),
        );
        break;
      case "Recommended":
      default:
        result.sort(
          (a, b) =>
            Number(b.offer || 0) - Number(a.offer || 0),
        );
        break;
    }

    return result;
  }, [rooms, destination, filters]);

  const toggleCategory = (value) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((c) => c !== value)
        : [...prev.categories, value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceLabel: "Any price",
      sort: "Recommended",
    });
  };

  const metaLine = [
    destination && `"${destination}"`,
    checkIn && checkOut && `${checkIn} → ${checkOut}`,
    guestsParam && `${guestsParam} guest${guestsParam !== "1" ? "s" : ""}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="search-results-page-clean">
      <div className="container">
        <header className="results-header-clean">
          <h1>
            {destination
              ? `Stays in "${destination}"`
              : "Explore the collection"}
          </h1>
          {metaLine ? (
            <p className="results-meta-line">{metaLine}</p>
          ) : null}
          <p>
            Showing <strong>{filteredRooms.length}</strong> of{" "}
            <strong>{rooms.length}</strong> properties
            {destination ? " matching your search" : ""}. Refine with filters
            or open a listing for full amenities and secure checkout.
          </p>
          {fetchError ? (
            <p className="results-error-banner">{fetchError}</p>
          ) : null}
          <button
            type="button"
            className="mobile-filter-trigger"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </header>

        <div className="catalog-layout">
          <main className="inventory-section">
            <div className="rooms-list">
              {loading ? (
                <div className="loading">Searching properties...</div>
              ) : filteredRooms.length === 0 ? (
                <div className="empty-results">
                  <Search size={48} color="#9ca3af" />
                  <h3>No properties match</h3>
                  <p>
                    Try another destination, clear filters, or browse the full
                    directory.
                  </p>
                  <div className="empty-actions">
                    <button
                      type="button"
                      className="btn-outline-dark"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </button>
                    <button
                      type="button"
                      className="btn-outline-dark"
                      onClick={() => navigate("/rooms")}
                    >
                      All stays
                    </button>
                    <button
                      type="button"
                      className="btn-outline-dark"
                      onClick={() => navigate("/")}
                    >
                      Home
                    </button>
                  </div>
                </div>
              ) : (
                filteredRooms.map((room, idx) => (
                  <motion.div
                    key={room._id}
                    className="room-horizontal-card"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <div className="card-image">
                      <RoomImg room={room} slot={0} alt="" loading="lazy" />
                      {room.offer > 0 ? (
                        <span className="card-offer-chip">
                          {room.offer}% off
                        </span>
                      ) : null}
                    </div>
                    <div className="card-info">
                      <span className="location-text">
                        {room.location?.address}, {room.location?.city}
                      </span>
                      <div className="title-row">
                        <h3>{room.title}</h3>
                        <div className="rating">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              size={14}
                              fill={
                                n <=
                                Math.round(Number(room.rating) || 4.8)
                                  ? "#f59e0b"
                                  : "none"
                              }
                              color="#f59e0b"
                            />
                          ))}
                          <span>{room.numReviews || 180}+ reviews</span>
                        </div>
                      </div>
                      <p className="card-loc">
                        <MapPin size={14} aria-hidden />{" "}
                        {room.location?.city}, {room.location?.country} ·{" "}
                        {room.category}
                      </p>

                      <div className="amenities-row">
                        {(room.amenities || ["WiFi", "Concierge"])
                          .slice(0, 4)
                          .map((a) => (
                            <span key={a} className="amenity">
                              {a}
                            </span>
                          ))}
                      </div>

                      <div className="card-footer">
                        <div className="price-tag-blue">
                          ${room.price} <span>/night</span>
                        </div>
                        <Link to={`/room/${room._id}`} className="details-btn">
                          View details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </main>

          <aside className="sidebar-filters">
            <div className="sidebar-header">
              <h3>Filters</h3>
              <button type="button" className="clear-btn" onClick={clearFilters}>
                Clear
              </button>
            </div>

            <div className="filter-group">
              <h4>Property category</h4>
              <div className="options">
                {["Hotel", "Resort", "Villa", "Apartment"].map((opt) => (
                  <label key={opt} className="check-option">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(opt)}
                      onChange={() => toggleCategory(opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group border-top">
              <h4>Nightly rate</h4>
              <div className="options">
                {PRICE_PRESETS.map((preset) => (
                  <label key={preset.label} className="radio-option">
                    <input
                      type="radio"
                      name="price-band"
                      checked={filters.priceLabel === preset.label}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          priceLabel: preset.label,
                        }))
                      }
                    />
                    <span>{preset.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group border-top">
              <h4>Sort by</h4>
              <div className="options">
                {[
                  "Recommended",
                  "Price Low to High",
                  "Price High to Low",
                  "Top Rated",
                ].map((opt) => (
                  <label key={opt} className="radio-option">
                    <input
                      type="radio"
                      name="sort-search"
                      checked={filters.sort === opt}
                      onChange={() =>
                        setFilters((prev) => ({ ...prev, sort: opt }))
                      }
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {mobileFiltersOpen && (
            <div
              className="filter-drawer-overlay"
              role="presentation"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <div
                className="filter-drawer"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="drawer-header">
                  <h3>Filters</h3>
                  <button
                    type="button"
                    className="close-drawer"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="drawer-content">
                  <div className="filter-group">
                    <h4>Property category</h4>
                    <div className="options">
                      {["Hotel", "Resort", "Villa", "Apartment"].map((opt) => (
                        <label key={opt} className="check-option">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(opt)}
                            onChange={() => toggleCategory(opt)}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="filter-group">
                    <h4>Nightly rate</h4>
                    <div className="options">
                      {PRICE_PRESETS.map((preset) => (
                        <label key={preset.label} className="radio-option">
                          <input
                            type="radio"
                            name="price-m"
                            checked={filters.priceLabel === preset.label}
                            onChange={() =>
                              setFilters((prev) => ({
                                ...prev,
                                priceLabel: preset.label,
                              }))
                            }
                          />
                          <span>{preset.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="filter-group">
                    <h4>Sort by</h4>
                    <div className="options">
                      {[
                        "Recommended",
                        "Price Low to High",
                        "Price High to Low",
                        "Top Rated",
                      ].map((opt) => (
                        <label key={opt} className="radio-option">
                          <input
                            type="radio"
                            name="sort-m-s"
                            checked={filters.sort === opt}
                            onChange={() =>
                              setFilters((prev) => ({ ...prev, sort: opt }))
                            }
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="drawer-footer">
                  <button
                    type="button"
                    className="apply-btn"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    Apply filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
