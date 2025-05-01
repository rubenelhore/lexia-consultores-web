import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize Firebase Admin SDK (only once)
admin.initializeApp();

// --- IMPORTANT: Configure API Key ---
// Run this command in your terminal IN THE PROJECT ROOT directory:
// firebase functions:config:set gemini.key="YOUR_API_KEY"
// Replace YOUR_API_KEY with your actual key before deploying!
// ---
const GEMINI_API_KEY = functions.config().gemini?.key;

// Initialize the Google Generative AI client
// We check if the key exists before creating the client
let genAI: GoogleGenerativeAI | null = null;
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
} else {
  console.error("FATAL ERROR: Gemini API Key not found in Firebase function configuration.");
  console.error("Run: firebase functions:config:set gemini.key=\"TU_CLAVE_API_REAL\"");
}

// Define the expected input data structure from the frontend
interface RequestData {
    controversyDetails: string;
    argumentsData: { [partyName: string]: string };
}

// Define the HTTPS Callable Function
// Updated function signature for newer firebase-functions versions
export const getGeminiResolution = functions.https.onCall(
  async (request: functions.https.CallableRequest<RequestData>) => {
    // Access data from the request object
    const data = request.data;

    // Ensure the Gemini client was initialized (API key was present)
    if (!genAI) {
      console.error("Gemini client not initialized. API key might be missing in config.");
      throw new functions.https.HttpsError("failed-precondition", "La configuración del servicio de IA está incompleta. Verifica la clave API.");
    }

    // --- Data Validation ---
    // Check if required data fields are present
    if (!data.controversyDetails || typeof data.controversyDetails !== "string" || data.controversyDetails.trim() === "") {
      throw new functions.https.HttpsError("invalid-argument", "Falta la descripción de la controversia.");
    }
    if (!data.argumentsData || typeof data.argumentsData !== "object" || Object.keys(data.argumentsData).length < 2) {
      throw new functions.https.HttpsError("invalid-argument", "Se requieren los argumentos de al menos dos partes.");
    }
    // Optional: Further validation on argument content (e.g., non-empty strings)
    for (const party in data.argumentsData) {
      if (typeof data.argumentsData[party] !== "string" || data.argumentsData[party].trim() === "") {
        throw new functions.https.HttpsError("invalid-argument", `Los argumentos para '${party}' no pueden estar vacíos.`);
      }
    }
    // --- End Data Validation ---


    // --- Construct the Prompt for Gemini ---
    // (Using the validated and cleaned data)
    const partyNames = Object.keys(data.argumentsData).join(", "); // Get party names for the prompt

    let prompt = `Eres un juez mexicano altamente experimentado y especializado en Mecanismos Alternativos de Solución de Controversias (MASC), particularmente en mediación y conciliación. Tu objetivo es analizar la siguiente controversia y proponer una resolución equitativa y fundamentada en principios legales y de justicia alternativa mexicanos.

Contexto de la Controversia:
${data.controversyDetails}

Argumentos y Versiones de las Partes Involucradas:
`;

    // Add arguments from each party to the prompt
    for (const partyName in data.argumentsData) {
      prompt += `\n--- Argumentos de ${partyName} ---\n${data.argumentsData[partyName]}\n`;
    }

    prompt += `
--- Instrucciones para la Resolución ---
Basándote EXCLUSIVAMENTE en la información proporcionada:
1.  Identifica los puntos clave de la controversia de manera concisa.
2.  Analiza objetivamente las posiciones y argumentos presentados por cada parte.
3.  Considera posibles puntos de acuerdo, soluciones intermedias o áreas de negociación viables.
4.  Propón una resolución clara, concisa, imparcial y justa, redactada en formato de acuerdo o convenio simple. El lenguaje debe ser formal, legalmente apropiado para México, pero accesible para las partes.
5.  La resolución debe incluir obligatoriamente:
    *   Un encabezado indicando que es una Propuesta de Acuerdo/Convenio.
    *   Una breve sección de "Antecedentes" resumiendo objetivamente la controversia según lo descrito.
    *   Una sección clara de "Acuerdos" o "Puntos Resolutivos" detallando la solución propuesta.
    *   Espacios claramente indicados al final para la fecha, nombre y firma de cada una de las partes involucradas: ${partyNames}.
6.  La estructura debe ser limpia y adecuada para imprimir directamente y ser firmada.
7.  NO incluyas explicaciones sobre tu proceso de razonamiento, deliberaciones internas, ni comentarios adicionales fuera del formato del documento de resolución. Enfócate únicamente en generar el texto del acuerdo final.`;

    // --- Call the Gemini API ---
    try {
      // Select the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Consider "gemini-pro" for potentially more complex cases

      // Configure generation parameters
      const generationConfig = {
        temperature: 0.5, // Lower temperature for more deterministic legal text
        topK: 1,
        topP: 0.95, // Keep topP high enough for some flexibility if needed
        maxOutputTokens: 4096, // Increase if resolutions might be very long
      };

      // Define safety settings to block harmful content
      const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ];

      // Send the prompt to Gemini
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings,
      });

      // Process the response
      const response = result.response;

      // Check for blocking first
      if (response?.promptFeedback?.blockReason) {
        console.error("Gemini request blocked:", response.promptFeedback.blockReason, response.promptFeedback.safetyRatings);
        const blockReason = response.promptFeedback.blockReason;
        let userMessage = "La solicitud no pudo ser procesada por el modelo de IA debido a restricciones de contenido.";
        if (blockReason === "SAFETY") {
          userMessage = "La solicitud o su contenido fue bloqueada por políticas de seguridad del modelo.";
        }
        throw new functions.https.HttpsError("permission-denied", userMessage);
      }

      // Check if response structure is valid and contains text
      if (response &&
          response.candidates &&
          response.candidates.length > 0 &&
          response.candidates[0].content &&
          response.candidates[0].content.parts &&
          response.candidates[0].content.parts.length > 0 &&
          response.candidates[0].content.parts[0].text
      ) {
        const resolutionText = response.text();
        console.log("Gemini Response successfully generated.");
        return { resolution: resolutionText };
      } else {
        // Handle unexpected response structure or empty text
        console.error("Gemini API did not return expected text content. Full Response:", JSON.stringify(response));
        throw new functions.https.HttpsError("internal", "El servicio de IA devolvió una respuesta inesperada o vacía.");
      }
    } catch (error: any) {
      console.error("Error calling Gemini API or processing response:", error);
      // Check if it's a known HttpsError from previous steps or a new error
      if (error.code && error.message) {
        // Re-throw known errors
        throw error;
      }
      // Provide a generic error message back to the client for unknown errors
      throw new functions.https.HttpsError(
        "internal",
        `Error al procesar la solicitud con el servicio de IA: ${error.message || "Error desconocido"}`
      );
    }
  }
);
