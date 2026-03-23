import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from './HomeLayout';
import BackgroundSlideshow from './BackgroundSlideshow';
import Login from './Login';
import '../App.css';

/* --- DATA COLLECTIONS --- */
const allCollections = [
    { id: 101, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1400", title: "L’Essentiel Hiver", subtitle: "Chaleur & Pureté" },
    { id: 103, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400", title: "Ligne Éditoriale", subtitle: "Avant-garde féminine" },
    { id: 107, image: "https://images.unsplash.com/photo-1511406361295-0a5ff814c0ad?w=1400", title: "Architecture Urbaine", subtitle: "Streetwear Minimal" },
    { id: 201, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1400", title: "Souffle d'Été", subtitle: "Lin & Intemporel" },
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function LandingPage({ onCartToggle, onLoginToggle, onSignupToggle, onContactToggle }) {
    const navigate = useNavigate();
    const [slidesData] = useState(() => allCollections);
    const [currentSlide, setCurrentSlide] = useState(0);

    const userName = localStorage.getItem('userName');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.reload();
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((p) => (p + 1) % slidesData.length);
        }, 8000);

        return () => {
            clearInterval(interval);
        };
    }, [slidesData.length]);

    return (
        <div className="landing-page-wrapper">
            <Navbar
                userName={userName}
                onLogout={handleLogout}
                onContact={onContactToggle}
                onLoginClick={onLoginToggle}
                onSignupClick={onSignupToggle}
                onCartToggle={onCartToggle}
            />

            {/* --- HERO SECTION --- */}
            <section className="hero-section">
                <BackgroundSlideshow currentSlide={currentSlide} slidesData={slidesData} />

                <div className="home-content">
                    <span className="gold-accent-text" style={{ letterSpacing: '8px', marginBottom: '20px', display: 'block' }}>MAISON DE MODE</span>
                    <h1 className="home-title" style={{ fontSize: '5rem', lineHeight: '0.9' }}>SMARTSHOP<br /><span style={{ fontWeight: '300', fontStyle: 'italic' }}>STUDIO.</span></h1>
                    <div className="home-subtitle" style={{ marginTop: '30px', opacity: 0.6 }}>Intelligence Artificielle & Haute Couture</div>
                    <div className="home-buttons" style={{ marginTop: '50px' }}>
                        <button className="btn-big btn-outline" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>Explorer</button>
                        <button className="btn-big btn-filled" onClick={() => navigate('/shop')}>Lancer l'IA</button>
                    </div>
                </div>

                <div className="hero-scroll-indicator">
                    <span>Scroll</span>
                    <div className="scroll-mouse"></div>
                </div>
            </section>

            {/* --- STUDIO VISION --- */}
            <section className="studio-vision">
                <div className="vision-container reveal">
                    <span className="vision-tag">Notre Philosophie</span>
                    <h2 className="vision-title">L'Élégance de demain,<br />conçue pour vous.</h2>
                    <p className="vision-desc">
                        SmartShop Studio fusionne l'artisanat traditionnel avec une intelligence artificielle de pointe.
                        Nous ne vendons pas simplement des vêtements ; nous créons une conversation entre votre style unique et l'innovation technologique.
                    </p>
                </div>
            </section>

            {/* --- PREMIUM COLLECTIONS GRID --- */}
            <section className="premium-grid">
                <div className="luxury-card grid-item-large reveal" onClick={() => navigate('/shop')}>
                    <img src={slidesData[0].image} alt="Col 1" />
                    <div className="card-content-overlay">
                        <span className="gold-accent-text" style={{ fontSize: '0.6rem' }}>Saison 2026</span>
                        <h3>L’ESSENTIEL HIVERNALE</h3>
                        <div className="explore-link">Explorer la collection</div>
                    </div>
                </div>
                <div className="luxury-card grid-item-small reveal" onClick={() => navigate('/shop')} style={{ transitionDelay: '0.2s' }}>
                    <img src={slidesData[1].image} alt="Col 2" />
                    <div className="card-content-overlay">
                        <h3>ÉDITORIAL</h3>
                        <div className="explore-link">Voir plus</div>
                    </div>
                </div>
                <div className="luxury-card grid-item-small reveal" onClick={() => navigate('/shop')}>
                    <img src={slidesData[2].image} alt="Col 3" />
                    <div className="card-content-overlay">
                        <h3>URBAN</h3>
                        <div className="explore-link">Voir plus</div>
                    </div>
                </div>
                <div className="luxury-card grid-item-large reveal" onClick={() => navigate('/shop')} style={{ transitionDelay: '0.2s' }}>
                    <img src={slidesData[3].image} alt="Col 4" />
                    <div className="card-content-overlay">
                        <span className="gold-accent-text" style={{ fontSize: '0.6rem' }}>Exclusivité IA</span>
                        <h3>BUREAU MODERNE</h3>
                        <div className="explore-link">Explorer</div>
                    </div>
                </div>
            </section>

            {/* --- BRAND BENEFITS PRO --- */}
            <section className="benefits-pro-section">
                <div className="benefits-grid-pro reveal">
                    <div className="benefit-item-pro">
                        <span className="icon">◈</span>
                        <h4>LIVRAISON STUDIO</h4>
                        <p>Expédition prioritaire sous 24h dans un packaging éco-conçu de luxe.</p>
                    </div>
                    <div className="benefit-item-pro">
                        <span className="icon">◈</span>
                        <h4>ARTISANAT IA</h4>
                        <p>Des recommandations basées sur votre morphologie et vos préférences de style.</p>
                    </div>
                    <div className="benefit-item-pro">
                        <span className="icon">◈</span>
                        <h4>CONCIERGERIE</h4>
                        <p>Une équipe dédiée disponible 7j/7 pour vous accompagner.</p>
                    </div>
                </div>
            </section>

            {/* --- CALL TO ACTION --- */}
            <section className="cta-section" style={{ padding: '150px 0', background: '#fff', color: '#000' }}>
                <div className="reveal">
                    <span className="gold-accent-text" style={{ color: '#111', fontSize: '0.8rem' }}>Prêt pour l'expérience ?</span>
                    <h2 style={{ fontSize: '3rem', marginTop: '20px', marginBottom: '40px' }}>VOTRE STYLE, RÉINVENTÉ.</h2>
                    <button className="btn-big btn-filled" onClick={() => navigate('/shop')} style={{ background: '#000', color: '#fff' }}>COMMENCER LE SHOPPING</button>
                </div>
            </section>

            {/* --- MODALS --- */}
            <Footer onContact={onContactToggle} />
        </div>
    );
}
