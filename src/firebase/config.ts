// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  enableMultiTabIndexedDbPersistence, 
  enableIndexedDbPersistence, 
  CACHE_SIZE_UNLIMITED, 
  PersistenceSettings,
  initializeFirestore
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxEUHKgAoGNSaHYIQOzzTxVuoD4ZPTz0k",
  authDomain: "rendez-vous-parfait-ca3a6.firebaseapp.com",
  databaseURL: "https://rendez-vous-parfait-ca3a6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rendez-vous-parfait-ca3a6",
  storageBucket: "rendez-vous-parfait-ca3a6.firebasestorage.app",
  messagingSenderId: "247528274248",
  appId: "1:247528274248:web:7c92f4255bec86c66bdb7d",
  measurementId: "G-7K6FQEMEQW"
};

// En mode développement uniquement, ajouter un log minimal sans exposer les détails
if (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === "true") {
  console.log('Firebase initialisé en mode développement');
}

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialiser Firestore avec des options spécifiques pour gérer les problèmes CORS
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Utiliser long polling au lieu de WebSocket
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

// Exporter les services Firebase
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;