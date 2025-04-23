import React from 'react';

const Header: React.FC = () => {
  return (
    <header>
      {/* Header content will go here */}
      <h1>LexIA Consultores</h1> {/* Or your chosen name */}
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