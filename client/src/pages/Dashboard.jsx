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
  TrendingUp,
  DollarSign,
  UserPlus,
  Calendar,
  X
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
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
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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
           <h2>{room ? "Edit Property" : "Add New Property"}</h2>
           <button onClick={onClose}><X size={24}/></button>
        </div>
        <form onSubmit={handleSubmit} className="clean-form-grid">
           <div className="form-group-clean span-2">
              <label>Property Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
           </div>
           <div className="form-group-clean span-2">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" />
           </div>
           <div className="form-group-clean">
              <label>City</label>
              <input type="text" name="location.city" value={formData.location.city} onChange={handleChange} required />
           </div>
           <div className="form-group-clean">
              <label>Country</label>
              <input type="text" name="location.country" value={formData.location.country} onChange={handleChange} required />
           </div>
           <div className="form-group-clean">
              <label>Price per Night</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required />
           </div>
           <div className="form-group-clean">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                 <option value="Hotel">Hotel</option>
                 <option value="Resort">Resort</option>
                 <option value="Villa">Villa</option>
                 <option value="Apartment">Apartment</option>
              </select>
           </div>
           <div className="form-footer span-2">
              <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-save">{room ? "Update Property" : "Create Property"}</button>
           </div>
        </form>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState({ rooms: [], bookings: [], users: [], stats: {} });
  const [loading, setLoading] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          const [roomsRes, bookingsRes, usersRes, statsRes] = await Promise.all([
            api.get("/rooms"),
            api.get("/bookings"),
            api.get("/admin/users"),
            api.get("/admin/stats")
          ]);
          setData({ rooms: roomsRes.data, bookings: bookingsRes.data, users: usersRes.data, stats: statsRes.data });
        } else {
          const { data: bookingsData } = await api.get("/bookings/mybookings");
          setData(prev => ({ ...prev, bookings: bookingsData }));
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

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

  const deleteRoom = async (id) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/rooms/${id}`);
      window.location.reload();
    }
  };

  if (!isAdmin) {
    // Standard User Dashboard (My Bookings)
    return (
      <div className="dashboard-page-clean minimal-user">
        <div className="container">
          <header className="dashboard-header-clean user-header-flex">
            <div>
              <h1>My Bookings</h1>
              <p>Manage your hotel reservations and upcoming trips.</p>
            </div>
            <button className="logout-btn-minimal" onClick={() => { logout(); navigate("/"); }}>
               <LogOut size={18}/> Sign Out
            </button>
          </header>
          <div className="bookings-table-container">
             <table className="bookings-table-clean">
                <thead>
                   <tr><th>Hotels</th><th>Date & Timings</th><th>Payment</th></tr>
                </thead>
                <tbody>
                   {data.bookings.map(b => (
                     <tr key={b._id}>
                        <td className="td-room-info">
                           <div className="room-flex">
                              <img src={b.room?.images?.[0]} alt="" />
                              <div className="room-meta">
                                 <h4>{b.room?.title}</h4>
                                 <p>{b.room?.location?.city}</p>
                                 <p className="total-text">Total: ${b.totalPrice}</p>
                              </div>
                           </div>
                        </td>
                        <td>{new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}</td>
                        <td><span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span></td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay-clean" onClick={() => setSidebarOpen(false)}></div>}
      
      {/* Sidebar */}
      <aside className={`admin-sidebar-clean ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
           <div className="logo-icon">Q</div>
           <span>QuickStay</span>
           <button className="mobile-sidebar-close" onClick={() => setSidebarOpen(false)}><X size={24}/></button>
        </div>
        <nav className="admin-nav">
           <button className={activeTab === "overview" ? "active" : ""} onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}><LayoutGrid size={20}/> Overview</button>
           <button className={activeTab === "rooms" ? "active" : ""} onClick={() => { setActiveTab("rooms"); setSidebarOpen(false); }}><Hotel size={20}/> Properties</button>
           <button className={activeTab === "users" ? "active" : ""} onClick={() => { setActiveTab("users"); setSidebarOpen(false); }}><Users size={20}/> Members</button>
           <button className={activeTab === "bookings" ? "active" : ""} onClick={() => { setActiveTab("bookings"); setSidebarOpen(false); }}><ShoppingCart size={20}/> Reservations</button>
        </nav>
        <button className="logout-btn-clean" onClick={() => { logout(); navigate("/"); }}>
           <LogOut size={20}/> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main-clean">
         <header className="admin-topnav">
            <button className="mobile-sidebar-trigger" onClick={() => setSidebarOpen(true)}>
               <LayoutGrid size={24}/>
            </button>
            <div className="search-bar">
               <Search size={18}/>
               <input type="text" placeholder="Search database..." />
            </div>
            <div className="top-actions">
               <div className="bell"><Bell size={20}/><span className="dot"></span></div>
               <div className="user-profile">
                  <div className="avatar-sm">{user?.name[0]}</div>
                  <span>{user?.name}</span>
               </div>
            </div>
         </header>

         <div className="admin-content-scroll">
            {activeTab === "overview" && (
              <div className="overview-tab">
                 <div className="stats-grid-clean">
                    <div className="stat-card">
                       <div className="icon-box blue"><DollarSign size={24}/></div>
                       <div className="val">
                          <h3>${(data.stats.totalRevenue/1000).toFixed(1)}k</h3>
                          <p>Total Revenue</p>
                       </div>
                       <div className="trend positive">+12%</div>
                    </div>
                    <div className="stat-card">
                       <div className="icon-box green"><Hotel size={24}/></div>
                       <div className="val">
                          <h3>{data.stats.totalRooms}</h3>
                          <p>Total Stays</p>
                       </div>
                    </div>
                    <div className="stat-card">
                       <div className="icon-box purple"><ShoppingCart size={24}/></div>
                       <div className="val">
                          <h3>{data.stats.totalBookings}</h3>
                          <p>Active Res.</p>
                       </div>
                    </div>
                    <div className="stat-card">
                       <div className="icon-box orange"><Users size={24}/></div>
                       <div className="val">
                          <h3>{data.stats.totalUsers}</h3>
                          <p>Elite Members</p>
                       </div>
                    </div>
                 </div>

                 <div className="recent-grid-clean">
                    <div className="recent-card">
                       <div className="card-header"><h3>Recent Bookings</h3><button onClick={() => setActiveTab("bookings")}>View All</button></div>
                       <table className="mini-table">
                          <tbody>
                             {data.bookings.slice(0, 5).map(b => (
                               <tr key={b._id}>
                                  <td>{b.room?.title}</td>
                                  <td>${b.totalPrice}</td>
                                  <td><span className={`status-pill ${b.status.toLowerCase()}`}>{b.status}</span></td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === "rooms" && (
              <div className="rooms-tab-admin">
                 <div className="tab-header">
                    <h2>Property Inventory</h2>
                    <button className="add-property-btn" onClick={() => { setEditingRoom(null); setShowRoomForm(true); }}>
                       <Plus size={18}/> Add Property
                    </button>
                 </div>
                 <div className="table-wrapper-clean">
                    <table className="admin-table-clean">
                       <thead>
                          <tr><th>Property</th><th>Category</th><th>Price</th><th>Location</th><th>Actions</th></tr>
                       </thead>
                       <tbody>
                          {data.rooms.map(r => (
                            <tr key={r._id}>
                               <td>
                                  <div className="room-cell">
                                     <img src={r.images?.[0]} alt="" />
                                     <span>{r.title}</span>
                                  </div>
                               </td>
                               <td>{r.category}</td>
                               <td>${r.price}/night</td>
                               <td>{r.location?.city}</td>
                               <td>
                                  <div className="action-btns">
                                     <button onClick={() => { setEditingRoom(r); setShowRoomForm(true); }}><Edit size={16}/></button>
                                     <button className="delete" onClick={() => deleteRoom(r._id)}><Trash2 size={16}/></button>
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
                 <div className="tab-header"><h2>Member Database</h2></div>
                 <div className="table-wrapper-clean">
                    <table className="admin-table-clean">
                       <thead><tr><th>Member</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
                       <tbody>
                          {data.users.map(u => (
                            <tr key={u._id}>
                               <td>{u.name}</td>
                               <td>{u.email}</td>
                               <td>{u.isAdmin ? 'Admin' : 'Member'}</td>
                               <td><span className="status-pill active">Active</span></td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="bookings-tab-admin">
                 <div className="tab-header"><h2>Global Reservations</h2></div>
                 <div className="table-wrapper-clean">
                    <table className="admin-table-clean">
                       <thead>
                          <tr><th>Property</th><th>Customer</th><th>Check In</th><th>Check Out</th><th>Amount</th><th>Status</th></tr>
                       </thead>
                       <tbody>
                          {data.bookings.map(b => (
                            <tr key={b._id}>
                               <td>{b.room?.title || "Property Deleted"}</td>
                               <td>{b.user?.name || "Guest"}</td>
                               <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                               <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                               <td>${b.totalPrice}</td>
                               <td><span className={`status-pill ${b.status.toLowerCase()}`}>{b.status}</span></td>
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
