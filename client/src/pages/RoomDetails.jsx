import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, Star, Wifi, Coffee, Waves, Shield, CheckCircle,
  Calendar, Users, ArrowLeft, Heart, Share2
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import "./RoomDetails.css";

const galleryFallbacks = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
];

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await api.get(`/rooms/${id}`);
        setRoom(data);
      } catch (err) {
        console.error("Failed to fetch room:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const getImg = (idx) => {
    const img = room?.images?.[idx];
    if (img && typeof img === "string" && img.trim() !== "") return img;
    return galleryFallbacks[idx] || galleryFallbacks[0];
  };
  if (loading) return <div className="loading">Loading property details...</div>;
  if (!room) return <div className="loading">Property not found.</div>;

  return (
    <div className="room-details-exact-page">
      <div className="container">
        {/* Top Nav */}
        <div className="detail-top-nav">
           <button className="back-btn-ghost" onClick={() => navigate(-1)}><ArrowLeft size={18}/> Back</button>
           <div className="top-actions">
              <button><Share2 size={18}/> Share</button>
              <button><Heart size={18}/> Save</button>
           </div>
        </div>

        {/* Title */}
        <header className="room-header-exact">
           <div className="title-row-exact">
              <h1>{room.title} <span className="cat-tag">({room.type || "Simple Bed"})</span></h1>
              {room.offer > 0 && <span className="offer-tag-exact">{room.offer}% OFF</span>}
           </div>
           <div className="stats-row-exact">
              <div className="rating-wrap">
                 {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                 <span className="count">200+ reviews</span>
              </div>
              <span className="sep-dot"></span>
              <p className="loc-text-exact"><MapPin size={14}/> {room.location?.city || "Los Angeles"}, {room.location?.country || "USA"}</p>
           </div>
        </header>

        {/* Gallery 1+4 */}
        <div className="gallery-grid-exact">
           <div className="gallery-main">
              <img src={getImg(0)} alt={room.title} loading="lazy" />
           </div>
           <div className="gallery-side">
              <img src={getImg(1)} alt="" loading="lazy" />
              <img src={getImg(2)} alt="" loading="lazy" />
              <img src={getImg(3)} alt="" loading="lazy" />
              <img src={getImg(4)} alt="" loading="lazy" />
           </div>
        </div>

        {/* Content + Booking */}
        <div className="content-layout-exact">
           <div className="main-info-column">
              <h2>Experience Luxury Like Never Before</h2>

              <div className="amenity-icons-row">
                 <span><Wifi size={18}/> Free wifi</span>
                 <span><Coffee size={18}/> Free breakfast</span>
                 <span><Waves size={18}/> Pool access</span>
              </div>

              <div className="badges-stack">
                 <div className="b-item">
                    <Shield size={22} color="var(--primary)" />
                    <div>
                       <h4>Clean Space</h4>
                       <p>This host committed to a rigorous cleaning process.</p>
                    </div>
                 </div>
                 <div className="b-item">
                    <MapPin size={22} color="var(--primary)" />
                    <div>
                       <h4>Great Location</h4>
                       <p>90% of recent guests gave the location a 5-star rating.</p>
                    </div>
                 </div>
                 <div className="b-item">
                    <CheckCircle size={22} color="var(--primary)" />
                    <div>
                       <h4>Great check-in experience</h4>
                       <p>95% of recent guests gave the check-in process a 5-star rating.</p>
                    </div>
                 </div>
              </div>

              <p className="desc-text-exact">
                {room.description || "Guests will be stationed on the ground floor according to availability. You get a comfortable two bedroom apartment with a true city feeling. The price quoted is for two guests. Please mark the number of guests to get the exact price for groups. The apartment is fully furnished with modern amenities for a pleasant stay."}
              </p>

              {/* Map */}
              <div className="map-section-exact">
                 <h3>Location on map</h3>
                 <div className="map-placeholder-exact">
                    <iframe
                      title="map"
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: "var(--radius-lg)" }}
                      loading="lazy"
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent((room.location?.city || "Los Angeles") + " " + (room.location?.country || "USA"))}`}
                      allowFullScreen
                    ></iframe>
                 </div>
                 <div className="map-info">
                    <strong>{room.location?.city || "Los Angeles"}, {room.location?.country || "USA"}</strong>
                    <p>It's like a home away from home.</p>
                 </div>
              </div>

              {/* Host */}
              <div className="host-section-exact">
                 <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Host" loading="lazy" />
                 <div className="host-info">
                    <h4>Hosted by Emma Rodriguez</h4>
                    <div className="host-stats">
                       <span><Star size={12} fill="#f59e0b" color="#f59e0b"/> 200+ reviews</span>
                       <span>Response rate: 100%</span>
                       <span>Response time: 10 min</span>
                    </div>
                    <button className="contact-host">Contact Host</button>
                 </div>
              </div>
           </div>

           {/* Booking Sidebar */}
           <aside className="booking-sidebar-exact">
              <div className="pricing-top">
                 <span className="p-val">${room.price}</span>
                 <span className="p-unit">/ day</span>
              </div>

              <div className="booking-widget-exact">
                 <div className="w-field">
                    <label>Check-in</label>
                    <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                 </div>
                 <div className="w-field">
                    <label>Check-Out</label>
                    <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                 </div>
                 <div className="w-field">
                    <label>Guests</label>
                    <input type="number" min="1" max="10" value={guests} onChange={e => setGuests(e.target.value)} />
                 </div>
                 <button
                   className="check-btn-exact"
                   onClick={() => navigate(`/checkout/${id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                 >
                    Check Availability
                 </button>
              </div>
           </aside>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
