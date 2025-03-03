import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  MenuItem,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Hotel,
  Restaurant,
  Spa,
} from '@mui/icons-material';
import {
  getAllItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  updateHomeDisplay,
  updateItineraryDisplay,
} from '../../firebase/itineraryService';
import { Itinerary, ItineraryStep, ItineraryType } from '../../types/itinerary';
import ItineraryStepForm from './ItineraryStepForm';
import { initializeItineraries } from '../../firebase/initializeData';

const ItineraryManagement: React.FC = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(null);
  const [formData, setFormData] = useState<Partial<Itinerary>>({
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
    displayOnHome: false,
    displayStartDate: null,
    displayEndDate: null,
  });

  console.log('ItineraryManagement - Rendu initial');

  // Charger les itinéraires au montage du composant
  useEffect(() => {
    console.log('ItineraryManagement - useEffect déclenché');
    loadItineraries();
  }, []);

  // Charger tous les itinéraires
  const loadItineraries = async () => {
    console.log('ItineraryManagement - Début du chargement des itinéraires');
    try {
      setLoading(true);
      const data = await getAllItineraries();
      console.log('ItineraryManagement - Itinéraires chargés:', data);
      setItineraries(data);
      setError(null);
    } catch (err) {
      console.error('ItineraryManagement - Erreur de chargement:', err);
      setError('Erreur lors du chargement des itinéraires');
    } finally {
      setLoading(false);
    }
  };

  // Gérer l'ouverture du dialogue
  const handleOpenDialog = (itinerary?: Itinerary) => {
    if (itinerary) {
      setEditingItinerary(itinerary);
      setFormData(itinerary);
    } else {
      setEditingItinerary(null);
      setFormData({
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
        displayOnHome: false,
        displayStartDate: null,
        displayEndDate: null,
      });
    }
    setOpenDialog(true);
  };

  // Gérer la fermeture du dialogue
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItinerary(null);
    setFormData({
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
      displayOnHome: false,
      displayStartDate: null,
      displayEndDate: null,
    });
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Gestion spéciale pour les dates
    if (name === 'displayStartDate' || name === 'displayEndDate') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? new Date(value) : null
      }));
      return;
    }
    
    // Gestion normale pour les autres champs
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editingItinerary) {
        await updateItinerary(editingItinerary.id, formData);
      } else {
        await createItinerary(formData as Omit<Itinerary, 'id'>);
      }
      await loadItineraries();
      handleCloseDialog();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la sauvegarde de l\'itinéraire');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Gérer la suppression d'un itinéraire
  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet itinéraire ?')) {
      try {
        setLoading(true);
        await deleteItinerary(id);
        await loadItineraries();
        setError(null);
      } catch (err) {
        setError('Erreur lors de la suppression de l\'itinéraire');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInitializeItineraries = async () => {
    try {
      setLoading(true);
      await initializeItineraries();
      await loadItineraries();
      setError(null);
    } catch (err) {
      console.error('Erreur lors de l\'initialisation des itinéraires:', err);
      setError('Erreur lors de l\'initialisation des itinéraires');
    } finally {
      setLoading(false);
    }
  };

  const handleHomeDisplayToggle = async (id: number, currentValue: boolean, startDate?: Date, endDate?: Date) => {
    try {
      setLoading(true);
      await updateItineraryDisplay(id, !currentValue, startDate, endDate);
      await loadItineraries();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'affichage');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestion des Itinéraires
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={handleInitializeItineraries}
            disabled={loading}
          >
            Initialiser les itinéraires
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nouvel Itinéraire
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Titre</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Prix</TableCell>
                <TableCell>Durée</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Affichage Accueil</TableCell>
                <TableCell>Période d'affichage</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itineraries.map((itinerary) => (
                <TableRow key={itinerary.id}>
                  <TableCell>{itinerary.id}</TableCell>
                  <TableCell>{itinerary.title}</TableCell>
                  <TableCell>{itinerary.type}</TableCell>
                  <TableCell>{itinerary.price}€</TableCell>
                  <TableCell>{itinerary.duration}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {itinerary.tags?.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={itinerary.displayOnHome || false}
                      onChange={() => handleHomeDisplayToggle(
                        itinerary.id,
                        itinerary.displayOnHome || false,
                        itinerary.displayStartDate,
                        itinerary.displayEndDate
                      )}
                      disabled={loading}
                    />
                  </TableCell>
                  <TableCell>
                    {itinerary.displayOnHome ? (
                      <>
                        Du: {itinerary.displayStartDate instanceof Date ? itinerary.displayStartDate.toLocaleDateString('fr-FR') : 'Non défini'}
                        <br />
                        Au: {itinerary.displayEndDate instanceof Date ? itinerary.displayEndDate.toLocaleDateString('fr-FR') : 'Non défini'}
                      </>
                    ) : 'Non affiché'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(itinerary)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(itinerary.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingItinerary ? 'Modifier l\'itinéraire' : 'Nouvel itinéraire'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  margin="normal"
                >
                  <MenuItem value="couples">Couples</MenuItem>
                  <MenuItem value="groups">Groupes</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="Titre"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  margin="normal"
                  multiline
                  rows={4}
                />
                <TextField
                  fullWidth
                  label="Image URL"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Prix"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Durée"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Taille du groupe"
                  name="groupSize"
                  value={formData.groupSize}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Tags (séparés par des virgules)"
                  name="tags"
                  value={formData.tags?.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    tags: e.target.value.split(',').map(tag => tag.trim())
                  }))}
                  margin="normal"
                  helperText="Entrez les tags séparés par des virgules"
                />
                <TextField
                  fullWidth
                  label="Date de début d'affichage"
                  name="displayStartDate"
                  type="date"
                  value={formData.displayStartDate instanceof Date ? formData.displayStartDate.toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  fullWidth
                  label="Date de fin d'affichage"
                  name="displayEndDate"
                  type="date"
                  value={formData.displayEndDate instanceof Date ? formData.displayEndDate.toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ItineraryStepForm
                  steps={formData.steps || []}
                  onChange={(newSteps) => setFormData(prev => ({
                    ...prev,
                    steps: newSteps
                  }))}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingItinerary ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ItineraryManagement; 