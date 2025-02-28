import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { 
  createUserRecord, 
  updateUserLastLogin, 
  getUserData, 
  isAdmin as checkIsAdmin,
  UserData,
  UserRole,
  updateUserRole
} from '../firebase/userService';

// Définir le type pour le contexte
interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  signup: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  updateUserPhoto: (photoURL: string) => Promise<void>;
  setUserRole: (uid: string, role: UserRole) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

// Créer le contexte
const AuthContext = createContext<AuthContextType | null>(null);

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}

// Fournisseur du contexte
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Fonction pour rafraîchir les données utilisateur
  async function refreshUserData() {
    if (currentUser) {
      try {
        const data = await getUserData(currentUser.uid);
        setUserData(data);
        
        // Vérifier si l'utilisateur est admin
        const adminStatus = await checkIsAdmin(currentUser.uid);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Erreur lors du rafraîchissement des données utilisateur:', error);
      }
    } else {
      setUserData(null);
      setIsAdmin(false);
    }
  }

  // Fonction d'inscription
  async function signup(email: string, password: string): Promise<UserCredential> {
    try {
      console.log('AuthContext: Tentative d\'inscription avec:', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('AuthContext: Inscription réussie:', result);
      
      // Créer l'enregistrement utilisateur dans Firestore avec le rôle par défaut 'user'
      await createUserRecord(result.user);
      
      return result;
    } catch (error) {
      console.error('AuthContext: Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  // Fonction de connexion
  async function login(email: string, password: string): Promise<UserCredential> {
    try {
      console.log('AuthContext: Tentative de connexion avec:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthContext: Connexion réussie:', result);
      
      // Mettre à jour la date de dernière connexion
      if (result.user) {
        await updateUserLastLogin(result.user.uid);
      }
      
      return result;
    } catch (error) {
      console.error('AuthContext: Erreur lors de la connexion:', error);
      throw error;
    }
  }

  // Fonction de déconnexion
  async function logout(): Promise<void> {
    try {
      console.log('AuthContext: Tentative de déconnexion');
      await signOut(auth);
      console.log('AuthContext: Déconnexion réussie');
    } catch (error) {
      console.error('AuthContext: Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  // Fonction de réinitialisation du mot de passe
  async function resetPassword(email: string): Promise<void> {
    try {
      console.log('AuthContext: Tentative de réinitialisation du mot de passe pour:', email);
      await sendPasswordResetEmail(auth, email);
      console.log('AuthContext: Email de réinitialisation envoyé');
    } catch (error) {
      console.error('AuthContext: Erreur lors de la réinitialisation du mot de passe:', error);
      throw error;
    }
  }

  // Fonction de mise à jour du profil
  async function updateUserProfile(displayName: string): Promise<void> {
    // Vérifier si l'utilisateur est connecté
    if (!currentUser) {
      console.error('AuthContext: Tentative de mise à jour du profil sans utilisateur connecté');
      
      // Attendre que l'utilisateur soit connecté (max 3 secondes)
      let attempts = 0;
      const maxAttempts = 6;
      
      return new Promise((resolve, reject) => {
        const checkUser = setInterval(() => {
          attempts++;
          
          if (auth.currentUser) {
            clearInterval(checkUser);
            console.log('AuthContext: Utilisateur trouvé après attente, mise à jour du profil');
            
            updateProfile(auth.currentUser, { displayName })
              .then(() => {
                console.log('AuthContext: Profil mis à jour avec succès après attente');
                resolve();
              })
              .catch((error) => {
                console.error('AuthContext: Erreur lors de la mise à jour du profil après attente:', error);
                reject(error);
              });
          } else if (attempts >= maxAttempts) {
            clearInterval(checkUser);
            console.error('AuthContext: Impossible de trouver l\'utilisateur après plusieurs tentatives');
            reject("Aucun utilisateur connecté après plusieurs tentatives");
          }
        }, 500); // Vérifier toutes les 500ms
      });
    }
    
    try {
      console.log('AuthContext: Tentative de mise à jour du profil pour:', currentUser.email);
      await updateProfile(currentUser, { displayName });
      console.log('AuthContext: Profil mis à jour avec succès');
      
      // Mettre à jour également dans Firestore si l'utilisateur existe déjà
      const userDoc = await getUserData(currentUser.uid);
      if (userDoc) {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, { displayName });
      }
      
      // Rafraîchir les données utilisateur
      await refreshUserData();
    } catch (error) {
      console.error('AuthContext: Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  }
  
  // Fonction pour définir le rôle d'un utilisateur (réservée aux administrateurs)
  async function setUserRole(uid: string, role: UserRole): Promise<void> {
    if (!isAdmin) {
      console.error('AuthContext: Tentative de modification de rôle sans droits d\'administrateur');
      throw new Error('Accès non autorisé');
    }
    
    try {
      await updateUserRole(uid, role);
      console.log(`AuthContext: Rôle de l'utilisateur ${uid} mis à jour: ${role}`);
      
      // Si c'est l'utilisateur actuel, rafraîchir ses données
      if (currentUser && currentUser.uid === uid) {
        await refreshUserData();
      }
    } catch (error) {
      console.error('AuthContext: Erreur lors de la modification du rôle:', error);
      throw error;
    }
  }

  // Fonction de mise à jour de la photo de profil
  async function updateUserPhoto(photoURL: string): Promise<void> {
    // Vérifier si l'utilisateur est connecté
    if (!currentUser) {
      console.error('AuthContext: Tentative de mise à jour de la photo sans utilisateur connecté');
      throw new Error("Aucun utilisateur connecté");
    }
    
    try {
      console.log('AuthContext: Tentative de mise à jour de la photo pour:', currentUser.email);
      await updateProfile(currentUser, { photoURL });
      console.log('AuthContext: Photo de profil mise à jour avec succès');
      
      // Mettre à jour également dans Firestore si l'utilisateur existe déjà
      const userDoc = await getUserData(currentUser.uid);
      if (userDoc) {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, { photoURL });
      }
      
      // Rafraîchir les données utilisateur
      await refreshUserData();
    } catch (error) {
      console.error('AuthContext: Erreur lors de la mise à jour de la photo de profil:', error);
      throw error;
    }
  }

  // Effet pour surveiller l'état de l'authentification
  useEffect(() => {
    // Logger uniquement en développement si activé
    if (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === "true") {
      console.log('Surveillance de l\'état d\'authentification activée');
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Log minimal sans exposer les détails de l'utilisateur
      if (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === "true") {
        console.log('État d\'authentification changé:', user ? 'Utilisateur connecté' : 'Aucun utilisateur');
      }
      
      setCurrentUser(user);
      
      if (user) {
        // Récupérer les données utilisateur depuis Firestore
        try {
          const data = await getUserData(user.uid);
          
          // Si l'utilisateur n'existe pas encore dans Firestore, le créer
          if (!data) {
            await createUserRecord(user);
            await refreshUserData();
          } else {
            setUserData(data);
            
            // Vérifier si l'utilisateur est admin
            const adminStatus = await checkIsAdmin(user.uid);
            setIsAdmin(adminStatus);
            
            // Mettre à jour la date de dernière connexion
            await updateUserLastLogin(user.uid);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      } else {
        setUserData(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    isAdmin,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserPhoto,
    setUserRole,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 