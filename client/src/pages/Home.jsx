import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Star, ArrowRight, Calendar, Users } from "lucide-react";
import api from "../utils/api";
import "./Home.css";

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDest, setSearchDest] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get("/rooms");
        setRooms(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const fallbackHotels = [
    { title: "The Grand Resort", location: "San Diego, CA", price: 450, rating: 4.9, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80" },
    { title: "The Grand Resort", location: "Maldives", price: 450, rating: 4.9, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80" },
    { title: "The Grand Resort", location: "Paris, France", price: 450, rating: 4.9, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=600&q=80" },
    { title: "The Grand Resort", location: "Dubai, UAE", price: 450, rating: 4.9, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" }
  ];

  const displayHotels = rooms.length > 0
    ? rooms.map(r => ({
        _id: r._id,
        title: r.title,
        location: `${r.location?.city || "City"}, ${r.location?.country || "Country"}`,
        price: r.price,
        rating: r.rating || 4.9,
        image: (r.images && r.images.length > 0 && r.images[0].trim() !== "") ? r.images[0] : fallbackHotels[0].image
      }))
    : fallbackHotels;

  const offers = [
    { title: "Summer Escape Package", desc: "Enjoy a complimentary night and daily breakfast", badge: "30% OFF", img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80" },
    { title: "Romantic Getaway", desc: "Special couple package including spa treatment", badge: "20% OFF", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80" },
    { title: "Early Bird Special", desc: "Book 60 days in advance and save on your stay", badge: "15% OFF", img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80" }
  ];

  const testimonials = [
    { img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80", name: "Emma Rodriguez", loc: "Barcelona, Spain", text: "I've been using QuickStay for my past few getaway trips and I'm so glad I did. Incredible attention to detail and customer service." },
    { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80", name: "Carlos Rodriguez", loc: "Buenos Aires", text: "I was amazed by how quickly everything was coordinated. The property exceeded expectations and the booking platforms set a new bar." },
    { img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80", name: "Diana Rodriguez", loc: "London, UK", text: "I've tried many competitors but none compare to the personalized experience that QuickStay delivers every single time." }
  ];

  return (
    <div className="home-exact">
      {/* Hero */}
      <section className="hero-exact-wrap">
        <div className="hero-bg"></div>
        <div className="container hero-content-exact">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="eyebrow white">The Ultimate Hotel Experience</span>
            <h1>Discover Your Perfect<br/>Getaway Destination</h1>
            <p className="hero-sub">Unparalleled luxury and comfort await at the world's most exclusive<br/>hotels and resorts. Start your journey today.</p>

            <div className="search-bar-exact">
               <div className="search-input">
                  <label><MapPin size={14}/> Destination</label>
                  <input type="text" placeholder="Dubai" value={searchDest} onChange={e => setSearchDest(e.target.value)} />
               </div>
               <div className="search-input">
                  <label><Calendar size={14}/> Check in</label>
                  <input type="date" />
               </div>
               <div className="search-input">
                  <label><Calendar size={14}/> Check out</label>
                  <input type="date" />
               </div>
               <div className="search-input sm">
                  <label><Users size={14}/> Guests</label>
                  <input type="number" placeholder="2" min="1" />
               </div>
               <button className="search-btn-exact" onClick={() => navigate(`/search?location=${searchDest}`)}>
                  <Search size={18} />
                  <span>Search</span>
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="featured-exact">
         <div className="container">
            <header className="section-head-exact centered">
               <h2>Featured Hotels</h2>
               <p>Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences</p>
            </header>

            <div className="hotel-grid-exact">
               {displayHotels.map((h, i) => (
                 <motion.div
                   key={h._id || i}
                   className="hotel-card-exact"
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   viewport={{ once: true }}
                 >
                    <Link to={h._id ? `/room/${h._id}` : "/rooms"} className="card-link-wrap">
                       <div className="card-top">
                          <img src={h.image} alt={h.title} loading="lazy" />
                          <span className="best-seller">Best Seller</span>
                       </div>
                       <div className="card-body">
                          <div className="body-top">
                             <h3>{h.title}</h3>
                             <span className="rating"><Star size={12} fill="#f59e0b" color="#f59e0b" /> {h.rating}</span>
                          </div>
                          <p className="loc"><MapPin size={12}/> {h.location}</p>
                          <div className="body-bottom">
                             <span className="price"><strong>${h.price}</strong> /night</span>
                             <span className="view-btn">View Details</span>
                          </div>
                       </div>
                    </Link>
                 </motion.div>
               ))}
            </div>
            <div className="view-all-row">
               <Link to="/rooms" className="view-all-ghost">View All Hotels</Link>
            </div>
         </div>
      </section>

      {/* Exclusive Offers */}
      <section className="offers-exact">
         <div className="container">
            <header className="section-head-exact flex">
               <div>
                  <h2>Exclusive Offers</h2>
                  <p>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
               </div>
               <Link to="/rooms" className="view-link">View All Offers <ArrowRight size={16}/></Link>
            </header>

            <div className="offers-grid-exact">
               {offers.map((o, i) => (
                 <motion.div
                   key={i}
                   className="offer-card-exact"
                   whileHover={{ y: -8 }}
                   transition={{ type: "spring", stiffness: 300 }}
                 >
                    <img src={o.img} alt={o.title} loading="lazy" />
                    <div className="offer-content">
                       <span className="offer-badge">{o.badge}</span>
                       <h3>{o.title}</h3>
                       <p>{o.desc}</p>
                       <Link to="/rooms" className="offer-link">View Offers <ArrowRight size={14}/></Link>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-exact">
         <div className="container">
            <header className="section-head-exact centered">
               <h2>What Our Guests Say</h2>
               <p>Discover why discerning travelers choose QuickStay for their luxury accommodations around the world.</p>
            </header>

            <div className="testimonials-grid-exact">
               {testimonials.map((t, i) => (
                 <motion.div
                   key={i}
                   className="testi-card"
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.15 }}
                   viewport={{ once: true }}
                 >
                    <div className="testi-user">
                       <img src={t.img} alt={t.name} loading="lazy" />
                       <div>
                          <h4>{t.name}</h4>
                          <p>{t.loc}</p>
                       </div>
                    </div>
                    <div className="testi-stars">
                       {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}
                    </div>
                    <p className="testi-text">"{t.text}"</p>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
