import React from 'react';

const HeroSection: React.FC = () => {
  // Smooth scroll to contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h2>Consultoría Certificada en Mecanismos Alternativos de Controversias</h2>
        <p>Ofrecemos facilitación, mediación y conciliación validadas por la Ley General de Mecanismos Alternativos de Solución de Controversias de México.</p>
        <button type="button" onClick={scrollToContact}>Solicita una Consulta</button>
      </div>
      <div className="hero-image">
        {/* Image will go here */}
      </div>
    </section>
  );
};

export default HeroSection; 