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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const handleMobileLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Function to handle starting the pre-consulta directly
  const handleStartPreConsulta = () => {
    // Pass dummy data for now. We need to decide how to handle real user data later.
    const dummyUserData: UserData = { nombre: '', email: '', telefono: '' };
    onStartConsultation(dummyUserData);
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
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

    </header>
  );
};

export default Header; 