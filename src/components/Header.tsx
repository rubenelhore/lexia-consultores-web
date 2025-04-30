import React from 'react';
import logo from '../Logo.png'; // Corrected case for logo import

const Header: React.FC = () => {
  return (
    <header>
      <img src={logo} alt="LexIA Consultores Logo" className="header-logo" />
      <nav>
        <ul>
          <li><a href="#features">Características</a></li>
          <li><a href="#how-it-works">¿Cómo Funciona?</a></li>
          <li><a href="#contact">Contacto</a></li>
        </ul>
      </nav>
      <a href="#contact" className="cta-button">Solicita Consulta</a>
    </header>
  );
};

export default Header; 