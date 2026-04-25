import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-info">
            <Link to="/" className="logo">
              <div className="logo-icon">Q</div>
              <span>QuickStay</span>
            </Link>
            <p>
              Defining the frontier of luxury travel since 2024. We curate the
              world's most extraordinary properties for the discerning traveler.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Instagram"><FaInstagram size={20} /></a>
              <a href="#" aria-label="Twitter"><FaTwitter size={20} /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedin size={20} /></a>
              <a href="#" aria-label="Facebook"><FaFacebook size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>COLLECTIONS</h4>
            <div className="link-group">
              <Link to="/rooms">All Stays</Link>
              <Link to="/experience">Experiences</Link>
              <Link to="/about">Our Story</Link>
              <Link to="/contact">Concierge</Link>
            </div>
          </div>

          <div className="footer-links">
            <h4>ASSISTANCE</h4>
            <div className="link-group">
              <Link to="/contact">Help Center</Link>
              <Link to="/dashboard">The Portal</Link>
              <Link to="/about">Safety</Link>
              <Link to="/contact">Partnerships</Link>
            </div>
          </div>

          <div className="footer-newsletter">
             <h4>THE DISPATCH</h4>
            <p>Subscribe for early access to off-market properties and curated
              seasonal collections.</p>
             <div className="newsletter-box">
                <input type="email" placeholder="Email Address" />
                <button aria-label="Subscribe">
                   <ArrowRight size={20} />
                </button>
             </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 QUICKSTAY GLOBAL. ARCHITECTS OF ATMOSPHERE.</p>
          <div className="bottom-links">
            <Link to="/about">PRIVACY</Link>
            <Link to="/about">TERMS</Link>
            <Link to="/about">SITEMAP</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
