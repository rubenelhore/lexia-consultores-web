import React, { useState } from 'react';
import logo from '../Logo.png'; // Revert path
import PreConsultaModal from './PreConsultaModal'; // Import the modal component

// Define UserData interface here or import if defined elsewhere
interface UserData {
  nombre: string;
  email: string;
  telefono: string;
}

// Define props for Header
interface HeaderProps {
  onStartConsultation: (userData: UserData) => void;
}

const Header: React.FC<HeaderProps> = ({ onStartConsultation }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const [isPreConsultaModalOpen, setIsPreConsultaModalOpen] = useState(false); // State for modal

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const handleMobileLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Functions to control the modal
  const openPreConsultaModal = () => {
    setIsPreConsultaModalOpen(true);
    // Close mobile menu if open when opening the modal
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const closePreConsultaModal = () => {
    setIsPreConsultaModalOpen(false);
  };

  return (
    <header>
      <img src={logo} alt="LexIA Consultores Logo" className="header-logo" />

      {/* --- Desktop Navigation --- */}
      <nav className="desktop-nav"> {/* Add class for desktop nav */}
        <ul>
          <li><a href="#features">Características</a></li>
          <li><a href="#how-it-works">¿Cómo Funciona?</a></li>
          <li><a href="#contact">Contacto</a></li>
        </ul>
        <a href="#contact" className="cta-button">Solicita Consulta</a>
        <button className="cta-button pre-consulta-button" onClick={openPreConsultaModal}>Realizar Pre-Consulta</button>
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
        </ul>
        {/* Include CTA in mobile menu too */}
        <a href="#contact" className="cta-button" onClick={handleMobileLinkClick}>Solicita Consulta</a>
        <button className="cta-button pre-consulta-button" onClick={openPreConsultaModal}>Realizar Pre-Consulta</button>
      </nav>

      {/* Render the modal conditionally */}
      <PreConsultaModal
        isOpen={isPreConsultaModalOpen}
        onClose={closePreConsultaModal}
        onProceed={onStartConsultation}
      />

    </header>
  );
};

export default Header; 