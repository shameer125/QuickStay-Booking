import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Search, User, Menu, X, LogOut, LayoutDashboard, CalendarDays, Bookmark } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";

  return (
    <nav className={`nav-exact ${scrolled || !isHome ? "scrolled" : ""}`}>
      <div className="container nav-flex">
        <Link to="/" className="brand-exact">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
           <span>QuickStay</span>
        </Link>

        <div className="nav-links-exact">
           <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
           <Link to="/rooms" className={location.pathname === "/rooms" ? "active" : ""}>Stays</Link>
           <Link to="/experience" className={location.pathname === "/experience" ? "active" : ""}>Experiences</Link>
           <Link to="/groups" className={location.pathname === "/groups" ? "active" : ""}>Groups</Link>
           <Link to="/help" className={location.pathname === "/help" ? "active" : ""}>Help</Link>
           <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
        </div>

        <div className="nav-actions-exact">
           <Link to="/saved" className="nav-saved-trigger" title="Saved stays" aria-label="Saved stays">
             <Bookmark size={18} />
           </Link>
           <button type="button" className="search-trigger" aria-label="Search stays" onClick={() => navigate("/search")}>
             <Search size={18} />
           </button>
           {user ? (
             <>
               {user.isAdmin ? (
                 <Link to="/dashboard" className="nav-dash-link" title="Admin dashboard">
                   <LayoutDashboard size={18} />
                   <span>Admin</span>
                 </Link>
               ) : (
                 <>
                   <Link to="/my-bookings" className="nav-trips-link" title="Your reservations">
                     <CalendarDays size={18} />
                     <span>My trips</span>
                   </Link>
                   <Link to="/profile" className="user-pill-exact">
                     <User size={16} />
                     <span>{user.name}</span>
                   </Link>
                 </>
               )}
               {user.isAdmin && (
                 <Link to="/profile" className="user-pill-exact subtle" title="Account">
                   <User size={16} />
                   <span>{user.name}</span>
                 </Link>
               )}
               <button className="nav-logout-btn" onClick={() => { logout(); navigate("/"); }} title="Logout">
                  <LogOut size={18} />
               </button>
             </>
           ) : (
             <Link to="/login" className="login-btn-exact">Login</Link>
           )}
           <button className="menu-trigger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
           </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-exact">
           <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
           <Link to="/rooms" onClick={() => setMobileMenuOpen(false)}>Stays</Link>
           <Link to="/experience" onClick={() => setMobileMenuOpen(false)}>Experiences</Link>
           <Link to="/groups" onClick={() => setMobileMenuOpen(false)}>Groups</Link>
           <Link to="/help" onClick={() => setMobileMenuOpen(false)}>Help</Link>
           <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
           <Link to="/saved" onClick={() => setMobileMenuOpen(false)}>Saved stays</Link>
           {user ? (
             <>
               {user.isAdmin ? (
                 <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Admin dashboard</Link>
               ) : (
                 <>
                   <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)}>My trips</Link>
                   <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Account ({user.name})</Link>
                 </>
               )}
               <button className="mobile-logout-btn" onClick={() => { logout(); navigate("/"); setMobileMenuOpen(false); }}>
                  <LogOut size={18} /> Logout
               </button>
             </>
           ) : (
             <Link to="/login" className="mobile-login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
           )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
