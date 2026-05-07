import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  MapPin, Star, Shield, CheckCircle,
  ArrowLeft, Heart, Share2
} from "lucide-react";


import api from "../utils/api";
import { readFavoriteIds, toggleFavoriteId } from "../utils/favorites";
import RoomImg from "../components/RoomImg";
import "./RoomDetails.css";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [saved, setSaved] = useState(false);
  const [shareHint, setShareHint] = useState("");

  useEffect(() => {
    if (id) setSaved(readFavoriteIds().includes(String(id)));
  }, [id]);

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

  if (loading) return <div className="loading">Loading property details...</div>;
  if (!room) return <div className="loading">Property not found.</div>;

  return (
    <div className="room-details-exact-page">
      <div className="container">
        {/* Top Nav */}
        <div className="detail-top-nav">
           <button className="back-btn-ghost" onClick={() => navigate(-1)}><ArrowLeft size={18}/> Back</button>
           <div className="top-actions">
              <button type="button" onClick={async () => {
                const url = typeof window !== "undefined" ? window.location.href : "";
                try {
                  if (navigator.share) {
                    await navigator.share({ title: room?.title, text: "View this stay", url });
                  } else {
                    await navigator.clipboard.writeText(url);
                    setShareHint("Link copied to clipboard");
                    setTimeout(() => setShareHint(""), 2200);
                  }
                } catch {
                  try {
                    await navigator.clipboard.writeText(url);
                    setShareHint("Link copied to clipboard");
                    setTimeout(() => setShareHint(""), 2200);
                  } catch {
                    setShareHint("Copy the URL from your browser address bar.");
                    setTimeout(() => setShareHint(""), 2800);
                  }
                }
              }}><Share2 size={18}/> Share</button>
              <button type="button" className={saved ? "save-active" : ""} onClick={() => {
                if (!id) return;
                setSaved(toggleFavoriteId(id));
              }}><Heart size={18} fill={saved ? "currentColor" : "none"} strokeWidth={2} /> {saved ? "Saved" : "Save"}</button>
              <Link to="/saved" className="saved-inline-link">Saved list</Link>
           </div>
           {shareHint ? <p className="share-hint" role="status">{shareHint}</p> : null}
        </div>

        {/* Title */}
        <header className="room-header-exact">
           <div className="title-row-exact">
              <h1>{room.title} <span className="cat-tag">({room.type || "Suite"})</span></h1>
              {room.offer > 0 && <span className="offer-tag-exact">{room.offer}% OFF</span>}
           </div>
           <div className="stats-row-exact">
              <div className="rating-wrap">
                 {[1, 2, 3, 4, 5].map((n) => (
                   <Star
                     key={n}
                     size={14}
                     fill={
                       n <= Math.round(room.rating || 4.8)
                         ? "#f59e0b"
                         : "none"
                     }
                     color="#f59e0b"
                     aria-hidden
                   />
                 ))}
                 <span className="count">{room.numReviews ?? 180}+ reviews</span>
              </div>
              <span className="sep-dot"></span>
              <p className="loc-text-exact"><MapPin size={14}/> {room.location?.city || "Los Angeles"}, {room.location?.country || "USA"}</p>
           </div>
        </header>

        {/* Gallery 1+4 */}
        <div className="gallery-grid-exact">
           <div className="gallery-main">
              <RoomImg room={room} slot={0} alt={room.title} loading="lazy" />
           </div>
           <div className="gallery-side">
              <RoomImg room={room} slot={1} alt="" loading="lazy" />
              <RoomImg room={room} slot={2} alt="" loading="lazy" />
              <RoomImg room={room} slot={3} alt="" loading="lazy" />
              <RoomImg room={room} slot={4} alt="" loading="lazy" />
           </div>
        </div>

        {/* Content + Booking */}
        <div className="content-layout-exact">
           <div className="main-info-column">
              <h2>Experience Luxury Like Never Before</h2>

              <div className="amenity-icons-row">
                 {(room.amenities?.length
                   ? room.amenities
                   : ["WiFi", "Breakfast", "Pool access", "Concierge"]
                 ).slice(0, 6).map((label) => (
                   <span key={label}>
                     <CheckCircle size={18} aria-hidden /> {label}
                   </span>
                 ))}
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
                 <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop" alt="Host" loading="lazy" onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/host-quickstay/160/160"; e.currentTarget.onerror = null; }} />
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
