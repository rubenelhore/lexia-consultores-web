import React, { useState } from 'react';
import '../styles/LexiaConsultorVirtual.css'; // We will create this CSS file
import { getFunctions, httpsCallable } from "firebase/functions"; // Import Firebase functions
import { db } from '../firebaseConfig'; // Import Firestore instance
import { collection, addDoc, Timestamp } from 'firebase/firestore'; // Import Firestore functions

// UserData might be passed initially as dummy/empty, handle it gracefully
interface UserData {
  nombre: string;
  email: string;
  telefono: string;
}

interface LexiaConsultorVirtualProps {
  userData: UserData; // Keep prop for now, but don't rely on it being complete initially
}

// Define types for the stages - Adjust stages for the new flow
type ConsultationStage = 'problemInput' | 'loading' | 'summary' | 'error';

// Remove Arguments interface
// interface Arguments { ... }

const LexiaConsultorVirtual: React.FC<LexiaConsultorVirtualProps> = ({ userData }) => {
  // State for component stage - Start at 'problemInput'
  const [stage, setStage] = useState<ConsultationStage>('problemInput');

  // State for controversy details
  const [controversyDetails, setControversyDetails] = useState('');
  // Remove party/argument states
  // const [partesInvolucradas, setPartesInvolucradas] = useState<string[]>(['', '']);
  // const [argumentsData, setArgumentsData] = useState<Arguments>({});

  // State for Gemini result (will hold initial strategy)
  const [resolutionResult, setResolutionResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Remove Party Input Handlers
  // const handleAddParty = () => { ... };
  // const handlePartyChange = (index: number, value: string) => { ... };
  // const handleRemoveParty = (index: number) => { ... };

  // Rename and adapt function to handle initial problem submission
  const handleProblemSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (controversyDetails.trim() === '') {
        alert('Por favor, describe tu problemática.');
        return;
    }
    setStage('loading'); // Set loading state
    setErrorMessage(null); // Clear previous errors
    setResolutionResult(null); // Clear previous results

    console.log('Submitting problem to Firebase:', controversyDetails);

    try {
      const functions = getFunctions(); // Get Firebase Functions instance
      // TODO: Rename 'getGeminiResolution' to the new function name e.g., 'getInitialStrategy'
      const callGetStrategy = httpsCallable(functions, 'getGeminiResolution'); // TEMPORARY: Use old name

      const requestData = {
          controversyDetails: controversyDetails,
          // Remove argumentsData from request
      };

      const result = await callGetStrategy(requestData);
      // Adapt expected response structure if needed
      const data = result.data as { resolution: string }; // Assuming 'resolution' still holds the strategy text

      if (data.resolution) {
        setResolutionResult(data.resolution);
        setStage('summary');

        // --- Save initial consultation data to Firestore ---
        try {
          const consultationData = {
            userData: userData, // Save the potentially incomplete userData for now
            controversyDetails: controversyDetails,
            // Remove parties/arguments from saved data
            // partesInvolucradas: partesInvolucradas,
            // argumentsData: argumentsData,
            resolution: data.resolution, // Save the initial strategy
            createdAt: Timestamp.now()
          };
          // Use a different collection or add a field to distinguish these initial consultations?
          const docRef = await addDoc(collection(db, "consultations"), consultationData); // Keep collection for now
          console.log("Initial consultation data saved with ID: ", docRef.id);
        } catch (firestoreError) {
          console.error("Error saving initial consultation data to Firestore: ", firestoreError);
          // Log error but don't block UI or change stage
        }
        // --- End Firestore save ---

      } else {
          throw new Error("La respuesta de la función no contenía una resolución.");
      }

    } catch (error: any) {
      console.error("Error calling Firebase Function:", error);
      setErrorMessage(`Error al obtener la estrategia inicial: ${error.message || 'Error desconocido.'}`);
      setStage('error'); // Go to error stage
    }
  };

  // Remove handleArgumentChange
  // const handleArgumentChange = (partyName: string, value: string) => { ... };

  // Remove handleArgumentsSubmit (replaced by handleProblemSubmit)
  // const handleArgumentsSubmit = async (event: React.FormEvent) => { ... };

  // --- Function to retry or go back ---
  const handleRetry = () => {
      // Go back to problem input stage on retry
      setStage('problemInput');
      setErrorMessage(null);
  }
  // ---

  return (
    <section id="lexia-consultor" className="lexia-consultor-section">
      <h2>LexIA Consultor Virtual</h2>
      {/* Show welcome only if name exists (might be empty initially) */}
      {stage === 'problemInput' && userData.nombre && <p>Bienvenido/a, {userData.nombre}.</p>}
      {stage === 'problemInput' && !userData.nombre && <p>Bienvenido/a. Describe tu situación.</p>}


      {/* Stage 1: Problem Input */}
      {stage === 'problemInput' && (
        // Use the new handler
        <form onSubmit={handleProblemSubmit} className="controversy-form">
          <h3>Describe tu Problemática</h3>
          <div className="form-group">
            <label htmlFor="controversyDetails">Por favor, detalla la situación o consulta que tienes:</label>
            <textarea
              id="controversyDetails"
              rows={8} // Maybe more rows for initial description
              value={controversyDetails}
              onChange={(e) => setControversyDetails(e.target.value)}
              placeholder="Describe aquí tu caso. Cuanto más detalle proporciones, mejor será el análisis inicial..."
              required
            ></textarea>
          </div>

          {/* Remove Party Input Section */}
          {/* <h3>Partes Involucradas</h3> ... */}

          {/* Change button text and action */}
          <button type="submit" className="cta-button">Obtener Análisis Inicial</button>
        </form>
      )}

      {/* Stage 2: Arguments Input - REMOVE THIS STAGE */}
      {/* {stage === 'arguments' && ( ... )} */}

       {/* Loading Stage - No changes needed here */}
       {stage === 'loading' && (
        <div className="loading-section">
          <p>Analizando tu situación...</p>
          {/* Add a spinner or loading indicator here */}
          <div className="spinner"></div>
        </div>
      )}

      {/* Stage 3: Summary/Result (Now shows initial strategy) */}
      {stage === 'summary' && (
        <div className="summary-section">
          <h3>Análisis Inicial y Estrategia Propuesta</h3>
          {resolutionResult ? (
             // Display the strategy. Consider formatting if it's long.
            <pre className="resolution-output">{resolutionResult}</pre>
          ) : (
            <p>Generando resultado...</p>
          )}

          {/* Add the offer to coordinate */}
          <div className="coordination-offer">
              <h4>Siguientes Pasos</h4>
              <p>LexIA puede ayudarte a gestionar esta situación. Si lo deseas, podemos ponernos en contacto contigo y, si aplica, con la contraparte para buscar una solución.</p>
              {/* TODO: Add buttons/form for next actions:
                  - Request contact (gather user details if missing)
                  - Provide counterparty details (optional)
                  - Go back / Start new consultation
              */}
              <button
                className="cta-button contact-scroll-button"
                onClick={() => {
                  // Decide action: maybe scroll to contact or open a dedicated contact/next step form
                  const contactSection = document.getElementById('contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Quiero que me contacten
              </button>
          </div>

        </div>
      )}

       {/* Error Stage - Adapt message slightly if needed */}
       {stage === 'error' && (
          <div className="error-section">
            <h3>Error</h3>
            <p>{errorMessage || 'Ha ocurrido un error inesperado.'}</p>
            <button onClick={handleRetry} className="cta-button">Intentar de Nuevo</button>
          </div>
      )}

    </section>
  );
};

export default LexiaConsultorVirtual; 