import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const fieldName = id.replace('contact', '').toLowerCase();
    setFormData(prev => ({
      ...prev,
      [fieldName === 'name' ? 'name' : fieldName]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('ContactSection: Form submitted with:', formData);

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      console.error('ContactSection: Missing required fields');
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Por favor ingrese un email válido');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const docRef = await addDoc(collection(db, "contactMessages"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        submittedAt: Timestamp.now()
      });
      console.log("ContactSection: Document written with ID:", docRef.id);
      setSubmitStatus('success');
      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error: any) {
      console.error("ContactSection: Error adding document:", error);
      console.error("ContactSection: Error details:", error.message);
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
              <p className="text-center text-muted mb-4">
                Nos encantaría saber de ti. Completa el formulario y te responderemos lo antes posible.
              </p>

              {/* Submission Status Messages */}
              {submitStatus === 'success' && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <strong>¡Mensaje enviado!</strong> Gracias por contactarnos. Te responderemos pronto.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>Error al enviar</strong> Por favor, inténtalo de nuevo más tarde.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label htmlFor="contactName" className="form-label small fw-light">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="contactName"
                      placeholder="Tu nombre"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="contactEmail" className="form-label small fw-light">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="contactEmail"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="contactPhone" className="form-label small fw-light">
                    Teléfono <span className="text-muted">(Opcional)</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control form-control-lg"
                    id="contactPhone"
                    placeholder="Tu número"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="contactMessage" className="form-label small fw-light">
                    Mensaje
                  </label>
                  <textarea
                    className="form-control form-control-lg"
                    id="contactMessage"
                    rows={5}
                    placeholder="Escribe tu consulta aquí..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg rounded-pill px-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enviando...
                      </>
                    ) : (
                      'Enviar Mensaje'
                    )}
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