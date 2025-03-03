import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Pending,
  Schedule,
  Sort,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { customExperienceService } from '../../firebase/customExperienceService';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

const formatBudget = (budget: string): string => {
  switch (budget) {
    case 'economic':
      return 'Économique';
    case 'premium':
      return 'Premium';
    default:
      return budget;
  }
};

const formatActivityType = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    outdoor: 'Plein air',
    indoor: 'Intérieur',
    water: 'Nautique',
    adrenaline: 'Sensations fortes',
    culture: 'Culture',
  };
  return typeMap[type] || type;
};

const formatCuisineType = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    gastronomy: 'Gastronomique',
    world: 'Cuisine du monde',
    wine: 'Vin & dégustation',
    local: 'Cuisine locale',
    trendy: 'Tendance',
  };
  return typeMap[type] || type;
};

const formatIntensity = (intensity: string): string => {
  const intensityMap: { [key: string]: string } = {
    low: 'Faible',
    moderate: 'Modérée',
    high: 'Élevée',
  };
  return intensityMap[intensity] || intensity;
};

const formatAmbiance = (ambiance: string): string => {
  const ambianceMap: { [key: string]: string } = {
    cosy: 'Cosy',
    romantic: 'Romantique',
    festive: 'Festive',
    family: 'Familiale',
  };
  return ambianceMap[ambiance] || ambiance;
};

const formatAccommodationType = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    'city-center': 'Hôtel en centre-ville',
    'garden': 'Hôtel avec jardin',
    'atypical': 'Hébergement atypique',
    'spa': 'Hôtel avec spa',
    'luxury': 'Hôtel de luxe',
  };
  return typeMap[type] || type;
};

const formatStyle = (style: string): string => {
  const styleMap: { [key: string]: string } = {
    'modern': 'Design Moderne',
    'traditional': 'Charme Traditionnel',
  };
  return styleMap[style] || style;
};

const formatDate = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'dd MMMM yyyy', { locale: fr });
  } catch (e) {
    return dateStr;
  }
};

const UserCustomExperiences: React.FC = () => {
  const { currentUser } = useAuth();
  const [customExperiences, setCustomExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortExperiences = (experiences: any[], order: 'asc' | 'desc') => {
    return [...experiences].sort((a, b) => {
      try {
        const dateA = a?.dateAndConstraints?.date ? new Date(a.dateAndConstraints.date).getTime() : 0;
        const dateB = b?.dateAndConstraints?.date ? new Date(b.dateAndConstraints.date).getTime() : 0;
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      } catch (error) {
        console.warn('Erreur lors du tri des dates:', error);
        return 0;
      }
    });
  };

  useEffect(() => {
    const loadCustomExperiences = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const userExperiences = await customExperienceService.getUserExperiences(currentUser);
        // Vérification que userExperiences est un tableau non vide
        if (Array.isArray(userExperiences) && userExperiences.length > 0) {
          const sortedExperiences = sortExperiences(userExperiences, sortOrder);
          setCustomExperiences(sortedExperiences);
        } else {
          setCustomExperiences([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des expériences sur mesure:', error);
        setError('Impossible de charger vos expériences sur mesure. Veuillez réessayer plus tard.');
        setCustomExperiences([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadCustomExperiences();
  }, [currentUser, sortOrder]);

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Chip 
            icon={<Pending />} 
            label="En attente" 
            size="small"
            sx={{ 
              bgcolor: 'rgba(255, 193, 7, 0.1)', 
              color: '#ffc107',
              borderColor: 'rgba(255, 193, 7, 0.3)',
              border: '1px solid'
            }} 
          />
        );
      case 'processing':
        return (
          <Chip 
            icon={<Schedule />} 
            label="En cours de traitement" 
            size="small"
            sx={{ 
              bgcolor: 'rgba(33, 150, 243, 0.1)', 
              color: '#2196f3',
              borderColor: 'rgba(33, 150, 243, 0.3)',
              border: '1px solid'
            }} 
          />
        );
      case 'completed':
        return (
          <Chip 
            icon={<CheckCircle />} 
            label="Terminé" 
            size="small"
            sx={{ 
              bgcolor: 'rgba(76, 175, 80, 0.1)', 
              color: '#4caf50',
              borderColor: 'rgba(76, 175, 80, 0.3)',
              border: '1px solid'
            }} 
          />
        );
      default:
        return null;
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

  if (customExperiences.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Vous n'avez pas encore d'expériences sur mesure
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.href = '/#creer'}
          sx={{ mt: 2 }}
        >
          Créer une expérience sur mesure
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Mes expériences sur mesure ({customExperiences.length})
        </Typography>
        <Button
          startIcon={<Sort />}
          onClick={handleSort}
          variant="outlined"
          size="small"
          sx={{
            borderColor: 'rgba(247, 74, 161, 0.3)',
            color: '#F74AA1',
            '&:hover': {
              borderColor: '#F74AA1',
              backgroundColor: 'rgba(247, 74, 161, 0.1)',
            },
          }}
        >
          Trier par date ({sortOrder === 'asc' ? 'Du plus ancien' : 'Du plus récent'})
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {customExperiences.map((experience) => (
          <Grid item xs={12} key={experience.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper sx={{ 
                p: 3,
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 214, 198, 0.3)',
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {experience.itineraryType === 'hotel-restaurant-activity' ? 'Week-end Complet' : 'Sortie Express'}
                  </Typography>
                  {getStatusChip(experience.status)}
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Créée le {experience.createdAt.toLocaleDateString('fr-FR')}
                </Typography>

                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Hébergement - uniquement affiché si c'est un week-end complet */}
                {experience.itineraryType === 'hotel-restaurant-activity' && experience.accommodation && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: '#F59E3F' }}>
                      Hébergement
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Types d'hébergement :
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {experience.accommodation.types.map((type: string, index: number) => (
                            <Chip
                              key={index}
                              label={formatAccommodationType(type)}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(247, 74, 161, 0.1)',
                                color: '#F74AA1',
                              }}
                            />
                          ))}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Style :
                        </Typography>
                        <Typography>{formatStyle(experience.accommodation.style)}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Budget :
                        </Typography>
                        <Typography>{formatBudget(experience.accommodation.budget)}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Restaurant */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: '#F59E3F' }}>
                    Restaurant
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Types de cuisine :
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {experience.restaurant?.cuisineTypes?.map((type: string, index: number) => (
                          <Chip
                            key={index}
                            label={formatCuisineType(type)}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(247, 74, 161, 0.1)',
                              color: '#F74AA1',
                            }}
                          />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Ambiance :
                      </Typography>
                      <Typography>{formatAmbiance(experience.restaurant?.ambiance)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Budget :
                      </Typography>
                      <Typography>{formatBudget(experience.restaurant?.budget)}</Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Activité */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: '#F59E3F' }}>
                    Activité
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Type :
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {Array.isArray(experience.activity?.type) ? 
                          experience.activity.type.map((type: string, index: number) => (
                            <Chip
                              key={index}
                              label={formatActivityType(type)}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(247, 74, 161, 0.1)',
                                color: '#F74AA1',
                              }}
                            />
                          ))
                          : 
                          <Typography>{formatActivityType(experience.activity?.type)}</Typography>
                        }
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Intensité :
                      </Typography>
                      <Typography>{formatIntensity(experience.activity?.intensity)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Budget :
                      </Typography>
                      <Typography>{formatBudget(experience.activity?.budget)}</Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Date et Lieu */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: '#F59E3F' }}>
                    Date et Lieu
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Date :
                      </Typography>
                      <Typography>{formatDate(experience.dateAndConstraints?.date)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Heure :
                      </Typography>
                      <Typography>{experience.dateAndConstraints?.time}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Zone :
                      </Typography>
                      <Typography>{experience.dateAndConstraints?.location}</Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Personnalisation */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: '#F59E3F' }}>
                    Personnalisation
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Type de groupe :
                      </Typography>
                      <Typography>
                        {experience.personalization?.groupDynamics === 'friends' ? 'Entre amis' : 'Événement spécial'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Ambiance :
                      </Typography>
                      <Typography>
                        {experience.personalization?.vibe === 'chill' ? 'Chill & Cosy' : 'Party & Fun'}
                      </Typography>
                    </Grid>
                    {experience.personalization?.specificRequests && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Demandes spécifiques :
                        </Typography>
                        <Typography>{experience.personalization.specificRequests}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserCustomExperiences; 