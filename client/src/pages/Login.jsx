import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/api";
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
      navigate(user.isAdmin ? "/dashboard" : "/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(getApiErrorMessage(err, "Authentication failed."));
    } finally {
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
            {/* <div className="admin-demo">
              <p>
                <strong>Admin access:</strong> sign in with{" "}
                <code>admin@quickstay.com</code> / <code>admin123</code> (or your{" "}
                <code>ADMIN_EMAIL</code> / <code>ADMIN_PASSWORD</code> from{" "}
                <code>.env</code>). You will be redirected to the{" "}
                <strong>admin dashboard</strong>, or open{" "}
                <Link to="/dashboard">/dashboard</Link> after logging in.
              </p>
            </div> */}
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
