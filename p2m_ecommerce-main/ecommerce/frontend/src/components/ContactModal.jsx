import React from 'react';
import nour from '../assets/nour.jpg';
import jawhar from '../assets/jawhar.jpg';

const ContactModal = ({ onClose }) => {
  return (
    <div className="auth-modal-root" style={{ zIndex: 3000000 }}>
      {/* Overlay covers the background */}
      <div className="auth-overlay" onClick={onClose} style={{ position: 'fixed', inset: 0 }}></div>

      {/* Content box */}
      <div className="contact-premium-container"
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', zIndex: 10 }}>

        <button className="premium-close-btn" onClick={onClose}>✕</button>

        <div className="contact-header-luxury">
          <span className="gold-accent-text">Savoir-Faire</span>
          <h2>CONTACTER LE STUDIO</h2>
          <p>L’excellence et l’innovation au service de votre style.</p>
        </div>

        <div className="members-showcase">
          {/* Membre 1 */}
          <div className="luxury-member-card">
            <div className="member-portrait-box">
              <img src={nour} alt="Nour" />
              <div className="portrait-overlay"></div>
            </div>
            <div className="member-bio">
              <h3>Nour Ben Abdeljelil</h3>
              <span className="job-title">Product Lead & Designer</span>
              <div className="member-socials">
                <div className="social-row">
                  <span className="social-icon">✉️</span>
                  <span>nour.benabdeljelil@supcom.tn</span>
                </div>
                <div className="social-row">
                  <span className="social-icon">📱</span>
                  <span>+216 93 296 282</span>
                </div>
              </div>
            </div>
          </div>

          <div className="showcase-divider"></div>

          {/* Membre 2 */}
          <div className="luxury-member-card">
            <div className="member-portrait-box">
              <img src={jawhar} alt="Jawhar" />
              <div className="portrait-overlay"></div>
            </div>
            <div className="member-bio">
              <h3>Mohamed Jawhar Daoudi</h3>
              <span className="job-title">Lead Architect & Tech Expert</span>
              <div className="member-socials">
                <div className="social-row">
                  <span className="social-icon">✉️</span>
                  <span>mohamedjawhar.daoudi@supcom.tn</span>
                </div>
                <div className="social-row">
                  <span className="social-icon">📱</span>
                  <span>+216 93 240 480</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-bottom-legal">
          SMARTSHOP STUDIO • TUNISIA • EXPERTISE CONNECTÉE
        </div>
      </div>
    </div>
  );
};

export default ContactModal;