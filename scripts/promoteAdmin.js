import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAxEUHKgAoGNSaHYIQOzzTxVuoD4ZPTz0k",
  authDomain: "rendez-vous-parfait-ca3a6.firebaseapp.com",
  projectId: "rendez-vous-parfait-ca3a6",
  storageBucket: "rendez-vous-parfait-ca3a6.appspot.com",
  messagingSenderId: "247528274248",
  appId: "1:247528274248:web:7c92f4255bec86c66bdb7d",
  measurementId: "G-7K6FQEMEQW"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Promouvoir un utilisateur au rang d'administrateur
 */
async function promoteToAdmin(email) {
  try {
    console.log(`Tentative de promotion de l'utilisateur ${email} au rang d'administrateur...`);
    
    // Rechercher l'utilisateur par email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error(`Aucun utilisateur trouvé avec l'email ${email}`);
      return false;
    }
    
    // Prendre le premier utilisateur correspondant
    const userDoc = querySnapshot.docs[0];
    const uid = userDoc.id;
    
    // Mettre à jour le rôle
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { role: 'admin' });
    
    console.log(`L'utilisateur ${email} (${uid}) a été promu administrateur avec succès!`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la promotion de l\'utilisateur:', error);
    return false;
  }
}

// Email de l'utilisateur à promouvoir
const email = 'hardcore339@protonmail.com';

// Exécuter la fonction
promoteToAdmin(email)
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Erreur:', error);
    process.exit(1);
  }); 