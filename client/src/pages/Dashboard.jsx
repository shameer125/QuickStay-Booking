import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Hotel,
  Users,
  ShoppingCart,
  LogOut,
  Search,
  Bell,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  X,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import RoomImg from "../components/RoomImg";
import "./Dashboard.css";

const RoomForm = ({ room, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: room?.title || "",
    description: room?.description || "",
    location: {
      address: room?.location?.address || "",
      city: room?.location?.city || "",
      country: room?.location?.country || "",
    },
    price: room?.price || "",
    images: room?.images || [""],
    amenities: room?.amenities || ["Free wifi", "Breakfast", "Pool"],
    category: room?.category || "Hotel",
    type: room?.type || "Single Bed",
    offer: room?.offer || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay-clean">
      <motion.div
        className="modal-content-clean"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="modal-header">
          <h2>{room ? "Edit property" : "Add property"}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="clean-form-grid">
          <div className="form-group-clean span-2">
            <label>Property title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group-clean span-2">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>
          <div className="form-group-clean">
            <label>City</label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group-clean">
            <label>Country</label>
            <input
              type="text"
              name="location.country"
              value={formData.location.country}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group-clean span-2">
            <label>Street address</label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              required
              placeholder="e.g. 12 Harbor View"
            />
          </div>
          <div className="form-group-clean">
            <label>Price per night (USD)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group-clean">
            <label>Room type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Single Bed">Single bed</option>
              <option value="Double Bed">Double bed</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Family Suite">Family suite</option>
              <option value="Luxury Room">Luxury room</option>
            </select>
          </div>
          <div className="form-group-clean">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Hotel">Hotel</option>
              <option value="Resort">Resort</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>
          <div className="form-group-clean">
            <label>Offer (% off)</label>
            <input
              type="number"
              min="0"
              max="100"
              name="offer"
              value={formData.offer}
              onChange={handleChange}
            />
          </div>
          <div className="form-footer span-2">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {room ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState({
    rooms: [],
    bookings: [],
    users: [],
    stats: {},
  });
  const [loading, setLoading] = useState(true);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [roomsRes, bookingsRes, usersRes, statsRes] = await Promise.all([
          api.get("/rooms"),
          api.get("/bookings"),
          api.get("/admin/users"),
          api.get("/admin/stats"),
        ]);
        setData({
          rooms: roomsRes.data,
          bookings: bookingsRes.data,
          users: usersRes.data,
          stats: statsRes.data,
        });
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRoomSubmit = async (payload) => {
    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom._id}`, payload);
      } else {
        await api.post("/rooms", payload);
      }
      setShowRoomForm(false);
      window.location.reload();
    } catch (err) {
      alert("Action failed. Please try again.");
    }
  };

  const deleteRoom = async (roomId) => {
    if (window.confirm("Delete this property permanently?")) {
      await api.delete(`/rooms/${roomId}`);
      window.location.reload();
    }
  };

  const revenue = data.stats.totalRevenue ?? 0;

  return (
    <div className="admin-dashboard-layout">
      {sidebarOpen && (
        <div
          className="sidebar-overlay-clean"
          role="presentation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar-clean ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">Q</div>
          <span>QuickStay Admin</span>
          <button
            type="button"
            className="mobile-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="admin-nav">
          <button
            type="button"
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => {
              setActiveTab("overview");
              setSidebarOpen(false);
            }}
          >
            <LayoutGrid size={20} /> Overview
          </button>
          <button
            type="button"
            className={activeTab === "rooms" ? "active" : ""}
            onClick={() => {
              setActiveTab("rooms");
              setSidebarOpen(false);
            }}
          >
            <Hotel size={20} /> Properties
          </button>
          <button
            type="button"
            className={activeTab === "users" ? "active" : ""}
            onClick={() => {
              setActiveTab("users");
              setSidebarOpen(false);
            }}
          >
            <Users size={20} /> Members
          </button>
          <button
            type="button"
            className={activeTab === "bookings" ? "active" : ""}
            onClick={() => {
              setActiveTab("bookings");
              setSidebarOpen(false);
            }}
          >
            <ShoppingCart size={20} /> Reservations
          </button>
        </nav>
        <button
          type="button"
          className="logout-btn-clean"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <LogOut size={20} /> Sign out
        </button>
      </aside>

      <main className="admin-main-clean">
        <header className="admin-topnav">
          <button
            type="button"
            className="mobile-sidebar-trigger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <LayoutGrid size={24} />
          </button>
          <div className="search-bar admin-search-muted" aria-hidden="true">
            <Search size={18} />
            <input type="text" placeholder="Admin console" readOnly tabIndex={-1} />
          </div>
          <div className="top-actions">
            <div className="bell" aria-hidden="true">
              <Bell size={20} />
              <span className="dot" />
            </div>
            <div className="user-profile">
              <div className="avatar-sm">{user?.name?.[0]}</div>
              <span>{user?.name}</span>
            </div>
          </div>
        </header>

        <div className="admin-content-scroll">
          {loading ? (
            <div className="admin-loading-msg">Loading admin data...</div>
          ) : activeTab === "overview" ? (
            <div className="overview-tab">
              <div className="stats-grid-clean">
                <div className="stat-card">
                  <div className="icon-box blue">
                    <DollarSign size={24} />
                  </div>
                  <div className="val">
                    <h3>${(revenue / 1000).toFixed(1)}k</h3>
                    <p>Total revenue</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="icon-box green">
                    <Hotel size={24} />
                  </div>
                  <div className="val">
                    <h3>{data.stats.totalRooms ?? data.rooms.length}</h3>
                    <p>Listed properties</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="icon-box purple">
                    <ShoppingCart size={24} />
                  </div>
                  <div className="val">
                    <h3>{data.stats.totalBookings ?? data.bookings.length}</h3>
                    <p>Reservations</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="icon-box orange">
                    <Users size={24} />
                  </div>
                  <div className="val">
                    <h3>{data.stats.totalUsers ?? data.users.length}</h3>
                    <p>Registered users</p>
                  </div>
                </div>
              </div>

              <div className="recent-grid-clean">
                <div className="recent-card">
                  <div className="card-header">
                    <h3>Recent bookings</h3>
                    <button type="button" onClick={() => setActiveTab("bookings")}>
                      View all
                    </button>
                  </div>
                  <div className="mini-table-wrapper">
                    <table className="mini-table">
                      <tbody>
                        {data.bookings.slice(0, 5).map((b) => (
                          <tr key={b._id}>
                            <td>{b.room?.title}</td>
                            <td>${b.totalPrice}</td>
                            <td>
                              <span
                                className={`status-pill ${String(
                                  b.status
                                ).toLowerCase()}`}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "rooms" && (
            <div className="rooms-tab-admin">
              <div className="tab-header">
                <h2>Property inventory</h2>
                <button
                  type="button"
                  className="add-property-btn"
                  onClick={() => {
                    setEditingRoom(null);
                    setShowRoomForm(true);
                  }}
                >
                  <Plus size={18} /> Add property
                </button>
              </div>
              <div className="table-wrapper-clean">
                <table className="admin-table-clean admin-table-properties">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.rooms.map((r) => (
                      <tr key={r._id}>
                        <td>
                          <div className="room-cell">
                            <RoomImg room={r} slot={0} alt="" />
                            <span>{r.title}</span>
                          </div>
                        </td>
                        <td>{r.category}</td>
                        <td>${r.price}/night</td>
                        <td>{r.location?.city}</td>
                        <td>
                          <div className="action-btns">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingRoom(r);
                                setShowRoomForm(true);
                              }}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              type="button"
                              className="delete"
                              onClick={() => deleteRoom(r._id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="users-tab-admin">
              <div className="tab-header">
                <h2>Registered members</h2>
              </div>
              <div className="table-wrapper-clean">
                <table className="admin-table-clean admin-table-members">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.isAdmin ? "Admin" : "Guest"}</td>
                        <td>
                          <span className="status-pill active">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="bookings-tab-admin">
              <div className="tab-header">
                <h2>All reservations</h2>
              </div>
              <div className="table-wrapper-clean">
                <table className="admin-table-clean admin-table-bookings-admin">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Customer</th>
                      <th>Check in</th>
                      <th>Check out</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.bookings.map((b) => (
                      <tr key={b._id}>
                        <td>{b.room?.title || "Removed listing"}</td>
                        <td>{b.user?.name || "Guest"}</td>
                        <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                        <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                        <td>${b.totalPrice}</td>
                        <td>
                          <span
                            className={`status-pill ${String(
                              b.status
                            ).toLowerCase()}`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {showRoomForm && (
        <RoomForm
          room={editingRoom}
          onClose={() => setShowRoomForm(false)}
          onSubmit={handleRoomSubmit}
        />
      )}
    </div>
  );
};

export default Dashboard;
