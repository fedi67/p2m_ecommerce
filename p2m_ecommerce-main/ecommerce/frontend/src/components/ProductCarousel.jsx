import React, { useState, useEffect } from 'react';
import CONFIG from '../config';

const ProductCarousel = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    // Initial load
    useEffect(() => {
        const loadCart = () => {
            const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartItems(savedCart);
        };

        loadCart();

        // Listen for additions from ChatInterface
        window.addEventListener('cartUpdated', loadCart);
        return () => window.removeEventListener('cartUpdated', loadCart);
    }, []);

    const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);
    const total = subtotal;

    const removeItem = (id) => {
        const updated = cartItems.filter(item => item.id !== id);
        setCartItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Veuillez vous connecter pour finaliser votre commande.");
            return;
        }

        setSubmitting(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    variant_id: item.variant_id || 1,
                    quantity: 1,
                    price: item.price
                })),
                total_price: total
            };

            const response = await fetch(`${CONFIG.API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                alert("Commande validée avec succès ! ✨");
                setCartItems([]);
                localStorage.removeItem('cart');
                onClose();
            } else {
                const data = await response.json();
                alert(`Erreur : ${data.detail || "Impossible de valider la commande"}`);
            }
        } catch (error) {
            alert("Serveur indisponible.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>

                {/* Header du Panier */}
                <div className="drawer-header">
                    <h2 style={{ color: 'white', margin: 0 }}>Votre Panier</h2>
                    <button className="drawer-close-btn" onClick={onClose}>✕</button>
                </div>

                {/* Liste des articles */}
                <div className="cart-items-list">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart-msg">Votre panier est vide.</div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="cart-item-row" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'none' }}>
                                <div className="cart-item-img">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <span className="item-meta">Taille : {item.size}</span>
                                    <span className="item-price">{item.price} €</span>
                                </div>
                                <button className="cart-remove-btn" onClick={() => removeItem(item.id)}>✕</button>
                            </div>
                        ))
                    )}
                </div>

                {/* Résumé et Checkout */}
                <div className="cart-summary-panel">
                    <div className="summary-row">
                        <span>Nombre d'articles</span>
                        <span>{cartItems.length}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>{total.toFixed(2)} €</span>
                    </div>

                    <button
                        className={`btn-big btn-filled checkout-btn ${submitting ? 'loading' : ''}`}
                        onClick={handleCheckout}
                        disabled={submitting || cartItems.length === 0}
                    >
                        {submitting ? "Traitement..." : "Finaliser ma Commande"}
                    </button>
                    <p className="secure-note">🔒 Paiement Sécurisé SSL</p>
                </div>

            </div>
        </div>
    );
};

export default ProductCarousel;