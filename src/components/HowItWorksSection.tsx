import React from 'react';

const HowItWorksSection: React.FC = () => {
  // Placeholder steps
  const steps = [
    {
      step: 1,
      title: "Registro e Integración",
      description: "Crea tu cuenta y conecta tus fuentes de datos o sube documentos de forma segura."
    },
    {
      step: 2,
      title: "Procesamiento con IA",
      description: "Nuestra IA analiza la información, busca patrones y aplica modelos legales entrenados para México."
    },
    {
      step: 3,
      title: "Resultados y Acciones",
      description: "Recibe análisis claros, resúmenes, alertas y predicciones directamente en tu panel de control."
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <h2>¿Cómo Funciona?</h2>
      <div className="steps-container">
        {steps.map((item) => (
          <div key={item.step} className="step-item">
            <div className="step-number">{item.step}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection; 