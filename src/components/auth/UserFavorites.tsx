import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Delete as DeleteIcon,
  AccessTime,
  Groups,
  Euro,
  ArrowForward,
  CalendarToday,
  Spa,
  Museum,
  SportsTennis,
  LocalOffer,
  Hotel,
  Restaurant,
  DirectionsWalk
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getUserFavorites, removeFromFavorites, Favorite as FavoriteType } from '../../firebase/itineraryService';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ItineraryModal from '../ItineraryModal';
import PrestationModal from '../PrestationModal';
import { Itinerary, ItineraryStep } from '../Itineraries';

const cardVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
    },
  },
};

// Fonction pour générer des étapes fictives basées sur le type d'itinéraire
const generateMockSteps = (favorite: FavoriteType): ItineraryStep[] => {
  const steps: ItineraryStep[] = [];
  
  if (favorite.itineraryType === 'couples') {
    // Pour les itinéraires de type "couples"
    steps.push({
      type: 'hotel',
      name: 'Hôtel Le Royal',
      description: 'Suite avec vue panoramique',
      icon: <Hotel sx={{ color: 'white' }} />,
      details: {
        title: 'Hôtel Le Royal',
        description: 'Une suite luxueuse avec vue panoramique sur la ville',
        images: [favorite.itineraryImage],
        adresse: '123 Avenue des Champs-Élysées, Paris',
        prix: '€€€',
        equipements: ['Wi-Fi', 'Spa', 'Room Service'],
        horaires: '24h/24',
        avis: [
          {
            utilisateur: 'Sophie',
            commentaire: 'Séjour inoubliable avec une vue magnifique',
            note: 5
          }
        ]
      }
    });
    
    steps.push({
      type: 'restaurant',
      name: 'La Table d\'Or',
      description: 'Restaurant gastronomique étoilé',
      icon: <Restaurant sx={{ color: 'white' }} />,
      details: {
        title: 'La Table d\'Or',
        description: 'Un restaurant gastronomique étoilé pour une expérience culinaire exceptionnelle',
        images: [favorite.itineraryImage],
        adresse: '45 Rue de la Paix, Paris',
        prix: '€€€€',
        menu: ['Menu Dégustation', 'Accord Mets et Vins'],
        horaires: '19h-23h',
        avis: [
          {
            utilisateur: 'Jean',
            commentaire: 'Une expérience gastronomique inoubliable',
            note: 5
          }
        ]
      }
    });
    
    steps.push({
      type: 'activity',
      name: 'Spa Privé',
      description: 'Massage en duo et champagne',
      icon: <Spa sx={{ color: 'white' }} />,
      details: {
        title: 'Spa Privé',
        description: 'Un moment de détente en duo avec massage et champagne',
        images: [favorite.itineraryImage],
        adresse: 'Dans l\'hôtel',
        prix: '€€',
        duree: '2h',
        horaires: 'Sur réservation',
        avis: [
          {
            utilisateur: 'Marie',
            commentaire: 'Moment de détente parfait',
            note: 5
          }
        ]
      }
    });
  } else {
    // Pour les itinéraires de type "groups" ou autres
    steps.push({
      type: 'hotel',
      name: 'Spa Resort & Hôtel',
      description: 'Chambre Deluxe avec jacuzzi privatif',
      icon: <Hotel sx={{ color: 'white' }} />,
      details: {
        title: 'Spa Resort & Hôtel',
        description: 'Un hôtel de luxe avec spa et installations de bien-être',
        images: [favorite.itineraryImage],
        adresse: '789 Boulevard du Sport, Lyon',
        prix: '€€',
        equipements: ['Wi-Fi', 'Piscine', 'Salle de sport'],
        horaires: '24h/24',
        avis: [
          {
            utilisateur: 'Thomas',
            commentaire: 'Excellent rapport qualité-prix',
            note: 4
          }
        ]
      }
    });
    
    steps.push({
      type: 'activity',
      name: 'Massage Duo Signature',
      description: 'Rituel spa de 2h avec accès aux installations',
      icon: <Spa sx={{ color: 'white' }} />,
      details: {
        title: 'Massage Duo Signature',
        description: 'Un rituel spa complet pour une détente absolue',
        images: [favorite.itineraryImage],
        adresse: 'Dans l\'hôtel',
        prix: '€€',
        duree: '2h',
        niveau: 'Tous niveaux',
        horaires: '10h-20h',
        avis: [
          {
            utilisateur: 'Julie',
            commentaire: 'Massage exceptionnel',
            note: 5
          }
        ]
      }
    });
    
    steps.push({
      type: 'restaurant',
      name: 'Le Jardin Secret',
      description: 'Dîner aux chandelles dans un cadre intimiste',
      icon: <Restaurant sx={{ color: 'white' }} />,
      details: {
        title: 'Le Jardin Secret',
        description: 'Un restaurant avec une ambiance romantique et une cuisine raffinée',
        images: [favorite.itineraryImage],
        adresse: '56 Rue des Fleurs, Lyon',
        prix: '€€€',
        menu: ['Menu du Chef', 'Carte des Vins'],
        horaires: '19h-22h30',
        avis: [
          {
            utilisateur: 'Pierre',
            commentaire: 'Cadre magnifique et cuisine délicieuse',
            note: 5
          }
        ]
      }
    });
  }
  
  return steps;
};

const UserFavorites: React.FC = () => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<ItineraryStep | null>(null);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavorites = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const userFavorites = await getUserFavorites(currentUser.uid);
        setFavorites(userFavorites);
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
        setError('Impossible de charger vos favoris. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    loadFavorites();
  }, [currentUser]);

  const handleRemoveFavorite = async (favoriteId: string, itineraryId: number) => {
    if (!currentUser) return;
    
    try {
      await removeFromFavorites(currentUser.uid, itineraryId);
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      
      // Jouer un son de suppression
      const audio = new Audio('/sounds/skip.mp3');
      audio.volume = 0.5;
      audio.play();
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
      setError('Impossible de supprimer ce favori. Veuillez réessayer plus tard.');
    }
  };

  const handleViewItinerary = (itineraryId: number) => {
    // Naviguer vers la section des itinéraires et mettre en évidence l'itinéraire sélectionné
    navigate('/#itineraires', { state: { highlightItinerary: itineraryId } });
  };

  const handleBooking = (itineraryId: number) => {
    // Naviguer vers la page de réservation avec l'itinéraire sélectionné
    const itinerary = favorites.find(fav => fav.itineraryId === itineraryId);
    if (itinerary) {
      navigate(`/booking/${itineraryId}`, { 
        state: { 
          itinerary: {
            id: itinerary.itineraryId,
            title: itinerary.itineraryTitle,
            image: itinerary.itineraryImage,
            price: itinerary.itineraryPrice,
            // Autres propriétés nécessaires pour la page de réservation
          } 
        } 
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (favorites.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Vous n'avez pas encore d'itinéraires favoris
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/#itineraires')}
          sx={{ 
            mt: 2,
            background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
            '&:hover': {
              background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
              opacity: 0.9
            },
          }}
        >
          Découvrir nos itinéraires
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Mes itinéraires favoris ({favorites.length})
      </Typography>
      
      <Grid container spacing={5} sx={{ 
        position: 'relative', 
        zIndex: 1,
        justifyContent: 'center',
        px: 2 
      }}>
        {favorites.map((favorite, index) => {
          // Générer des étapes fictives pour chaque favori
          const mockSteps = generateMockSteps(favorite);
          
          // Créer un objet itinéraire complet pour la modale
          const itinerary: Itinerary = {
            id: favorite.itineraryId,
            title: favorite.itineraryTitle,
            description: favorite.itineraryDescription || '',
            image: favorite.itineraryImage,
            price: favorite.itineraryPrice,
            duration: favorite.itineraryDuration || '24h',
            groupSize: favorite.itineraryGroupSize || '2 personnes',
            type: favorite.itineraryType as any || 'couples',
            tags: favorite.itineraryTags || [],
            steps: mockSteps,
            date: '22 mars 2025',
            images: [favorite.itineraryImage]
          };
          
          return (
            <Grid item xs={12} md={6} lg={5} key={favorite.id} sx={{ display: 'flex' }}>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                    image={favorite.itineraryImage}
                    alt={favorite.itineraryTitle}
                    sx={{
                      borderBottom: '1px solid rgba(255, 214, 198, 0.2)',
                    }}
                  />
                  
                  {/* Bouton supprimer */}
                  <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
                    <IconButton
                      onClick={() => favorite.id && handleRemoveFavorite(favorite.id, favorite.itineraryId)}
                      disabled={loading}
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.5)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                      }}
                    >
                      <DeleteIcon sx={{ color: 'white' }} />
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
                      label={favorite.itineraryType === 'couples' ? 'Duo' : 'Groupe'}
                      sx={{
                        background: favorite.itineraryType === 'couples' 
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
                    {favorite.itineraryTags?.includes('Bien-être') && (
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
                    
                    {favorite.itineraryTags?.includes('Culture') && (
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
                    
                    {favorite.itineraryTags?.includes('Aventure') && (
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
                    
                    {/* Badge prix si c'est un bon plan */}
                    {favorite.itineraryPrice < 200 && (
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
                      {favorite.itineraryTitle}
                    </Typography>
                    
                    {favorite.itineraryDescription && (
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
                        {favorite.itineraryDescription}
                      </Typography>
                    )}

                    <Box sx={{ 
                      mb: 3, 
                      flexGrow: 1,
                      height: 'auto',
                      overflowY: 'visible'
                    }}>
                      {mockSteps.map((step, idx) => (
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
                      {favorite.itineraryDuration && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime sx={{ 
                            color: '#F59E3F',
                          }} />
                          <Typography variant="body2" color="text.secondary">
                            {favorite.itineraryDuration}
                          </Typography>
                        </Box>
                      )}
                      
                      {favorite.itineraryGroupSize && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Groups sx={{ 
                            color: '#F74AA1',
                          }} />
                          <Typography variant="body2" color="text.secondary">
                            {favorite.itineraryGroupSize}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2
                    }}>
                      <Euro sx={{ 
                        color: '#F59E3F',
                      }} />
                      <Typography variant="body2" color="text.secondary">
                        {favorite.itineraryPrice} € par personne
                      </Typography>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setSelectedItinerary(itinerary)}
                      sx={{
                        background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                          opacity: 0.9
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
          );
        })}
      </Grid>
      
      {/* Utiliser les mêmes modales que dans Itineraries.tsx */}
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

export default UserFavorites; 