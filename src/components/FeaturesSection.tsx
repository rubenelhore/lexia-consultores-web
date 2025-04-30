import React from 'react';

// Define an interface for Feature props
interface FeatureItemProps {
  title: string;
  description: string;
  icon: string; // Add icon prop (Font Awesome class string)
}

const FeatureItem: React.FC<FeatureItemProps> = ({ title, description, icon }) => (
  <div className="feature-item">
    <i className={`feature-icon ${icon}`}></i> {/* Render icon */} 
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => {
  // Placeholder features with icons
  const features = [
    {
      title: "Documentación y Convenios Efectivos",
      description: "Diseñamos y validamos convenios con calidad de cosa juzgada bajo la nueva ley MASC.",
      icon: "fa-solid fa-magnifying-glass-chart" // Example icon
    },
    {
      title: "Asesoría y Mediación Especializada",
      description: "Facilitamos mediaciones y conciliaciones, optimizando acuerdos con respaldo legal y certificación.",
      icon: "fa-solid fa-scale-balanced"
    },
    {
      title: "Gestión de Sesiones y Seguimiento",
      description: "Coordinamos sesiones presenciales o virtuales y hacemos seguimiento minucioso de convenios.",
      icon: "fa-solid fa-folder-open"
    },
    {
      title: "Consultoría Itinerante",
      description: "Atención personalizada en tus instalaciones o en salas de coworking, garantizando flexibilidad.",
      icon: "fa-solid fa-lightbulb"
    },
    {
      title: "Cumplimiento y Credibilidad Jurídica",
      description: "Certificados como facilitadores, garantizamos acuerdos legales y salvaguarda de datos.",
      icon: "fa-solid fa-shield-halved"
    },
    {
      title: "Informes y Documentación Digital",
      description: "Entregamos reportes detallados y convenios digitales listos para firma electrónica avanzada.",
      icon: "fa-solid fa-users"
    },
    {
      title: "Capacitación en MASC",
      description: "Impartimos cursos y talleres sobre mediación y conciliación para tu equipo.",
      icon: "fa-solid fa-graduation-cap"
    },
    {
      title: "Soporte Post-Acuerdo",
      description: "Brindamos asesoría continua para asegurar cumplimiento y resolver dudas.",
      icon: "fa-solid fa-headset"
    }
  ];

  return (
    <section id="features" className="features">
      <h2>Características Principales</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureItem key={index} title={feature.title} description={feature.description} icon={feature.icon} />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection; 