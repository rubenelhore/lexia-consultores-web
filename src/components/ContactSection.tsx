import React, { useState } from 'react';
import { db } from '../firebaseConfig';
// import { collection, addDoc } from 'firebase/firestore';

console.error("***** ContactSection.tsx SCRIPT CARGADO *****");

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.error(">>> handleSubmit v8 INICIADO <<<");

    db.collection('contactMessages').add(formData)
      .then((docRef) => {
          console.error(">>> DENTRO DE .then() v8 (ÉXITO) <<<", docRef);
          alert('Gracias por tu mensaje. Nos pondremos en contacto pronto.');
          setFormData({ name: '', email: '', message: '' });
          console.error(">>> handleSubmit v8 FINALIZADO (ÉXITO - then) <<<");
      })
      .catch((error: any) => {
          console.error(">>> ¡¡¡DENTRO DE .catch() v8!!! <<<");
          console.error("Error detallado v8:");
          console.error("Código:", error?.code || 'No disponible');
          console.error("Mensaje:", error?.message || 'No disponible');
          console.error("Objeto error v8:", error);
          alert('Hubo un error v8. Revisa consola.');
          console.error(">>> handleSubmit v8 FINALIZADO (ERROR - catch) <<<");
      });

    console.error(">>> Después de llamar a db.collection.add() v8 <<<");
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