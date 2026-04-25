import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, Wifi, Coffee, Utensils, Waves } from "lucide-react";
import api from "../utils/api";
import "./Rooms.css";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: [],
    price: null,
    sort: "Newest First"
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
    if (category === 'type') {
      setFilters(prev => ({
        ...prev,
        type: prev.type.includes(value) ? prev.type.filter(i => i !== value) : [...prev.type, value]
      }));
    } else {
      setFilters(prev => ({ ...prev, [category]: value }));
    }
  };

  const fallbackImages = [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
  ];

  return (
    <div className="rooms-exact-page">
      <div className="container">
        <header className="rooms-head-exact">
           <h1>Hotel Rooms</h1>
           <p>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
           <button className="mobile-filter-trigger" onClick={() => setMobileFiltersOpen(true)}>
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
              ) : (
                rooms.map((room, idx) => (
                  <motion.div
                    key={room._id}
                    className="room-card-h-exact"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <Link to={`/room/${room._id}`} className="card-image-h">
                        <img
                          src={(room.images && room.images.length > 0 && room.images[0].trim() !== "") ? room.images[0] : fallbackImages[idx % fallbackImages.length]}
                          alt={room.title}
                          loading="lazy"
                        />
                     </Link>
                     <div className="card-info-h">
                        <span className="loc-sup">{room.location?.address || "Beachfront Drive"}, {room.location?.city || "City"}</span>
                        <div className="title-row-h">
                           <Link to={`/room/${room._id}`}><h3>{room.title}</h3></Link>
                           <div className="rating-h">
                              {[...Array(4)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                              <Star size={14} fill="none" color="#f59e0b" />
                              <span>200+ reviews</span>
                           </div>
                        </div>
                        <p className="card-loc-h"><MapPin size={14} /> {room.location?.city || "Los Angeles"}, {room.location?.country || "USA"}</p>
                        <div className="amenities-h">
                           <span><Wifi size={14}/> Free wifi</span>
                           <span><Coffee size={14}/> Free breakfast</span>
                           <span><Utensils size={14}/> Room service</span>
                        </div>
                        <div className="card-footer-h">
                           <span className="price-h">$ {room.price} <span className="unit">/day</span></span>
                           <Link to={`/room/${room._id}`} className="view-details-link">View Details</Link>
                        </div>
                     </div>
                  </motion.div>
                ))
              )}
              {rooms.length > 0 && (
                <div className="show-more-row">
                   <button className="show-more-exact">Show More</button>
                </div>
              )}
           </main>

           {/* Sidebar */}
           <aside className="filters-sidebar-exact">
              <div className="sidebar-header-exact">
                 <h3>FILTERS</h3>
                 <button onClick={() => setFilters({ type: [], price: null, sort: "Newest First" })}>CLEAR</button>
              </div>

              <div className="filter-sec">
                 <h4>Popular filters</h4>
                 <div className="options-stack">
                    {["Single Bed", "Family Suite", "Double Bed", "Luxury Room"].map(opt => (
                      <label key={opt} className="check-box-exact">
                         <input type="checkbox" checked={filters.type.includes(opt)} onChange={() => handleFilterChange('type', opt)} />
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
                         <h4>Popular filters</h4>
                         <div className="options-stack">
                            {["Single Bed", "Family Suite", "Double Bed", "Luxury Room"].map(opt => (
                              <label key={opt} className="check-box-exact">
                                 <input type="checkbox" checked={filters.type.includes(opt)} onChange={() => handleFilterChange('type', opt)} />
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
