import { db } from '../firebase/config';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

/**
 * Utilitaire pour promouvoir un utilisateur au rang d'administrateur
 * Peut être exécuté depuis la console du navigateur
 */
export async function promoteToAdmin(email) {
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

// Exposer la fonction globalement pour pouvoir l'utiliser dans la console
window.promoteToAdmin = promoteToAdmin; 