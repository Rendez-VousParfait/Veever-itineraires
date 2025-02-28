// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableMultiTabIndexedDbPersistence, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
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

// Initialiser Firestore avec configuration optimisée
export const db = getFirestore(app);

// Configurer la persistance des données selon le mode
const persistenceMode = import.meta.env.VITE_FIREBASE_PERSISTENCE || 'session';

// Appliquer la configuration de persistence uniquement côté client
if (typeof window !== 'undefined') {
  if (persistenceMode === 'session') {
    // Mode session - moins de problèmes CORS mais données perdues à la fermeture du navigateur
    // Pas de configuration spéciale nécessaire, utilise le comportement par défaut de Firestore
  } else if (persistenceMode === 'local') {
    // Mode local - données persistantes entre sessions, mais plus susceptible aux erreurs CORS
    (async () => {
      try {
        await enableIndexedDbPersistence(db);
        if (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === "true") {
          console.log('Persistance Firestore activée avec succès');
        }
      } catch (err: any) {
        if (err.code === 'failed-precondition') {
          console.warn('Persistance Firestore impossible: plusieurs onglets ouverts à la fois');
        } else if (err.code === 'unimplemented') {
          console.warn('Le navigateur ne supporte pas la persistance IndexedDB');
        }
      }
    })();
  }
}

// Exporter les services Firebase
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;