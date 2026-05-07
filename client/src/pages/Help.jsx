import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronDown,
  MessageCircle,
  Shield,
  RefreshCw,
  Calendar,
  Mail,
} from "lucide-react";
import "./Help.css";

const FAQ_ITEMS = [
  {
    q: "How do I modify or cancel a reservation?",
    a: "Open My trips from your account menu. For eligible stays you will see an option to cancel directly in your booking row. Changes that require date moves are handled by concierge—contact us via the messaging form on the Contact page with your confirmation details.",
  },
  {
    q: "When am I charged for my stay?",
    a: "Checkout collects the full stay total shown on the review screen before your booking is confirmed. You will see booking status update to Confirmed immediately after a successful request.",
  },
  {
    q: "How does QuickStay vet properties?",
    a: "Every listing is reviewed for accuracy, amenity alignment, and photography quality. Partner properties must meet our cleanliness and guest-support standards before appearing in search.",
  },
  {
    q: "Can I book for a group or corporate event?",
    a: "Yes. Visit our Groups & events page for volumes of five rooms or more, brand activations, or off-site meetings—we will match you with inventory and on-site support.",
  },
  {
    q: "Is my data secure?",
    a: "Sessions use industry-standard tokens. We never store passwords in plain text and only use your profile data to operate bookings. Read more in our Policies section.",
  },
];

const Help = () => {
  const [open, setOpen] = useState(0);

  return (
    <div className="help-page">
      <section className="help-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="help-hero-inner"
          >
            <span className="eyebrow blue">Help center</span>
            <h1>Guidance for every step of your stay</h1>
            <p>
              Search quick answers below or reach our concierge team for
              personalized itinerary and booking support.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container help-layout">
        <aside className="help-aside">
          <h2>Contact paths</h2>
          <Link to="/contact" className="help-tile">
            <MessageCircle size={20} aria-hidden />
            <div>
              <strong>Concierge</strong>
              <span>Form, response within one business day</span>
            </div>
          </Link>
          <a href="mailto:concierge@quickstay.com" className="help-tile">
            <Mail size={20} aria-hidden />
            <div>
              <strong>Email</strong>
              <span>concierge@quickstay.com</span>
            </div>
          </a>
          <Link to="/groups" className="help-tile">
            <Calendar size={20} aria-hidden />
            <div>
              <strong>Groups &amp; events</strong>
              <span>Blocks, meetings, retreats</span>
            </div>
          </Link>
          <Link to="/policies" className="help-tile muted">
            <Shield size={20} aria-hidden />
            <div>
              <strong>Policies</strong>
              <span>Privacy, terms, and cancellations</span>
            </div>
          </Link>
        </aside>

        <div className="help-main">
          <h2 className="faq-title">Frequently asked questions</h2>
          <ul className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <li key={item.q} className="faq-item">
                <button
                  type="button"
                  className={`faq-trigger ${open === i ? "open" : ""}`}
                  onClick={() => setOpen(open === i ? -1 : i)}
                  aria-expanded={open === i}
                >
                  <span>{item.q}</span>
                  <ChevronDown size={20} className="faq-chevron" aria-hidden />
                </button>
                {open === i && (
                  <div className="faq-panel" role="region">
                    <p>{item.a}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="help-cta-card">
            <RefreshCw size={22} aria-hidden />
            <div>
              <h3>Still need help?</h3>
              <p>
                Share your confirmation code (if you have one) and preferred
                contact—we will route you to the right specialist.
              </p>
              <Link to="/contact" className="help-cta-btn">
                Contact concierge
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
