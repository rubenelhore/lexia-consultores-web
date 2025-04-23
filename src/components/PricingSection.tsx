import React from 'react';

interface PricingPlanProps {
  title: string;
  price: string;
  frequency: string;
  features: string[];
  discountInfo?: string;
  isFeatured?: boolean; // To highlight a specific plan
}

const PricingPlan: React.FC<PricingPlanProps> = (
  { title, price, frequency, features, discountInfo, isFeatured }
) => (
  <div className={`pricing-plan ${isFeatured ? 'featured' : ''}`}>
    <h3>{title}</h3>
    <div className="price-tag">
      <span className="price">{price}</span>
      <span className="frequency">{frequency}</span>
    </div>
    <ul>
      {features.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
    {discountInfo && <p className="discount-info">{discountInfo}</p>}
    <button>Seleccionar Plan</button> { /* Link or action here */}
  </div>
);

const PricingSection: React.FC = () => {
  const plans = [
    {
      title: "Consultoría Especializada",
      price: "$1,000 USD",
      frequency: "/ Sesión de 3 horas",
      features: [
        "Análisis profundo por expertos",
        "Estrategias legales personalizadas",
        "Resolución de dudas complejas",
      ],
      discountInfo: "Pack 3 sesiones: $2,500 USD",
      isFeatured: false,
    },
    {
      title: "IA para Abogados",
      price: "$40 USD",
      frequency: "/ Mes",
      features: [
        "Asistente IA individual",
        "Análisis de documentos",
        "Búsqueda jurídica avanzada",
        "Gestión básica de casos",
      ],
      discountInfo: "Pago anual: $30 USD / Mes",
      isFeatured: true, // Highlight this plan
    },
    {
      title: "IA para Equipos",
      price: "$40 USD",
      frequency: "/ Mes por usuario",
      features: [
        "Todo en IA para Abogados",
        "Herramientas colaborativas",
        "Gestión de equipo",
        "Reportes avanzados",
        "Mínimo 5 cuentas",
      ],
      discountInfo: "Pago anual: $30 USD / Mes por usuario",
      isFeatured: false,
    },
  ];

  return (
    <section id="pricing" className="pricing">
      <h2>Planes de Precios</h2>
      <div className="pricing-container">
        {plans.map((plan, index) => (
          <PricingPlan key={index} {...plan} />
        ))}
      </div>
    </section>
  );
};

export default PricingSection; 