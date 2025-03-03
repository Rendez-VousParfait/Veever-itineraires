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
  TextField,
  MenuItem,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Sort,
  CheckCircle,
  Schedule,
  Pending,
  ExpandMore,
  FilterList,
  GetApp,
  Assessment,
  NoteAdd,
  Event,
  Restaurant,
  Category,
  Style,
  AttachMoney,
  Mood,
  Sports,
  AccessTime,
  LocationOn,
  Group,
  Description,
  History,
  Hotel,
  Add,
} from '@mui/icons-material';
import { customExperienceService } from '../../firebase/customExperienceService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import ItineraryStepForm from './ItineraryStepForm';
import { createItinerary } from '../../firebase/itineraryService';
import { Itinerary, ItineraryStep } from '../../types/itinerary';

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

// Fonction pour formater les timestamps de manière sécurisée
const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return 'Date inconnue';
  
  try {
    // Si c'est déjà un objet Date
    if (timestamp instanceof Date) {
      return format(timestamp, 'dd/MM/yyyy HH:mm', { locale: fr });
    }
    
    // Si c'est un timestamp Firestore avec méthode toDate()
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      return format(timestamp.toDate(), 'dd/MM/yyyy HH:mm', { locale: fr });
    }
    
    // Si c'est un nombre ou une chaîne qui peut être convertie en Date
    if (typeof timestamp === 'number' || typeof timestamp === 'string') {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
      }
    }
    
    // Si aucune conversion n'a fonctionné
    return 'Date invalide';
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return 'Erreur de date';
  }
};

const AdminCustomExperiences: React.FC = () => {
  const { currentUser } = useAuth();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [filters, setFilters] = useState({
    zone: '',
    budget: '',
    type: '',
    dateRange: 'all',
  });
  const [stats, setStats] = useState<any>(null);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<any[]>([]);
  const [openCreateItineraryDialog, setOpenCreateItineraryDialog] = useState(false);
  const [experienceForItinerary, setExperienceForItinerary] = useState<any>(null);
  const [itineraryFormData, setItineraryFormData] = useState<Partial<Itinerary>>({
    type: 'couples',
    title: '',
    description: '',
    image: '',
    steps: [],
    price: 0,
    duration: '',
    groupSize: '',
    tags: [],
    date: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExperiences();
    loadStats();
  }, []);

  useEffect(() => {
    if (selectedExperience?.id) {
      loadNotes(selectedExperience.id);
    }
  }, [selectedExperience]);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const allExperiences = await customExperienceService.getAllCustomExperiences();
      setExperiences(sortExperiences(allExperiences, sortOrder));
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

  const handleStatusChange = async (experienceId: string, newStatus: string) => {
    try {
      await customExperienceService.updateExperienceStatus(experienceId, newStatus);
      await loadExperiences();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const getStatusChip = (status: string) => {
    const statusConfig: { [key: string]: { icon: any; color: string; label: string } } = {
      pending: { icon: <Pending />, color: '#ffc107', label: 'En attente' },
      processing: { icon: <Schedule />, color: '#2196f3', label: 'En cours' },
      completed: { icon: <CheckCircle />, color: '#4caf50', label: 'Terminé' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Chip
        icon={config.icon}
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

  const loadStats = async () => {
    try {
      const statistics = await customExperienceService.getStatistics();
      setStats(statistics);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const loadNotes = async (experienceId: string) => {
    try {
      const notes = await customExperienceService.getInternalNotes(experienceId);
      setNotes(notes);
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedExperience?.id || !currentUser?.email) return;

    try {
      await customExperienceService.addInternalNote(
        selectedExperience.id,
        newNote,
        currentUser.email
      );
      setNewNote('');
      await loadNotes(selectedExperience.id);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error);
    }
  };

  const handleExport = async () => {
    try {
      const data = await customExperienceService.exportToCSV();
      const csvContent = data.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `experiences_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.click();
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    }
  };

  const applyFilters = (experience: any) => {
    if (filters.zone && experience.dateAndConstraints.location !== filters.zone) return false;
    if (filters.type && experience.itineraryType !== filters.type) return false;
    if (filters.budget) {
      const budgets = [
        experience.restaurant?.budget,
        experience.activity?.budget,
        experience.accommodation?.budget,
      ];
      if (!budgets.includes(filters.budget)) return false;
    }
    if (filters.dateRange !== 'all') {
      const date = new Date(experience.createdAt);
      const now = new Date();
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      if (filters.dateRange === 'month' && date < monthAgo) return false;
    }
    return true;
  };

  const filteredExperiences = experiences
    .filter(exp => statusFilter === 'all' ? true : exp.status === statusFilter)
    .filter(applyFilters);

  const handleCreateItinerary = (experience: any) => {
    // Préremplir le formulaire avec les données de l'expérience
    const newItineraryData: Partial<Itinerary> = {
      type: 'couples', // Par défaut pour les expériences personnalisées
      title: `Expérience personnalisée pour ${experience.userEmail}`,
      description: `Itinéraire créé en réponse à la demande d'expérience personnalisée du ${formatTimestamp(experience.createdAt)}`,
      image: '/images/custom-experience.jpg', // Image par défaut
      steps: [],
      price: 0, // À définir par l'administrateur
      duration: experience.dateAndConstraints?.time || '1 jour',
      groupSize: '2 personnes',
      tags: [],
      date: format(new Date(), 'yyyy-MM-dd'),
    };

    // Ajouter des étapes basées sur le type d'itinéraire
    const steps: ItineraryStep[] = [];

    // Ajouter l'hébergement si c'est un week-end complet
    if (experience.itineraryType === 'hotel-restaurant-activity' && experience.accommodation) {
      const hotelStep: ItineraryStep = {
        type: 'hotel',
        name: 'Hébergement recommandé',
        description: `${formatAccommodationType(experience.accommodation.types[0])} - ${formatStyle(experience.accommodation.style)}`,
        icon: <Hotel />,
        details: {
          title: 'Hébergement personnalisé',
          description: `Un hébergement ${formatAccommodationType(experience.accommodation.types[0])} avec un style ${formatStyle(experience.accommodation.style)}.`,
          images: [],
          adresse: experience.dateAndConstraints?.location || 'Paris',
          prix: formatBudget(experience.accommodation.budget),
          avis: [],
        },
      };
      steps.push(hotelStep);
    }

    // Ajouter le restaurant
    const restaurantStep: ItineraryStep = {
      type: 'restaurant',
      name: 'Restaurant recommandé',
      description: `${formatCuisineType(extractCuisineTypes(experience.preferences)[0] || '')} - ${formatAmbiance(experience.restaurant.ambiance)}`,
      icon: <Restaurant />,
      details: {
        title: 'Restaurant personnalisé',
        description: `Un restaurant avec une ambiance ${formatAmbiance(experience.restaurant.ambiance)}.`,
        images: [],
        adresse: experience.dateAndConstraints?.location || 'Paris',
        prix: formatBudget(experience.restaurant.budget),
        avis: [],
      },
    };
    steps.push(restaurantStep);

    // Ajouter l'activité
    const activityStep: ItineraryStep = {
      type: 'activity',
      name: 'Activité recommandée',
      description: `${formatActivityType(extractActivityTypes(experience.preferences)[0] || '')} - Intensité: ${formatIntensity(experience.activity.intensity)}`,
      icon: <Sports />,
      details: {
        title: 'Activité personnalisée',
        description: `Une activité de type ${formatActivityType(extractActivityTypes(experience.preferences)[0] || '')} avec une intensité ${formatIntensity(experience.activity.intensity)}.`,
        images: [],
        adresse: experience.dateAndConstraints?.location || 'Paris',
        prix: formatBudget(experience.activity.budget),
        avis: [],
      },
    };
    steps.push(activityStep);

    newItineraryData.steps = steps;
    setItineraryFormData(newItineraryData);
    setExperienceForItinerary(experience);
    setOpenCreateItineraryDialog(true);
  };

  const handleItineraryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItineraryFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleStepsChange = (steps: ItineraryStep[]) => {
    setItineraryFormData(prev => ({
      ...prev,
      steps
    }));
  };

  const handleSaveItinerary = async () => {
    try {
      setLoading(true);
      
      // Créer l'itinéraire
      const itineraryId = await createItinerary(itineraryFormData as Omit<Itinerary, 'id'>);
      
      // Mettre à jour l'expérience personnalisée avec l'ID de l'itinéraire créé
      if (experienceForItinerary?.id) {
        await customExperienceService.updateExperienceWithItinerary(
          experienceForItinerary.id, 
          itineraryId,
          currentUser?.email || 'admin'
        );
      }
      
      // Recharger les expériences
      await loadExperiences();
      
      // Fermer le dialogue
      setOpenCreateItineraryDialog(false);
      setExperienceForItinerary(null);
      setItineraryFormData({
        type: 'couples',
        title: '',
        description: '',
        image: '',
        steps: [],
        price: 0,
        duration: '',
        groupSize: '',
        tags: [],
        date: '',
      });
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la création de l\'itinéraire:', err);
      setError('Erreur lors de la création de l\'itinéraire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Gestion des Expériences Personnalisées
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            variant="outlined"
            size="small"
          >
            Filtres avancés
          </Button>
          <Button
            startIcon={<Assessment />}
            onClick={() => setShowStats(!showStats)}
            variant="outlined"
            size="small"
          >
            Statistiques
          </Button>
          <Button
            startIcon={<GetApp />}
            onClick={handleExport}
            variant="outlined"
            size="small"
          >
            Exporter CSV
          </Button>
        </Box>
      </Box>

      <Accordion expanded={showFilters} onChange={() => setShowFilters(!showFilters)}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Filtres avancés</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Zone"
                value={filters.zone}
                onChange={(e) => setFilters({ ...filters, zone: e.target.value })}
              >
                <MenuItem value="">Toutes les zones</MenuItem>
                <MenuItem value="paris">Paris</MenuItem>
                <MenuItem value="idf">Île-de-France</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Budget"
                value={filters.budget}
                onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
              >
                <MenuItem value="">Tous les budgets</MenuItem>
                <MenuItem value="economic">Économique</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Type"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <MenuItem value="">Tous les types</MenuItem>
                <MenuItem value="hotel-restaurant-activity">Week-end Complet</MenuItem>
                <MenuItem value="restaurant-activity">Sortie Express</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Période"
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              >
                <MenuItem value="all">Toutes les périodes</MenuItem>
                <MenuItem value="month">Dernier mois</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {showStats && stats && (
        <Card sx={{ mb: 3, mt: 2 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" gutterBottom>Aperçu général</Typography>
                <Typography>Total des demandes : {stats.total}</Typography>
                <Typography>Ce mois-ci : {stats.thisMonth}</Typography>
                <Typography>Taux de conversion : {(stats.conversionRate * 100).toFixed(1)}%</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" gutterBottom>Par statut</Typography>
                <Typography>En attente : {stats.byStatus.pending}</Typography>
                <Typography>En cours : {stats.byStatus.processing}</Typography>
                <Typography>Terminé : {stats.byStatus.completed}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" gutterBottom>Par type</Typography>
                <Typography>Week-ends : {stats.byType.weekend}</Typography>
                <Typography>Sorties Express : {stats.byType.express}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date de création</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Date souhaitée</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExperiences.map((experience) => (
              <TableRow key={experience.id}>
                <TableCell>
                  {formatTimestamp(experience.createdAt)}
                </TableCell>
                <TableCell>
                  {experience.itineraryType === 'hotel-restaurant-activity' 
                    ? 'Week-end Complet' 
                    : 'Sortie Express'}
                </TableCell>
                <TableCell>{experience.userEmail || 'Non spécifié'}</TableCell>
                <TableCell>
                  {experience.dateAndConstraints?.date 
                    ? formatTimestamp(experience.dateAndConstraints.date)
                    : 'Non spécifié'}
                </TableCell>
                <TableCell>{getStatusChip(experience.status)}</TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => {
                      setSelectedExperience(experience);
                      setOpenDialog(true);
                    }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton 
                    size="small"
                    onClick={() => {
                      const nextStatus = {
                        'pending': 'processing',
                        'processing': 'completed',
                        'completed': 'completed'
                      }[experience.status];
                      handleStatusChange(experience.id, nextStatus);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  {(experience.status === 'processing' || experience.status === 'completed') && (
                    <Tooltip title="Créer un itinéraire">
                      <IconButton 
                        size="small"
                        color="primary"
                        onClick={() => handleCreateItinerary(experience)}
                      >
                        <Add />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
                    Créée le {formatTimestamp(selectedExperience.createdAt)}
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
                          <Typography>{formatTimestamp(selectedExperience.dateAndConstraints?.date)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="text.secondary">Heure :</Typography>
                          </Box>
                          <Typography>{selectedExperience.dateAndConstraints?.time || 'Non spécifiée'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="subtitle2" color="text.secondary">Zone :</Typography>
                          </Box>
                          <Typography>{selectedExperience.dateAndConstraints?.location || 'Non spécifiée'}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {selectedExperience.personalization && (
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
                        <NoteAdd sx={{ color: '#F59E3F' }} />
                        <Typography variant="h6" color="#F59E3F">Notes internes</Typography>
                      </Box>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      placeholder="Ajouter une note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#F59E3F',
                              },
                            },
                          }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<NoteAdd />}
                      onClick={handleAddNote}
                          sx={{ 
                            mt: 1,
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
                      Ajouter une note
                    </Button>
                  </Box>
                  <List>
                    {notes.map((note: any) => (
                      <React.Fragment key={note.id}>
                        <ListItem>
                          <ListItemText
                            primary={note.content}
                                secondary={`${note.createdBy} - ${formatTimestamp(note.createdAt)}`}
                          />
                        </ListItem>
                            <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                      </React.Fragment>
                    ))}
                  </List>
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
                        <History sx={{ color: '#F59E3F' }} />
                        <Typography variant="h6" color="#F59E3F">Historique des statuts</Typography>
                      </Box>
                  <List>
                    {selectedExperience.statusHistory?.map((entry: any, index: number) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={`Statut : ${entry.status}`}
                                secondary={`${entry.updatedBy} - ${formatTimestamp(entry.timestamp)}`}
                          />
                        </ListItem>
                        {entry.note && (
                          <ListItem>
                            <ListItemText
                              secondary={`Note : ${entry.note}`}
                              sx={{ pl: 2 }}
                            />
                          </ListItem>
                        )}
                            <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                      </React.Fragment>
                    ))}
                  </List>
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
              <Button 
                variant="contained" 
                onClick={() => {
                  const nextStatus = {
                    'pending': 'processing',
                    'processing': 'completed',
                    'completed': 'completed'
                  }[selectedExperience.status];
                  handleStatusChange(selectedExperience.id, nextStatus);
                  setOpenDialog(false);
                }}
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
                {selectedExperience.status === 'completed' 
                  ? 'Terminé' 
                  : selectedExperience.status === 'processing' 
                    ? 'Marquer comme terminé' 
                    : 'Marquer en cours'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialogue de création d'itinéraire */}
      <Dialog
        open={openCreateItineraryDialog}
        onClose={() => setOpenCreateItineraryDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Créer un itinéraire personnalisé
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Titre"
                  name="title"
                  value={itineraryFormData.title}
                  onChange={handleItineraryInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Image (URL)"
                  name="image"
                  value={itineraryFormData.image}
                  onChange={handleItineraryInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={itineraryFormData.description}
                  onChange={handleItineraryInputChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Prix"
                  name="price"
                  type="number"
                  value={itineraryFormData.price}
                  onChange={handleItineraryInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Durée"
                  name="duration"
                  value={itineraryFormData.duration}
                  onChange={handleItineraryInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Taille du groupe"
                  name="groupSize"
                  value={itineraryFormData.groupSize}
                  onChange={handleItineraryInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tags (séparés par des virgules)"
                  name="tags"
                  value={itineraryFormData.tags?.join(', ')}
                  onChange={(e) => {
                    setItineraryFormData(prev => ({
                      ...prev,
                      tags: e.target.value.split(',').map(tag => tag.trim())
                    }));
                  }}
                />
              </Grid>
            </Grid>

            <ItineraryStepForm
              steps={itineraryFormData.steps || []}
              onChange={handleStepsChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateItineraryDialog(false)}>
            Annuler
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveItinerary}
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer l\'itinéraire'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCustomExperiences; 