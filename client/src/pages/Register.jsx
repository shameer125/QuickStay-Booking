import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { getApiErrorMessage } from '../utils/api';
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      const stored = localStorage.getItem("userInfo");
      const u = stored ? JSON.parse(stored) : null;
      navigate(u?.isAdmin ? "/dashboard" : "/", { replace: true });
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "We could not create your account. Please check the form and try again.",
        ),
      );
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
            <h1>Create Account</h1>
            <p>Join QuickStay to start exploring curated hotels.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-clean">
            <div className="form-input-box">
              <label>Full Legal Name</label>
              <div className="input-with-icon">
                 <User size={18} />
                 <input
                   type="text"
                   placeholder="Julian Vane"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   required
                 />
              </div>
            </div>

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
              <p className="field-hint">Use at least 6 characters.</p>
              <div className="input-with-icon">
                 <Lock size={18} />
                 <input
                   type="password"
                   placeholder="••••••••"
                   value={password}
                   minLength={6}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                 />
              </div>
            </div>

            {error && <div className="auth-error-msg">{error}</div>}

            <button type="submit" className="auth-submit-btn-clean" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
              <ArrowRight size={18} />
            </button>
          </form>

          <footer className="auth-footer-clean">
            <p>Already a member? <Link to="/login">Sign In</Link></p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
