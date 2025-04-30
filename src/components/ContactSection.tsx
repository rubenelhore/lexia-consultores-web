import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 p-md-5">
              <h2 className="text-center mb-4">Contacto</h2>
              <form>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label htmlFor="contactName" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="contactName" placeholder="Tu nombre completo" required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="contactEmail" className="form-label">Correo Electrónico</label>
                    <input type="email" className="form-control" id="contactEmail" placeholder="tu@email.com" required />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="contactPhone" className="form-label">Teléfono <span className="text-muted">(Opcional)</span></label>
                  <input type="tel" className="form-control" id="contactPhone" placeholder="Tu número de teléfono" />
                </div>
                <div className="mb-4">
                  <label htmlFor="contactMessage" className="form-label">Mensaje</label>
                  <textarea className="form-control" id="contactMessage" rows={5} placeholder="Escribe tu consulta aquí..." required></textarea>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-lg">Enviar Mensaje</button>
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
