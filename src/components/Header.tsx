import React from 'react';
import logo from '../logo.png'; // Import the logo assuming it's in src/

const Header: React.FC = () => {
  return (
    <header>
      <img src={logo} alt="LexIA Consultores Logo" className="header-logo" />
      <nav>
        <ul>
          <li><a href="#features">Características</a></li>
          <li><a href="#how-it-works">¿Cómo Funciona?</a></li>
          <li><a href="#pricing">Precios</a></li>
          <li><a href="#contact">Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header; 