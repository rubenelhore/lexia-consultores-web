import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Save form data to Firestore collection 'contactMessages'
      console.log("Datos a guardar en Firestore:", formData);
      await addDoc(collection(db, 'contactMessages'), formData);
      alert('Gracias por tu mensaje. Nos pondremos en contacto pronto.');
      // Reset form
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      console.error("Firestore write failed:", error.code, error.message);
      alert('Hubo un error al enviar tu mensaje. Revisa la consola.');
    }
  };

  return (
    <section id="contact" className="contact">
      <h2>Contacto</h2>
      <p>¿Interesado en una demo o tienes preguntas? Completa el formulario.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <div className="input-wrapper">
            <i className="form-icon fa-solid fa-user"></i>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <div className="input-wrapper">
            <i className="form-icon fa-regular fa-envelope"></i>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="message">Mensaje:</label>
          <div className="input-wrapper">
            <i className="form-icon fa-solid fa-comment-dots"></i>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>
        <button type="submit">Enviar Mensaje</button>
      </form>
    </section>
  );
};

export default ContactSection; 