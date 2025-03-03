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
  CircularProgress,
  Alert,
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
import { addToFavorites, removeFromFavorites, isItineraryFavorite, getHomeItineraries } from '../firebase/itineraryService';

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
  displayStartDate?: string;
  displayEndDate?: string;
}

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
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ItineraryType | 'all'>('all');
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [selectedStep, setSelectedStep] = useState<ItineraryStep | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<{[key: number]: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    status: string;
  }}>({});
  const navigate = useNavigate();
  const [faviconPosition, setFaviconPosition] = useState({ x: -500, y: -600 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Charger les itinéraires au montage du composant
  useEffect(() => {
    const loadItineraries = async () => {
      try {
        setLoading(true);
        const data = await getHomeItineraries();
        setItineraries(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des itinéraires:', err);
        setError('Erreur lors du chargement des itinéraires');
      } finally {
        setLoading(false);
      }
    };

    loadItineraries();
  }, []);

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
          
          setFavorites(favIds.reduce((acc, id) => ({ ...acc, [id]: isFavorite }), {}));
        } catch (error) {
          console.error('Erreur lors du chargement des favoris:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Si l'utilisateur n'est pas connecté, charger depuis localStorage
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites).reduce((acc, id) => ({ ...acc, [id]: true }), {}));
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
        const newFavorites = {
          ...favorites,
          [itineraryId]: !favorites[itineraryId]
        };
        
        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(Object.keys(newFavorites).filter(id => newFavorites[id])));
        return;
      }
      
      const itinerary = itineraries.find(item => item.id === itineraryId);
      if (!itinerary) return;
      
      if (favorites[itineraryId]) {
        // Supprimer des favoris
        await removeFromFavorites(currentUser.uid, itineraryId);
        setFavorites({ ...favorites, [itineraryId]: false });
        
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
        setFavorites({ ...favorites, [itineraryId]: true });
        
        // Jouer un son d'ajout
        const audio = new Audio('/sounds/like.mp3');
        audio.volume = 0.5;
        audio.play();
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error);
    }
  };

  // Calculer le temps restant pour chaque itinéraire
  const calculateTimeRemaining = useCallback(() => {
    const newTimeRemaining: {[key: number]: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
      status: string;
    }} = {};
    const now = new Date();
    
      itineraries.forEach(itinerary => {
      if (!itinerary.displayStartDate || !itinerary.displayEndDate) {
        newTimeRemaining[itinerary.id] = {
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          status: "Dates non définies"
        };
        return;
      }

      const startDate = new Date(itinerary.displayStartDate);
      const endDate = new Date(itinerary.displayEndDate);
      
      // Si la date de fin est dépassée
      if (now > endDate) {
        newTimeRemaining[itinerary.id] = {
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          status: "Réservations terminées"
        };
      }
      // Si la date de début n'est pas encore atteinte
      else if (now < startDate) {
        const difference = startDate.getTime() - now.getTime();
        const days = Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const seconds = Math.floor((difference % (1000 * 60)) / 1000).toString().padStart(2, '0');
        
        newTimeRemaining[itinerary.id] = {
          days,
          hours,
          minutes,
          seconds,
          status: "début"
        };
      }
      // Si on est dans la période d'affichage
      else {
        const difference = endDate.getTime() - now.getTime();
        const days = Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const seconds = Math.floor((difference % (1000 * 60)) / 1000).toString().padStart(2, '0');
        
        newTimeRemaining[itinerary.id] = {
          days,
          hours,
          minutes,
          seconds,
          status: "fin"
        };
      }
    });
    
    setTimeRemaining(newTimeRemaining);
  }, [itineraries]);

  // Mettre à jour le compteur toutes les secondes
  useEffect(() => {
    const timer = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(timer);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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
                {Object.keys(timeRemaining).length > 0 && timeRemaining[1] && !timeRemaining[1].status?.includes("terminées") ? (
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
                        {timeRemaining[1].days}
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 0.5 }}>jours</Typography>
                    </Box>
                    
                    {/* Heures */}
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mx: 1
                    }}>
                      <Box
                        component={motion.div}
                        key={`hours-${timeRemaining[1].hours}`}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        sx={{ 
                          fontWeight: 'bold',
                          minWidth: '2.5rem',
                          textAlign: 'center',
                          background: 'linear-gradient(to bottom, rgba(245, 158, 63, 0.5), rgba(245, 158, 63, 0.2))',
                          borderRadius: '4px',
                          px: 1,
                          py: 0.5,
                          fontSize: '1.5rem',
                        }}
                      >
                        {timeRemaining[1].hours}
                      </Box>
                      <Typography variant="caption" sx={{ mt: 0.5 }}>h</Typography>
                    </Box>
                    
                    {/* Minutes */}
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mx: 1
                    }}>
                      <Box
                        component={motion.div}
                        key={`minutes-${timeRemaining[1].minutes}`}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        sx={{ 
                          fontWeight: 'bold',
                          minWidth: '2.5rem',
                          textAlign: 'center',
                          background: 'linear-gradient(to bottom, rgba(245, 158, 63, 0.6), rgba(245, 158, 63, 0.3))',
                          borderRadius: '4px',
                          px: 1,
                          py: 0.5,
                          fontSize: '1.5rem',
                        }}
                      >
                        {timeRemaining[1].minutes}
                      </Box>
                      <Typography variant="caption" sx={{ mt: 0.5 }}>min</Typography>
                    </Box>
                    
                    {/* Secondes */}
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      ml: 1
                    }}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`seconds-${timeRemaining[1].seconds}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Box sx={{ 
                              fontWeight: 'bold',
                              minWidth: '2.5rem',
                              textAlign: 'center',
                              background: 'linear-gradient(to bottom, rgba(247, 74, 161, 0.8), rgba(247, 74, 161, 0.5))',
                              borderRadius: '4px',
                            px: 1,
                            py: 0.5,
                              fontSize: '1.5rem',
                          }}>
                            {timeRemaining[1].seconds}
                          </Box>
                        </motion.div>
                      </AnimatePresence>
                      <Typography variant="caption" sx={{ mt: 0.5 }}>sec</Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body1" component="span" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {timeRemaining[1]?.status || 'Calcul en cours...'}
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
                      height: '100%',
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
                        {favorites[itinerary.id] ? (
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
                      <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 'bold',
                          height: '3.6em',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {itinerary.title}
                      </Typography>
                      <Typography 
                        color="text.secondary" 
                        paragraph
                        sx={{ 
                          minHeight: '48px',
                          height: '4.5em',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
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
                              {step.type === 'hotel' && <Hotel sx={{ color: 'white' }} />}
                              {step.type === 'restaurant' && <Restaurant sx={{ color: 'white' }} />}
                              {step.type === 'activity' && <Spa sx={{ color: 'white' }} />}
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography 
                                variant="body2" 
                                color="text.primary" 
                                sx={{ 
                                  fontWeight: 'bold',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
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