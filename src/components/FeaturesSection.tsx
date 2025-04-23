import React from 'react';

// Define an interface for Feature props if needed later
interface FeatureItemProps {
  title: string;
  description: string;
  // icon?: string; // Optional: Add icon later
}

const FeatureItem: React.FC<FeatureItemProps> = ({ title, description }) => (
  <div className="feature-item">
    {/* Icon would go here */}
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => {
  // Placeholder features
  const features = [
    {
      title: "Análisis Inteligente de Documentos",
      description: "Extrae información clave, identifica cláusulas y resume textos legales complejos en segundos."
    },
    {
      title: "Búsqueda Jurídica Avanzada",
      description: "Accede a jurisprudencia, leyes y regulaciones relevantes con precisión y rapidez impulsadas por IA."
    },
    {
      title: "Gestión de Casos Optimizada",
      description: "Organiza expedientes, monitorea plazos y colabora eficientemente en tu equipo."
    },
    {
      title: "Predicción y Soporte",
      description: "Obtén insights basados en datos para evaluar posibles resultados y fortalecer tus estrategias."
    },
    {
      title: "Seguridad y Cumplimiento Normativo",
      description: "Garantizamos la máxima protección de tus datos y el cumplimiento de las normativas de privacidad mexicanas."
    },
    {
      title: "Colaboración y Reportes",
      description: "Facilita el trabajo en equipo dentro del despacho y genera reportes personalizados sobre el rendimiento y casos."
    }
  ];

  return (
    <section id="features" className="features">
      <h2>Características Principales</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureItem key={index} title={feature.title} description={feature.description} />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection; 