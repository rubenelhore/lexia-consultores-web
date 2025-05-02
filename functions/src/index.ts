import * as functions from "firebase-functions";
import * as admin from "firebase-admin"; // UNCOMMENT
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"; // UNCOMMENT

// KEEP Global admin.initializeApp(); COMMENTED OUT

// Flag to ensure admin is initialized only once per instance
let isAdminInitialized = false; // Linter might complain, but we need let for reassignment

// Define a very simple callable function for testing
export const helloWorld = functions.https.onCall((data, context) => {
  console.log("Executing helloWorld function!");
  return { message: "Hello from Firebase!" };
});

// UNCOMMENT ORIGINAL FUNCTION LOGIC

interface RequestData {
    controversyDetails: string;
    argumentsData: { [partyName: string]: string };
}

export const getGeminiResolution = functions.https.onCall(
  async (request: functions.https.CallableRequest<RequestData>) => {
    console.log("--- getGeminiResolution function execution STARTED ---");

    // --- Initialize Admin SDK INSIDE (if not already) ---
    if (!isAdminInitialized) {
      admin.initializeApp();
      isAdminInitialized = true; // Reassign the flag
      console.log("Firebase Admin SDK initialized.");
    }
    // --- End Admin SDK Initialization ---

    // --- Initialize Gemini Client INSIDE the function ---
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error("FATAL ERROR: Gemini API Key not found in function environment variables.");
      console.error("Set the GEMINI_API_KEY environment variable during deployment or via Secret Manager.");
      throw new functions.https.HttpsError("failed-precondition", "La configuración de la clave API para el servicio de IA no fue encontrada.");
    }
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    // --- End Gemini Client Initialization ---

    const data = request.data;

    // --- Data Validation ---
    if (!data.controversyDetails || typeof data.controversyDetails !== "string" || data.controversyDetails.trim() === "") {
      throw new functions.https.HttpsError("invalid-argument", "Falta la descripción de la controversia.");
    }
    if (!data.argumentsData || typeof data.argumentsData !== "object" || Object.keys(data.argumentsData).length < 2) {
      throw new functions.https.HttpsError("invalid-argument", "Se requieren los argumentos de al menos dos partes.");
    }
    for (const party in data.argumentsData) {
      if (typeof data.argumentsData[party] !== "string" || data.argumentsData[party].trim() === "") {
        throw new functions.https.HttpsError("invalid-argument", `Los argumentos para '${party}' no pueden estar vacíos.`);
      }
    }
    // --- End Data Validation ---

    const partyNames = Object.keys(data.argumentsData).join(", ");
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
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const generationConfig = { temperature: 0.5, topK: 1, topP: 0.95, maxOutputTokens: 4096 };
      const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ];
      const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig, safetySettings });
      const response = result.response;
      if (response?.promptFeedback?.blockReason) {
        console.error("Gemini request blocked:", response.promptFeedback.blockReason, response.promptFeedback.safetyRatings);
        const blockReason = response.promptFeedback.blockReason;
        let userMessage = "La solicitud no pudo ser procesada por el modelo de IA debido a restricciones de contenido.";
        if (blockReason === "SAFETY") {
          userMessage = "La solicitud o su contenido fue bloqueada por políticas de seguridad del modelo.";
        }
        throw new functions.https.HttpsError("permission-denied", userMessage);
      }
      if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const resolutionText = response.text();
        console.log("Gemini Response successfully generated.");
        return { resolution: resolutionText };
      } else {
        console.error("Gemini API did not return expected text content. Full Response:", JSON.stringify(response));
        throw new functions.https.HttpsError("internal", "El servicio de IA devolvió una respuesta inesperada o vacía.");
      }
    } catch (error: any) {
      console.error("Error calling Gemini API or processing response:", error);
      if (error.code && error.message) {
        throw error;
      }
      throw new functions.https.HttpsError("internal", `Error al procesar la solicitud con el servicio de IA: ${error.message || "Error desconocido"}`);
    }
  }
);
