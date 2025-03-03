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
import { Itinerary } from '../types/itinerary';

// Collections Firestore
const ORDERS_COLLECTION = 'orders';
const CUSTOM_EXPERIENCES_COLLECTION = 'customExperiences';
const FAVORITES_COLLECTION = 'favorites';

// Collection Firestore pour les itinéraires
const ITINERARIES_COLLECTION = 'itineraries';

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

/**
 * Récupère tous les itinéraires
 */
export async function getAllItineraries(): Promise<Itinerary[]> {
  console.log('getAllItineraries - Début de la récupération');
  try {
    const itinerariesRef = collection(db, ITINERARIES_COLLECTION);
    console.log('getAllItineraries - Collection référencée:', ITINERARIES_COLLECTION);
    
    const querySnapshot = await getDocs(itinerariesRef);
    console.log('getAllItineraries - Nombre de documents:', querySnapshot.size);
    
    const itineraries: Itinerary[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('getAllItineraries - Document trouvé:', doc.id, data);
      
      // Convertir les Timestamps en Dates
      const displayStartDate = data.displayStartDate?.toDate() || null;
      const displayEndDate = data.displayEndDate?.toDate() || null;
      
      itineraries.push({
        ...data,
        id: parseInt(doc.id),
        displayStartDate,
        displayEndDate
      } as Itinerary);
    });
    
    console.log('getAllItineraries - Itinéraires récupérés:', itineraries);
    return itineraries;
  } catch (error) {
    console.error('getAllItineraries - Erreur:', error);
    throw error;
  }
}

/**
 * Récupère un itinéraire par son ID
 */
export const getItineraryById = async (itineraryId: string): Promise<Itinerary> => {
  try {
    const itineraryRef = doc(db, ITINERARIES_COLLECTION, itineraryId);
    const itineraryDoc = await getDoc(itineraryRef);
    
    if (!itineraryDoc.exists()) {
      throw new Error('Itinéraire non trouvé');
    }
    
    const itineraryData = itineraryDoc.data();
    return {
      id: itineraryDoc.id,
      ...itineraryData
    } as Itinerary;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'itinéraire:', error);
    throw error;
  }
};

/**
 * Crée un nouvel itinéraire
 */
export async function createItinerary(itinerary: Omit<Itinerary, 'id'>): Promise<number> {
  try {
    // Générer un nouvel ID
    const itinerariesRef = collection(db, ITINERARIES_COLLECTION);
    const querySnapshot = await getDocs(itinerariesRef);
    const existingIds = querySnapshot.docs.map(doc => parseInt(doc.id));
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    
    // Créer l'itinéraire avec le nouvel ID
    await setDoc(doc(db, ITINERARIES_COLLECTION, newId.toString()), {
      ...itinerary,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Itinéraire créé avec succès, ID:', newId);
    return newId;
  } catch (error) {
    console.error('Erreur lors de la création de l\'itinéraire:', error);
    throw error;
  }
}

/**
 * Met à jour un itinéraire existant
 */
export async function updateItinerary(itineraryId: number, itineraryData: Partial<Itinerary>): Promise<void> {
  try {
    const docRef = doc(db, ITINERARIES_COLLECTION, itineraryId.toString());
    
    // Vérifier si l'itinéraire existe
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('Itinéraire non trouvé');
    }
    
    // Mettre à jour l'itinéraire
    await updateDoc(docRef, {
      ...itineraryData,
      updatedAt: serverTimestamp()
    });
    console.log('Itinéraire mis à jour avec succès');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'itinéraire:', error);
    throw error;
  }
}

/**
 * Supprime un itinéraire
 */
export async function deleteItinerary(itineraryId: number): Promise<void> {
  try {
    const docRef = doc(db, ITINERARIES_COLLECTION, itineraryId.toString());
    
    // Vérifier si l'itinéraire existe
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('Itinéraire non trouvé');
    }
    
    // Supprimer l'itinéraire
    await deleteDoc(docRef);
    console.log('Itinéraire supprimé avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'itinéraire:', error);
    throw error;
  }
}

/**
 * Met à jour les paramètres d'affichage d'un itinéraire
 */
export async function updateItineraryDisplay(
  itineraryId: number, 
  displayOnHome: boolean,
  displayStartDate?: Date | null,
  displayEndDate?: Date | null
): Promise<void> {
  try {
    const docRef = doc(db, ITINERARIES_COLLECTION, itineraryId.toString());
    const updateData: any = {
      displayOnHome,
      updatedAt: serverTimestamp()
    };

    // Convertir les dates en Timestamps seulement si elles sont définies
    if (displayStartDate instanceof Date) {
      updateData.displayStartDate = Timestamp.fromDate(displayStartDate);
    }
    if (displayEndDate instanceof Date) {
      updateData.displayEndDate = Timestamp.fromDate(displayEndDate);
    }

    await updateDoc(docRef, updateData);
    console.log(`Paramètres d'affichage de l'itinéraire ${itineraryId} mis à jour:`, updateData);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres d\'affichage:', error);
    throw error;
  }
}

/**
 * Récupère les itinéraires à afficher sur la page d'accueil
 */
export async function getHomeItineraries(): Promise<Itinerary[]> {
  try {
    const itinerariesRef = collection(db, ITINERARIES_COLLECTION);
    const now = new Date();
    
    // Récupérer tous les itinéraires avec displayOnHome = true
    const q = query(
      itinerariesRef,
      where("displayOnHome", "==", true)
    );
    
    const querySnapshot = await getDocs(q);
    const itineraries: Itinerary[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Convertir les Timestamps en Dates si ils existent
      const displayStartDate = data.displayStartDate ? data.displayStartDate.toDate() : null;
      const displayEndDate = data.displayEndDate ? data.displayEndDate.toDate() : null;
      
      // Vérifier si l'itinéraire doit être affiché selon les dates
      const isWithinDateRange = (
        // Si pas de date de début OU si la date actuelle est après la date de début
        (!displayStartDate || now >= displayStartDate) &&
        // ET si pas de date de fin OU si la date actuelle est avant la date de fin
        (!displayEndDate || now <= displayEndDate)
      );
      
      // N'ajouter l'itinéraire que s'il est dans la plage de dates
      if (isWithinDateRange) {
        itineraries.push({
          ...data,
          id: parseInt(doc.id),
          displayStartDate,
          displayEndDate
        } as Itinerary);
      }
    });
    
    // Trier les itinéraires par type
    return itineraries.sort((a, b) => a.type.localeCompare(b.type));
  } catch (error) {
    console.error('Erreur lors de la récupération des itinéraires de la page d\'accueil:', error);
    throw error;
  }
}