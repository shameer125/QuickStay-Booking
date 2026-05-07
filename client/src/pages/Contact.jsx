import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Send,
  Globe,
  Shield,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import api from "../utils/api";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/contact", formData);
      setSubmitted(true);
      setReference(data.reference || "");
      setFormData((prev) => ({
        ...prev,
        message: "",
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again shortly.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const contactMethods = [
    {
      icon: <Mail size={24} color="var(--primary)" />,
      title: "Global Inquiries",
      detail: "concierge@quickstay.com",
      desc: "Formal requests and partnerships.",
    },
    {
      icon: <Phone size={24} color="var(--primary)" />,
      title: "Priority Line",
      detail: "+1 (888) LUX-STAY",
      desc: "For members and urgent matters.",
    },
    {
      icon: <Globe size={24} color="var(--primary)" />,
      title: "Media Relations",
      detail: "press@quickstay.com",
      desc: "Journalist and media outreach.",
    },
  ];

  return (
    <div className="contact-page-exact">
      <section className="contact-hero-clean-v2">
        <div className="container">
          <motion.div
            className="contact-hero-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="eyebrow blue">Our concierge</span>
            <h1>At your service</h1>
            <p>
              Luxury travel advisors for bespoke itineraries, group programs,
              and day-of-trip changes—always routed to a human specialist.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container">
        <div className="contact-grid-clean">
          <aside className="contact-info-side">
            <div className="info-card-v2">
              <h3>Direct channels</h3>
              <div className="methods-stack">
                {contactMethods.map((m) => (
                  <div className="method-item" key={m.title}>
                    <div className="m-icon">{m.icon}</div>
                    <div className="m-text">
                      <h4>{m.title}</h4>
                      <strong>{m.detail}</strong>
                      <p>{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="badges-row-v2">
              <div className="badge-item-v2">
                <Shield size={18} color="var(--primary)" />
                24/7 support
              </div>
              <div className="badge-item-v2">
                <Globe size={18} color="var(--primary)" />
                Global reach
              </div>
            </div>
          </aside>

          <main className="contact-form-side">
            <div className="form-card-v2">
              {submitted ? (
                <div className="success-msg-v2">
                  <Send size={48} color="var(--primary)" />
                  <h2>Message received</h2>
                  <p>
                    {reference
                      ? `Reference ${reference}. `
                      : ""}
                    Expect a thoughtful reply within one business day.
                  </p>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => {
                      setSubmitted(false);
                      setReference("");
                    }}
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3>Send an inquiry</h3>
                  {error ? (
                    <div className="contact-inline-error">
                      <AlertCircle size={18} />
                      <span>{error}</span>
                    </div>
                  ) : null}
                  <div className="form-group-clean">
                    <label htmlFor="contact-name">Full name</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="Alex Morgan"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group-clean">
                    <label htmlFor="contact-email">Email address</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="form-group-clean">
                    <label htmlFor="contact-subject">Topic</label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option>General Inquiry</option>
                      <option>Booking change</option>
                      <option>Groups & events</option>
                      <option>Press</option>
                    </select>
                  </div>
                  <div className="form-group-clean">
                    <label htmlFor="contact-message">Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="5"
                      placeholder="Dates, destinations, party size—we read every detail."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      minLength={10}
                    />
                  </div>
                  <button
                    type="submit"
                    className="contact-submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="spin" size={20} aria-hidden /> Sending...
                      </>
                    ) : (
                      <>
                        <span>Send message</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Contact;
