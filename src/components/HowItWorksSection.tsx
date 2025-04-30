import React from 'react';

interface StepItemProps {
  title: string;
  description: string;
  icon: string;
}

const StepItem: React.FC<StepItemProps> = ({ title, description, icon }) => (
  <div className="step-item">
    <div className="step-icon-container">
       <i className={`step-icon ${icon}`}></i>
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: "fa-solid fa-user-plus",
      title: "1. Espacio Profesional Híbrido",
      description: "Elige tu plan de coworking con salas de juntas y hot-desk para recibir clientes con credibilidad."
    },
    {
      icon: "fa-solid fa-gears",
      title: "2. Consultoría Itinerante",
      description: "Atendemos controversias en tus oficinas o domicilio, con firma electrónica avanzada para convenios."
    },
    {
      icon: "fa-solid fa-chart-line",
      title: "3. Validación y Seguimiento",
      description: "Emitimos y damos seguimiento a convenios con calidad de cosa juzgada y reportes detallados."
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <h2>¿Cómo Funciona?</h2>
      <div className="steps-container">
        {steps.map((item, index) => (
          <StepItem key={index} title={item.title} description={item.description} icon={item.icon} />
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection; 