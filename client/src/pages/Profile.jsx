import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { User, Mail, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import "./Profile.css";

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (formData.password && formData.password !== formData.confirmPassword) {
      return setMessage({ type: "error", text: "Passwords do not match." });
    }

    try {
      setLoading(true);
      await updateProfile({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setMessage({ type: "success", text: "Profile updated successfully." });
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-clean">
      <div className="container">
        <header className="profile-header-top">
           <h1>Account Settings</h1>
           <p>Manage your personal information and security settings.</p>
        </header>

        <div className="profile-content-clean">
          <div className="profile-card-clean">
             <div className="profile-sidebar-basic">
                <div className="avatar-preview">
                   {user?.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                </div>
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
             </div>

             <div className="profile-form-main">
                {message.text && (
                  <div className={`form-alert ${message.type}`}>
                    {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{message.text}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                   <div className="form-section">
                      <h4>Personal Information</h4>
                      <div className="form-grid-clean">
                         <div className="form-group-clean">
                            <label>Full Name</label>
                            <div className="input-group-icon">
                               <User size={16} />
                               <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                         </div>
                         <div className="form-group-clean">
                            <label>Email Address</label>
                            <div className="input-group-icon">
                               <Mail size={16} />
                               <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="form-section border-top">
                      <h4>Security / Change Password</h4>
                      <div className="form-grid-clean">
                         <div className="form-group-clean">
                            <label>New Password</label>
                            <div className="input-group-icon">
                               <Lock size={16} />
                               <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current" />
                            </div>
                         </div>
                         <div className="form-group-clean">
                            <label>Confirm Password</label>
                            <div className="input-group-icon">
                               <Lock size={16} />
                               <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm new password" />
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="form-footer-clean">
                      <button type="submit" className="save-profile-btn" disabled={loading}>
                         {loading ? <Loader2 className="spin" size={20} /> : "Save Changes"}
                      </button>
                   </div>
                </form>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
