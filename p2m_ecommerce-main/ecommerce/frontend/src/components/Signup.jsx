import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CONFIG from '../config';

function Signup({ onClose, onSwitchLogin }) {
  const [formData, setFormData] = useState({
    first_name: '',
    email: '',
    password: '',
    gender: '',
    country: '',
    age: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setMessage('');

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Adhésion confirmée. Bienvenue au Studio.');
        setTimeout(() => onSwitchLogin(), 2000);
      } else {
        setIsError(true);
        setMessage(data.detail || 'Une erreur est survenue.');
      }
    } catch (error) {
      setIsError(true);
      setMessage('Serveur indisponible.');
    }
  };

  return (
    <div className="auth-modal-root" onClick={onClose}>
      <div className="auth-overlay"></div>

      <div className="signup-luxury-box" onClick={(e) => e.stopPropagation()}>
        <button className="premium-close-btn" onClick={onClose}>✕</button>

        <div className="auth-header-pro">
          <span className="gold-accent-text" style={{ letterSpacing: '6px' }}>REJOINDRE LA MAISON</span>
          <h2 className="luxury-title-auth">ADHÉSION</h2>
          <p className="auth-subtitle-pro">Créez votre profil pour une élégance sans limites.</p>
        </div>

        {message && (
          <div className={isError ? "auth-error-luxury" : "auth-message-luxury"}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form-grid">
          <div className="input-field-luxury">
            <label>NOM COMPLET</label>
            <input type="text" name="first_name" placeholder="Prénom & Nom" onChange={handleChange} required />
          </div>

          <div className="input-field-luxury">
            <label>ADRESSE E-MAIL</label>
            <input type="email" name="email" placeholder="votre@email.com" onChange={handleChange} required />
          </div>

          <div className="input-field-luxury">
            <label>SEXE</label>
            <select name="gender" onChange={handleChange} required className="luxury-select">
              <option value="">Sélectionner</option>
              <option value="F">Femme</option>
              <option value="H">Homme</option>
              <option value="O">Autre</option>
            </select>
          </div>

          <div className="input-field-luxury">
            <label>ÂGE</label>
            <input type="number" name="age" placeholder="ans" onChange={handleChange} required />
          </div>

          <div className="input-field-luxury full-width">
            <label>PAYS</label>
            <input type="text" name="country" placeholder="Ex: Tunisie, France..." onChange={handleChange} required />
          </div>

          <div className="input-field-luxury full-width">
            <label>MOT DE PASSE</label>
            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
          </div>

          <button type="submit" className="login-btn-luxury full-width">
            CONFIRMER L'ADHÉSION
          </button>
        </form>

        <div className="auth-footer-pro">
          <span>Déjà membre ?</span>
          <button onClick={onSwitchLogin} className="gold-link-pro" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>SE CONNECTER</button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
