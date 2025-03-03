import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './config';

const initialItineraries = [
  {
    id: 1,
    type: 'couples',
    title: 'Escapade Romantique',
    description: 'Une journée magique en amoureux.',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1200&auto=format&fit=crop',
    displayOnHome: true,
    steps: [
      {
        type: 'hotel',
        name: 'Hôtel Le Royal',
        description: 'Suite avec vue panoramique',
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
    displayOnHome: true,
    steps: [
      {
        type: 'hotel',
        name: 'Spa Resort & Hotel',
        description: 'Chambre Deluxe avec jacuzzi privatif',
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
            'Smart TV'
          ],
          avis: [
            {
              utilisateur: 'Julie M.',
              commentaire: 'Un véritable havre de paix. Le jacuzzi privatif est un plus incroyable.',
              note: 5
            },
            {
              utilisateur: 'Marc D.',
              commentaire: 'Parfait pour un week-end en amoureux. Service impeccable.',
              note: 4.5
            }
          ]
        }
      },
      {
        type: 'activity',
        name: 'Massage Duo Signature',
        description: 'Rituel bien-être en duo',
        details: {
          title: 'Massage Signature - Expérience Duo',
          description: 'Vivez un moment de détente absolue avec notre massage signature en duo, suivi d\'un accès aux installations spa.',
          images: [
            'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200',
            'https://images.unsplash.com/photo-1531112357080-a5eb0f6c0744?q=80&w=1200',
            'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200',
            'https://images.unsplash.com/photo-1482275548304-a58859dc31b7?q=80&w=1200',
          ],
          adresse: '45 Avenue du Bien-être, 69006 Lyon',
          prix: '180€ pour 2 personnes',
          duree: '2h',
          equipements: [
            'Peignoirs et chaussons fournis',
            'Accès spa inclus',
            'Tisanerie',
            'Espace détente'
          ],
          avis: [
            {
              utilisateur: 'Sophie L.',
              commentaire: 'Un moment magique, les masseurs sont très professionnels.',
              note: 5
            },
            {
              utilisateur: 'Pierre B.',
              commentaire: 'Excellente prestation, cadre magnifique.',
              note: 5
            }
          ]
        }
      }
    ],
    price: 299,
    duration: '48h',
    groupSize: '2 personnes',
    tags: ['Couples', 'Bien-être', 'Spa', 'Week-end'],
    date: '15 avril 2025'
  },
  {
    id: 3,
    type: 'groups',
    title: 'Aventure Entre Amis',
    description: 'Un week-end d\'activités et de découvertes entre amis.',
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=1200&auto=format&fit=crop',
    displayOnHome: true,
    steps: [
      {
        type: 'activity',
        name: 'Escape Game VR',
        description: 'Expérience immersive en réalité virtuelle',
        details: {
          title: 'Escape Game VR - Mission Impossible',
          description: 'Plongez dans une aventure virtuelle unique où votre équipe devra résoudre des énigmes complexes pour sauver le monde.',
          images: [
            'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200',
            'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200',
            'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=1200',
          ],
          adresse: '12 Rue de l\'Innovation, 69002 Lyon',
          prix: '35€ par personne',
          duree: '1h',
          niveau: 'Tous niveaux',
          equipements: [
            'Casques VR dernière génération',
            'Zone de jeu spacieuse',
            'Équipement de tracking',
            'Vestiaires'
          ],
          avis: [
            {
              utilisateur: 'Thomas R.',
              commentaire: 'Une expérience incroyable, on se croirait vraiment dans un film !',
              note: 5
            },
            {
              utilisateur: 'Laura M.',
              commentaire: 'Super activité en groupe, les énigmes sont bien pensées.',
              note: 4.5
            }
          ]
        }
      },
      {
        type: 'restaurant',
        name: 'Le Loft',
        description: 'Restaurant-bar tendance',
        details: {
          title: 'Le Loft - Cuisine du Monde',
          description: 'Un concept unique mêlant cuisine internationale, cocktails créatifs et ambiance festive.',
          images: [
            'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200',
            'https://images.unsplash.com/photo-1485686531765-ba63b07845a7?q=80&w=1200',
            'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1200',
          ],
          adresse: '78 Rue de la République, 69002 Lyon',
          prix: 'À partir de 35€/personne',
          horaires: 'Du mardi au dimanche, 19h-2h',
          menu: [
            'Tapas du monde',
            'Burgers gourmet',
            'Pizzas artisanales',
            'Cocktails signature'
          ],
          avis: [
            {
              utilisateur: 'Antoine P.',
              commentaire: 'Parfait pour une soirée entre amis, ambiance au top !',
              note: 5
            },
            {
              utilisateur: 'Marie S.',
              commentaire: 'Excellents cocktails et nourriture délicieuse.',
              note: 4.5
            }
          ]
        }
      }
    ],
    price: 89,
    duration: '6h',
    groupSize: '4-8 personnes',
    tags: ['Groupes', 'Fun', 'Soirée', 'High-tech'],
    date: '5 mai 2025'
  },
  {
    id: 4,
    type: 'groups',
    title: 'Culture & Découverte',
    description: 'Une journée riche en découvertes culturelles et gastronomiques.',
    image: 'https://images.unsplash.com/photo-1582034986517-30d163aa1da9?q=80&w=1200&auto=format&fit=crop',
    displayOnHome: true,
    steps: [
      {
        type: 'activity',
        name: 'Visite Guidée Street Art',
        description: 'Découverte du street art lyonnais',
        details: {
          title: 'Street Art Tour - Lyon Alternative',
          description: 'Une visite guidée unique à travers les quartiers les plus artistiques de Lyon, à la découverte des œuvres de street art emblématiques.',
          images: [
            'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?q=80&w=1200',
            'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200',
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200',
          ],
          adresse: 'Point de départ: Place des Terreaux, 69001 Lyon',
          prix: '25€ par personne',
          duree: '2h30',
          equipements: [
            'Guide expert',
            'Livret explicatif',
            'Écouteurs fournis'
          ],
          avis: [
            {
              utilisateur: 'Claire D.',
              commentaire: 'Une découverte passionnante de l\'art urbain lyonnais.',
              note: 5
            },
            {
              utilisateur: 'Paul M.',
              commentaire: 'Guide très cultivé et parcours bien pensé.',
              note: 4.5
            }
          ]
        }
      },
      {
        type: 'restaurant',
        name: 'Le Bistrot des Artistes',
        description: 'Cuisine traditionnelle revisitée',
        details: {
          title: 'Le Bistrot des Artistes - Cuisine Créative',
          description: 'Un bistrot moderne où la cuisine traditionnelle rencontre la créativité artistique.',
          images: [
            'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1200',
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200',
            'https://images.unsplash.com/photo-1515669097368-22e68427d265?q=80&w=1200',
          ],
          adresse: '34 Rue des Capucins, 69001 Lyon',
          prix: 'Menu du jour 28€',
          horaires: 'Du mardi au samedi, 12h-14h30 et 19h-22h30',
          menu: [
            'Entrées de saison',
            'Plats signature',
            'Desserts artisanaux',
            'Carte des vins locale'
          ],
          avis: [
            {
              utilisateur: 'Sarah L.',
              commentaire: 'Une cuisine inventive dans un cadre chaleureux.',
              note: 4.5
            },
            {
              utilisateur: 'Michel P.',
              commentaire: 'Excellent rapport qualité-prix, service attentionné.',
              note: 5
            }
          ]
        }
      }
    ],
    price: 79,
    duration: '5h',
    groupSize: '6-12 personnes',
    tags: ['Groupes', 'Culture', 'Gastronomie', 'Art'],
    date: '12 juin 2025'
  }
];

export const initializeItineraries = async () => {
  try {
    const itinerariesRef = collection(db, 'itineraries');
    
    for (const itinerary of initialItineraries) {
      await setDoc(doc(itinerariesRef, itinerary.id.toString()), {
        ...itinerary,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Itinéraire ${itinerary.id} ajouté avec succès`);
    }
    
    console.log('Tous les itinéraires ont été initialisés');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des itinéraires:', error);
    throw error;
  }
}; 