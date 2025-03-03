import { ReactNode } from 'react';

export type ItineraryType = 'couples' | 'groups';

export interface ItineraryStep {
  type: 'hotel' | 'restaurant' | 'activity';
  name: string;
  description: string;
  details: {
    title: string;
    description: string;
    images: string[];
    adresse: string;
    prix: string;
    duree?: string;
    equipements?: string[];
    niveau?: string;
    horaires?: string;
    menu?: string[];
    avis: {
      utilisateur: string;
      commentaire: string;
      note: number;
    }[];
  };
}

export interface Itinerary {
  id: number;
  type: ItineraryType;
  title: string;
  description: string;
  image: string;
  steps: ItineraryStep[];
  price: number;
  duration: string;
  groupSize: string;
  rating?: number;
  tags: string[];
  date: string;
  displayOnHome?: boolean;
  displayStartDate?: Date | null;
  displayEndDate?: Date | null;
} 