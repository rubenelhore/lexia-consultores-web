import React, { useState } from 'react';
import '../styles/LexiaConsultorVirtual.css'; // We will create this CSS file
import { getFunctions, httpsCallable } from "firebase/functions"; // Import Firebase functions

// Assuming UserData interface is defined elsewhere or we define it here
interface UserData {
  nombre: string;
  email: string;
  telefono: string;
}

interface LexiaConsultorVirtualProps {
  userData: UserData;
}

// Define types for the stages
type ConsultationStage = 'details' | 'arguments' | 'loading' | 'summary' | 'error';

// Type for storing arguments (party name -> argument text)
interface Arguments {
  [partyName: string]: string;
}

const LexiaConsultorVirtual: React.FC<LexiaConsultorVirtualProps> = ({ userData }) => {
  // State for component stage
  const [stage, setStage] = useState<ConsultationStage>('details');
  
  // State for controversy details
  const [controversyDetails, setControversyDetails] = useState('');
  const [partesInvolucradas, setPartesInvolucradas] = useState<string[]>(['', '']); // Start with two parties

  // State for arguments
  const [argumentsData, setArgumentsData] = useState<Arguments>({});

  // State for Gemini result
  const [resolutionResult, setResolutionResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- Handlers for Party Inputs ---
  const handleAddParty = () => {
    setPartesInvolucradas([...partesInvolucradas, '']);
  };

  const handlePartyChange = (index: number, value: string) => {
    const updatedParties = [...partesInvolucradas];
    updatedParties[index] = value;
    setPartesInvolucradas(updatedParties);
  };

  const handleRemoveParty = (index: number) => {
    // Prevent removing below minimum parties if needed (e.g., 2)
    if (partesInvolucradas.length <= 2) return; 
    const updatedParties = partesInvolucradas.filter((_, i) => i !== index);
    setPartesInvolucradas(updatedParties);
  };
  // --- End Party Input Handlers ---

  // --- Submit Initial Details ---
  const handleControversySubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validParties = partesInvolucradas.map(p => p.trim()).filter(p => p !== '');
    if (validParties.length < 2) {
        alert('Por favor, ingresa al menos dos partes involucradas válidas.');
        return;
    }
    console.log('Controversy Details:', controversyDetails);
    console.log('Partes Involucradas:', validParties);
    // Initialize arguments state for valid parties
    const initialArgs: Arguments = {};
    validParties.forEach(party => {
        initialArgs[party] = ''; 
    });
    setArgumentsData(initialArgs);
    setPartesInvolucradas(validParties); // Update state with cleaned party names
    setStage('arguments'); // Proceed to arguments stage
  };
  // --- End Submit Initial Details ---

  // --- Handlers for Argument Inputs ---
  const handleArgumentChange = (partyName: string, value: string) => {
    setArgumentsData(prevArgs => ({
      ...prevArgs,
      [partyName]: value,
    }));
  };

  // --- Submit Arguments to Firebase Function ---
  const handleArgumentsSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStage('loading'); // Set loading state
    setErrorMessage(null); // Clear previous errors
    setResolutionResult(null); // Clear previous results

    console.log('Submitting Arguments to Firebase:', argumentsData);

    try {
      const functions = getFunctions(); // Get Firebase Functions instance
      const callGemini = httpsCallable(functions, 'getGeminiResolution'); 
      
      const requestData = {
          controversyDetails: controversyDetails, // Send controversy details too
          argumentsData: argumentsData 
      };

      const result = await callGemini(requestData);
      const data = result.data as { resolution: string }; // Type assertion

      if (data.resolution) {
        setResolutionResult(data.resolution);
        setStage('summary');
      } else {
          throw new Error("La respuesta de la función no contenía una resolución.");
      }

    } catch (error: any) {
      console.error("Error calling Firebase Function:", error);
      setErrorMessage(`Error al obtener la resolución: ${error.message || 'Error desconocido.'}`);
      setStage('error'); // Go to error stage
    }
  };
  // ---

  // --- Function to retry or go back ---
  const handleRetry = () => {
      setStage('arguments'); // Go back to arguments stage to allow edits/retry
      setErrorMessage(null);
  }
  // ---

  return (
    <section id="lexia-consultor" className="lexia-consultor-section">
      <h2>LexIA Consultor Virtual</h2>
      {/* Only show welcome message in the first stage? */} 
      {stage === 'details' && <p>Bienvenido/a, {userData.nombre}.</p>}

      {/* Stage 1: Details Input */}
      {stage === 'details' && (
        <form onSubmit={handleControversySubmit} className="controversy-form">
          <h3>Datos Generales de la Controversia</h3>
          <div className="form-group">
            <label htmlFor="controversyDetails">Describe brevemente la controversia:</label>
            <textarea
              id="controversyDetails"
              rows={5}
              value={controversyDetails}
              onChange={(e) => setControversyDetails(e.target.value)}
              required
            ></textarea>
          </div>

          <h3>Partes Involucradas</h3>
          {partesInvolucradas.map((party, index) => (
            <div key={index} className="form-group party-input">
              <label htmlFor={`party-${index}`}>Parte {index + 1}:</label>
              <input
                type="text"
                id={`party-${index}`}
                value={party}
                onChange={(e) => handlePartyChange(index, e.target.value)}
                placeholder="Nombre de la parte"
                // Only require the first two parties initially
                required={index < 2}
              />
              {/* Allow removing only extra parties (beyond 2) */}
              {partesInvolucradas.length > 2 && index >= 2 && (
                  <button type="button" onClick={() => handleRemoveParty(index)} className="remove-party-button">
                    &times;
                  </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddParty} className="add-party-button">
            + Añadir Otra Parte
          </button>

          <button type="submit" className="cta-button">Guardar Datos y Continuar</button>
        </form>
      )}

      {/* Stage 2: Arguments Input */}
      {stage === 'arguments' && (
        <form onSubmit={handleArgumentsSubmit} className="arguments-form">
           <h3>Argumentos de las Partes</h3>
           <p>Por favor, ingresa la versión o argumentos de cada parte involucrada.</p>
           {Object.keys(argumentsData).map((partyName) => (
             <div key={partyName} className="form-group argument-input">
                <label htmlFor={`argument-${partyName}`}>{partyName}:</label>
                <textarea
                  id={`argument-${partyName}`}
                  rows={8}
                  value={argumentsData[partyName]}
                  onChange={(e) => handleArgumentChange(partyName, e.target.value)}
                  placeholder={`Ingresa los argumentos de ${partyName}...`}
                  required
                ></textarea>
             </div>
           ))}
           <button type="submit" className="cta-button">Enviar Argumentos a Análisis</button>
        </form>
      )}

      {/* Stage 3: Summary/Result (Placeholder) */}
      {stage === 'summary' && (
        <div className="summary-section">
          <h3>Resumen y Resultado</h3>
          <p>Los argumentos han sido enviados. Procesando la información...</p>
          {/* TODO: Display results from Gemini API call */}
        </div>
      )}

    </section>
  );
};

export default LexiaConsultorVirtual; 