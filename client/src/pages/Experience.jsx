import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Globe, ShieldCheck } from "lucide-react";
import "./Experience.css";

const Experience = () => {
  const experiences = [
    {
      title: "Celestial Coastal Retreats",
      tag: "WATERFRONT",
      description: "Private island access, underwater dining, and sunset yacht excursions curated for absolute serenity.",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Metropolitan Elite Escapes",
      tag: "URBAN LUXURY",
      description: "Penthouse views above the skyline, personalized concierge services, and exclusive club access.",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Ancestral Wellness Journeys",
      tag: "HOLISTIC",
      description: "Ancient healing rituals combined with modern science in secluded mountain sanctuaries.",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <div className="experience-page-exact">
      <section className="experience-hero-clean">
        <div className="hero-overlay"></div>
        <div className="container">
          <motion.div 
            className="exp-hero-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="eyebrow blue">The QuickStay Philosophy</span>
            <h1>Journeys Beyond Expectation</h1>
            <p>We believe a stay is more than a room. It is a portal to new perspectives, curated with an eye for excellence and connection.</p>
          </motion.div>
        </div>
      </section>

      <section className="experiences-grid-sec">
         <div className="container">
            <header className="section-head-exact centered">
               <h2>Curated Chapters</h2>
               <p>Discover our handpicked adventures designed to inspire and rejuvenate.</p>
            </header>

            <div className="exp-grid-modern">
               {experiences.map((exp, i) => (
                 <motion.div 
                   key={i} 
                   className="exp-card-modern"
                   whileHover={{ y: -10 }}
                 >
                    <div className="ext-img">
                       <img src={exp.image} alt={exp.title} />
                       <span className="tag-pill">{exp.tag}</span>
                    </div>
                    <div className="exp-body">
                       <h3>{exp.title}</h3>
                       <p>{exp.description}</p>
                       <Link to="/rooms" className="explore-link">View matching stays <ArrowRight size={16}/></Link>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      <section className="benefits-clean">
         <div className="container flex-cols">
            <div className="ben-visual">
               <img src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=80" alt="" />
            </div>
            <div className="ben-content">
               <span className="eyebrow blue">The Standards</span>
               <h2>Travel with Absolute Confidence.</h2>
               <div className="ben-list">
                  <div className="ben-item">
                     <Sparkles size={24} color="var(--primary)"/>
                     <div>
                        <h4>Artisan Curation</h4>
                        <p>Collaborating with masters of hospitality to define new standards of personal excellence.</p>
                     </div>
                  </div>
                  <div className="ben-item">
                     <Globe size={24} color="var(--primary)"/>
                     <div>
                        <h4>Global Concierge</h4>
                        <p>An invisible hand guiding your journey through the world's most sought-after destinations.</p>
                     </div>
                  </div>
                  <div className="ben-item">
                     <ShieldCheck size={24} color="var(--primary)"/>
                     <div>
                        <h4>Verified Excellence</h4>
                        <p>Properties that treat every guest with the highest standards of luxury and care.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Experience;
