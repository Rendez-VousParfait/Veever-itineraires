import { collection, addDoc, query, where, getDocs, Timestamp, doc, updateDoc, orderBy, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { User } from 'firebase/auth';
import { format } from 'date-fns';

export interface StatusHistoryEntry {
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  timestamp: Date;
  updatedBy: string;
  note?: string;
}

export interface InternalNote {
  id?: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  experienceId: string;
}

export interface CustomExperience {
  id?: string;
  userId: string;
  userEmail: string;
  createdAt: Date;
  itineraryType: 'hotel-restaurant-activity' | 'restaurant-activity';
  accommodation?: {
    types: string[];
    budget: string;
    style: string;
  };
  restaurant: {
    cuisineTypes: string[];
    ambiance: string;
    budget: string;
  };
  activity: {
    type: string;
    intensity: string;
    budget: string;
  };
  dateAndConstraints: {
    date: string;
    time: string;
    location: string;
  };
  personalization: {
    groupDynamics: string;
    vibe: string;
    specificRequests?: string;
  };
  preferences: {
    [key: string]: boolean;
  };
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  statusHistory?: StatusHistoryEntry[];
  internalNotes?: InternalNote[];
  updatedAt?: Date;
}

const CUSTOM_EXPERIENCES_COLLECTION = 'custom_experiences';
const INTERNAL_NOTES_COLLECTION = 'internal_notes';

export const customExperienceService = {
  async createCustomExperience(data: Omit<CustomExperience, 'id' | 'createdAt' | 'status'>) {
    try {
      const experienceData = {
        ...data,
        createdAt: Timestamp.fromDate(new Date()),
        status: 'pending' as const,
        statusHistory: [{
          status: 'pending',
          timestamp: new Date(),
          updatedBy: data.userEmail,
        }]
      };

      const docRef = await addDoc(
        collection(db, CUSTOM_EXPERIENCES_COLLECTION),
        experienceData
      );

      return {
        id: docRef.id,
        ...experienceData
      };
    } catch (error) {
      console.error('Erreur lors de la création de l\'expérience personnalisée:', error);
      throw error;
    }
  },

  async getUserExperiences(user: User) {
    try {
      const q = query(
        collection(db, CUSTOM_EXPERIENCES_COLLECTION),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as CustomExperience[];
    } catch (error) {
      console.error('Erreur lors de la récupération des expériences:', error);
      throw error;
    }
  },

  async getAllCustomExperiences() {
    try {
      const querySnapshot = await getDocs(collection(db, CUSTOM_EXPERIENCES_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as CustomExperience[];
    } catch (error) {
      console.error('Erreur lors de la récupération de toutes les expériences:', error);
      throw error;
    }
  },

  async updateExperienceStatus(experienceId: string, newStatus: 'pending' | 'processing' | 'completed' | 'cancelled', updatedBy: string, note?: string) {
    try {
      const experienceRef = doc(db, CUSTOM_EXPERIENCES_COLLECTION, experienceId);
      const experienceDoc = await getDoc(experienceRef);
      
      if (!experienceDoc.exists()) {
        throw new Error('Experience not found');
      }

      const currentData = experienceDoc.data();
      const statusHistory = currentData.statusHistory || [];
      
      const historyEntry: StatusHistoryEntry = {
        status: newStatus,
        timestamp: new Date(),
        updatedBy,
        ...(note && { note }),
      };

      await updateDoc(experienceRef, {
        status: newStatus,
        statusHistory: [...statusHistory, historyEntry],
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  },

  async getStatusHistory(experienceId: string): Promise<StatusHistoryEntry[]> {
    try {
      const experienceRef = doc(db, CUSTOM_EXPERIENCES_COLLECTION, experienceId);
      const experienceDoc = await experienceRef.get();
      return experienceDoc.data()?.statusHistory || [];
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      return [];
    }
  },

  async addInternalNote(experienceId: string, content: string, createdBy: string): Promise<void> {
    try {
      const experienceRef = doc(db, CUSTOM_EXPERIENCES_COLLECTION, experienceId);
      const notesCollectionRef = collection(experienceRef, 'notes');
      
      await addDoc(notesCollectionRef, {
        content,
        createdBy,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error);
      throw error;
    }
  },

  async getInternalNotes(experienceId: string): Promise<InternalNote[]> {
    try {
      const experienceRef = doc(db, CUSTOM_EXPERIENCES_COLLECTION, experienceId);
      const notesCollectionRef = collection(experienceRef, 'notes');
      const q = query(notesCollectionRef, orderBy('createdAt', 'desc'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as InternalNote[];
    } catch (error) {
      console.error('Erreur lors de la récupération des notes:', error);
      throw error;
    }
  },

  async exportToCSV(): Promise<string[][]> {
    try {
      const experiencesRef = collection(db, CUSTOM_EXPERIENCES_COLLECTION);
      const snapshot = await getDocs(experiencesRef);
      
      // En-têtes
      const headers = [
        'ID',
        'Date de création',
        'Statut',
        'Type',
        'Client',
        'Zone',
        'Budget Restaurant',
        'Budget Activité',
        'Budget Hébergement',
        'Dernière mise à jour',
      ];

      // Données
      const rows = snapshot.docs.map(doc => {
        const data = doc.data();
        return [
          doc.id,
          data.createdAt?.toDate().toLocaleDateString('fr-FR'),
          data.status,
          data.itineraryType === 'hotel-restaurant-activity' ? 'Week-end Complet' : 'Sortie Express',
          data.userEmail,
          data.dateAndConstraints?.location || '',
          data.restaurant?.budget || '',
          data.activity?.budget || '',
          data.accommodation?.budget || '',
          data.updatedAt?.toDate().toLocaleDateString('fr-FR'),
        ];
      });

      return [headers, ...rows];
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
      throw error;
    }
  },

  async getStatistics(): Promise<any> {
    try {
      const experiencesRef = collection(db, CUSTOM_EXPERIENCES_COLLECTION);
      const snapshot = await getDocs(experiencesRef);
      
      const now = new Date();
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      const stats = {
        total: 0,
        thisMonth: 0,
        conversionRate: 0,
        byStatus: {
          pending: 0,
          processing: 0,
          completed: 0,
        },
        byType: {
          weekend: 0,
          express: 0,
        },
      };

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate();
        
        // Total
        stats.total++;
        
        // Ce mois-ci
        if (createdAt >= monthAgo) {
          stats.thisMonth++;
        }
        
        // Par statut
        stats.byStatus[data.status]++;
        
        // Par type
        if (data.itineraryType === 'hotel-restaurant-activity') {
          stats.byType.weekend++;
        } else if (data.itineraryType === 'restaurant-activity') {
          stats.byType.express++;
        }
      });

      // Calcul du taux de conversion (complétés / total)
      stats.conversionRate = stats.byStatus.completed / stats.total;

      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  async updateExperience(experienceId: string, data: Omit<CustomExperience, 'id' | 'createdAt' | 'status' | 'statusHistory'>) {
    try {
      const experienceRef = doc(db, CUSTOM_EXPERIENCES_COLLECTION, experienceId);
      const experienceDoc = await getDoc(experienceRef);
      
      if (!experienceDoc.exists()) {
        throw new Error('Experience not found');
      }

      const currentData = experienceDoc.data();
      
      // Vérifier que l'expérience appartient bien à l'utilisateur
      if (currentData.userId !== data.userId) {
        throw new Error('Unauthorized');
      }

      // Vérifier que l'expérience est bien en statut "pending"
      if (currentData.status !== 'pending') {
        throw new Error('Only pending experiences can be modified');
      }

      await updateDoc(experienceRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      return {
        id: experienceId,
        ...data,
        createdAt: currentData.createdAt.toDate(),
        status: currentData.status,
        statusHistory: currentData.statusHistory,
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'expérience:', error);
      throw error;
    }
  },

  async updateExperienceWithItinerary(
    experienceId: string,
    itineraryId: string,
    adminEmail: string
  ): Promise<void> {
    try {
      const experienceRef = doc(db, CUSTOM_EXPERIENCES_COLLECTION, experienceId);
      const experienceDoc = await getDoc(experienceRef);
      
      if (!experienceDoc.exists()) {
        throw new Error('L\'expérience n\'existe pas');
      }
      
      const currentExperience = experienceDoc.data();
      const now = new Date();
      
      // Mettre à jour l'expérience avec l'ID de l'itinéraire et changer le statut
      await updateDoc(experienceRef, {
        itineraryId: itineraryId,
        status: 'completed',
        statusHistory: [
          ...(currentExperience.statusHistory || []),
          {
            status: 'completed',
            timestamp: serverTimestamp(),
            note: `Itinéraire créé (ID: ${itineraryId})`,
            updatedBy: adminEmail
          }
        ],
        updatedAt: serverTimestamp()
      });
      
      return;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'expérience avec l\'itinéraire:', error);
      throw error;
    }
  },
}; 