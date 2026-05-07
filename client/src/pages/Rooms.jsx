import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import api from "../utils/api";
import RoomImg from "../components/RoomImg";
import "./Rooms.css";

const TYPE_OPTIONS = [
  "Single Bed",
  "Double Bed",
  "Deluxe",
  "Suite",
  "Family Suite",
  "Luxury Room",
];
const CATEGORY_OPTIONS = ["Hotel", "Resort", "Villa", "Apartment"];

const PRICE_RANGES = {
  "$100 to $300": [100, 300],
  "$300 to $600": [300, 600],
  "$600 to $1000": [600, 1000],
};

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: [],
    category: [],
    price: null,
    sort: "Newest First",
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/rooms");
        setRooms(data);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleFilterChange = (category, value) => {
    if (category === "type" || category === "category") {
      setFilters((prev) => ({
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter((item) => item !== value)
          : [...prev[category], value],
      }));
    } else {
      setFilters((prev) => ({ ...prev, [category]: value }));
    }
  };

  const filteredRooms = useMemo(() => {
    let list = [...rooms];
    if (filters.type.length) {
      list = list.filter((r) => filters.type.includes(r.type));
    }
    if (filters.category.length) {
      list = list.filter((r) => filters.category.includes(r.category));
    }
    if (filters.price && PRICE_RANGES[filters.price]) {
      const [min, max] = PRICE_RANGES[filters.price];
      list = list.filter((r) => r.price >= min && r.price <= max);
    }
    switch (filters.sort) {
      case "Price Low to High":
        list.sort((a, b) => a.price - b.price);
        break;
      case "Price High to Low":
        list.sort((a, b) => b.price - a.price);
        break;
      case "Newest First":
      default:
        list.sort(
          (a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
    }
    return list;
  }, [rooms, filters]);

  return (
    <div className="rooms-exact-page">
      <div className="container">
        <header className="rooms-head-exact">
           <h1>Browse stays</h1>
           <p>Filter by room type, property category, and nightly rate—then refine with sort options. Every listing shows live availability during checkout.</p>
           <button type="button" className="mobile-filter-trigger" onClick={() => setMobileFiltersOpen(true)}>
              Filters
           </button>
        </header>

        <div className="rooms-layout-exact">
           {/* Main List */}
           <main className="rooms-list-exact">
              {loading ? (
                <div className="loading-exact">Searching properties...</div>
              ) : rooms.length === 0 ? (
                <div className="loading-exact">No rooms found. Check back later!</div>
              ) : filteredRooms.length === 0 ? (
                <div className="loading-exact">No stays match these filters—try widening your selection.</div>
              ) : (
                filteredRooms.map((room, idx) => (
                  <motion.div
                    key={room._id}
                    className="room-card-h-exact"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <Link to={`/room/${room._id}`} className="card-image-h">
                        <RoomImg
                          room={room}
                          slot={0}
                          alt={room.title}
                          loading="lazy"
                        />
                     </Link>
                     <div className="card-info-h">
                        <span className="loc-sup">{room.location?.address || "Beachfront Drive"}, {room.location?.city || "City"}</span>
                        <div className="title-row-h">
                           <Link to={`/room/${room._id}`}><h3>{room.title}</h3></Link>
                           <div className="rating-h">
                              {[...Array(5)].map((_, si) => (
                                <Star
                                  key={si}
                                  size={14}
                                  fill={
                                    si < Math.round(room.rating || 4)
                                      ? "#f59e0b"
                                      : "none"
                                  }
                                  color="#f59e0b"
                                />
                              ))}
                              <span>{room.numReviews || 180}+ reviews</span>
                           </div>
                        </div>
                        <p className="card-loc-h"><MapPin size={14} /> {room.location?.city || "Los Angeles"}, {room.location?.country || "USA"}</p>
                        <div className="amenities-h">
                           {(room.amenities?.length ? room.amenities : ["WiFi", "Concierge"]).slice(0, 4).map((am) => (
                             <span key={am}>{am}</span>
                           ))}
                        </div>
                        <div className="card-footer-h">
                           <span className="price-h">$ {room.price} <span className="unit">/day</span></span>
                           <Link to={`/room/${room._id}`} className="view-details-link">View Details</Link>
                        </div>
                     </div>
                  </motion.div>
                ))
              )}
              {rooms.length > 0 && !loading && (
                <p className="rooms-results-meta" role="status">
                  Showing <strong>{filteredRooms.length}</strong> of{" "}
                  <strong>{rooms.length}</strong> stays
                </p>
              )}
           </main>

           {/* Sidebar */}
           <aside className="filters-sidebar-exact">
              <div className="sidebar-header-exact">
                 <h3>FILTERS</h3>
                 <button type="button" onClick={() => setFilters({ type: [], category: [], price: null, sort: "Newest First" })}>CLEAR</button>
              </div>

              <div className="filter-sec">
                 <h4>Room type</h4>
                 <div className="options-stack">
                    {TYPE_OPTIONS.map(opt => (
                      <label key={opt} className="check-box-exact">
                         <input type="checkbox" checked={filters.type.includes(opt)} onChange={() => handleFilterChange('type', opt)} />
                         <span>{opt}</span>
                      </label>
                    ))}
                 </div>
              </div>

              <div className="filter-sec">
                 <h4>Property category</h4>
                 <div className="options-stack">
                    {CATEGORY_OPTIONS.map(opt => (
                      <label key={opt} className="check-box-exact">
                         <input type="checkbox" checked={filters.category.includes(opt)} onChange={() => handleFilterChange('category', opt)} />
                         <span>{opt}</span>
                      </label>
                    ))}
                 </div>
              </div>

              <div className="filter-sec">
                 <h4>Price</h4>
                 <div className="options-stack">
                    {["$100 to $300", "$300 to $600", "$600 to $1000"].map(opt => (
                      <label key={opt} className="check-box-exact">
                         <input type="radio" name="price" checked={filters.price === opt} onChange={() => handleFilterChange('price', opt)} />
                         <span>{opt}</span>
                      </label>
                    ))}
                 </div>
              </div>

              <div className="filter-sec">
                 <h4>Sort By</h4>
                 <div className="options-stack">
                    {["Price Low to High", "Price High to Low", "Newest First"].map(opt => (
                      <label key={opt} className="check-box-exact">
                         <input type="radio" name="sort" checked={filters.sort === opt} onChange={() => handleFilterChange('sort', opt)} />
                         <span>{opt}</span>
                      </label>
                    ))}
                 </div>
              </div>
           </aside>

           {/* Mobile Filter Drawer */}
           {mobileFiltersOpen && (
             <div className="filter-drawer-overlay" onClick={() => setMobileFiltersOpen(false)}>
                <div className="filter-drawer" onClick={e => e.stopPropagation()}>
                   <div className="drawer-header">
                      <h3>Filters</h3>
                      <button className="close-drawer" onClick={() => setMobileFiltersOpen(false)}>✕</button>
                   </div>
                   <div className="drawer-content">
                         <div className="filter-sec">
                         <h4>Room type</h4>
                         <div className="options-stack">
                            {TYPE_OPTIONS.map(opt => (
                              <label key={opt} className="check-box-exact">
                                 <input type="checkbox" checked={filters.type.includes(opt)} onChange={() => handleFilterChange('type', opt)} />
                                 <span>{opt}</span>
                              </label>
                            ))}
                         </div>
                      </div>
                      <div className="filter-sec">
                         <h4>Property category</h4>
                         <div className="options-stack">
                            {CATEGORY_OPTIONS.map(opt => (
                              <label key={opt} className="check-box-exact">
                                 <input type="checkbox" checked={filters.category.includes(opt)} onChange={() => handleFilterChange('category', opt)} />
                                 <span>{opt}</span>
                              </label>
                            ))}
                         </div>
                      </div>
                      <div className="filter-sec">
                         <h4>Price</h4>
                         <div className="options-stack">
                            {["$100 to $300", "$300 to $600", "$600 to $1000"].map(opt => (
                              <label key={opt} className="check-box-exact">
                                 <input type="radio" name="price-m" checked={filters.price === opt} onChange={() => handleFilterChange('price', opt)} />
                                 <span>{opt}</span>
                              </label>
                            ))}
                         </div>
                      </div>
                      <div className="filter-sec">
                         <h4>Sort By</h4>
                         <div className="options-stack">
                            {["Price Low to High", "Price High to Low", "Newest First"].map(opt => (
                              <label key={opt} className="check-box-exact">
                                 <input type="radio" name="sort-m" checked={filters.sort === opt} onChange={() => handleFilterChange('sort', opt)} />
                                 <span>{opt}</span>
                              </label>
                            ))}
                         </div>
                      </div>
                   </div>
                   <div className="drawer-footer">
                      <button className="apply-btn" onClick={() => setMobileFiltersOpen(false)}>Apply Filters</button>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
