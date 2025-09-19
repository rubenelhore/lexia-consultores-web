import React, { useState } from 'react';
import logo from '../Logo.png'; // Revert path

// Define UserData interface here or import if defined elsewhere
interface UserData {
  nombre: string;
  email: string;
  telefono: string;
}

// Define props for Header
interface HeaderProps {
  onStartConsultation: (userData: UserData) => void;
  onGoToLanding: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStartConsultation, onGoToLanding }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const [showModal, setShowModal] = useState(false); // State for user data modal
  const [userData, setUserData] = useState<UserData>({
    nombre: '',
    email: '',
    telefono: ''
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const handleMobileLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Function to handle starting the pre-consulta - opens modal
  const handleStartPreConsulta = () => {
    setShowModal(true);
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Handle form submission from modal
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!userData.nombre.trim() || !userData.email.trim()) {
      alert('Por favor complete su nombre y email');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      alert('Por favor ingrese un email válido');
      return;
    }

    console.log('Header: Starting consultation with user data:', userData);
    onStartConsultation(userData);
    setShowModal(false);
    // Reset form
    setUserData({ nombre: '', email: '', telefono: '' });
  };

  // Handle input changes in modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Function to handle logo click (calls the prop)
  const handleLogoClick = () => {
    onGoToLanding();
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header>
      {/* Wrap logo in a clickable element */}
      <div 
        className="logo-container" 
        onClick={handleLogoClick} 
        style={{ cursor: 'pointer' }}
        role="button"
        aria-label="Ir a inicio"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLogoClick(); }}
      >
        <img src={logo} alt="LexIA Consultores Logo" className="header-logo" />
      </div>

      {/* --- Desktop Navigation --- */}
      <nav className="desktop-nav"> {/* Add class for desktop nav */}
        <ul>
          <li><a href="#features">Características</a></li>
          <li><a href="#how-it-works">¿Cómo Funciona?</a></li>
          <li><a href="#contact">Contacto</a></li>
          <li><a href="https://lexiaconsultores.substack.com" target="_blank" rel="noopener noreferrer">Blog</a></li>
        </ul>
        <a href="#contact" className="cta-button">Solicita Consulta</a>
        <button className="cta-button pre-consulta-button" onClick={handleStartPreConsulta}>Iniciar chatbot</button>
      </nav>

      {/* --- Mobile Menu Button (Burger) --- */}
      <button className="mobile-menu-button" onClick={toggleMobileMenu} aria-label="Toggle menu">
        {/* Use Font Awesome icons - ensure Font Awesome is linked in index.html */}
        <i className={isMobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </button>

      {/* --- Mobile Navigation --- */}
      {/* Use conditional class for display based on state */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}> 
        <ul>
          {/* Use onClick handler for mobile links */}
          <li><a href="#features" onClick={handleMobileLinkClick}>Características</a></li>
          <li><a href="#how-it-works" onClick={handleMobileLinkClick}>¿Cómo Funciona?</a></li>
          <li><a href="#contact" onClick={handleMobileLinkClick}>Contacto</a></li>
          <li><a href="https://lexiaconsultores.substack.com" target="_blank" rel="noopener noreferrer" onClick={handleMobileLinkClick}>Blog</a></li>
        </ul>
        {/* Include CTA in mobile menu too */}
        <a href="#contact" className="cta-button" onClick={handleMobileLinkClick}>Solicita Consulta</a>
        <button className="cta-button pre-consulta-button" onClick={handleStartPreConsulta}>Iniciar chatbot</button>
      </nav>

      {/* Modal for user data */}
      {showModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowModal(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Iniciar Consulta con Chatbot</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Cerrar modal"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={userData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ingrese su nombre completo"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  placeholder="su@email.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Teléfono (opcional)</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={userData.telefono}
                  onChange={handleInputChange}
                  placeholder="555-123-4567"
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Iniciar Consulta
                </button>
              </div>
            </form>
          </div>
        </>
      )}

    </header>
  );
};

export default Header; 