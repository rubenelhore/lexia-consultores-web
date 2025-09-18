// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Added Firestore import

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAP-WjklHHbOUgwmkUbL90M_2pZfSTCSj8",
  authDomain: "lexia-consultores-9d664.firebaseapp.com",
  projectId: "lexia-consultores-9d664",
  storageBucket: "lexia-consultores-9d664.firebasestorage.app",
  messagingSenderId: "113402454668",
  appId: "1:113402454668:web:c4735ec0df4478c5f051a9",
  measurementId: "G-7CC3JKNES7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

// Export Firebase services
export { app, analytics, db };
