// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// En mode développement uniquement, ajouter un log minimal sans exposer les détails
if (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === "true") {
  console.log('Firebase initialisé en mode développement');
}

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore avec des options spécifiques pour gérer les problèmes CORS
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Utiliser long polling au lieu de WebSocket
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

// Exporter les services Firebase
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;