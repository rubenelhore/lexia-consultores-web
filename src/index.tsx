import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

admin.initializeApp();

// Configure your Gemini API Key securely using Firebase environment variables
// Run: firebase functions:config:set gemini.key="YOUR_API_KEY"
const GEMINI_API_KEY = functions.config().gemini.key;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Define the expected input data structure
interface RequestData {
    controversyDetails: string;
    argumentsData: { [partyName: string]: string };
}

export const getGeminiResolution = functions.https.onCall(async (data: RequestData, context) => {
    // Basic validation
    if (!data.controversyDetails || !data.argumentsData || Object.keys(data.argumentsData).length < 2) {
        throw new functions.https.HttpsError("invalid-argument", "La solicitud debe incluir detalles de la controversia y argumentos de al menos dos partes.");
    }

    // --- Construct the Prompt ---
    let prompt = `Eres un juez mexicano altamente experimentado y especializado en Mecanismos Alternativos de Solución de Controversias (MASC), particularmente en mediación y conciliación. Tu objetivo es analizar la siguiente controversia y proponer una resolución equitativa y fundamentada en principios legales y de justicia alternativa mexicanos.

Contexto de la Controversia:
${data.controversyDetails}

Argumentos y Versiones de las Partes Involucradas:
`;

    // Add arguments from each party
    for (const partyName in data.argumentsData) {
        prompt += `\n--- Argumentos de ${partyName} ---\n${data.argumentsData[partyName]}\n`;
    }

    prompt += `
--- Instrucciones para la Resolución ---
Basándote EXCLUSIVAMENTE en la información proporcionada:
1.  Identifica los puntos clave de la controversia.
2.  Analiza las posiciones y argumentos de cada parte.
3.  Considera posibles puntos de acuerdo o áreas de negociación.
4.  Propón una resolución clara, concisa y justa en formato de acuerdo o convenio simple. El lenguaje debe ser formal pero accesible para las partes.
5.  La resolución debe incluir:
    *   Un breve resumen de los antecedentes presentados.
    *   Los puntos de acuerdo propuestos o la solución sugerida.
    *   Espacios claramente indicados para la firma de cada una de las partes mencionadas (${Object.keys(data.argumentsData).join(", ")}).
6.  La estructura debe ser adecuada para imprimir y firmar. NO incluyas explicaciones sobre tu proceso de pensamiento, solo el documento de resolución final.`;

    // --- Call Gemini API ---
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Or your preferred model

        const generationConfig = {
            temperature: 0.7, // Adjust creativity/consistency
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048, // Adjust as needed
        };

        // Optional: Safety Settings (adjust as needed)
        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig,
          safetySettings,
        });

        if (result.response) {
            const resolutionText = result.response.text(); // Use .text() accessor
            console.log("Gemini Response:", resolutionText);
            return { resolution: resolutionText };
        } else {
             console.error("Gemini API did not return a valid response structure.");
             throw new functions.https.HttpsError("internal", "No se pudo obtener una respuesta válida del servicio de IA.");
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Check for specific Gemini errors if possible
        if (error instanceof Error) {
           if (error.message.includes("SAFETY")) {
               throw new functions.https.HttpsError("permission-denied", "La solicitud fue bloqueada por políticas de seguridad.");
           }
        }
        throw new functions.https.HttpsError("internal", "Error al procesar la solicitud con el servicio de IA.");
    }
});
