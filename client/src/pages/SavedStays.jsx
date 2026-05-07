import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MapPin, Star, Trash2, Loader2 } from "lucide-react";
import api from "../utils/api";
import { readFavoriteIds, writeFavoriteIds } from "../utils/favorites";
import RoomImg from "../components/RoomImg";
import "./SavedStays.css";

const SavedStays = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const ids = readFavoriteIds();
    if (ids.length === 0) {
      setRooms([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data: all } = await api.get("/rooms");
      const setIds = new Set(ids.map(String));
      const matched = all.filter((r) => setIds.has(String(r._id)));
      setRooms(matched);
      const valid = new Set(matched.map((r) => String(r._id)));
      const pruned = ids.filter((id) => valid.has(String(id)));
      if (pruned.length !== ids.length) writeFavoriteIds(pruned);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  const remove = (roomId) => {
    const id = String(roomId);
    writeFavoriteIds(readFavoriteIds().filter((x) => x !== id));
    setRooms((prev) => prev.filter((r) => String(r._id) !== id));
  };

  return (
    <div className="saved-page">
      <section className="saved-hero">
        <div className="container">
          <span className="eyebrow blue">Your collection</span>
          <h1>Saved stays</h1>
          <p>
            Properties you have marked across the site. Sign in separately to
            complete a booking—we keep this list on your device until you clear
            browser data.
          </p>
        </div>
      </section>

      <div className="container saved-body">
        {loading ? (
          <div className="saved-loading">
            <Loader2 className="spin" size={32} aria-hidden />
            <p>Loading saved properties...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="saved-empty">
            <Heart size={48} strokeWidth={1.25} aria-hidden />
            <h2>No saved stays yet</h2>
            <p>
              Tap “Save” on any property detail page to build a shortlist you
              can review here.
            </p>
            <Link to="/rooms" className="saved-browse-btn">
              Browse stays
            </Link>
          </div>
        ) : (
          <div className="saved-grid">
            {rooms.map((room, idx) => (
              <motion.article
                key={room._id}
                className="saved-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <button
                  type="button"
                  className="saved-remove"
                  aria-label={`Remove ${room.title} from saved`}
                  onClick={() => remove(room._id)}
                >
                  <Trash2 size={18} />
                </button>
                <Link to={`/room/${room._id}`} className="saved-card-media">
                  <RoomImg room={room} slot={0} alt="" loading="lazy" />
                </Link>
                <div className="saved-card-body">
                  <Link to={`/room/${room._id}`}>
                    <h3>{room.title}</h3>
                  </Link>
                  <p className="saved-loc">
                    <MapPin size={14} aria-hidden />{" "}
                    {room.location?.city}, {room.location?.country}
                  </p>
                  <div className="saved-meta">
                    <div className="saved-rating">
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <span>{(room.rating || 4.8).toFixed(1)}</span>
                    </div>
                    <span className="saved-price">
                      ${room.price}
                      <small>/night</small>
                    </span>
                  </div>
                  <Link
                    to={`/room/${room._id}`}
                    className="saved-view-details"
                  >
                    View listing
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedStays;
