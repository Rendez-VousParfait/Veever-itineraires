import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
} from '@mui/material';
import {
  AccessTime,
  Group,
  AttachMoney,
  ArrowBack,
  Hotel,
  Restaurant,
  DirectionsWalk,
  LocalActivity,
  LocationOn,
  Star,
} from '@mui/icons-material';
import { getItineraryById } from '../firebase/itineraryService';
import { Itinerary, ItineraryStep } from '../types/itinerary';

const ItineraryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        if (!id) {
          setError('ID d\'itinéraire non spécifié');
          setLoading(false);
          return;
        }

        const fetchedItinerary = await getItineraryById(id);
        setItinerary(fetchedItinerary);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'itinéraire:', err);
        setError('Impossible de charger l\'itinéraire. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return <Hotel />;
      case 'restaurant':
        return <Restaurant />;
      case 'activity':
        return <LocalActivity />;
      case 'walking':
        return <DirectionsWalk />;
      default:
        return <LocalActivity />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !itinerary) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'Itinéraire non trouvé'}
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Retour à l'accueil
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBack />}
        sx={{ mb: 4 }}
      >
        Retour à l'accueil
      </Button>

      {/* En-tête de l'itinéraire */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {itinerary.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {itinerary.description}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                icon={<AccessTime />}
                label={`Durée: ${itinerary.duration}`}
                variant="outlined"
              />
              <Chip
                icon={<Group />}
                label={`Taille du groupe: ${itinerary.groupSize}`}
                variant="outlined"
              />
              <Chip
                icon={<AttachMoney />}
                label={`Prix: ${itinerary.price}€`}
                variant="outlined"
              />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {itinerary.tags?.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{ bgcolor: 'primary.light', color: 'white' }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                image={itinerary.image || '/images/default-itinerary.jpg'}
                alt={itinerary.title}
                sx={{ height: 250, objectFit: 'cover' }}
              />
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Étapes de l'itinéraire */}
      <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
        Votre itinéraire
      </Typography>
      <Stepper orientation="vertical" sx={{ mt: 4 }}>
        {itinerary.steps.map((step, index) => (
          <Step key={index} active={true}>
            <StepLabel
              StepIconComponent={() => (
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {getStepIcon(step.type)}
                </Avatar>
              )}
            >
              <Typography variant="h6">{step.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </StepLabel>
            <StepContent>
              <Card sx={{ mb: 2, mt: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {step.details.title}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {step.details.description}
                  </Typography>

                  {step.details.images && step.details.images.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, overflowX: 'auto', pb: 1 }}>
                      {step.details.images.map((image, imgIndex) => (
                        <Box
                          key={imgIndex}
                          component="img"
                          src={image}
                          alt={`${step.name} image ${imgIndex + 1}`}
                          sx={{
                            width: 120,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  <List dense>
                    {step.details.adresse && (
                      <ListItem>
                        <ListItemIcon>
                          <LocationOn fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={step.details.adresse} />
                      </ListItem>
                    )}
                    {step.details.prix && (
                      <ListItem>
                        <ListItemIcon>
                          <AttachMoney fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={step.details.prix} />
                      </ListItem>
                    )}
                  </List>

                  {step.details.avis && step.details.avis.length > 0 && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Avis
                      </Typography>
                      {step.details.avis.map((avis, avisIndex) => (
                        <Box key={avisIndex} sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" fontWeight="bold">
                              {avis.author}
                            </Typography>
                            <Rating
                              value={avis.rating}
                              readOnly
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                          <Typography variant="body2">{avis.comment}</Typography>
                        </Box>
                      ))}
                    </>
                  )}
                </CardContent>
              </Card>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Container>
  );
};

export default ItineraryDetail; 