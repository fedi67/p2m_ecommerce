import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

// --- IMPORTS DES COMPOSANTS ---
import Login from './components/Login';
import Signup from './components/Signup';
import ContactModal from './components/ContactModal';
import LandingPage from './components/LandingPage';
import BackgroundSlideshow from './components/BackgroundSlideshow';
import ProductCarousel from './components/ProductCarousel';
import ChatInterface from './components/ChatInterface';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import CustomCursor from './components/CustomCursor';
import CONFIG from './config';

/* --- TOUTES LES IMAGES RÉUNIES --- */
const allCollections = [
  { id: 101, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1400", title: "Collection Hiver", subtitle: "Chaleur & Élégance" },
  { id: 103, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400", title: "Éclat Hivernal", subtitle: "Prêt-à-porter féminin" },
  { id: 107, image: "https://images.unsplash.com/photo-1511406361295-0a5ff814c0ad?w=1400", title: "Urban Winter", subtitle: "Streetwear de saison" },
  { id: 201, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1400", title: "Collection Été", subtitle: "Légèreté & Lin" },
  { id: 202, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1400", title: "Summer Business", subtitle: "Rester frais en costume" },
  { id: 301, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400", title: "Saisons Douces", subtitle: "Le style de transition" }
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

/* --- INTERFACE SHOP --- */
function ShopInterface({ onCartToggle, onLoginToggle, onSignupToggle, onContactToggle }) {
  const navigate = useNavigate();
  const [slidesData] = useState(() => shuffleArray(allCollections));
  const [inputValue, setInputValue] = useState("");
  const userName = localStorage.getItem('userName');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: `Bonjour ${userName || ''} ! Je suis votre styliste personnel. Comment puis-je vous aider ?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      onLoginToggle();
    }
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, navigate, onLoginToggle]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMsgText = inputValue;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsgText }]);
    setInputValue("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Préparation de l'historique (10 derniers messages)
      const history = messages.slice(-10).map(msg => ({
        role: msg.sender === 'ai' ? 'assistant' : 'user',
        content: msg.text
      }));

      const response = await fetch(`${CONFIG.API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ message: userMsgText, history: history })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // Découpage et affichage progressif ("Chat Bubbling")
      const parts = data.reply.split('\n').filter(p => p.trim());

      setIsTyping(false);

      parts.forEach((part, index) => {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + index,
            sender: 'ai',
            text: part,
            products: index === parts.length - 1 ? data.products : []
          }]);
        }, index * 850); // Délai de lecture naturel
      });

    } catch (error) {
      console.log("Fallback activated due to error:", error);
      // FALLBACK "JUSTE POUR AUJOURD'HUI"
      const fallbackProducts = [
        { id: 901, name: "Manteau Hiver", price: 250, image: allCollections[0].image, variants: [{ id: 1, size: 'M', price: 250 }, { id: 2, size: 'L', price: 250 }] },
        { id: 902, name: "Robe de Soirée", price: 180, image: allCollections[1].image, variants: [{ id: 3, size: 'S', price: 180 }, { id: 4, size: 'M', price: 180 }] },
        { id: 903, name: "Veste Urbaine", price: 120, image: allCollections[2].image, variants: [{ id: 5, size: 'L', price: 120 }] },
        { id: 904, name: "Tenue d'Été", price: 95, image: allCollections[3].image, variants: [{ id: 6, size: 'M', price: 95 }] }
      ];

      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'ai',
        text: "Je rencontre une légère surcharge momentanée, mais voici une sélection exclusive rien que pour vous.",
        products: fallbackProducts
      }]);
      setIsTyping(false);
    }
  };

  return (
    <ChatInterface
      messages={messages}
      inputValue={inputValue}
      setInputValue={setInputValue}
      onSend={handleSend}
      onViewProfile={() => navigate('/profile')}
      chatEndRef={chatEndRef}
      isTyping={isTyping}
      onSignupClick={onSignupToggle}
      onContactClick={onContactToggle}
      backgrounds={slidesData}
    />
  );
}

/* --- WRAPPER POUR LE CAROUSEL (Gère la navigation) --- */
function CollectionPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.reload();
  };

  return (
    <ProductCarousel
      onBack={() => navigate('/')}
      onLogout={handleLogout}
    />
  );
}

/* --- WRAPPER POUR LE PROFIL --- */
function ProfilePage({ onCartToggle, onLoginToggle, onSignupToggle, onContactToggle }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <UserProfile
      onStartChat={() => navigate('/shop')}
      onLogout={handleLogout}
      onClose={() => navigate(-1)}
      onCartToggle={onCartToggle}
      onLoginClick={onLoginToggle}
      onSignupClick={onSignupToggle}
      onAdminClick={() => navigate('/admin')}
      onContact={onContactToggle}
    />
  );
}

/* --- ROUTEUR PRINCIPAL --- */
function App() {
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const callback = () => {
      document.querySelectorAll('.reveal:not(.active)').forEach(el => observer.observe(el));
    };

    const mutationObserver = new MutationObserver(callback);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    callback();

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <Router>
      <CustomCursor />
      <MainContent
        showCart={showCart} setShowCart={setShowCart}
        showLogin={showLogin} setShowLogin={setShowLogin}
        showSignup={showSignup} setShowSignup={setShowSignup}
      />
    </Router>
  );
}

function MainContent({ showCart, setShowCart, showLogin, setShowLogin, showSignup, setShowSignup }) {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [showContact, setShowContact] = useState(false);

  // Redirect admin if they try to access client pages
  useEffect(() => {
    if (isAdmin && window.location.pathname !== '/admin') {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('isAdmin');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage
          onCartToggle={() => setShowCart(true)}
          onLoginToggle={() => setShowLogin(true)}
          onSignupToggle={() => setShowSignup(true)}
          onContactToggle={() => setShowContact(true)}
        />} />
        <Route path="/shop" element={<ShopInterface
          onCartToggle={() => setShowCart(true)}
          onLoginToggle={() => setShowLogin(true)}
          onSignupToggle={() => setShowSignup(true)}
          onContactToggle={() => setShowContact(true)}
        />} />
        <Route path="/profile" element={<ProfilePage
          onCartToggle={() => setShowCart(true)}
          onLoginToggle={() => setShowLogin(true)}
          onSignupToggle={() => setShowSignup(true)}
          onContactToggle={() => setShowContact(true)}
        />} />
        <Route path="/admin" element={<AdminDashboard onLogout={handleLogout} />} />
        <Route path="/login" element={<Login onClose={() => setShowLogin(false)} />} />
      </Routes>

      {/* MODALS GLOBALES */}
      <ProductCarousel
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />

      {showLogin && <Login
        onClose={() => setShowLogin(false)}
        onSwitchSignup={() => { setShowLogin(false); setShowSignup(true); }}
      />}

      {showSignup && <Signup
        onClose={() => setShowSignup(false)}
        onSwitchLogin={() => { setShowSignup(false); setShowLogin(true); }}
      />}

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  );
}

export default App;