import firebase from 'firebase/compat/app'; // Import compat/app
import 'firebase/compat/firestore';      // Import compat/firestore
// import { getAnalytics } from "firebase/analytics"; // Optional: If you use Analytics

// --- NUEVA CONFIGURACIÓN HARDCODED --- (Del proyecto lexiaconsultores-5e0db)
const firebaseConfig = {
  apiKey: "AIzaSyCB2KKiEbvfWmJ3qElknAyzJOzvK6Ca9ps",
  authDomain: "lexiaconsultores-5e0db.firebaseapp.com",
  projectId: "lexiaconsultores-5e0db",
  storageBucket: "lexiaconsultores-5e0db.appspot.com", // Usamos .appspot.com aquí
  messagingSenderId: "752434104302",
  appId: "1:752434104302:web:2aa7d15c6e946729ea30ff",
  measurementId: "G-B3D540K7L1" // Opcional
};
// -----------------------------------

console.log(">>> USANDO SDK v8 COMPAT Y NUEVA CONFIG HARDCODED");

// Initialize Firebase (estilo v8)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

// Initialize Firestore (estilo v8)
const db = firebase.firestore(); // Obtiene la instancia de firestore

// Initialize Analytics (optional)
// const analytics = getAnalytics(app);

export { db /*, analytics */ }; // Export db and analytics (if used)
