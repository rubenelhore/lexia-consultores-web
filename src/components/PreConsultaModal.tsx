import React, { useState } from 'react';
import '../styles/PreConsultaModal.css'; // We'll create this CSS file next

interface UserData {
  nombre: string;
  email: string;
  telefono: string;
}

interface PreConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (userData: UserData) => void;
}

const PreConsultaModal: React.FC<PreConsultaModalProps> = ({ isOpen, onClose, onProceed }) => {
  // State for form fields
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const userData: UserData = { nombre, email, telefono };
    console.log('User Data:', userData); // Log data for now
    // TODO: Add actual data saving logic (e.g., API call)
    onProceed(userData); // Call the new prop function with user data
    onClose(); // UNCOMMENT THIS LINE - Close the modal after proceeding
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>Identificación Personal</h2>
        <p>Por favor, ingresa tus datos para continuar.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Número de Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="cta-button">Continuar</button>
        </form>
      </div>
    </div>
  );
};

export default PreConsultaModal; 