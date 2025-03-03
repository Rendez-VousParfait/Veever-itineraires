import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Alert,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Cancel,
  PictureAsPdf,
  Sort,
  Hotel,
  Restaurant,
  Sports,
  Event,
  LocationOn,
  Group,
  Mood,
  AttachMoney,
  Style,
  Category,
  AccessTime,
  Description,
  GetApp,
} from '@mui/icons-material';
import { customExperienceService } from '../../firebase/customExperienceService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Link } from 'react-router-dom';

const formatBudget = (budget: string): string => {
  switch (budget) {
    case 'economic':
      return 'Économique';
    case 'premium':
      return 'Premium';
    default:
      return budget || 'Non spécifié';
  }
};

const formatAmbiance = (ambiance: string): string => {
  const ambianceMap: { [key: string]: string } = {
    'cozy': 'Cosy & Intime',
    'trendy': 'Branché & Tendance',
    'casual': 'Décontracté',
    'elegant': 'Élégant',
    'party': 'Festif',
  };
  return ambianceMap[ambiance] || ambiance || 'Non spécifié';
};

const formatIntensity = (intensity: string): string => {
  const intensityMap: { [key: string]: string } = {
    'low': 'Faible',
    'medium': 'Modérée',
    'high': 'Intense',
  };
  return intensityMap[intensity] || intensity || 'Non spécifié';
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

// Fonction pour extraire les types de cuisine à partir des préférences
const extractCuisineTypes = (preferences: { [key: string]: boolean } | undefined): string[] => {
  if (!preferences) return [];
  
  const cuisineTypes = ['gastronomy', 'world', 'wine', 'local', 'trendy'];
  return cuisineTypes.filter(type => preferences[type] === true);
};

// Fonction pour extraire les types d'activité à partir des préférences
const extractActivityTypes = (preferences: { [key: string]: boolean } | undefined): string[] => {
  if (!preferences) return [];
  
  const activityTypes = ['outdoor', 'indoor', 'water', 'adrenaline', 'culture'];
  return activityTypes.filter(type => preferences[type] === true);
};

const UserCustomExperiences: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadExperiences();
    }
  }, [currentUser]);

  const loadExperiences = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const userExperiences = await customExperienceService.getUserExperiences(currentUser);
      setExperiences(sortExperiences(userExperiences, sortOrder));
    } catch (error) {
      console.error('Erreur lors du chargement des expériences:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortExperiences = (exps: any[], order: 'asc' | 'desc') => {
    return [...exps].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const handleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setExperiences(sortExperiences(experiences, newOrder));
  };

  const handleModify = (experienceId: string) => {
    navigate(`/custom-experiences/edit/${experienceId}`);
  };

  const handleCancel = async () => {
    if (!selectedExperience) return;
    try {
      await customExperienceService.updateExperienceStatus(
        selectedExperience.id,
        'cancelled',
        currentUser?.email || 'utilisateur',
        'Annulé par l\'utilisateur'
      );
      setCancelConfirmOpen(false);
      setOpenDialog(false);
      await loadExperiences();
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
    }
  };

  const generatePDF = (experience: any) => {
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(20);
    
    // Titre
    doc.text('Résumé de votre expérience personnalisée', 20, 20);
    doc.setFontSize(12);
    
    // Informations générales
    doc.text(`Type : ${experience.itineraryType === 'hotel-restaurant-activity' ? 'Week-end Complet' : 'Sortie Express'}`, 20, 40);
    doc.text(`Date de création : ${format(new Date(experience.createdAt), 'dd MMMM yyyy', { locale: fr })}`, 20, 50);
    doc.text(`Statut : ${experience.status === 'pending' ? 'En attente' : experience.status === 'processing' ? 'En cours' : 'Terminé'}`, 20, 60);

    let yPos = 80;

    // Hébergement (si week-end complet)
    if (experience.itineraryType === 'hotel-restaurant-activity' && experience.accommodation) {
      doc.setFontSize(14);
      doc.text('Hébergement', 20, yPos);
      doc.setFontSize(12);
      yPos += 10;
      doc.text(`Types : ${experience.accommodation.types.map(formatAccommodationType).join(', ')}`, 25, yPos);
      yPos += 10;
      doc.text(`Style : ${formatStyle(experience.accommodation.style)}`, 25, yPos);
      yPos += 10;
      doc.text(`Budget : ${formatBudget(experience.accommodation.budget)}`, 25, yPos);
      yPos += 20;
    }

    // Restaurant
    doc.setFontSize(14);
    doc.text('Restaurant', 20, yPos);
    doc.setFontSize(12);
    yPos += 10;
    
    // Types de cuisine (depuis cuisineTypes ou préférences)
    const cuisineTypes = experience.restaurant.cuisineTypes?.length > 0 
      ? experience.restaurant.cuisineTypes 
      : extractCuisineTypes(experience.preferences);
    
    doc.text(`Types de cuisine : ${cuisineTypes.length > 0 
      ? cuisineTypes.map(formatCuisineType).join(', ') 
      : 'Non spécifié'}`, 25, yPos);
    
    yPos += 10;
    doc.text(`Ambiance : ${formatAmbiance(experience.restaurant.ambiance)}`, 25, yPos);
    yPos += 10;
    doc.text(`Budget : ${formatBudget(experience.restaurant.budget)}`, 25, yPos);
    yPos += 20;

    // Activité
    doc.setFontSize(14);
    doc.text('Activité', 20, yPos);
    doc.setFontSize(12);
    yPos += 10;
    
    // Types d'activité (depuis type ou préférences)
    const activityTypes = Array.isArray(experience.activity.type) && experience.activity.type.length > 0
      ? experience.activity.type
      : experience.activity.type
        ? [experience.activity.type]
        : extractActivityTypes(experience.preferences);
    
    doc.text(`Type : ${activityTypes.length > 0 
      ? activityTypes.map(formatActivityType).join(', ') 
      : 'Non spécifié'}`, 25, yPos);
    
    yPos += 10;
    doc.text(`Intensité : ${formatIntensity(experience.activity.intensity)}`, 25, yPos);
    yPos += 10;
    doc.text(`Budget : ${formatBudget(experience.activity.budget)}`, 25, yPos);
    yPos += 20;

    // Informations complémentaires
    doc.setFontSize(14);
    doc.text('Informations complémentaires', 20, yPos);
    doc.setFontSize(12);
    yPos += 10;
    doc.text(`Date souhaitée : ${format(new Date(experience.dateAndConstraints.date), 'dd MMMM yyyy', { locale: fr })}`, 25, yPos);
    yPos += 10;
    doc.text(`Zone : ${experience.dateAndConstraints.location}`, 25, yPos);

    // Sauvegarde du PDF
    doc.save(`experience-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const getStatusChip = (status: string) => {
    const statusConfig: { [key: string]: { color: string; label: string } } = {
      pending: { color: '#ffc107', label: 'En attente' },
      processing: { color: '#2196f3', label: 'En cours' },
      completed: { color: '#4caf50', label: 'Terminé' },
      cancelled: { color: '#f44336', label: 'Annulé' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Chip
        label={config.label}
        size="small"
        sx={{
          bgcolor: `${config.color}20`,
          color: config.color,
          borderColor: `${config.color}50`,
          border: '1px solid',
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Chargement de vos expériences...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Mes Expériences Personnalisées
        </Typography>
        <Button
          startIcon={<Sort />}
          onClick={handleSort}
          variant="outlined"
          size="small"
        >
          {sortOrder === 'asc' ? 'Plus ancien d\'abord' : 'Plus récent d\'abord'}
        </Button>
      </Box>

      {experiences.length === 0 ? (
        <Alert severity="info">
          Vous n'avez pas encore créé d'expérience personnalisée.
          <Button
            color="primary"
            onClick={() => navigate('/')}
            sx={{ ml: 2 }}
          >
            Créer ma première expérience
          </Button>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {experiences.map((experience) => (
            <Grid item xs={12} md={6} key={experience.id}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2,
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(99, 102, 241, 0.1)'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {experience.itineraryType === 'hotel-restaurant-activity' ? 'Week-end Complet' : 'Sortie Express'}
                  </Typography>
                  {getStatusChip(experience.status)}
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Créée le {format(new Date(experience.createdAt), 'dd/MM/yyyy', { locale: fr })}
                </Typography>

                {/* Contenu existant */}
                
                {/* Boutons d'action */}
                <Box sx={{ 
                  mt: 3, 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  gap: 1.5,
                  p: 2,
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <Button
                    startIcon={<Visibility />}
                    variant="contained"
                    size="medium"
                    onClick={() => {
                      setSelectedExperience(experience);
                      setOpenDialog(true);
                    }}
                    sx={{ minWidth: '120px' }}
                  >
                    Détails
                  </Button>
                  
                  {experience.status === 'pending' && (
                    <>
                      <Button
                        startIcon={<Edit />}
                        variant="contained"
                        size="medium"
                        onClick={() => handleModify(experience.id)}
                        sx={{ minWidth: '120px' }}
                      >
                        Modifier
                      </Button>
                      <Button
                        startIcon={<Cancel />}
                        variant="contained"
                        color="error"
                        size="medium"
                        onClick={() => {
                          setSelectedExperience(experience);
                          setCancelConfirmOpen(true);
                        }}
                        sx={{ minWidth: '120px' }}
                      >
                        Annuler
                      </Button>
                    </>
                  )}
                  
                  <Button
                    startIcon={<PictureAsPdf />}
                    variant="contained"
                    size="medium"
                    onClick={() => generatePDF(experience)}
                    sx={{ minWidth: '120px' }}
                  >
                    PDF
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de détails */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(to bottom, rgba(30, 41, 59, 0.95), rgba(30, 41, 59, 0.98))',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        {selectedExperience && (
          <>
            <DialogTitle>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                mb: 2,
                pb: 2,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Box>
                  <Typography variant="h5" sx={{ 
                    mb: 1,
                    background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold'
                  }}>
                    {selectedExperience.itineraryType === 'hotel-restaurant-activity' 
                      ? 'Week-end Complet' 
                      : 'Sortie Express'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    opacity: 0.8
                  }}>
                    <Event fontSize="small" />
                    Créée le {format(new Date(selectedExperience.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                  </Typography>
                </Box>
                {getStatusChip(selectedExperience.status)}
              </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
              <Grid container spacing={3}>
                {selectedExperience.itineraryType === 'hotel-restaurant-activity' && (
                  <Grid item xs={12}>
                    <Card sx={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Hotel sx={{ color: '#F59E3F' }} />
                          <Typography variant="h6" sx={{
                            color: '#F59E3F',
                            fontWeight: 'bold'
                          }}>Hébergement</Typography>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Category fontSize="small" color="action" />
                              <Typography variant="subtitle2" color="text.secondary">Types :</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selectedExperience.accommodation?.types?.map((type: string, index: number) => (
                                <Chip
                                  key={index}
                                  label={formatAccommodationType(type)}
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(245, 158, 63, 0.1)',
                                    color: '#F59E3F',
                                  }}
                                />
                              ))}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Style fontSize="small" color="action" />
                              <Typography variant="subtitle2" color="text.secondary">Style :</Typography>
                            </Box>
                            <Typography>{formatStyle(selectedExperience.accommodation?.style)}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <AttachMoney fontSize="small" color="action" />
                              <Typography variant="subtitle2" color="text.secondary">Budget :</Typography>
                            </Box>
                            <Typography>{formatBudget(selectedExperience.accommodation?.budget)}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Restaurant sx={{ color: '#F59E3F' }} />
                        <Typography variant="h6" color="#F59E3F">Restaurant</Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Category fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="text.secondary">Types de cuisine :</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selectedExperience.restaurant?.cuisineTypes?.length > 0 ? (
                              selectedExperience.restaurant.cuisineTypes.map((type: string, index: number) => (
                                <Chip
                                  key={index}
                                  label={formatCuisineType(type)}
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(247, 74, 161, 0.1)',
                                    color: '#F74AA1',
                                  }}
                                />
                              ))
                            ) : extractCuisineTypes(selectedExperience.preferences).length > 0 ? (
                              extractCuisineTypes(selectedExperience.preferences).map((type: string, index: number) => (
                                <Chip
                                  key={index}
                                  label={formatCuisineType(type)}
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(247, 74, 161, 0.1)',
                                    color: '#F74AA1',
                                  }}
                                />
                              ))
                            ) : (
                              <Typography color="text.secondary">Non spécifié</Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Mood fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="text.secondary">Ambiance :</Typography>
                          </Box>
                          <Typography>{formatAmbiance(selectedExperience.restaurant?.ambiance)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AttachMoney fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="text.secondary">Budget :</Typography>
                          </Box>
                          <Typography>{formatBudget(selectedExperience.restaurant?.budget)}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Sports sx={{ color: '#F59E3F' }} />
                        <Typography variant="h6" color="#F59E3F">Activité</Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Category fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="text.secondary">Type :</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {Array.isArray(selectedExperience.activity?.type) && selectedExperience.activity.type.length > 0 ? (
                              selectedExperience.activity.type.map((type: string, index: number) => (
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
                            ) : selectedExperience.activity?.type ? (
                              <Typography>{formatActivityType(selectedExperience.activity.type)}</Typography>
                            ) : extractActivityTypes(selectedExperience.preferences).length > 0 ? (
                              extractActivityTypes(selectedExperience.preferences).map((type: string, index: number) => (
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
                            ) : (
                              <Typography color="text.secondary">Non spécifié</Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Mood fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="text.secondary">Intensité :</Typography>
                          </Box>
                          <Typography>{formatIntensity(selectedExperience.activity?.intensity)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AttachMoney fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="text.secondary">Budget :</Typography>
                          </Box>
                          <Typography>{formatBudget(selectedExperience.activity?.budget)}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Event sx={{ color: '#F59E3F' }} />
                        <Typography variant="h6" color="#F59E3F">Informations complémentaires</Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Event fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="text.secondary">Date souhaitée :</Typography>
                          </Box>
                          <Typography>{format(new Date(selectedExperience.dateAndConstraints?.date), 'dd MMMM yyyy', { locale: fr })}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="text.secondary">Heure :</Typography>
                          </Box>
                          <Typography>{selectedExperience.dateAndConstraints?.time}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="text.secondary">Zone :</Typography>
                          </Box>
                          <Typography>{selectedExperience.dateAndConstraints?.location}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Group sx={{ color: '#F59E3F' }} />
                        <Typography variant="h6" color="#F59E3F">Personnalisation</Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Group fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="text.secondary">Type de groupe :</Typography>
                          </Box>
                          <Typography>
                            {selectedExperience.personalization?.groupDynamics === 'friends' ? 'Entre amis' : 'Événement spécial'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Mood fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="text.secondary">Ambiance :</Typography>
                          </Box>
                          <Typography>
                            {selectedExperience.personalization?.vibe === 'chill' ? 'Chill & Cosy' : 'Party & Fun'}
                          </Typography>
                        </Grid>
                        {selectedExperience.personalization?.specificRequests && (
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Description fontSize="small" color="action" />
                              <Typography variant="subtitle2" color="text.secondary">Demandes spécifiques :</Typography>
                            </Box>
                            <Typography>{selectedExperience.personalization.specificRequests}</Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ 
              p: 3,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              gap: 2
            }}>
              <Button 
                onClick={() => setOpenDialog(false)}
                variant="outlined"
                sx={{ 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                Fermer
              </Button>
              {selectedExperience.status === 'pending' && (
                <>
                  <Button 
                    variant="contained"
                    onClick={() => handleModify(selectedExperience.id)}
                    startIcon={<Edit />}
                    sx={{
                      background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                      border: 'none',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                        opacity: 0.9,
                        transform: 'translateY(-1px)',
                      }
                    }}
                  >
                    Modifier
                  </Button>
                  <Button 
                    variant="contained"
                    color="error"
                    onClick={() => setCancelConfirmOpen(true)}
                    startIcon={<Cancel />}
                    sx={{
                      '&:hover': {
                        transform: 'translateY(-1px)',
                      }
                    }}
                  >
                    Annuler la demande
                  </Button>
                </>
              )}
              <Button 
                variant="contained"
                onClick={() => generatePDF(selectedExperience)}
                startIcon={<PictureAsPdf />}
                sx={{
                  background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                  border: 'none',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                    opacity: 0.9,
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                Télécharger le résumé PDF
              </Button>
              {selectedExperience.itineraryId && (
                <Button
                  component={Link}
                  to={`/itinerary/${selectedExperience.itineraryId}`}
                  color="primary"
                  variant="contained"
                  startIcon={<Visibility />}
                >
                  Voir l'itinéraire
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog de confirmation d'annulation */}
      <Dialog
        open={cancelConfirmOpen}
        onClose={() => setCancelConfirmOpen(false)}
      >
        <DialogTitle>Confirmer l'annulation</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir annuler cette demande d'expérience personnalisée ?
            Cette action ne peut pas être annulée.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelConfirmOpen(false)}>Non, garder</Button>
          <Button 
            onClick={handleCancel}
            color="error"
            variant="contained"
          >
            Oui, annuler la demande
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserCustomExperiences; 