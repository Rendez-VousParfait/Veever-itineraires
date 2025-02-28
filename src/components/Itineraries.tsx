import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Stack,
  IconButton,
  Rating,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Place, 
  AccessTime, 
  Groups, 
  Euro, 
  Hotel, 
  Restaurant, 
  Spa, 
  Apartment, 
  SportsEsports, 
  Museum, 
  SportsTennis, 
  Favorite, 
  FavoriteBorder, 
  LocationOn,
  CalendarToday,
  LocalOffer
} from '@mui/icons-material';
import ItineraryModal from './ItineraryModal';
import PrestationModal, { Prestation } from './PrestationModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addToFavorites, removeFromFavorites, isItineraryFavorite } from '../firebase/itineraryService';

export type ItineraryType = 'couples' | 'groups';

export interface ItineraryStep {
  type: 'hotel' | 'restaurant' | 'activity';
  name: string;
  description: string;
  icon: React.ReactNode;
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
  images?: string[];
  tags: string[];
  date: string;
}

const itineraries: Itinerary[] = [
  {
    id: 1,
    type: 'couples',
    title: 'Escapade Romantique',
    description: 'Une journée magique en amoureux.',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1200&auto=format&fit=crop',
    steps: [
      {
        type: 'hotel',
        name: 'Hôtel Le Royal',
        description: 'Suite avec vue panoramique',
        icon: <Hotel />,
        details: {
          title: 'Suite Deluxe Vue Panoramique',
          description: 'Profitez d\'une vue imprenable sur la ville depuis votre suite luxueuse de 45m². La chambre dispose d\'un lit king-size, d\'une salle de bain en marbre avec baignoire et douche à l\'italienne, et d\'un salon privé.',
          images: [
            'https://images.unsplash.com/photo-1618773928121-c33d57733427?q=80&w=1200',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
            'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200',
          ],
          adresse: '15 Place Bellecour, 69002 Lyon',
          prix: '350€ / nuit',
          equipements: [
            'Lit King-size',
            'Climatisation',
            'Wi-Fi gratuit',
            'Mini-bar',
            'Coffre-fort',
            'Room service 24/7',
            'Baignoire balnéo',
            'Vue panoramique'
          ],
          avis: [
            {
              utilisateur: 'Sophie M.',
              commentaire: 'Vue exceptionnelle et service impeccable. Le petit-déjeuner en chambre était délicieux.',
              note: 5
            },
            {
              utilisateur: 'Pierre L.',
              commentaire: 'Chambre spacieuse et très confortable. Parfait pour un séjour romantique.',
              note: 4.5
            }
          ]
        }
      },
      {
        type: 'restaurant',
        name: 'La Table d\'Or',
        description: 'Restaurant gastronomique étoilé',
        icon: <Restaurant />,
        details: {
          title: 'La Table d\'Or - Gastronomie Étoilée',
          description: 'Restaurant gastronomique 2 étoiles Michelin offrant une cuisine créative et raffinée dans un cadre élégant avec vue sur la ville.',
          images: [
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200',
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200',
            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200',
            'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200',
          ],
          adresse: '20 Quai Gailleton, 69002 Lyon',
          prix: 'Menu dégustation à partir de 150€/personne',
          horaires: 'Du mardi au samedi, 19h30-22h30',
          menu: [
            'Amuse-bouches du chef',
            'Foie gras de canard mi-cuit',
            'Saint-Jacques snackées',
            'Filet de bœuf Rossini',
            'Chariot de fromages affinés',
            'Soufflé au chocolat grand cru'
          ],
          avis: [
            {
              utilisateur: 'Marie C.',
              commentaire: 'Une expérience gastronomique inoubliable. Chaque plat est une œuvre d\'art.',
              note: 5
            },
            {
              utilisateur: 'Jean-Paul B.',
              commentaire: 'Service attentionné et carte des vins exceptionnelle.',
              note: 5
            }
          ]
        }
      },
      {
        type: 'activity',
        name: 'Spa Privé',
        description: 'Massage en duo et champagne',
        icon: <Spa />,
        details: {
          title: 'Spa Privé - Moment de détente en duo',
          description: 'Profitez d\'un moment de détente absolue avec notre forfait spa privatif incluant massage en duo, accès au jacuzzi et coupe de champagne.',
          images: [
            'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200',
            'https://images.unsplash.com/photo-1531112357080-a5eb0f6c0744?q=80&w=1200',
            'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200',
            'https://images.unsplash.com/photo-1482275548304-a58859dc31b7?q=80&w=1200',
          ],
          adresse: '25 Rue du Spa, 69002 Lyon',
          prix: '220€ pour 2 personnes',
          duree: '2h30',
          equipements: [
            'Peignoirs et chaussons fournis',
            'Produits de soin haut de gamme',
            'Jacuzzi privatif',
            'Espace détente',
            'Champagne et mignardises'
          ],
          avis: [
            {
              utilisateur: 'Emma R.',
              commentaire: 'Moment magique en couple. Les masseurs sont très professionnels.',
              note: 5
            },
            {
              utilisateur: 'Thomas D.',
              commentaire: 'Cadre sublime et prestations haut de gamme. À refaire !',
              note: 4.5
            }
          ]
        }
      }
    ],
    price: 199,
    duration: '24h',
    groupSize: '2 personnes',
    tags: ['Couples', 'Romantique', 'Soirée'],
    date: '22 mars 2025'
  },
  {
    id: 2,
    type: 'couples',
    title: 'Week-end Cocooning',
    description: 'Détente et bien-être pour un moment à deux inoubliable.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    steps: [
      {
        type: 'hotel',
        name: 'Spa Resort & Hotel',
        description: 'Chambre Deluxe avec jacuzzi privatif',
        icon: <Hotel />,
        details: {
          title: 'Chambre Deluxe Spa Resort',
          description: 'Plongez dans un cocon de douceur avec notre chambre Deluxe équipée d\'un jacuzzi privatif. Un espace de 35m² pensé pour votre confort absolu.',
          images: [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
            'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200',
            'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?q=80&w=1200',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200',
          ],
          adresse: '45 Avenue du Bien-être, 69006 Lyon',
          prix: '280€ / nuit',
          equipements: [
            'Jacuzzi privatif',
            'Lit Queen-size',
            'Room service 24/7',
            'Accès spa inclus',
            'Peignoirs et chaussons',
            'Machine Nespresso',
            'Smart TV',
            'Minibar premium'
          ],
          avis: [
            {
              utilisateur: 'Julie R.',
              commentaire: 'Le jacuzzi privatif est fantastique ! Parfait pour un week-end en amoureux.',
              note: 5
            },
            {
              utilisateur: 'Marc D.',
              commentaire: 'Chambre spacieuse et très bien équipée. Le petit déjeuner en chambre était excellent.',
              note: 4.5
            }
          ]
        }
      },
      {
        type: 'activity',
        name: 'Massage Duo Signature',
        description: 'Rituel spa de 2h avec accès aux installations',
        icon: <Spa />,
        details: {
          title: 'Rituel Signature en Duo',
          description: 'Un voyage sensoriel de 2h comprenant un massage relaxant aux huiles essentielles, suivi d\'un accès aux installations spa (sauna, hammam, piscine).',
          images: [
            'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1200',
            'https://images.unsplash.com/photo-1613796537803-99baa1446b81?q=80&w=1200',
            'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?q=80&w=1200',
            'https://images.unsplash.com/photo-1629196914168-3a2652305f60?q=80&w=1200',
          ],
          adresse: '45 Avenue du Bien-être, 69006 Lyon',
          prix: '190€ pour 2 personnes',
          duree: '2h de soin + 2h d\'accès spa',
          equipements: [
            'Massage personnalisé',
            'Huiles essentielles bio',
            'Accès spa complet',
            'Tisanerie détox',
            'Espace détente'
          ],
          avis: [
            {
              utilisateur: 'Sarah B.',
              commentaire: 'Une expérience exceptionnelle, les masseurs sont très professionnels.',
              note: 5
            },
            {
              utilisateur: 'Laurent M.',
              commentaire: 'Moment de détente parfait, installations haut de gamme.',
              note: 5
            }
          ]
        }
      },
      {
        type: 'restaurant',
        name: 'Le Jardin Secret',
        description: 'Dîner aux chandelles dans un cadre intimiste',
        icon: <Restaurant />,
        details: {
          title: 'Le Jardin Secret - Restaurant Intimiste',
          description: 'Une parenthèse gastronomique dans un écrin de verdure, où la cuisine française contemporaine se marie aux saveurs du monde.',
          images: [
            '/images/restaurants/jardin-secret/salle.jpg',
            '/images/restaurants/jardin-secret/terrasse.jpg',
            '/images/restaurants/jardin-secret/plat1.jpg',
            '/images/restaurants/jardin-secret/dessert.jpg',
          ],
          adresse: '12 Rue des Jardins, 69006 Lyon',
          prix: 'Menu découverte à 85€/personne',
          horaires: 'Du mercredi au dimanche, 19h00-22h30',
          menu: [
            'Amuse-bouche du moment',
            'Carpaccio de Saint-Jacques aux agrumes',
            'Filet de bœuf aux morilles',
            'Assiette de fromages affinés',
            'Dessert signature au chocolat'
          ],
          avis: [
            {
              utilisateur: 'Claire P.',
              commentaire: 'Cadre magnifique et cuisine raffinée. Service très attentionné.',
              note: 5
            },
            {
              utilisateur: 'Antoine G.',
              commentaire: 'Une soirée parfaite, le menu découverte est une vraie réussite.',
              note: 4.5
            }
          ]
        }
      }
    ],
    price: 279,
    duration: '24h',
    groupSize: '2 personnes',
    tags: ['Couples', 'Week-end', 'Bien-être'],
    date: '22-23 mars 2025'
  },
  {
    id: 3,
    type: 'groups',
    title: 'Aventure Urbaine',
    description: 'Une journée de découvertes et de défis entre amis.',
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=1200&auto=format&fit=crop',
    steps: [
      {
        type: 'hotel',
        name: 'Boutique Hôtel des Arts',
        description: 'Junior Suite avec terrasse privée',
        icon: <Hotel />,
        details: {
          title: 'Junior Suite - Boutique Hôtel des Arts',
          description: 'Séjournez dans notre Junior Suite de 40m² avec terrasse privée donnant sur la vieille ville. Un espace élégant où art contemporain et confort moderne se rencontrent.',
          images: [
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200',
            'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?q=80&w=1200',
            'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1200',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200',
          ],
          adresse: '8 Rue des Artistes, 69001 Lyon',
          prix: '320€ / nuit',
          equipements: [
            'Terrasse privée 15m²',
            'Lit King-size',
            'Œuvres d\'art originales',
            'Station d\'accueil iPad',
            'Machine à café Nespresso',
            'Minibar gratuit',
            'Room service 24/7'
          ],
          avis: [
            {
              utilisateur: 'Philippe M.',
              commentaire: 'Décoration sublime et vue imprenable depuis la terrasse. Un vrai coup de cœur !',
              note: 5
            },
            {
              utilisateur: 'Isabelle D.',
              commentaire: 'Le petit-déjeuner sur la terrasse était magique. Personnel aux petits soins.',
              note: 4.5
            }
          ]
        }
      },
      {
        type: 'activity',
        name: 'Visite Privée Musée',
        description: 'Guide personnel et coupe de champagne',
        icon: <Museum />,
        details: {
          title: 'Visite Privée du Musée des Beaux-Arts',
          description: 'Découvrez les trésors du musée en compagnie d\'un guide expert. Profitez d\'un accès privilégié avant l\'ouverture au public, suivi d\'une dégustation de champagne.',
          images: [
            'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1200',
            'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1200',
            'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200',
            'https://images.unsplash.com/photo-1482275548304-a58859dc31b7?q=80&w=1200',
          ],
          adresse: '20 Place des Terreaux, 69001 Lyon',
          prix: '75€ par personne',
          duree: '2h30',
          equipements: [
            'Guide expert dédié',
            'Audioguide multilingue',
            'Coupe de champagne',
            'Catalogue d\'exposition',
            'Accès prioritaire'
          ],
          avis: [
            {
              utilisateur: 'François R.',
              commentaire: 'Une visite passionnante ! Notre guide était intarissable sur l\'histoire de l\'art.',
              note: 5
            },
            {
              utilisateur: 'Marie-Anne P.',
              commentaire: 'Moment privilégié avant l\'ouverture, très appréciable pour les photos.',
              note: 5
            }
          ]
        }
      },
      {
        type: 'restaurant',
        name: 'L\'Atelier Gourmand',
        description: 'Cours de cuisine en duo avec le chef',
        icon: <Restaurant />,
        details: {
          title: 'L\'Atelier Gourmand - Expérience Culinaire',
          description: 'Participez à un cours de cuisine unique avec notre chef étoilé, suivi d\'un repas dégustation des plats préparés accompagnés des vins sélectionnés par notre sommelier.',
          images: [
            'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200',
            'https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?q=80&w=1200',
            'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=1200',
            'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200',
          ],
          adresse: '15 Rue de la Gastronomie, 69002 Lyon',
          prix: '180€ par personne',
          duree: '4h (cours + déjeuner)',
          horaires: 'Sessions à 10h et 16h',
          equipements: [
            'Tablier offert',
            'Fiches recettes',
            'Dégustation de vins',
            'Certificat de participation'
          ],
          menu: [
            'Mise en bouche surprise',
            'Entrée au choix parmi 3',
            'Plat signature du chef',
            'Dessert à réaliser soi-même'
          ],
          avis: [
            {
              utilisateur: 'Julien B.',
              commentaire: 'Une expérience unique ! Le chef partage ses secrets avec passion.',
              note: 5
            },
            {
              utilisateur: 'Sophie V.',
              commentaire: 'Excellent moment d\'apprentissage dans la bonne humeur.',
              note: 4.5
            }
          ]
        }
      }
    ],
    price: 149,
    duration: '24h',
    groupSize: '4 à 8 personnes',
    tags: ['Groupes', 'Culture', 'Aventure'],
    date: '22 mars 2025'
  },
  {
    id: 4,
    type: 'groups',
    title: 'Culture & Gastronomie',
    description: 'Une expérience culturelle et gustative unique.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
    steps: [
      {
        type: 'hotel',
        name: 'Boutique Hôtel des Arts',
        description: 'Junior Suite avec terrasse privée',
        icon: <Hotel />,
        details: {
          title: 'Junior Suite - Boutique Hôtel des Arts',
          description: 'Séjournez dans notre Junior Suite de 40m² avec terrasse privée donnant sur la vieille ville. Un espace élégant où art contemporain et confort moderne se rencontrent.',
          images: [
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200',
            'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?q=80&w=1200',
            'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1200',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200',
          ],
          adresse: '8 Rue des Artistes, 69001 Lyon',
          prix: '320€ / nuit',
          equipements: [
            'Terrasse privée 15m²',
            'Lit King-size',
            'Œuvres d\'art originales',
            'Station d\'accueil iPad',
            'Machine à café Nespresso',
            'Minibar gratuit',
            'Room service 24/7'
          ],
          avis: [
            {
              utilisateur: 'Philippe M.',
              commentaire: 'Décoration sublime et vue imprenable depuis la terrasse. Un vrai coup de cœur !',
              note: 5
            },
            {
              utilisateur: 'Isabelle D.',
              commentaire: 'Le petit-déjeuner sur la terrasse était magique. Personnel aux petits soins.',
              note: 4.5
            }
          ]
        }
      },
      {
        type: 'activity',
        name: 'Visite Privée Musée',
        description: 'Guide personnel et coupe de champagne',
        icon: <Museum />,
        details: {
          title: 'Visite Privée du Musée des Beaux-Arts',
          description: 'Découvrez les trésors du musée en compagnie d\'un guide expert. Profitez d\'un accès privilégié avant l\'ouverture au public, suivi d\'une dégustation de champagne.',
          images: [
            'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1200',
            'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1200',
            'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200',
            'https://images.unsplash.com/photo-1482275548304-a58859dc31b7?q=80&w=1200',
          ],
          adresse: '20 Place des Terreaux, 69001 Lyon',
          prix: '75€ par personne',
          duree: '2h30',
          equipements: [
            'Guide expert dédié',
            'Audioguide multilingue',
            'Coupe de champagne',
            'Catalogue d\'exposition',
            'Accès prioritaire'
          ],
          avis: [
            {
              utilisateur: 'François R.',
              commentaire: 'Une visite passionnante ! Notre guide était intarissable sur l\'histoire de l\'art.',
              note: 5
            },
            {
              utilisateur: 'Marie-Anne P.',
              commentaire: 'Moment privilégié avant l\'ouverture, très appréciable pour les photos.',
              note: 5
            }
          ]
        }
      },
      {
        type: 'restaurant',
        name: 'L\'Atelier Gourmand',
        description: 'Cours de cuisine en duo avec le chef',
        icon: <Restaurant />,
        details: {
          title: 'L\'Atelier Gourmand - Expérience Culinaire',
          description: 'Participez à un cours de cuisine unique avec notre chef étoilé, suivi d\'un repas dégustation des plats préparés accompagnés des vins sélectionnés par notre sommelier.',
          images: [
            'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200',
            'https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?q=80&w=1200',
            'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=1200',
            'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200',
          ],
          adresse: '15 Rue de la Gastronomie, 69002 Lyon',
          prix: '180€ par personne',
          duree: '4h (cours + déjeuner)',
          horaires: 'Sessions à 10h et 16h',
          equipements: [
            'Tablier offert',
            'Fiches recettes',
            'Dégustation de vins',
            'Certificat de participation'
          ],
          menu: [
            'Mise en bouche surprise',
            'Entrée au choix parmi 3',
            'Plat signature du chef',
            'Dessert à réaliser soi-même'
          ],
          avis: [
            {
              utilisateur: 'Julien B.',
              commentaire: 'Une expérience unique ! Le chef partage ses secrets avec passion.',
              note: 5
            },
            {
              utilisateur: 'Sophie V.',
              commentaire: 'Excellent moment d\'apprentissage dans la bonne humeur.',
              note: 4.5
            }
          ]
        }
      }
    ],
    price: 199,
    duration: '24h',
    groupSize: '4 à 8 personnes',
    tags: ['Groupes', 'Culture', 'Gastronomie'],
    date: '22-23 mars 2025'
  }
];

const cardVariants = {
  hover: {
    y: -12,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const Itineraries: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ItineraryType | 'all'>('all');
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedStep, setSelectedStep] = useState<ItineraryStep | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<{[key: number]: string}>({});
  const navigate = useNavigate();
  const [faviconPosition, setFaviconPosition] = useState({ x: -500, y: -600 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filteredItineraries = selectedType === 'all' 
    ? itineraries 
    : itineraries.filter(item => item.type === selectedType);

  const handleBooking = (id: number) => {
    const itinerary = itineraries.find(item => item.id === id);
    if (itinerary) {
      setSelectedItinerary(itinerary);
    }
  };

  // Charger les favoris depuis Firebase au chargement du composant
  useEffect(() => {
    const loadFavorites = async () => {
      if (currentUser) {
        setIsLoading(true);
        try {
          // Vérifier chaque itinéraire
          const favIds: number[] = [];
          
          for (const itinerary of itineraries) {
            const isFavorite = await isItineraryFavorite(currentUser.uid, itinerary.id);
            if (isFavorite) {
              favIds.push(itinerary.id);
            }
          }
          
          setFavorites(favIds);
        } catch (error) {
          console.error('Erreur lors du chargement des favoris:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Si l'utilisateur n'est pas connecté, charger depuis localStorage
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      }
    };
    
    loadFavorites();
  }, [currentUser]);

  // Gérer l'ajout/suppression des favoris
  const handleToggleFavorite = async (itineraryId: number) => {
    try {
      if (!currentUser) {
        // Si l'utilisateur n'est pas connecté, utiliser localStorage
        const newFavorites = favorites.includes(itineraryId)
          ? favorites.filter(id => id !== itineraryId)
          : [...favorites, itineraryId];
        
        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return;
      }
      
      const itinerary = itineraries.find(item => item.id === itineraryId);
      if (!itinerary) return;
      
      if (favorites.includes(itineraryId)) {
        // Supprimer des favoris
        await removeFromFavorites(currentUser.uid, itineraryId);
        setFavorites(favorites.filter(id => id !== itineraryId));
        
        // Jouer un son de suppression
        const audio = new Audio('/sounds/skip.mp3');
        audio.volume = 0.5;
        audio.play();
      } else {
        // Ajouter aux favoris
        await addToFavorites(
          currentUser.uid, 
          itineraryId, 
          itinerary.title, 
          itinerary.image,
          itinerary.description,
          itinerary.price,
          itinerary.duration,
          itinerary.groupSize,
          itinerary.type,
          itinerary.tags
        );
        setFavorites([...favorites, itineraryId]);
        
        // Jouer un son d'ajout
        const audio = new Audio('/sounds/like.mp3');
        audio.volume = 0.5;
        audio.play();
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error);
    }
  };

  // Calculer le temps restant jusqu'au 15 mars à 00:00:00
  const calculateTimeRemaining = useCallback(() => {
    const newTimeRemaining: {[key: number]: string} = {};
    
    // Date cible: 15 mars 2025 à 00:00:00
    const targetDate = new Date(2025, 2, 15, 0, 0, 0); // Mois commence à 0, donc 2 = mars
    const now = new Date();
    
    // Calculer la différence en millisecondes
    const difference = targetDate.getTime() - now.getTime();
    
    // Si la date cible est dépassée
    if (difference <= 0) {
      itineraries.forEach(itinerary => {
        newTimeRemaining[itinerary.id] = "Réservations terminées";
      });
    } else {
      // Calculer jours, heures, minutes, secondes
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      // Formater avec des zéros pour les valeurs à un chiffre
      const formattedHours = hours < 10 ? `0${hours}` : hours;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      
      // Appliquer le même compte à rebours pour tous les itinéraires
      itineraries.forEach(itinerary => {
        newTimeRemaining[itinerary.id] = `${days}j ${formattedHours}h:${formattedMinutes}m:${formattedSeconds}s`;
      });
    }
    
    setTimeRemaining(newTimeRemaining);
  }, []);

  // Mettre à jour le décompte chaque seconde
  useEffect(() => {
    // Calculer le temps restant immédiatement au chargement
    calculateTimeRemaining();
    
    // Mettre à jour le temps restant toutes les secondes
    const timer = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, [calculateTimeRemaining]);

  // Ajuster la position du favicon en fonction du contenu
  useEffect(() => {
    // Attendre que le rendu soit terminé
    const timer = setTimeout(() => {
      if (sectionRef.current) {
        // Calculer la position optimale en fonction de la hauteur du contenu
        const sectionHeight = sectionRef.current.clientHeight;
        const newY = -600; // Position Y de base
        
        // Ajuster la position Y si nécessaire en fonction du type sélectionné
        setFaviconPosition({
          x: -500, // Position X fixe
          y: newY   // Position Y calculée
        });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [selectedType, filteredItineraries]);

  return (
    <Box
      component="section"
      id="itineraires"
      ref={sectionRef}
      sx={{
        py: { xs: 8, md: 12 },
        background: '#10192c',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Favicon E en position absolue par rapport à la section */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <Box
          component="img"
          src="/images/FAVICON E.png"
          alt="Veever Favicon E"
          sx={{
            position: 'absolute',
            top: '0px', // Position fixe en pixels depuis le haut de la section
            left: '-150px', // Position fixe en pixels depuis la gauche de la section
            width: { xs: '600px', md: '900px', lg: '1200px' },
            height: 'auto',
            filter: 'drop-shadow(0 0 15px rgba(247, 74, 161, 0.7))',
            transform: 'rotate(-5deg)',
            maxWidth: '90vw',
            opacity: 1,
            mixBlendMode: 'lighten',
          }}
        />
      </Box>

      <Container 
        maxWidth={false}
        sx={{ 
          px: { xs: 2, sm: 4, md: 8, lg: 12 },
          maxWidth: '2000px',
          mx: 'auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 6,
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 600,
              background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Découvrez nos itinéraires
          </Typography>

          {/* Compte à rebours global placé au-dessus des filtres */}
          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              mb: 4,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 2,
              bgcolor: 'rgba(245, 158, 63, 0.15)',
              borderRadius: '16px',
              border: '2px solid rgba(245, 158, 63, 0.3)',
              minWidth: '300px',
              maxWidth: '400px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            }}>
              <AccessTime sx={{ 
                color: '#F74AA1',
                animation: 'spin 2s infinite linear',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
                fontSize: '2rem',
                mr: 1
              }} />
              <Box sx={{ 
                color: '#F74AA1', 
                fontWeight: 'bold',
                width: '100%'
              }}>
                <Typography variant="body1" component="div" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                  Fin des réservations:
                </Typography>
                {Object.keys(timeRemaining).length > 0 && !timeRemaining[1]?.includes("terminées") ? (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    mt: 0.5,
                    fontFamily: 'monospace',
                  }}>
                    {/* Jours */}
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mr: 1
                    }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 'bold',
                          minWidth: '2.5rem',
                          textAlign: 'center',
                          background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                          borderRadius: '4px',
                          px: 1,
                          py: 0.5,
                          color: 'white',
                        }}
                      >
                        {timeRemaining[1]?.split(' ')[0].replace('j', '')}
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 0.5 }}>jours</Typography>
                    </Box>
                    
                    {/* Heures */}
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mx: 1,
                      position: 'relative'
                    }}>
                      <Box
                        key={`hour-${timeRemaining[1]?.split(' ')[1]?.split(':')[0]?.replace('h', '')}`}
                        component={motion.div}
                        initial={{ y: -5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        sx={{ 
                          fontWeight: 'bold',
                          minWidth: '2.5rem',
                          textAlign: 'center',
                          background: 'linear-gradient(to bottom, rgba(245, 158, 63, 0.5), rgba(245, 158, 63, 0.2))',
                          borderRadius: '4px',
                          px: 1,
                          py: 0.5,
                          fontSize: '1.5rem',
                          boxShadow: '0 0 5px rgba(245, 158, 63, 0.4)',
                          letterSpacing: '1px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        {timeRemaining[1]?.split(' ')[1]?.split(':')[0]?.replace('h', '') || '00'}
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          mt: 0.5,
                          fontWeight: 'bold',
                          color: '#F59E3F'
                        }}
                      >
                        h
                      </Typography>
                    </Box>
                    
                    {/* Minutes */}
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mx: 1,
                      position: 'relative'
                    }}>
                      <Box
                        key={`min-${timeRemaining[1]?.split(':')[1]?.replace('m', '')}`}
                        component={motion.div}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                        sx={{ 
                          fontWeight: 'bold',
                          minWidth: '2.5rem',
                          textAlign: 'center',
                          background: 'linear-gradient(to bottom, rgba(245, 158, 63, 0.6), rgba(245, 158, 63, 0.3))',
                          borderRadius: '4px',
                          px: 1,
                          py: 0.5,
                          fontSize: '1.5rem',
                          boxShadow: '0 0 8px rgba(245, 158, 63, 0.5)',
                          letterSpacing: '1px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        {timeRemaining[1]?.split(':')[1]?.replace('m', '') || '00'}
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          mt: 0.5,
                          fontWeight: 'bold',
                          color: '#F59E3F'
                        }}
                      >
                        min
                      </Typography>
                    </Box>
                    
                    {/* Secondes */}
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      ml: 1,
                      position: 'relative'
                    }}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`sec-${timeRemaining[1]?.split(':')[2]?.replace('s', '')}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            boxShadow: '0 0 15px rgba(247, 74, 161, 0.7)'
                          }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Box
                            sx={{ 
                              fontWeight: 'bold',
                              minWidth: '2.5rem',
                              height: '2.5rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textAlign: 'center',
                              background: 'linear-gradient(to bottom, rgba(247, 74, 161, 0.8), rgba(247, 74, 161, 0.5))',
                              borderRadius: '4px',
                              fontSize: '1.5rem',
                              color: 'white',
                              boxShadow: '0 0 15px rgba(247, 74, 161, 0.7)',
                              letterSpacing: '1px',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            {timeRemaining[1]?.split(':')[2]?.replace('s', '') || '00'}
                          </Box>
                        </motion.div>
                      </AnimatePresence>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          mt: 0.5, 
                          fontWeight: 'bold',
                          color: '#F74AA1'
                        }}
                      >
                        sec
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body1" component="span" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {timeRemaining[1] || 'Calcul en cours...'}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 6,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems="center"
              sx={{
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <Stack 
                direction="row" 
                spacing={2}
                sx={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '50px',
                  p: 1,
                  border: '1px solid rgba(255, 214, 198, 0.3)',
                }}
              >
                <ToggleButtonGroup
                  value={selectedType}
                  exclusive
                  onChange={(_, value) => value && setSelectedType(value)}
                  aria-label="type d'itinéraire"
                  sx={{ 
                    '& .MuiToggleButtonGroup-grouped': {
                      border: 0,
                      borderRadius: '50px !important',
                      mx: 0.5,
                      px: 3,
                      py: 1,
                      '&.Mui-selected': {
                        background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                        color: 'white',
                      },
                      '&:not(.Mui-selected)': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ToggleButton value="all" aria-label="tous">
                    Tous
                  </ToggleButton>
                  <ToggleButton value="couples" aria-label="couples">
                    Couples
                  </ToggleButton>
                  <ToggleButton value="groups" aria-label="groupes">
                    Groupes
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Stack>
          </Box>

          <Grid container spacing={5} sx={{ 
            position: 'relative', 
            zIndex: 1,
            justifyContent: 'center',
            px: 2 // Ajout d'un padding horizontal
          }}>
            {filteredItineraries.map((itinerary, index) => (
              <Grid item xs={12} md={6} lg={5} key={index} sx={{ display: 'flex' }}>
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ display: 'flex', width: '100%' }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      background: 'rgba(30, 41, 59, 0.7)',
                      backdropFilter: 'blur(12px)',
                      border: '2px solid rgba(255, 214, 198, 0.3)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(255, 214, 198, 0.2)',
                        border: '2px solid rgba(255, 214, 198, 0.5)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={itinerary.image}
                      alt={itinerary.title}
                      sx={{
                        borderBottom: '1px solid rgba(255, 214, 198, 0.2)',
                      }}
                    />
                    
                    {/* Bouton favoris */}
                    <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(itinerary.id);
                        }}
                        disabled={isLoading}
                        sx={{
                          bgcolor: 'rgba(0,0,0,0.5)',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                        }}
                      >
                        {favorites.includes(itinerary.id) ? (
                          <Favorite sx={{ color: '#F74AA1' }} />
                        ) : (
                          <FavoriteBorder sx={{ color: 'white' }} />
                        )}
                      </IconButton>
                    </Box>
                    
                    {/* Badges dans l'angle en haut à droite */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        zIndex: 2,
                      }}
                    >
                      {/* Badge principal basé sur le type d'itinéraire */}
                      <Chip
                        label={itinerary.type === 'couples' ? 'Duo' : 'Groupe'}
                        sx={{
                          background: itinerary.type === 'couples' 
                            ? 'linear-gradient(45deg, #F74AA1, #F59E3F)' 
                            : 'linear-gradient(45deg, #3f87f5, #41c7f5)',
                          color: 'white',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                          borderRadius: '16px',
                          '& .MuiChip-label': {
                            px: 1.5,
                          }
                        }}
                      />
                      
                      {/* Badge secondaire basé sur les caractéristiques de l'itinéraire */}
                      {itinerary.tags.includes('Bien-être') && (
                        <Chip
                          icon={<Spa sx={{ color: 'white !important' }} />}
                          label="Bien-être"
                          sx={{
                            background: 'rgba(30, 41, 59, 0.85)',
                            backdropFilter: 'blur(4px)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                            '& .MuiChip-label': {
                              px: 1,
                            }
                          }}
                          size="small"
                        />
                      )}
                      
                      {itinerary.tags.includes('Culture') && (
                        <Chip
                          icon={<Museum sx={{ color: 'white !important' }} />}
                          label="Culture"
                          sx={{
                            background: 'rgba(30, 41, 59, 0.85)',
                            backdropFilter: 'blur(4px)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                            '& .MuiChip-label': {
                              px: 1,
                            }
                          }}
                          size="small"
                        />
                      )}
                      
                      {itinerary.tags.includes('Aventure') && (
                        <Chip
                          icon={<SportsTennis sx={{ color: 'white !important' }} />}
                          label="Aventure"
                          sx={{
                            background: 'rgba(30, 41, 59, 0.85)',
                            backdropFilter: 'blur(4px)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                            '& .MuiChip-label': {
                              px: 1,
                            }
                          }}
                          size="small"
                        />
                      )}
                      
                      {/* Badge prix si c'est un prix spécial */}
                      {itinerary.price < 200 && (
                        <Chip
                          icon={<LocalOffer sx={{ color: 'white !important' }} />}
                          label="Bon plan"
                          sx={{
                            background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                            color: 'white',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                            '& .MuiChip-label': {
                              px: 1,
                            }
                          }}
                          size="small"
                        />
                      )}
                    </Box>

                    <CardContent sx={{ 
                      flexGrow: 1, 
                      p: 3, 
                      display: 'flex', 
                      flexDirection: 'column',
                      height: 'auto',
                    }}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {itinerary.title}
                      </Typography>
                      <Typography 
                        color="text.secondary" 
                        paragraph
                        sx={{ 
                          minHeight: '48px',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          mb: 2,
                          fontSize: '0.95rem',
                          fontStyle: 'italic',
                          borderLeft: '3px solid rgba(245, 158, 63, 0.5)',
                          pl: 2,
                          py: 1,
                          bgcolor: 'rgba(245, 158, 63, 0.05)',
                          borderRadius: '0 8px 8px 0',
                          fontWeight: 'bold',
                        }}
                      >
                        {itinerary.description}
                      </Typography>

                      <Box sx={{ 
                        mb: 3, 
                        flexGrow: 1,
                        height: 'auto',
                        overflowY: 'visible'
                      }}>
                        {itinerary.steps.map((step, idx) => (
                          <Stack
                            key={idx}
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            onClick={() => setSelectedStep(step)}
                            sx={{
                              p: 2,
                              mb: 2,
                              bgcolor: 'rgba(99, 102, 241, 0.1)',
                              borderRadius: '12px',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: 'rgba(99, 102, 241, 0.2)',
                                transform: 'translateX(8px)',
                              },
                              border: '1px solid rgba(99, 102, 241, 0.2)',
                            }}
                          >
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                              }}
                            >
                              {step.icon}
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>
                                {step.name}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{
                                  display: 'block',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '100%',
                                }}
                              >
                                {step.description}
                              </Typography>
                            </Box>
                          </Stack>
                        ))}
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        mt: 'auto',
                        mb: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime sx={{ 
                            color: '#F59E3F',
                          }} />
                          <Typography variant="body2" color="text.secondary">
                            {itinerary.duration}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Groups sx={{ 
                            color: '#F74AA1',
                          }} />
                          <Typography variant="body2" color="text.secondary">
                            {itinerary.groupSize}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2
                      }}>
                        <CalendarToday sx={{ 
                          color: '#F59E3F',
                        }} />
                        <Typography variant="body2" color="text.secondary">
                          {itinerary.date}
                        </Typography>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                          setSelectedItinerary(itinerary);
                        }}
                        sx={{
                          background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                          },
                          mt: 2
                        }}
                      >
                        Réserver
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {selectedItinerary && (
        <ItineraryModal
          itinerary={selectedItinerary}
          open={Boolean(selectedItinerary)}
          onClose={() => setSelectedItinerary(null)}
        />
      )}

      {selectedStep && (
        <PrestationModal
          prestation={{
            type: selectedStep.type === 'hotel' ? 'hebergement' : 
                  selectedStep.type === 'restaurant' ? 'restaurant' : 'activite',
            nom: selectedStep.details.title,
            description: selectedStep.details.description,
            images: selectedStep.details.images,
            adresse: selectedStep.details.adresse,
            prix: selectedStep.details.prix,
            duree: selectedStep.details.duree,
            equipements: selectedStep.details.equipements,
            menu: selectedStep.details.menu,
            horaires: selectedStep.details.horaires,
            avis: selectedStep.details.avis,
          }}
          isOpen={Boolean(selectedStep)}
          onClose={() => setSelectedStep(null)}
        />
      )}
    </Box>
  );
};

export default Itineraries; 