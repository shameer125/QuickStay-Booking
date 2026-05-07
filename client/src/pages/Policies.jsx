import React from "react";
import { Link } from "react-router-dom";
import "./Policies.css";

const Sections = ({ id, title, children }) => (
  <section id={id} className="pol-section">
    <h2>{title}</h2>
    <div className="pol-section-body">{children}</div>
  </section>
);

const Policies = () => {
  return (
    <div className="policies-page">
      <div className="container policies-wrap">
        <header className="pol-hero">
          <span className="eyebrow blue">Trust &amp; transparency</span>
          <h1>Policies</h1>
          <p>
            Practical information about how we handle your account, bookings,
            and personal data on this demo platform. Replace this copy with legal
            text approved for your jurisdiction before launch.
          </p>
          <nav className="pol-toc">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms of use</a>
            <a href="#booking">Booking &amp; cancellation</a>
            <a href="#cookies">Cookies</a>
          </nav>
        </header>

        <div className="pol-content">
          <Sections id="privacy" title="Privacy overview">
            <p>
              We collect the minimum details required to authenticate you and
              complete reservations—typically name, email, and hashed password.
              Listing browse behavior is not sold to advertisers in this demo
              deployment.
            </p>
            <p>
              You may request export or deletion of your profile by emailing
              our team with the subject line &quot;Data request&quot;.
            </p>
          </Sections>

          <Sections id="terms" title="Terms of use">
            <p>
              QuickStay connects travelers with descriptive property content.
              Stays are subject to confirmation at checkout. You agree not to
              misuse the API, circumvent rate limits, or attempt to alter other
              users&apos; bookings or admin tools.
            </p>
          </Sections>

          <Sections id="booking" title="Booking &amp; cancellation">
            <p>
              Confirmed bookings appear under My trips. Where the property
              allows, you may cancel from that screen and status will update to{" "}
              <strong>Cancelled</strong>. Charges, refunds, and change fees for
              a production deployment should be spelled out clearly with each
              rate plan.
            </p>
          </Sections>

          <Sections id="cookies" title="Cookies">
            <p>
              This application may store lightweight preferences (such as saved
              stays on your device) and session tokens while you remain signed
              in. Clear site data from your browser to remove them instantly.
            </p>
          </Sections>

          <div className="pol-cta-box">
            <p>Questions specific to compliance or contracting?</p>
            <Link to="/contact">Message concierge</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;
