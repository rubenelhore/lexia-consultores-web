import React, { useState } from 'react';
import '../styles/PreConsultaModal.css'; // We'll create this CSS file next
import { db } from '../firebaseConfig'; // Import Firestore instance
import { collection, addDoc, Timestamp } from 'firebase/firestore'; // Import Firestore functions

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const userData: UserData = { nombre, email, telefono };
    console.log('User Data:', userData);

    try {
      // Save to Firestore
      const docRef = await addDoc(collection(db, "preConsultas"), {
        ...userData, // Spread user data
        submittedAt: Timestamp.now() // Add timestamp
      });
      console.log("Pre-consulta data saved with ID: ", docRef.id);
    } catch (error) {
      console.error("Error saving pre-consulta data: ", error);
      // Optional: Notify user of the error, but proceed anyway
    } finally {
       // Proceed regardless of Firestore save status to not block UX
      onProceed(userData);
      onClose();
    }
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