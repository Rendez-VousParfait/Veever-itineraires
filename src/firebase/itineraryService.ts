import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  Timestamp,
  addDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './config';
import { Itinerary } from '../components/Itineraries';

// Collections Firestore
const ORDERS_COLLECTION = 'orders';
const CUSTOM_EXPERIENCES_COLLECTION = 'customExperiences';
const FAVORITES_COLLECTION = 'favorites';

// Interface pour les commandes d'itinéraires
export interface Order {
  id?: string;
  userId: string;
  itineraryId: number;
  itineraryTitle: string;
  itineraryImage: string;
  price: number;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  participants: number;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  createdAt: Timestamp | any;
  updatedAt: Timestamp | any;
}

// Interface pour les expériences sur mesure
export interface CustomExperience {
  id?: string;
  userId: string;
  title: string;
  description: string;
  preferences: {
    budget: string;
    duration: string;
    groupSize: string;
    activityTypes: string[];
    foodPreferences: string[];
    accommodationTypes: string[];
  };
  status: 'pending' | 'processing' | 'ready' | 'cancelled';
  createdAt: Timestamp | any;
  updatedAt: Timestamp | any;
  proposal?: {
    description: string;
    price: number;
    itinerary: any;
  };
}

// Interface pour les favoris
export interface Favorite {
  id?: string;
  userId: string;
  itineraryId: number;
  itineraryTitle: string;
  itineraryImage: string;
  itineraryDescription?: string;
  itineraryPrice: number;
  itineraryDuration?: string;
  itineraryGroupSize?: string;
  itineraryType?: string;
  itineraryTags?: string[];
  createdAt: Timestamp | any;
}

/**
 * Crée une nouvelle commande d'itinéraire
 */
export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const orderData: Order = {
      ...order,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);
    console.log('Commande créée avec succès, ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    throw error;
  }
}

/**
 * Récupère toutes les commandes d'un utilisateur
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef, 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Order;
      orders.push({
        ...data,
        id: doc.id
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    throw error;
  }
}

/**
 * Met à jour le statut d'une commande
 */
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp()
    });
    console.log(`Statut de la commande ${orderId} mis à jour: ${status}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de la commande:', error);
    throw error;
  }
}

/**
 * Crée une nouvelle demande d'expérience sur mesure
 */
export async function createCustomExperience(
  customExp: Omit<CustomExperience, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<string> {
  try {
    const customExpData: CustomExperience = {
      ...customExp,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, CUSTOM_EXPERIENCES_COLLECTION), customExpData);
    console.log('Demande d\'expérience sur mesure créée avec succès, ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création de la demande d\'expérience sur mesure:', error);
    throw error;
  }
}

/**
 * Récupère toutes les demandes d'expériences sur mesure d'un utilisateur
 */
export async function getUserCustomExperiences(userId: string): Promise<CustomExperience[]> {
  try {
    const customExpsRef = collection(db, CUSTOM_EXPERIENCES_COLLECTION);
    const q = query(
      customExpsRef, 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const customExps: CustomExperience[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as CustomExperience;
      customExps.push({
        ...data,
        id: doc.id
      });
    });
    
    return customExps;
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes d\'expériences sur mesure:', error);
    throw error;
  }
}

/**
 * Ajoute un itinéraire aux favoris
 */
export async function addToFavorites(
  userId: string, 
  itineraryId: number, 
  itineraryTitle: string, 
  itineraryImage: string,
  itineraryDescription?: string,
  itineraryPrice: number = 0,
  itineraryDuration?: string,
  itineraryGroupSize?: string,
  itineraryType?: string,
  itineraryTags?: string[]
): Promise<string> {
  try {
    // Vérifier si l'itinéraire est déjà dans les favoris
    const favoritesRef = collection(db, FAVORITES_COLLECTION);
    const q = query(
      favoritesRef,
      where("userId", "==", userId),
      where("itineraryId", "==", itineraryId)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Si l'itinéraire est déjà dans les favoris, retourner son ID
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      console.log('Itinéraire déjà dans les favoris, ID:', docId);
      return docId;
    }
    
    // Sinon, ajouter l'itinéraire aux favoris
    const favoriteData: Favorite = {
      userId,
      itineraryId,
      itineraryTitle,
      itineraryImage,
      itineraryDescription,
      itineraryPrice,
      itineraryDuration,
      itineraryGroupSize,
      itineraryType,
      itineraryTags,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, FAVORITES_COLLECTION), favoriteData);
    console.log('Itinéraire ajouté aux favoris avec succès, ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de l\'ajout aux favoris:', error);
    throw error;
  }
}

/**
 * Supprime un itinéraire des favoris
 */
export async function removeFromFavorites(userId: string, itineraryId: number): Promise<void> {
  try {
    const favoritesRef = collection(db, FAVORITES_COLLECTION);
    const q = query(
      favoritesRef,
      where("userId", "==", userId),
      where("itineraryId", "==", itineraryId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('Itinéraire non trouvé dans les favoris');
      return;
    }
    
    // Supprimer le document
    const docId = querySnapshot.docs[0].id;
    await deleteDoc(doc(db, FAVORITES_COLLECTION, docId));
    console.log('Itinéraire supprimé des favoris avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression des favoris:', error);
    throw error;
  }
}

/**
 * Récupère tous les favoris d'un utilisateur
 */
export async function getUserFavorites(userId: string): Promise<Favorite[]> {
  try {
    const favoritesRef = collection(db, FAVORITES_COLLECTION);
    const q = query(
      favoritesRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const favorites: Favorite[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Favorite;
      favorites.push({
        ...data,
        id: doc.id
      });
    });
    
    return favorites;
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    throw error;
  }
}

/**
 * Vérifie si un itinéraire est dans les favoris d'un utilisateur
 */
export async function isItineraryFavorite(userId: string, itineraryId: number): Promise<boolean> {
  try {
    if (!userId) return false;
    
    const favoritesRef = collection(db, FAVORITES_COLLECTION);
    const q = query(
      favoritesRef,
      where("userId", "==", userId),
      where("itineraryId", "==", itineraryId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Erreur lors de la vérification des favoris:', error);
    return false;
  }
}

/**
 * Récupère les itinéraires favoris les plus récents d'un utilisateur
 */
export async function getRecentFavorites(userId: string, limitCount: number = 5): Promise<Favorite[]> {
  try {
    const favoritesRef = collection(db, FAVORITES_COLLECTION);
    const q = query(
      favoritesRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const favorites: Favorite[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Favorite;
      favorites.push({
        ...data,
        id: doc.id
      });
    });
    
    return favorites;
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris récents:', error);
    throw error;
  }
} 