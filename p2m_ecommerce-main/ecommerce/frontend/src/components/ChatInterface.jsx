import React, { useState, useEffect, useMemo } from 'react';
import BackgroundSlideshow from './BackgroundSlideshow';
import CONFIG from '../config';

const ChatInterface = ({
    messages, inputValue, setInputValue, onSend, onViewProfile, chatEndRef, isTyping, backgrounds
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [reviewProductId, setReviewProductId] = useState(null);

    // Group products by message (proposition)
    const productPropositions = useMemo(() => {
        return messages
            .filter(msg => msg.products && msg.products.length > 0)
            .reverse() // Newest proposition first
            .map(msg => ({
                id: msg.id,
                products: msg.products,
                text: msg.text?.substring(0, 40) + "..."
            }));
    }, [messages]);

    useEffect(() => {
        const originalBodyStyles = { overflow: document.body.style.overflow, height: document.body.style.height };
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalBodyStyles.overflow;
            document.body.style.height = originalBodyStyles.height;
            document.documentElement.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setCurrentSlide(p => (p + 1) % (backgrounds?.length || 1)), 10000);
        return () => clearInterval(interval);
    }, [backgrounds?.length]);

    return (
        <div className="split-lookbook-wrapper" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            overflow: 'hidden', display: 'flex', zIndex: 1000,
            background: '#050505',
        }}>

            {/* 1. LEFT COLUMN: CHAT (35%) */}
            <div className="chat-column" style={{
                width: '35%', height: '100%', display: 'flex', flexDirection: 'column',
                background: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(30px)',
                borderRight: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 10
            }}>

                {/* Header Small */}
                <header style={{ padding: '30px 40px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer', opacity: 0.6 }}>←</button>
                        <button onClick={onViewProfile} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: 'white', cursor: 'pointer' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </button>
                    </div>
                    <span style={{ fontSize: '0.55rem', letterSpacing: '6px', color: '#c5a059', fontWeight: 'bold' }}>CONSEILLER PRIVÉ</span>
                    <h1 style={{ margin: '5px 0', fontSize: '1.4rem', fontWeight: '300', letterSpacing: '1px' }}>VOTRE STUDIO</h1>
                </header>

                {/* Messages Scrollable */}
                <div className="custom-scroll" style={{ flex: '1 1 auto', overflowY: 'auto', padding: '30px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <style>{`
            .custom-scroll::-webkit-scrollbar { width: 3px; }
            .custom-scroll::-webkit-scrollbar-thumb { background: rgba(197, 160, 89, 0.2); }
            .msg-bubble { transition: all 0.3s ease; }
            .mood-card { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
            .mood-card:hover { transform: scale(1.02); }
            
            /* Aurora Animations */
            @keyframes aurora-float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-3px); }
                100% { transform: translateY(0px); }
            }
            
            @keyframes blink {
                0% { opacity: 0.2; }
                20% { opacity: 1; }
                100% { opacity: 0.2; }
            }
            .typing-dot {
                animation: blink 1.4s infinite both;
                width: 5px; height: 5px;
                background: #c5a059; borderRadius: 50%; display: inline-block;
            }
            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }

          `}</style>
                    {messages.filter(m => m.text && m.text.trim()).map((msg, idx) => (
                        <div key={msg.id} className="msg-bubble" style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            marginBottom: '24px',
                            animation: 'aurora-float 6s ease-in-out infinite',
                            animationDelay: `${idx * 0.5}s`, // Staggered breathing
                            position: 'relative'
                        }}>
                            <div style={{
                                background: msg.sender === 'ai'
                                    ? 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(40,35,25,0.9) 100%)' // Dark Luxe Aurora
                                    : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)', // Glassy User
                                border: msg.sender === 'ai' ? '1px solid rgba(197, 160, 89, 0.2)' : '1px solid rgba(255,255,255,0.1)',
                                boxShadow: msg.sender === 'ai' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 15px rgba(0,0,0,0.1)',
                                color: '#fff',
                                padding: '18px 24px',
                                borderRadius: msg.sender === 'ai' ? '24px 24px 24px 4px' : '24px 24px 4px 24px', // ORGANIC SHAPES

                                fontSize: '1.1rem',
                                lineHeight: '1.6',
                                fontStyle: msg.sender === 'ai' ? 'italic' : 'normal',
                                backdropFilter: 'blur(10px)',
                            }}>
                                {/* Petit accent doré fluide pour l'IA */}
                                {msg.sender === 'ai' && (
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                        borderRadius: '24px 24px 24px 4px',
                                        background: 'linear-gradient(45deg, transparent 0%, rgba(197, 160, 89, 0.05) 50%, transparent 100%)',
                                        opacity: 0.5,
                                        pointerEvents: 'none'
                                    }}></div>
                                )}
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="msg-bubble" style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.03)',
                                color: '#c5a059',
                                padding: '12px 20px', borderRadius: '2px 20px 20px 20px',
                                fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex', alignItems: 'center', gap: '12px'
                            }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <div className="typing-dot" />
                                    <div className="typing-dot" />
                                    <div className="typing-dot" />
                                </div>
                                <span style={{ opacity: 0.8, fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    Votre styliste réfléchit...
                                </span>
                            </div>
                        </div>
                    )}


                    <div ref={chatEndRef} />
                </div>

                {/* Input area fixed at bottom of left column */}
                <footer style={{ padding: '20px 30px 40px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && onSend()}
                            placeholder="Échangez avec votre styliste..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '30px', padding: '15px 50px 15px 25px', color: 'white', outline: 'none', fontSize: '0.9rem' }}
                        />
                        <button onClick={onSend} style={{ position: 'absolute', right: '10px', background: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: 'black', cursor: 'pointer', fontWeight: 'bold' }}>➜</button>
                    </div>
                </footer>
            </div>

            {/* 2. RIGHT COLUMN: MOODBOARD (65%) */}
            <div className="moodboard-column" style={{
                width: '65%', height: '100%', position: 'relative', overflow: 'hidden'
            }}>

                {/* Background Slideshow (Faded) */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                    <BackgroundSlideshow currentSlide={currentSlide} slidesData={backgrounds || []} />
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(5,5,5,0.4), rgba(5,5,5,0.9))', zIndex: 1 }}></div>
                </div>

                {/* Product Grid / Moodboard content */}
                <div style={{
                    position: 'relative', zIndex: 5, height: '100%', padding: '60px',
                    display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{ marginBottom: '40px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#c5a059', letterSpacing: '8px', fontWeight: 'bold' }}>SÉLECTION LOOKBOOK</span>
                        <h2 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '200', marginTop: '10px' }}>Inspirations en direct</h2>
                    </div>

                    <div style={{
                        flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '40px', overflowY: 'auto', paddingBottom: '100px', perspective: '1000px'
                    }} className="custom-scroll">
                        {productPropositions.length > 0 ? (
                            productPropositions.map((prop, propIdx) => (
                                <div key={prop.id} className="reveal" style={{ gridColumn: '1/-1', display: 'contents' }}>
                                    {/* Proposition Header / Divider */}
                                    <div className="reveal-delay-1" style={{
                                        gridColumn: '1/-1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        marginTop: propIdx === 0 ? '0' : '60px',
                                        marginBottom: '30px'
                                    }}>
                                        <div style={{
                                            padding: '8px 15px',
                                            background: 'rgba(197, 160, 89, 0.1)',
                                            border: '1px solid rgba(197, 160, 89, 0.2)',
                                            borderRadius: '4px',
                                            color: '#c5a059',
                                            fontSize: '0.65rem',
                                            letterSpacing: '3px',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            SÉLECTION MAISON DE MODE #{productPropositions.length - propIdx}
                                        </div>
                                        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(197, 160, 89, 0.3), transparent)' }}></div>
                                    </div>

                                    <div className="reveal-delay-2" style={{
                                        gridColumn: '1/-1',
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                        gap: '40px'
                                    }}>
                                        {prop.products.map((product, idx) => (
                                            <ProductCard
                                                key={`${prop.id}-${product.id}-${idx}`}
                                                product={product}
                                                onAddReview={() => setReviewProductId(product.id)}
                                                className="reveal"
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.2 }}>
                                <div style={{ textAlign: 'center' }}>
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" style={{ marginBottom: '20px' }}>
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                    <p style={{ letterSpacing: '4px', fontSize: '0.8rem' }}>EN ATTENTE DE SUGGESTIONS</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Promo Floating Badge */}
                <div style={{ position: 'absolute', bottom: '40px', right: '40px', background: '#8b6e37', padding: '15px 25px', borderRadius: '8px', zIndex: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 'bold', letterSpacing: '3px', color: 'rgba(255,255,255,0.7)' }}>SÉLECTION VIP</div>
                    <div style={{ fontSize: '0.9rem', color: 'white', marginTop: '4px' }}>Nouveautés Hiver 2024</div>
                </div>
            </div>

            {/* Review Modal */}
            {reviewProductId && (
                <ReviewModal
                    productId={reviewProductId}
                    onClose={() => setReviewProductId(null)}
                />
            )}
        </div>
    );
};

const ProductCard = ({ product, onAddReview, className }) => {
    const [selectedSize, setSelectedSize] = useState(null);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Veuillez choisir une taille avant de commander.");
            return;
        }

        const matchingVariant = product.variants?.find(v => v.size === selectedSize);

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const newItem = {
            id: Date.now(),
            product_id: product.id,
            variant_id: matchingVariant ? matchingVariant.id : null,
            name: product.name,
            price: matchingVariant ? matchingVariant.price : product.price,
            size: selectedSize,
            image: product.image
        };

        localStorage.setItem('cart', JSON.stringify([...cart, newItem]));
        window.dispatchEvent(new Event('cartUpdated'));
        alert(`${product.name} (Taille ${selectedSize}) ajouté au panier !`);
    };

    return (
        <div className={`product-card-luxury ${className || ''}`} style={{
            background: 'rgba(20, 20, 20, 0.6)', // Fond plus sombre pour contraste
            border: '1px solid rgba(197, 160, 89, 0.15)', // Bordure dorée subtile
            borderRadius: '30px', // ORGANIC SHAPE (Galet)
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
            position: 'relative'
        }}>
            <div className="mood-card-container" style={{
                position: 'relative',
                height: '480px', // Plus haut pour l'élégance
            }}>
                <style>{`
                .product-card-luxury:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(197, 160, 89, 0.15); border-color: rgba(197, 160, 89, 0.4); }
                .mood-card-container:hover .mood-overlay-pro { opacity: 1; transform: translateY(0); }
                .mood-card-container:hover .mood-img-pro { transform: scale(1.08); filter: brightness(0.3); }
                .mood-overlay-pro {
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.7) 100%);
                    display: flex; flex-direction: column;
                    justify-content: center; align-items: center;
                    opacity: 0; transform: translateY(15px);
                    transition: all 0.5s ease; z-index: 10;
                    padding: 40px; text-align: center;
                    backdrop-filter: blur(4px);
                }
            `}</style>

                <img
                    className="mood-img-pro"
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 1.2s ease' }}
                />

                {/* Étiquette "Au repos" minimaliste */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%',
                    padding: '30px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    zIndex: 5,
                    pointerEvents: 'none'
                }}>
                    <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: '400', margin: 0 }}>{product.name}</h3>
                    <div style={{ color: '#c5a059', fontSize: '1.1rem', marginTop: '6px', }}>{product.price} €</div>
                </div>

                {/* Overlay "Aurora" au survol */}
                <div className="mood-overlay-pro">
                    <div style={{ width: '40px', height: '1px', background: '#c5a059', marginBottom: '20px' }}></div>
                    <h3 style={{
                        color: 'white', fontSize: '1.8rem',
                        fontStyle: 'italic', fontWeight: '400',
                        marginBottom: '30px', lineHeight: '1.2'
                    }}>{product.name}</h3>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '35px', flexWrap: 'wrap' }}>
                        {(product.variants || []).map(v => (
                            <span
                                key={v.id}
                                onClick={(e) => { e.stopPropagation(); setSelectedSize(v.size); }}
                                style={{
                                    cursor: 'pointer',
                                    padding: '8px 14px',
                                    border: selectedSize === v.size ? '1px solid #c5a059' : '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '50px', // Rond
                                    background: selectedSize === v.size ? '#c5a059' : 'rgba(255,255,255,0.05)',
                                    color: selectedSize === v.size ? '#000' : '#fff',
                                    fontSize: '0.8rem',
                                    fontWeight: selectedSize === v.size ? 'bold' : 'normal',
                                    transition: '0.3s'
                                }}>
                                {v.size}
                            </span>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                        <button
                            onClick={handleAddToCart}
                            style={{
                                background: '#c5a059', color: '#000', border: 'none',
                                padding: '16px 0', borderRadius: '50px', fontSize: '0.9rem',
                                fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer', transition: 'transform 0.2s',
                                boxShadow: '0 10px 20px rgba(197, 160, 89, 0.3)'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            AJOUTER AU PANIER
                        </button>

                        <button
                            onClick={onAddReview}
                            style={{
                                background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
                                padding: '12px 0', borderRadius: '50px', fontSize: '0.75rem',
                                fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer', transition: '0.3s'
                            }}
                            onMouseEnter={(e) => { e.target.style.borderColor = '#fff'; e.target.style.background = 'rgba(255,255,255,0.1)' }}
                            onMouseLeave={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.3)'; e.target.style.background = 'transparent' }}
                        >
                            VOIR LES AVIS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReviewModal = ({ productId, onClose }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetch(`${CONFIG.API_BASE_URL}/api/products/${productId}/reviews`)
            .then(res => res.json())
            .then(setReviews);
    }, [productId]);

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) return alert("Connectez-vous pour laisser un avis");

        setSubmitting(true);
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating, comment })
            });
            if (res.ok) {
                setComment("");
                // Refresh reviews
                const newRes = await fetch(`${CONFIG.API_BASE_URL}/api/products/${productId}/reviews`);
                setReviews(await newRes.json());
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(20px)' }}>
            <div className="signup-luxury-box" style={{ width: '600px', maxWidth: '95%', padding: '40px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#c5a059', fontSize: '1.55rem', cursor: 'pointer' }}>✕</button>

                <h3 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '30px' }}>AVIS CLIENTS</h3>

                <div className="custom-scroll" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '40px', paddingRight: '10px' }}>
                    {reviews.length === 0 ? <p style={{ opacity: 0.4 }}>Aucun avis pour le moment.</p> : (
                        reviews.map(r => (
                            <div key={r.id} style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ color: '#c5a059', fontWeight: 'bold', fontSize: '0.8rem' }}>{r.customer_name}</span>
                                    <span style={{ color: '#c5a059' }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{r.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
                    <h4 style={{ fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '20px', opacity: 0.6 }}>LAISSER UN COMMENTAIRE</h4>
                    <div style={{ marginBottom: '15px' }}>
                        {[1, 2, 3, 4, 5].map(n => (
                            <button key={n} onClick={() => setRating(n)} style={{ background: 'none', border: 'none', color: n <= rating ? '#c5a059' : '#333', fontSize: '1.5rem', cursor: 'pointer' }}>★</button>
                        ))}
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Votre expérience avec cette pièce..."
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '15px', color: 'white', outline: 'none', height: '100px', marginBottom: '20px' }}
                    />
                    <button onClick={handleSubmit} disabled={submitting} className="login-btn-luxury">
                        {submitting ? "ENVOI EN COURS..." : "PUBLIER L'AVIS"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;