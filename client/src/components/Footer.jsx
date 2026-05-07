import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";
import { ArrowRight, Shield, Headphones, Lock } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  const [joined, setJoined] = useState(false);

  return (
    <footer className="footer footer-pro">
      <div className="footer-trust-strip">
        <div className="container trust-inner">
          <span>
            <Shield size={17} aria-hidden strokeWidth={2} />
            Vetted listings
          </span>
          <span className="trust-dot" aria-hidden />
          <span>
            <Lock size={16} aria-hidden strokeWidth={2} />
            Encrypted checkout
          </span>
          <span className="trust-dot" aria-hidden />
          <span>
            <Headphones size={17} aria-hidden strokeWidth={2} />
            Concierge support
          </span>
        </div>
      </div>

      <div className="container">
        <div className="footer-top">
          <div className="footer-info">
            <Link to="/" className="logo footer-brand-lockup">
              <div className="logo-icon">Q</div>
              <div className="footer-brand-text">
                <span>QuickStay</span>
                <small>Curated luxury stays</small>
              </div>
            </Link>
            <p className="footer-lede">
              Hand-picked hotels, residences, and resorts worldwide—with clear
              rates, thoughtful amenities, and a team that responds when plans
              change.
            </p>
            <div className="footer-contact-mini">
              <a href="mailto:concierge@quickstay.com">concierge@quickstay.com</a>
              <span className="contact-sep">·</span>
              <span>Toll-free reservations (demo)</span>
            </div>
            <div className="social-links">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram size={19} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter size={19} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={19} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebook size={19} />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Explore</h4>
            <div className="link-group">
              <Link to="/rooms">All stays</Link>
              <Link to="/search">Search</Link>
              <Link to="/saved">Saved list</Link>
              <Link to="/groups">Groups &amp; events</Link>
              <Link to="/experience">Experiences</Link>
            </div>
          </div>

          <div className="footer-links">
            <h4>Company</h4>
            <div className="link-group">
              <Link to="/about">About</Link>
              <Link to="/help">Help center</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/my-bookings">My bookings</Link>
              <Link to="/policies">Policies</Link>
            </div>
          </div>

          <div className="footer-newsletter">
            <h4>The dispatch</h4>
            <p>
              Quiet launches, seasonal rate drops, and members-only itineraries—one
              email, no clutter.
            </p>
            <div className="newsletter-box">
              <input
                type="email"
                placeholder="Work email"
                disabled={joined}
                aria-label="Email for newsletter"
              />
              <button
                type="button"
                aria-label="Subscribe"
                disabled={joined}
                onClick={() => setJoined(true)}
              >
                <ArrowRight size={20} />
              </button>
            </div>
            {joined ? (
              <p className="newsletter-note">You are subscribed. Thank you.</p>
            ) : null}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 QuickStay. All rights reserved.</p>
          <div className="bottom-links">
            <Link to="/policies">Privacy</Link>
            <Link to="/policies">Terms</Link>
            <Link to="/help">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
