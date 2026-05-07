import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Presentation, Plane, ShieldCheck } from "lucide-react";
import "./Groups.css";

const Groups = () => {
  const blocks = [
    {
      icon: Users,
      title: "Room blocks",
      text: "Secure ten to five hundred rooms with one agreement, phased releases, and guest-name uploads when you need them.",
    },
    {
      icon: Presentation,
      title: "Meetings & off-sites",
      text: "Seaside board sessions, skyline summits, and hybrid studios—paired with breakout spaces and plated service.",
    },
    {
      icon: Plane,
      title: "Travel logistics",
      text: "We coordinate arrivals, bespoke experiences, and last-minute swaps when programs evolve during the week.",
    },
    {
      icon: ShieldCheck,
      title: "Duty of care",
      text: "Preferred partners meet QuickStay cleanliness and safety guidelines. Incident hotline included for road-warrior teams.",
    },
  ];

  return (
    <div className="groups-page">
      <section className="groups-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="eyebrow blue">For teams</span>
            <h1>Groups &amp; corporate travel</h1>
            <p className="groups-lede">
              A single point of contact for multi-room programs, branded
              experiences, and travel policies that mirror how your company
              actually works.
            </p>
            <div className="groups-hero-actions">
              <Link to="/contact" className="groups-btn-primary">
                Brief our team
              </Link>
              <Link to="/rooms" className="groups-btn-ghost">
                Explore inventory
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container groups-section">
        <h2 className="groups-section-title">How we support programs</h2>
        <div className="groups-grid">
          {blocks.map((b, i) => (
            <motion.div
              key={b.title}
              className="groups-card"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="groups-icon-wrap">
                <b.icon size={22} aria-hidden />
              </div>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <section className="groups-band">
        <div className="container groups-band-inner">
          <div>
            <h2>Prefer a curated shortlist?</h2>
            <p>
              Send destination, approximate headcount, and dates—we respond with
              three aligned options within twenty-four hours.
            </p>
          </div>
          <Link to="/contact">Start a briefing</Link>
        </div>
      </section>
    </div>
  );
};

export default Groups;
