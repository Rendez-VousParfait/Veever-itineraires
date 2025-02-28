import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  Timestamp,
  serverTimestamp,
  FieldValue
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './config';

// Types de rôles disponibles
export type UserRole = 'user' | 'admin';

// Interface pour les données utilisateur
export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: UserRole;
  createdAt: Timestamp | FieldValue;
  lastLogin: Timestamp | FieldValue;
}

// Collection Firestore pour les utilisateurs
const USERS_COLLECTION = 'users';

/**
 * Crée un nouvel utilisateur dans Firestore avec le rôle par défaut 'user'
 */
export async function createUserRecord(user: User, displayName?: string): Promise<void> {
  try {
    console.log('Création d\'un nouvel enregistrement utilisateur pour:', user.email);
    
    const userData: UserData = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName,
      photoURL: user.photoURL,
      role: 'user', // Rôle par défaut
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    };
    
    // Utiliser l'ID d'authentification comme ID de document
    await setDoc(doc(db, USERS_COLLECTION, user.uid), userData);
    console.log('Enregistrement utilisateur créé avec succès');
  } catch (error) {
    console.error('Erreur lors de la création de l\'enregistrement utilisateur:', error);
    throw error;
  }
}

/**
 * Met à jour la date de dernière connexion de l'utilisateur
 */
export async function updateUserLastLogin(uid: string): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      lastLogin: serverTimestamp()
    });
    
    // Logger uniquement en développement si activé
    if (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === "true") {
      console.log('Date de dernière connexion mise à jour');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la date de dernière connexion:', error);
    // Ne pas propager l'erreur car ce n'est pas critique
  }
}

/**
 * Récupère les données d'un utilisateur depuis Firestore
 */
export async function getUserData(uid: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    } else {
      console.log('Aucune donnée utilisateur trouvée pour:', uid);
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    throw error;
  }
}

/**
 * Vérifie si un utilisateur a le rôle d'administrateur
 */
export async function isAdmin(uid: string): Promise<boolean> {
  try {
    const userData = await getUserData(uid);
    return userData?.role === 'admin';
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle admin:', error);
    return false;
  }
}

/**
 * Met à jour le rôle d'un utilisateur
 */
export async function updateUserRole(uid: string, newRole: UserRole): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      role: newRole
    });
    console.log(`Rôle de l'utilisateur mis à jour: ${newRole}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle utilisateur:', error);
    throw error;
  }
}

/**
 * Récupère tous les utilisateurs avec un rôle spécifique
 */
export async function getUsersByRole(role: UserRole): Promise<UserData[]> {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where("role", "==", role));
    const querySnapshot = await getDocs(q);
    
    const users: UserData[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as UserData);
    });
    
    return users;
  } catch (error) {
    console.error(`Erreur lors de la récupération des utilisateurs avec le rôle ${role}:`, error);
    throw error;
  }
}

/**
 * Crée un utilisateur administrateur à partir d'un email
 */
export async function createAdminUser(email: string): Promise<void> {
  try {
    console.log(`Tentative de promotion de l'utilisateur ${email} au rang d'administrateur`);
    
    // Rechercher l'utilisateur par email
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error(`Aucun utilisateur trouvé avec l'email ${email}`);
      throw new Error(`Aucun utilisateur trouvé avec l'email ${email}. L'utilisateur doit d'abord s'inscrire.`);
    }
    
    // Prendre le premier utilisateur correspondant (normalement il n'y en a qu'un)
    const userDoc = querySnapshot.docs[0];
    const uid = userDoc.id;
    
    // Mettre à jour le rôle
    await updateUserRole(uid, 'admin');
    console.log(`L'utilisateur ${email} (${uid}) a été promu administrateur avec succès`);
  } catch (error) {
    console.error('Erreur lors de la création d\'un administrateur:', error);
    throw error;
  }
} 