import React from 'react';
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
} from '@mui/material';
import { AccessTime, Groups, Euro, ArrowBack } from '@mui/icons-material';
import { Itinerary } from './Itineraries';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BookingPageProps {
  itinerary: Itinerary;
}

const BookingPage: React.FC<BookingPageProps> = ({ itinerary }) => {
  const navigate = useNavigate();

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
                  sx={{
                    py: 2,
                    background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                    },
                  }}
                >
                  Payer {itinerary.price}€
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default BookingPage; 