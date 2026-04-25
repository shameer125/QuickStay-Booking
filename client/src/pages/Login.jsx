import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-exact">
      <div className="container">
        <motion.div 
          className="auth-card-clean"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Login to manage your bookings and collections.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-clean">
            <div className="form-input-box">
              <label>Email Address</label>
              <div className="input-with-icon">
                 <Mail size={18} />
                 <input
                   type="email"
                   placeholder="name@email.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                 />
              </div>
            </div>

            <div className="form-input-box">
              <label>Password</label>
              <div className="input-with-icon">
                 <Lock size={18} />
                 <input
                   type="password"
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                 />
              </div>
            </div>

            {error && <div className="auth-error-msg">{error}</div>}

            <button type="submit" className="auth-submit-btn-clean" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight size={18} />
            </button>
          </form>

          <footer className="auth-footer-clean">
            <p>Don't have an account? <Link to="/register">Create one</Link></p>
            <div className="admin-demo">
               <span>Demo: admin@quickstay.com / admin123</span>
            </div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
