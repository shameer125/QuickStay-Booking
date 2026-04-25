import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, Search, Wifi, Coffee, Waves, Utensils } from "lucide-react";
import api from "../utils/api";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const destination = query.get("location") || "";
  
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: [],
    sort: "Recommended"
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/rooms");
        setRooms(data);
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    let result = rooms;
    if (destination) {
      result = result.filter(r => 
        r.location?.city?.toLowerCase().includes(destination.toLowerCase()) ||
        r.location?.country?.toLowerCase().includes(destination.toLowerCase())
      );
    }
    if (filters.type.length > 0) {
      result = result.filter(r => filters.type.includes(r.category));
    }
    return result;
  }, [rooms, destination, filters]);

  const handleFilterChange = (value) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(value) 
        ? prev.type.filter(i => i !== value) 
        : [...prev.type, value]
    }));
  };

  return (
    <div className="search-results-page-clean">
      <div className="container">
        <header className="results-header-clean">
          <h1>{destination ? `Search Results in ${destination}` : "All Collections"}</h1>
          <p>Showing {filteredRooms.length} properties matching your search criteria. Discover your perfect stay from our handpicked selection.</p>
          <button className="mobile-filter-trigger" onClick={() => setMobileFiltersOpen(true)}>Filters</button>
        </header>

        <div className="catalog-layout">
          {/* Main Inventory */}
          <main className="inventory-section">
            <div className="rooms-list">
              {loading ? (
                <div className="loading">Searching properties...</div>
              ) : filteredRooms.length === 0 ? (
                <div className="empty-results">
                  <Search size={48} color="#9ca3af" />
                  <h3>No properties found</h3>
                  <p>Try adjusting your search or destination to reveal more of our collection.</p>
                  <button className="btn-outline-dark" onClick={() => navigate("/")}>Back to Home</button>
                </div>
              ) : (
                filteredRooms.map((room, idx) => (
                  <motion.div 
                    key={room._id}
                    className="room-horizontal-card"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="card-image">
                       <img src={room.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"} alt={room.title} />
                    </div>
                    <div className="card-info">
                       <span className="location-text">{room.location?.address}, {room.location?.city}</span>
                       <div className="title-row">
                          <h3>{room.title}</h3>
                          <div className="rating">
                             {[...Array(4)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                             <span>200+ reviews</span>
                          </div>
                       </div>
                       <p className="card-loc"><MapPin size={14} /> {room.location?.city}, {room.location?.country}</p>
                       
                       <div className="amenities-row">
                          <span className="amenity"><Wifi size={14} /> Free wifi</span>
                          <span className="amenity"><Coffee size={14} /> Breakfast</span>
                          <span className="amenity"><Waves size={14} /> Pool</span>
                          <span className="amenity"><Utensils size={14} /> Food</span>
                       </div>

                       <div className="card-footer">
                          <div className="price-tag-blue">
                             ${room.price} <span>/day</span>
                          </div>
                          <Link to={`/room/${room._id}`} className="details-btn">View Details</Link>
                       </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </main>

          {/* Sidebar Filters */}
          <aside className="sidebar-filters">
             <div className="sidebar-header">
                <h3>FILTERS</h3>
                <button className="clear-btn" onClick={() => setFilters({ type: [], sort: "Recommended" })}>CLEAR</button>
             </div>

             <div className="filter-group">
                <h4>Property Type</h4>
                <div className="options">
                   {["Hotel", "Resort", "Villa", "Apartment"].map(opt => (
                     <label key={opt} className="check-option">
                        <input 
                          type="checkbox" 
                          checked={filters.type.includes(opt)}
                          onChange={() => handleFilterChange(opt)}
                        />
                        <span>{opt}</span>
                     </label>
                   ))}
                </div>
             </div>

             <div className="filter-group border-top">
                <h4>Sort By</h4>
                <div className="options">
                   {["Recommended", "Price Low to High", "Price High to Low", "Top Rated"].map(opt => (
                     <label key={opt} className="radio-option">
                        <input 
                          type="radio" 
                          name="sort-search"
                          checked={filters.sort === opt}
                          onChange={() => setFilters(prev => ({ ...prev, sort: opt }))}
                        />
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
                     <div className="filter-group">
                        <h4>Property Type</h4>
                        <div className="options">
                           {["Hotel", "Resort", "Villa", "Apartment"].map(opt => (
                             <label key={opt} className="check-option">
                                <input 
                                  type="checkbox" 
                                  checked={filters.type.includes(opt)}
                                  onChange={() => handleFilterChange(opt)}
                                />
                                <span>{opt}</span>
                             </label>
                           ))}
                        </div>
                     </div>
                     <div className="filter-group">
                        <h4>Sort By</h4>
                        <div className="options">
                           {["Recommended", "Price Low to High", "Price High to Low", "Top Rated"].map(opt => (
                             <label key={opt} className="radio-option">
                                <input 
                                  type="radio" 
                                  name="sort-m-s"
                                  checked={filters.sort === opt}
                                  onChange={() => setFilters(prev => ({ ...prev, sort: opt }))}
                                />
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

export default SearchResults;
