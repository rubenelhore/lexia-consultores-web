import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const docRef = await addDoc(collection(db, "contactMessages"), {
        name: name,
        email: email,
        phone: phone,
        message: message,
        submittedAt: Timestamp.now() // Add a timestamp
      });
      console.log("Document written with ID: ", docRef.id);
      setSubmitStatus('success');
      // Clear form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error("Error adding document: ", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-3 p-4 p-md-5">
              <h2 className="text-center mb-3">Ponte en Contacto</h2>
              <p className="text-center text-muted mb-4">Nos encantaría saber de ti. Completa el formulario y te responderemos lo antes posible.</p>

              {/* Submission Status Messages */}
              {submitStatus === 'success' && (
                <div className="alert alert-success" role="alert">
                  ¡Mensaje enviado con éxito! Gracias por contactarnos.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="alert alert-danger" role="alert">
                  Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.
                </div>
              )}

              {/* Connect form onSubmit to handleSubmit */}
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label htmlFor="contactName" className="form-label small fw-light">Nombre Completo</label>
                    {/* Connect input to state */}
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="contactName"
                      placeholder="Tu nombre"
                      value={name} // Bind value
                      onChange={(e) => setName(e.target.value)} // Update state
                      required
                      disabled={isSubmitting} // Disable while submitting
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="contactEmail" className="form-label small fw-light">Correo Electrónico</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="contactEmail"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="contactPhone" className="form-label small fw-light">Teléfono <span className="text-muted">(Opcional)</span></label>
                  <input
                    type="tel"
                    className="form-control form-control-lg"
                    id="contactPhone"
                    placeholder="Tu número"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="contactMessage" className="form-label small fw-light">Mensaje</label>
                  <textarea
                    className="form-control form-control-lg"
                    id="contactMessage"
                    rows={5}
                    placeholder="Escribe tu consulta aquí..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                <div className="text-center">
                  {/* Disable button while submitting */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg rounded-pill px-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'} {/* Change text while submitting */}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
