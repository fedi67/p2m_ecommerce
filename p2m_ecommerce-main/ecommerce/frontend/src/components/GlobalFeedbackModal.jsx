import React, { useState } from 'react';
import CONFIG from '../config';

const GlobalFeedbackModal = ({ isOpen, onClose }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) return alert("Veuillez vous connecter pour laisser un avis.");

        setSubmitting(true);
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/api/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating, comment })
            });
            if (res.ok) {
                alert("Merci pour votre précieux retour ! SmartShop Studio s'améliore grâce à vous.");
                onClose();
            } else {
                alert("Erreur lors de l'envoi.");
            }
        } catch (err) {
            console.error("Feedback error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999
        }}>
            <div className="signup-luxury-box" style={{ width: '500px', padding: '50px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#c5a059', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

                <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '10px' }}>VOTRE EXPÉRIENCE</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginBottom: '30px' }}>Votre avis nous aide à atteindre l'excellence.</p>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ color: '#c5a059', fontSize: '0.7rem', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>NOTE GLOBALE</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                type="button"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '2rem',
                                    color: star <= rating ? '#c5a059' : 'rgba(255,255,255,0.2)',
                                    transition: 'color 0.2s',
                                    padding: '0 5px'
                                }}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ color: '#c5a059', fontSize: '0.7rem', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>MESSAGE</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Comment voyez-vous SmartShop Studio ?"
                        style={{
                            width: '100%', height: '120px', background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '15px',
                            borderRadius: '10px', fontSize: '0.9rem'
                        }}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="login-btn-luxury"
                    style={{ width: '100%' }}
                >
                    {submitting ? "ENVOI..." : "PUBLIER MON AVIS"}
                </button>
            </div>
        </div>
    );
};

export default GlobalFeedbackModal;
