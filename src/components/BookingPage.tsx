import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  Stack,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { AccessTime, Groups, Euro, ArrowBack } from '@mui/icons-material';
import { Itinerary } from './Itineraries';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../firebase/itineraryService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BookingPageProps {
  itinerary: Itinerary;
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

const BookingPage: React.FC<BookingPageProps> = ({ itinerary }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // États pour le formulaire de réservation
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState(1);
  const [date, setDate] = useState('');
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: currentUser?.email || '',
    phone: '',
  });
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Validation du formulaire
  const [formErrors, setFormErrors] = useState({
    participants: false,
    date: false,
    name: false,
    email: false,
    phone: false,
  });

  // Prix fictifs pour chaque type de prestation
  const getPriceByType = (type: string) => {
    switch (type) {
      case 'hotel':
        return itinerary.price * 0.5;
      case 'restaurant':
        return itinerary.price * 0.2;
      case 'activity':
        return itinerary.price * 0.3;
      default:
        return 0;
    }
  };
  
  // Ouvrir le dialogue de réservation
  const handleOpenDialog = () => {
    if (!currentUser) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      navigate('/login', { state: { from: `/itinerary/${itinerary.id}` } });
      return;
    }
    setOpenDialog(true);
  };
  
  // Fermer le dialogue de réservation
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Valider le formulaire
  const validateForm = (): boolean => {
    const errors = {
      participants: participants < 1,
      date: !date,
      name: !contactInfo.name.trim(),
      email: !contactInfo.email.trim() || !/\S+@\S+\.\S+/.test(contactInfo.email),
      phone: !contactInfo.phone.trim(),
    };
    
    setFormErrors(errors);
    
    return !Object.values(errors).some(error => error);
  };
  
  // Soumettre la commande
  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      return;
    }
    
    if (!currentUser) {
      setError("Vous devez être connecté pour effectuer une réservation.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Créer la commande dans Firebase
      const orderData = {
        userId: currentUser.uid,
        itineraryId: itinerary.id,
        itineraryTitle: itinerary.title,
        itineraryImage: itinerary.image,
        price: itinerary.price,
        date: date,
        participants: participants,
        contactInfo: contactInfo,
        specialRequests: specialRequests,
        status: 'pending' as const,
      };
      
      await createOrder(orderData);
      
      setSuccess(true);
      setLoading(false);
      
      // Fermer le dialogue après 2 secondes
      setTimeout(() => {
        setOpenDialog(false);
        // Rediriger vers la page de profil après 1 seconde supplémentaire
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      }, 2000);
      
    } catch (err) {
      setError("Une erreur est survenue lors de la création de votre commande. Veuillez réessayer.");
      setLoading(false);
      console.error("Erreur lors de la création de la commande:", err);
    }
  };
  
  // Gérer la fermeture du message de succès
  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 8,
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ mb: 4, color: 'white' }}
          >
            Retour
          </Button>

          <Typography
            variant="h3"
            sx={{
              mb: 6,
              background: 'linear-gradient(45deg, #6366f1, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Réservation de votre itinéraire
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper
                sx={{
                  p: 4,
                  bgcolor: 'rgba(30, 41, 59, 0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                  borderRadius: '16px',
                }}
              >
                <Typography variant="h5" gutterBottom>
                  {itinerary.title}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {itinerary.description}
                </Typography>

                <Stack direction="row" spacing={2} mb={4}>
                  <Chip
                    icon={<AccessTime sx={{ color: '#6366f1' }} />}
                    label={itinerary.duration}
                    sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)' }}
                  />
                  <Chip
                    icon={<Groups sx={{ color: '#6366f1' }} />}
                    label={itinerary.groupSize}
                    sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)' }}
                  />
                </Stack>

                <Typography variant="h6" gutterBottom>
                  Détail des prestations
                </Typography>

                {itinerary.steps.map((step, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        p: 3,
                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '12px',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {step.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {step.description}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ color: '#6366f1' }}>
                        {getPriceByType(step.type)}€
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 4,
                  bgcolor: 'rgba(30, 41, 59, 0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                  borderRadius: '16px',
                  position: 'sticky',
                  top: 24,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Récapitulatif
                </Typography>
                
                <Stack spacing={2} mb={4}>
                  {itinerary.steps.map((step, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography>{step.name}</Typography>
                      <Typography>{getPriceByType(step.type)}€</Typography>
                    </Stack>
                  ))}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" sx={{ color: '#6366f1' }}>
                      {itinerary.price}€
                    </Typography>
                  </Stack>
                </Stack>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleOpenDialog}
                  sx={{
                    py: 2,
                    background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                    },
                  }}
                >
                  Réserver maintenant
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
      
      {/* Dialogue de réservation */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Finaliser votre réservation</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Votre réservation a été enregistrée avec succès !
            </Alert>
          )}
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Itinéraire : {itinerary.title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Prix total : {itinerary.price}€
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formErrors.participants}>
                <InputLabel id="participants-label">Nombre de participants</InputLabel>
                <Select
                  labelId="participants-label"
                  value={participants}
                  label="Nombre de participants"
                  onChange={(e) => setParticipants(Number(e.target.value))}
                  disabled={loading || success}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.participants && (
                  <FormHelperText>Veuillez sélectionner le nombre de participants</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date de l'expérience"
                type="date"
                fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                error={formErrors.date}
                helperText={formErrors.date ? "Veuillez sélectionner une date" : ""}
                disabled={loading || success}
                inputProps={{ min: format(new Date(), 'yyyy-MM-dd') }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                Informations de contact
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Nom complet"
                fullWidth
                value={contactInfo.name}
                onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                error={formErrors.name}
                helperText={formErrors.name ? "Veuillez entrer votre nom" : ""}
                disabled={loading || success}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                error={formErrors.email}
                helperText={formErrors.email ? "Veuillez entrer une adresse email valide" : ""}
                disabled={loading || success}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Téléphone"
                fullWidth
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                error={formErrors.phone}
                helperText={formErrors.phone ? "Veuillez entrer votre numéro de téléphone" : ""}
                disabled={loading || success}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Demandes spéciales (optionnel)"
                fullWidth
                multiline
                rows={3}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                disabled={loading || success}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmitOrder} 
            variant="contained" 
            color="primary"
            disabled={loading || success}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Traitement en cours..." : "Confirmer la réservation"}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification de succès */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Votre réservation a été enregistrée avec succès !"
      />
    </Box>
  );
};

export default BookingPage; 