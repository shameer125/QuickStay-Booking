import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { CreditCard, ShieldCheck, CheckCircle, ArrowLeft, Loader2, MapPin, Calendar, Users } from "lucide-react";
import api from "../utils/api";
import "./Checkout.css";

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const checkIn = queryParams.get("checkIn") || new Date().toISOString().split("T")[0];
  const checkOut = queryParams.get("checkOut") || new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const guests = parseInt(queryParams.get("guests")) || 2;

  useEffect(() => {
     const fetchRoom = async () => {
       
      try {
        const { data } = await api.get(`/rooms/${id}`);
        setRoom(data);
      } catch (error) {
        console.error("Failed to fetch room:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const calculateDays = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const totalPrice = room ? calculateDays() * room.price : 0;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate(`/login?redirect=/checkout/${id}${location.search}`);
      return;
    }

    try {
      setBookingLoading(true);
      await api.post("/bookings", {
        room: id,
        checkIn,
        checkOut,
        guests,
        totalPrice,
      });
      setSuccess(true);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="loading">Initializing secure checkout...</div>;

  if (success) {
    return (
      <div className="checkout-success-page">
        <div className="container">
          <motion.div 
            className="success-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <CheckCircle size={64} color="#16a34a" />
            <h1>Booking Confirmed!</h1>
            <p>Thank you for choosing QuickStay. Your reservation at <strong>{room?.title}</strong> is secured.</p>
            
            <div className="summary-box">
               <div className="row"><span>Hotel</span><strong>{room?.title}</strong></div>
               <div className="row"><span>Date</span><strong>{checkIn} to {checkOut}</strong></div>
               <div className="row"><span>Total Paid</span><strong>${totalPrice}</strong></div>
            </div>

            <div className="success-footer">
               <button onClick={() => navigate("/dashboard")} className="btn-primary-blue">View My Bookings</button>
               <button onClick={() => navigate("/")} className="btn-outline">Back to Home</button>
                </div>
                
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-clean">
      <div className="container">
        <header className="checkout-header">
           <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={18}/> Back</button>
           <h1>Checkout</h1>
        </header>

        <div className="checkout-grid">
           <div className="checkout-form-side">
              <section className="checkout-block">
                 <div className="block-title">
                    <span className="num">1</span>
                    <h3>Your Trip Details</h3>
                 </div>
                 <div className="trip-summary-clean">
                    <div className="trip-item">
                       <label><Calendar size={14}/> Dates</label>
                       <p>{checkIn} — {checkOut}</p>
                    </div>
                    <div className="trip-item">
                       <label><Users size={14}/> Guests</label>
                       <p>{guests} {guests > 1 ? 'guests' : 'guest'}</p>
                    </div>
                    <div className="trip-item">
                       <label><MapPin size={14}/> Location</label>
                       <p>{room?.location?.city}, {room?.location?.country}</p>
                    </div>
                 </div>
              </section>

              <section className="checkout-block">
                 <div className="block-title">
                    <span className="num">2</span>
                    <h3>Payment Information</h3>
                 </div>
                 <form onSubmit={handleBooking} className="payment-form-clean">
                    <div className="form-row">
                       <div className="form-group-clean">
                          <label>Cardholder Name</label>
                          <input type="text" placeholder="John Doe" required />
                       </div>
                    </div>
                    <div className="form-row">
                       <div className="form-group-clean">
                          <label>Card Number</label>
                          <input type="text" placeholder="0000 0000 0000 0000" required />
                       </div>
                    </div>
                    <div className="form-row split">
                       <div className="form-group-clean">
                          <label>Expiry Date</label>
                          <input type="text" placeholder="MM / YY" required />
                       </div>
                       <div className="form-group-clean">
                          <label>CVV</label>
                          <input type="password" placeholder="***" required />
                       </div>
                    </div>

                    <div className="security-info">
                       <ShieldCheck size={18} color="#2563eb" />
                       <span>Your payment is secured with 256-bit SSL encryption.</span>
                    </div>

                    <button type="submit" className="confirm-btn" disabled={bookingLoading}>
                       {bookingLoading ? <Loader2 className="spin" size={20}/> : `Confirm & Pay $${totalPrice}`}
                    </button>
                 </form>
              </section>
           </div>

           <aside className="checkout-summary-side">
              <div className="summary-card-clean">
                 <h3>Price Summary</h3>
                 <div className="room-preview-box">
                    <img src={room?.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=100&q=80"} alt="" />
                    <div className="meta">
                       <h4>{room?.title}</h4>
                       <p>{room?.category}</p>
                    </div>
                 </div>
                 
                 <div className="price-breakdown">
                    <div className="price-row">
                       <span>${room?.price} x {calculateDays()} nights</span>
                       <span>${totalPrice}</span>
                    </div>
                    <div className="price-row">
                       <span>Service Fee</span>
                       <span className="free">Free</span>
                    </div>
                    <div className="price-row total">
                       <span>Total (USD)</span>
                       <span>${totalPrice}</span>
                    </div>
                 </div>

                 <div className="policy-note">
                    <strong>Free cancellation</strong>
                    <p>Cancel up to 48 hours before check-in for a full refund.</p>
                 </div>
              </div>
           </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
