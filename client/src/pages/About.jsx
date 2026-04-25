import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Award, Users } from "lucide-react";
import "./About.css";

const About = () => {
  const values = [
    {
      icon: <Award color="var(--primary)" size={32} />,
      title: "Excellence",
      desc: "An obsessive attention to detail that defines every aspect of our curated selection."
    },
    {
      icon: <ShieldCheck color="var(--primary)" size={32} />,
      title: "Integrity",
      desc: "Transparent relationships with partners and absolute privacy for our discerning guests."
    },
    {
      icon: <Users color="var(--primary)" size={32} />,
      title: "Connection",
      desc: "Bridging the gap between soulful travelers and the world's most evocative spaces."
    }
  ];

  return (
    <div className="about-page-exact">
      <section className="about-hero-clean-v2">
        <div className="container">
          <motion.div 
            className="about-hero-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="eyebrow blue">ESTD. 2023</span>
            <h1>Architects of Atmosphere</h1>
            <p>Redefining travel through a lens of curated simplicity and profound human experience.</p>
          </motion.div>
        </div>
      </section>

      <section className="mission-sec-clean">
        <div className="container flex-layout-v2">
          <div className="mission-visual-box">
             <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80" alt="luxury hotel" />
          </div>
          <div className="mission-content-v2">
            <span className="eyebrow blue">Our Manifesto</span>
            <h2>The pursuit of the extraordinary.</h2>
            <p>At QuickStay, we believe that travel is the ultimate art form. Our platform was born from a desire to strip away the noise of traditional booking and return to the essence of luxury: time, space, and memory.</p>
            <p>We don't just list hotels; we curate sanctuaries. Our team traverses the globe to hand-select properties that possess a unique "soul"—places where architecture, service, and environment converge to create something magical.</p>
          </div>
        </div>
      </section>

      <section className="values-sec-clean">
        <div className="container">
          <header className="section-head-exact centered">
            <h2>Foundational Pillars</h2>
            <p>Our DNA is built on three core values that guide every property selection.</p>
          </header>
          <div className="values-grid-v2">
            {values.map((v, idx) => (
              <motion.div 
                className="val-card-v2" 
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="v-icon-box">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
