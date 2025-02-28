import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  IconButton,
  Grid,
  Divider,
  Rating,
} from '@mui/material';
import {
  Close,
  AccessTime,
  Groups,
  Euro,
  Hotel,
  Restaurant,
  Spa,
  LocationOn,
  Info,
  CalendarToday,
  CreditCard,
  Facebook,
  Twitter,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { Itinerary } from './Itineraries';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ItineraryModalProps {
  itinerary: Itinerary;
  open: boolean;
  onClose: () => void;
}

const ItineraryModal: React.FC<ItineraryModalProps> = ({ itinerary, open, onClose }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = itinerary.images || [itinerary.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(99, 102, 241, 0.1)',
        },
      }}
    >
      <DialogTitle sx={{ position: 'relative', pb: 0 }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={4}>
          {/* Colonne de gauche */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ position: 'relative', mb: 4 }}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="img"
                    src={images[currentImageIndex]}
                    alt={`Vue ${currentImageIndex + 1} de ${itinerary.title}`}
                    sx={{
                      width: '100%',
                      height: 400,
                      objectFit: 'cover',
                    }}
                  />
                  
                  {/* Boutons de navigation */}
                  <IconButton
                    onClick={previousImage}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                    }}
                  >
                    <ArrowBack sx={{ color: 'white' }} />
                  </IconButton>
                  
                  <IconButton
                    onClick={nextImage}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                    }}
                  >
                    <ArrowForward sx={{ color: 'white' }} />
                  </IconButton>

                  {/* Indicateurs */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {images.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer',
                        }}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </Stack>
                </Box>
                
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    p: 2,
                    borderRadius: '0 0 16px 16px',
                  }}
                >
                  <Typography variant="h4" color="white">
                    {itinerary.title}
                  </Typography>
                  <Rating value={itinerary.rating} readOnly sx={{ mt: 1 }} />
                </Box>
              </Box>

              <Stack direction="row" spacing={2} mb={3}>
                <Chip
                  icon={<AccessTime />}
                  label={itinerary.duration}
                  sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)' }}
                />
                <Chip
                  icon={<Groups />}
                  label={itinerary.groupSize}
                  sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)' }}
                />
                <Chip
                  icon={<Euro />}
                  label={`${itinerary.price}€`}
                  sx={{ bgcolor: 'rgba(236, 72, 153, 0.1)' }}
                />
              </Stack>

              <Typography variant="body1" color="text.secondary" paragraph>
                {itinerary.description}
              </Typography>

              <Box sx={{ my: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ 
                  background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                }}>
                  Programme détaillé
                </Typography>

                {itinerary.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      spacing={2}
                      sx={{
                        p: 3,
                        mb: 2,
                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '12px',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(8px)',
                          bgcolor: 'rgba(99, 102, 241, 0.2)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                          flexShrink: 0,
                        }}
                      >
                        {step.icon}
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {step.name}
                        </Typography>
                        <Typography color="text.secondary">
                          {step.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Colonne de droite */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '16px',
                  p: 3,
                  mb: 4,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Informations pratiques
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CalendarToday sx={{ color: '#6366f1' }} />
                    <Typography>Réservation possible jusqu'à 48h avant</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CreditCard sx={{ color: '#6366f1' }} />
                    <Typography>Paiement sécurisé en ligne</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Info sx={{ color: '#6366f1' }} />
                    <Typography>Annulation gratuite jusqu'à 7 jours avant</Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  bgcolor: 'rgba(236, 72, 153, 0.1)',
                  borderRadius: '16px',
                  p: 3,
                  mb: 4,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Ce qui est inclus
                </Typography>
                <Stack spacing={2}>
                  <Typography>• Toutes les réservations</Typography>
                  <Typography>• Guide personnel (en option)</Typography>
                  <Typography>• Transport entre les étapes</Typography>
                  <Typography>• Assistance 24/7</Typography>
                </Stack>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => {
                  onClose();
                  navigate(`/booking/${itinerary.id}`, { state: { itinerary } });
                }}
                sx={{
                  background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                  },
                  py: 2,
                  fontSize: '1.1rem',
                }}
              >
                Réserver pour {itinerary.price}€
              </Button>

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  startIcon={<Facebook />}
                  onClick={() => {
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                      '_blank'
                    );
                  }}
                  sx={{
                    bgcolor: '#1877f2',
                    color: 'white',
                    '&:hover': { bgcolor: '#166fe5' },
                  }}
                >
                  Partager
                </Button>
                <Button
                  startIcon={<Twitter />}
                  onClick={() => {
                    window.open(
                      `https://twitter.com/intent/tweet?text=Découvrez cet itinéraire sur Veever : ${window.location.href}`,
                      '_blank'
                    );
                  }}
                  sx={{
                    bgcolor: '#1da1f2',
                    color: 'white',
                    '&:hover': { bgcolor: '#1a91da' },
                  }}
                >
                  Twitter
                </Button>
              </Stack>
            </motion.div>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ItineraryModal; 