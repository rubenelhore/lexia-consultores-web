import * as functions from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin"; // UNCOMMENT
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"; // UNCOMMENT

// Define the secret
const geminiApiKey = defineSecret("GEMINI_API_KEY");

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
    // Make argumentsData optional
    argumentsData?: { [partyName: string]: string };
}

export const getGeminiResolution = functions.https.onCall(
  { secrets: [geminiApiKey] },
  async (request: functions.https.CallableRequest<RequestData>) => {
    console.log("--- getGeminiResolution function execution STARTED ---");
    console.log("Received data:", JSON.stringify(request.data)); // Log received data

    // --- Initialize Admin SDK INSIDE (if not already) ---
    if (!isAdminInitialized) {
      try { // Add try-catch for initialization
          admin.initializeApp();
          isAdminInitialized = true; // Reassign the flag
          console.log("Firebase Admin SDK initialized.");
      } catch (initError: any) {
          console.error("FATAL ERROR: Firebase Admin SDK initialization failed.", initError);
          // Throw HttpsError to inform the client
          throw new functions.https.HttpsError("internal", "Error interno del servidor al inicializar.");
      }
    }
    // --- End Admin SDK Initialization ---\

    // --- Initialize Gemini Client INSIDE the function ---
    const GEMINI_API_KEY = geminiApiKey.value();
    if (!GEMINI_API_KEY) {
      console.error("FATAL ERROR: Gemini API Key not found in function environment variables.");
      console.error("Set the GEMINI_API_KEY environment variable during deployment or via Secret Manager.");
      throw new functions.https.HttpsError("failed-precondition", "La configuración de la clave API para el servicio de IA no fue encontrada.");
    }
    let genAI: GoogleGenerativeAI;
    try { // Add try-catch for Gemini client init
        genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        console.log("Gemini Client initialized.");
    } catch (geminiInitError: any) {
        console.error("FATAL ERROR: Gemini Client initialization failed.", geminiInitError);
        throw new functions.https.HttpsError("internal", "Error interno del servidor al inicializar el servicio de IA.");
    }
    // --- End Gemini Client Initialization ---\

    const data = request.data;

    // --- Data Validation ---\
    if (!data.controversyDetails || typeof data.controversyDetails !== "string" || data.controversyDetails.trim() === "") {
      console.error("Validation Error: Missing or invalid controversyDetails.");
      throw new functions.https.HttpsError("invalid-argument", "Falta la descripción de la controversia.");
    }

    let prompt: string;
    // Log the received argumentsData explicitly
    console.log("Log before check: data.argumentsData =", JSON.stringify(data.argumentsData));
    const isFullConsultation = data.argumentsData && typeof data.argumentsData === "object" && Object.keys(data.argumentsData).length >= 2;
    // Log the result of the check
    console.log(`Log after check: isFullConsultation = ${isFullConsultation}`);

    if (isFullConsultation && data.argumentsData) {
        // Log entry into the IF block
        console.log("Log: Entering IF block (Full Consultation)");

        console.log("Mode: Full Consultation (with arguments)");

        // --- MOVE argument validation logic INSIDE this block ---
        // Log before argument validation
        console.log("Log: About to validate arguments inside IF block...");
        // Check if object exists and has at least 2 keys (already part of isFullConsultation, but belt-and-suspenders)
        if (Object.keys(data.argumentsData).length < 2) {
             console.error("Validation Error: Less than 2 arguments provided.");
             throw new functions.https.HttpsError("invalid-argument", "Se requieren los argumentos de al menos dos partes.");
        }
        // Validate arguments content
        for (const party in data.argumentsData) {
          if (typeof data.argumentsData[party] !== "string" || data.argumentsData[party].trim() === "") {
            console.error(`Validation Error: Empty arguments for party '${party}'.`);
            throw new functions.https.HttpsError("invalid-argument", `Los argumentos para '${party}' no pueden estar vacíos.`);
          }
        }
        console.log("Log: Argument validation inside IF block passed.");
        // --- End moved validation ---

        const partyNames = Object.keys(data.argumentsData).join(", ");
        prompt = `Eres un juez mexicano altamente experimentado y especializado en Mecanismos Alternativos de Solución de Controversias (MASC), particularly en mediación y conciliación. Tu objetivo es analizar la siguiente controversia y proponer una resolución equitativa y fundamentada en principios legales y de justicia alternativa mexicanos.

Contexto de la Controversia:
${data.controversyDetails}

Argumentos y Versiones de las Partes Involucradas:\n`;

        for (const partyName in data.argumentsData) {
          prompt += `\\n--- Argumentos de ${partyName} ---\\n${data.argumentsData[partyName]}\\n`;
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
    *   Una breve sección de \"Antecedentes\" resumiendo objetivamente la controversia según lo descrito.
    *   Una sección clara de \"Acuerdos\" o \"Puntos Resolutivos\" detallando la solución propuesta.
    *   Espacios claramente indicados al final para la fecha, nombre y firma de cada una de las partes involucradas: ${partyNames}.
6.  La estructura debe ser limpia y adecuada para imprimir directamente y ser firmada.
7.  NO incluyas explicaciones sobre tu proceso de razonamiento, deliberaciones internas, ni comentarios adicionales fuera del formato del documento de resolución. Enfócate únicamente en generar el texto del acuerdo final.`;

    } else {
        // Log entry into the ELSE block
        console.log("Log: Entering ELSE block (Initial Pre-Consulta)");
        console.log("Mode: Initial Pre-Consulta (details only)");
        // Construct the new prompt for initial analysis and strategy
        prompt = `Eres LexIA, un asistente legal virtual experto en análisis de controversias y mecanismos alternativos de solución en México. Un usuario ha descrito la siguiente situación:

--- Situación Descrita por el Usuario ---
${data.controversyDetails}

--- Instrucciones ---
Basándote exclusivamente en la descripción proporcionada por el usuario:
1.  Analiza la situación legal descrita. Identifica los posibles tipos de conflicto (civil, mercantil, familiar, etc.) y los puntos clave desde una perspectiva legal mexicana de forma concisa.
2.  Describe brevemente las implicaciones legales o posibles consecuencias. Explica esto en un lenguaje claro y accesible para una persona sin conocimientos legales (similar al enfoque de justicio.es), y también menciona los términos técnicos relevantes para un profesional del derecho.
3.  Propón una estrategia inicial clara y concreta o los siguientes pasos recomendados para el usuario. Considera opciones como: recopilar más información específica, intentar comunicación directa (si aplica), explorar la mediación/conciliación, o la necesidad de consultar formalmente a un abogado especialista.
4.  Estructura tu respuesta de forma clara y ordenada (por ejemplo, usando puntos o secciones).
5.  **Importante**: Concluye tu respuesta EXACTAMENTE con el siguiente párrafo, sin añadir nada antes ni después de él en la conclusión: "Entendemos que esta situación puede ser compleja. En LexIA Consultores estamos para ayudarte. Si lo deseas, podemos ponernos en contacto contigo para profundizar en tu caso y, si es pertinente, facilitar la comunicación con la(s) otra(s) parte(s) involucrada(s) para explorar una solución amistosa. Haz clic en el botón 'Quiero que me contacten' si te interesa esta opción."`;
    }

    console.log("Generated Prompt:", prompt); // Log the generated prompt

    // --- Call the Gemini API ---
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      // Adjust generation config slightly? Maybe less deterministic for strategy?
      const generationConfig = { temperature: 0.6, topK: 1, topP: 0.95, maxOutputTokens: 4096 };
      const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ];

      console.log("Calling Gemini API..."); // Log before calling
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
        console.log("Returning resolution:", resolutionText.substring(0, 100) + "..."); // Log start of resolution
        return { resolution: resolutionText };
      } else {
        console.error("Gemini API did not return expected text content. Full Response:", JSON.stringify(response));
        throw new functions.https.HttpsError("internal", "El servicio de IA devolvió una respuesta inesperada o vacía.");
      }
    } catch (error: any) {
      console.error("Error calling Gemini API or processing response:", error);
      // Check if it's already an HttpsError (e.g., from blockReason handling)
      if (error instanceof functions.https.HttpsError) {
          throw error;
      }
      // Otherwise, wrap it
      throw new functions.https.HttpsError("internal", `Error al procesar la solicitud con el servicio de IA: ${error.message || "Error desconocido"}`);
    }
  }
);
