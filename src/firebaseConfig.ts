// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Added Firestore import

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbWAJrhq28kxIeIprycaIEOjq7yi9N-5I",
  authDomain: "lexia-consultores-b593f.firebaseapp.com",
  projectId: "lexia-consultores-b593f",
  storageBucket: "lexia-consultores-b593f.appspot.com", // Corrected storageBucket domain
  messagingSenderId: "1010531242469",
  appId: "1:1010531242469:web:199c03a77c982113369f0c",
  measurementId: "G-N9TYD05KR8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

// Export Firebase services
export { app, analytics, db };
