import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Send, Globe, Shield, ArrowRight } from "lucide-react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactMethods = [
    {
      icon: <Mail size={24} color="var(--primary)" />,
      title: "Global Inquiries",
      detail: "concierge@quickstay.com",
      desc: "Formal requests and partnerships."
    },
    {
      icon: <Phone size={24} color="var(--primary)" />,
      title: "Priority Line",
      detail: "+1 (888) LUX-STAY",
      desc: "For members and urgent matters."
    },
    {
      icon: <Globe size={24} color="var(--primary)" />,
      title: "Media Relations",
      detail: "press@quickstay.com",
      desc: "Journalist and media outreach."
    }
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
            <span className="eyebrow blue">Our Concierge</span>
            <h1>At Your Service</h1>
            <p>Our luxury travel advisors are dedicated to crafting your perfect itinerary. Contact us for personalized assistance.</p>
          </motion.div>
        </div>
      </section>

      <div className="container">
        <div className="contact-grid-clean">
          {/* Info Side */}
          <aside className="contact-info-side">
            <div className="info-card-v2">
              <h3>Direct Channels</h3>
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
               <div className="badge-item-v2"><Shield size={18} color="var(--primary)" /> 24/7 Support</div>
               <div className="badge-item-v2"><Globe size={18} color="var(--primary)" /> Global Reach</div>
            </div>
          </aside>

          {/* Form Side */}
          <main className="contact-form-side">
            <div className="form-card-v2">
               {submitted ? (
                 <div className="success-msg-v2">
                    <Send size={48} color="var(--primary)" />
                    <h2>Message Sent!</h2>
                    <p>We'll connect you with a consultant within the next few hours.</p>
                    <button className="btn-outline" onClick={() => setSubmitted(false)}>Send another</button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit}>
                    <h3>Send an Inquiry</h3>
                    <div className="form-group-clean">
                       <label>Full Name</label>
                       <input type="text" placeholder="Julian Vane" required />
                    </div>
                    <div className="form-group-clean">
                       <label>Email Address</label>
                       <input type="email" placeholder="j.vane@luxury.com" required />
                    </div>
                    <div className="form-group-clean">
                       <label>Message</label>
                       <textarea rows="5" placeholder="How can we help?" required></textarea>
                    </div>
                    <button type="submit" className="contact-submit-btn">
                       <span>Send Message</span>
                       <ArrowRight size={18} />
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
