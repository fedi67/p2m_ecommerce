import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from './HomeLayout';
import BackgroundSlideshow from './BackgroundSlideshow';
import CONFIG from '../config';
import GlobalFeedbackModal from './GlobalFeedbackModal';

const profileSlides = [
    { id: 1, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1400" },
    { id: 2, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1400" },
    { id: 3, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400" },
];

const UserProfile = ({ onAdminClick, onClose, onStartChat, onLogout, onCartToggle, onLoginClick, onSignupClick, onContact }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Force scroll to top when modal opens to avoid viewport issues
    useEffect(() => {
        if (isFeedbackOpen || selectedOrder) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isFeedbackOpen, selectedOrder]);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`${CONFIG.API_BASE_URL}/api/user/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                }
            } catch (err) {
                console.error("Erreur profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Slideshow interval
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % profileSlides.length);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="profile-luxury-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="signup-luxury-box" style={{ width: 'auto', padding: '40px' }}>CHARGEMENT...</div>
        </div>
    );

    return (
        <div className="profile-luxury-wrapper"
            style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background Slideshow with Adjusted Visibility */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.7 }}>
                <BackgroundSlideshow currentSlide={currentSlide} slidesData={profileSlides} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', zIndex: 1 }}></div>
            </div>

            <Navbar
                userName={userData?.first_name}
                onLogout={onLogout}
                onContact={onContact}
                onCartToggle={onCartToggle}
                onLoginClick={onLoginClick}
                onSignupClick={onSignupClick}
            />

            <div className="signup-luxury-box"
                onClick={(e) => e.stopPropagation()}
                style={{ width: '1100px', maxWidth: '95%', margin: '0 auto', zIndex: 10, position: 'relative', cursor: 'default' }}>
                <button className="premium-close-btn"
                    onClick={onClose}
                    style={{
                        top: '30px',
                        right: '30px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#c5a059',
                        fontSize: '1.5rem'
                    }}>✕</button>

                <div className="auth-header-pro" style={{ marginBottom: '60px' }}>
                    <span className="gold-accent-text" style={{ letterSpacing: '8px' }}>MEMBRE STUDIO</span>
                    <h2 className="luxury-title-auth" style={{ fontSize: '3rem' }}>VOTRE ESPACE</h2>
                    <p className="auth-subtitle-pro">
                        Bonjour, <span style={{ fontStyle: 'italic', color: '#c5a059' }}>{userData?.first_name || 'Estimé Client'}.</span>
                    </p>
                </div>

                <div className="profile-grid-luxury" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '60px' }}>
                    {/* Identity Info */}
                    <div className="info-luxury-card">
                        <div style={{ paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: '300' }}>IDENTITÉ</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div className="data-row-luxury">
                                <label>ADRESSE E-MAIL</label>
                                <span>{userData?.email && userData.email !== 'Non spécifié' ? userData.email : 'Non renseignée'}</span>
                            </div>
                            <div className="data-row-luxury">
                                <label>GENRE</label>
                                <span>{userData?.gender === 'F' ? 'Femme' : userData?.gender === 'H' ? 'Homme' : (userData?.gender === 'Non spécifié' ? 'Non précisé' : 'Énigmatique')}</span>
                            </div>
                            <div className="data-row-luxury">
                                <label>ÂGE</label>
                                <span>{userData?.age && userData.age !== 'N/A' ? `${userData.age} ans` : 'Non renseigné'}</span>
                            </div>
                            <div className="data-row-luxury">
                                <label>PAYS DE RÉSIDENCE</label>
                                <span>{userData?.country && userData.country !== 'Non spécifié' ? userData.country : 'Non renseigné'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats & History */}
                    <div className="history-luxury-card">
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '20px', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                            <h4 style={{ fontSize: '0.7rem', letterSpacing: '3px', opacity: 0.5, marginBottom: '15px' }}>POINTS PRIVILÈGE</h4>
                            <div style={{ fontSize: '4rem', fontWeight: '100', color: '#c5a059' }}>2,450</div>
                            <button onClick={onStartChat} className="login-btn-luxury" style={{ width: 'auto', padding: '12px 40px', marginTop: '20px' }}>
                                NOUVELLE SESSION IA
                            </button>
                            <button
                                onClick={() => setIsFeedbackOpen(true)}
                                style={{
                                    background: 'none', border: '1px solid rgba(197, 160, 89, 0.4)', color: '#c5a059',
                                    padding: '10px 20px', fontSize: '0.65rem', borderRadius: '5px', marginLeft: '10px',
                                    cursor: 'pointer', letterSpacing: '2px', fontWeight: 'bold'
                                }}
                            >
                                LAISSER UN AVIS STUDIO
                            </button>
                        </div>

                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: '300', marginBottom: '25px' }}>DERNIÈRES ACQUISITIONS</h3>
                        <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '10px' }} className="custom-scroll">
                            <table className="history-table-luxury">
                                <thead>
                                    <tr>
                                        <th>RÉFÉRENCE</th>
                                        <th>DATE</th>
                                        <th>NBR ARTICLES</th>
                                        <th>STATUT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userData?.purchase_history?.map((order, idx) => (
                                        <tr key={idx}
                                            onClick={() => setSelectedOrder(order)}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            style={{ cursor: 'pointer', transition: '0.3s' }}
                                        >
                                            <td style={{ fontFamily: 'monospace', opacity: 0.6, fontSize: '0.8rem' }}>{order.id}</td>
                                            <td style={{ fontSize: '0.85rem' }}>{order.date}</td>
                                            <td style={{ letterSpacing: '1px', fontWeight: '600', fontSize: '0.9rem' }}>{order.item_count} PIÈCES</td>
                                            <td><span className="status-tag-luxury">{order.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="auth-footer-pro" style={{ marginTop: '80px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    {userData?.is_admin && (
                        <button onClick={onAdminClick} className="gold-link-pro" style={{ background: 'rgba(197, 160, 89, 0.1)', border: '1px solid #c5a059', padding: '10px 30px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                            ACCÉDER AU DASHBOARD ADMIN
                        </button>
                    )}
                    <span>SmartShop Studio © 2026 - Registre de Membre Privé</span>
                    <button onClick={onLogout} className="gold-link-pro" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>SE DÉCONNECTER DU STUDIO</button>
                </div>
            </div>

            <Footer onContact={onContact} />

            <GlobalFeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />

            <OrderDetailsModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        </div>
    );
};

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000000
        }}>
            <div className="signup-luxury-box" style={{ width: '600px', maxWidth: '90%', padding: '50px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', color: '#c5a059', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>

                <div style={{ marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
                    <div style={{ color: '#c5a059', fontSize: '0.7rem', letterSpacing: '3px', fontWeight: 'bold', marginBottom: '10px' }}>DÉTAILS COMMANDE</div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'white', fontSize: '1.8rem', margin: 0 }}>{order.id}</h2>
                    <p style={{ opacity: 0.5, fontSize: '0.8rem', marginTop: '5px' }}>Passée le {order.date}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '400px', overflowY: 'auto', paddingRight: '15px' }}>
                    {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px' }}>
                            <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold', letterSpacing: '1px', fontSize: '1rem' }}>{item.name}</div>
                                <div style={{ opacity: 0.5, fontSize: '0.75rem', marginTop: '2px' }}>Taille: {item.size} • Qté: {item.quantity}</div>
                            </div>
                            <div style={{ color: '#c5a059', fontWeight: 'bold' }}>{item.price.toFixed(2)} €</div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>STATUT: {order.status}</div>
                    <div style={{ fontSize: '1.4rem', fontFamily: "'Playfair Display', serif" }}>
                        <span style={{ fontSize: '0.8rem', opacity: 0.5, marginRight: '10px' }}>TOTAL</span>
                        <span style={{ color: '#c5a059', fontWeight: 'bold' }}>{order.total_price.toFixed(2)} €</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;