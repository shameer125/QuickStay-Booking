import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  Calendar,
  Loader2,
  Heart,
  XCircle,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import RoomImg from "../components/RoomImg";
import "./Dashboard.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState("");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    setCancelError("");
    try {
      const { data } = await api.get("/bookings/mybookings");
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("My bookings fetch error:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cancelBooking = async (bookingId, status) => {
    if (status === "Cancelled") return;
    if (
      !window.confirm(
        "Cancel this reservation? This cannot be undone in the demo.",
      )
    )
      return;
    setCancellingId(bookingId);
    setCancelError("");
    try {
      await api.delete(`/bookings/${bookingId}/cancel`);
      await load();
    } catch {
      setCancelError(
        "We could not cancel that booking. Please refresh or contact support.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="dashboard-page-clean minimal-user">
      <div className="container">
        <header className="dashboard-header-clean user-header-flex">
          <div>
            <h1>My bookings</h1>
            <p>
              Manage confirmations and optional cancellations from one place.
            </p>
          </div>
          <div className="user-header-actions">
            <Link to="/saved" className="outline-link-dash subtle-icon">
              <Heart size={16} aria-hidden /> Saved stays
            </Link>
            <Link to="/profile" className="outline-link-dash">
              Account settings
            </Link>
            <button
              type="button"
              className="logout-btn-minimal"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <LogOut size={18} /> Sign out
            </button>
          </div>
        </header>

        {cancelError ? (
          <p className="bookings-banner-error">{cancelError}</p>
        ) : null}

        {loading ? (
          <div className="loading-exact bookings-loading">
            <Loader2 className="spin" size={28} aria-hidden />
            <p>Loading your reservations...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bookings-empty-state">
            <Calendar size={40} strokeWidth={1.25} aria-hidden />
            <h2>No bookings yet</h2>
            <p>
              Browse curated listings and reserve in a guided, secure checkout
              flow.
            </p>
            <Link to="/rooms" className="btn-primary-soft">
              Explore stays
            </Link>
          </div>
        ) : (
          <div className="bookings-table-container">
            <table className="bookings-table-clean">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="td-room-info">
                      <div className="room-flex">
                        <RoomImg
                          room={
                            b.room || {
                              _id: `booking-${b._id}`,
                              images: [],
                            }
                          }
                          slot={0}
                          alt=""
                        />
                        <div className="room-meta">
                          <h4>{b.room?.title}</h4>
                          <p>{b.room?.location?.city}</p>
                          <p className="total-text">Total: ${b.totalPrice}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      {new Date(b.checkIn).toLocaleDateString()} –{" "}
                      {new Date(b.checkOut).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${String(
                          b.status,
                        ).toLowerCase()}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status !== "Cancelled" ? (
                        <button
                          type="button"
                          className="cancel-booking-btn"
                          disabled={cancellingId === b._id}
                          onClick={() => cancelBooking(b._id, b.status)}
                        >
                          {cancellingId === b._id ? (
                            <Loader2 className="spin" size={16} />
                          ) : (
                            <>
                              <XCircle size={16} aria-hidden /> Cancel
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="muted-cell">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
