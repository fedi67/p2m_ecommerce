import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CONFIG from '../config';

function Login({ onClose, onSwitchSignup }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

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
    setError('');

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userName', data.user_name);
        localStorage.setItem('isAdmin', data.is_admin);

        onClose();

        if (data.is_admin) {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      } else {
        setError(data.detail || 'Identifiants invalides.');
      }
    } catch (err) {
      setError('Serveur indisponible');
    }
  };

  return (
    <div className="auth-modal-root" onClick={onClose}>
      <div className="auth-overlay"></div>

      <div className="login-luxury-box" onClick={(e) => e.stopPropagation()}>
        <button className="premium-close-btn" onClick={onClose}>✕</button>

        <div className="auth-header-pro">
          <span className="gold-accent-text" style={{ letterSpacing: '6px' }}>ESPACE PRIVÉ</span>
          <h2 className="luxury-title-auth">CONNEXION</h2>
          <p className="auth-subtitle-pro">Accédez à votre expérience SmartShop personnalisée.</p>
        </div>

        {error && <div className="auth-error-luxury">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form-pro">
          <div className="input-field-luxury">
            <label>ADRESSE E-MAIL</label>
            <input
              type="email"
              name="email"
              placeholder="votre@email.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-field-luxury">
            <label>MOT DE PASSE</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn-luxury">
            S'IDENTIFIER
          </button>
        </form>

        <p className="auth-footer-pro">
          <span>Pas encore membre ?</span>
          <button onClick={onSwitchSignup} className="gold-link-pro" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>CRÉER UN COMPTE</button>
        </p>
      </div>
    </div>
  );
}

export default Login;
