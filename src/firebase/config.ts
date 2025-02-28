// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxEUHKgAoGNSaHYIQOzzTxVuoD4ZPTz0k",
  authDomain: "rendez-vous-parfait-ca3a6.firebaseapp.com",
  projectId: "rendez-vous-parfait-ca3a6",
  storageBucket: "rendez-vous-parfait-ca3a6.appspot.com",
  messagingSenderId: "247528274248",
  appId: "1:247528274248:web:7c92f4255bec86c66bdb7d",
  measurementId: "G-7K6FQEMEQW"
};

// Initialiser Firebase avec journalisation
console.log('Initialisation de Firebase avec la configuration:', JSON.stringify(firebaseConfig, null, 2));
const app = initializeApp(firebaseConfig);
console.log('Firebase initialisé avec succès');

// Exporter les services Firebase
export const auth = getAuth(app);
console.log('Service d\'authentification Firebase initialisé');
export const db = getFirestore(app);
console.log('Service Firestore initialisé');
export const storage = getStorage(app);
console.log('Service Storage initialisé');
export default app;