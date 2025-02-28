import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <Box
      component="section"
      sx={{
        minHeight: 'calc(100vh - 80px)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background Image Layer avec filtre noir */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/images/hero_photo/hero-group.jpg)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)', // Voile noir légèrement plus foncé
            zIndex: 1,
          }
        }}
      />

      {/* Content */}
      <Container 
        maxWidth={false}
        sx={{ 
          position: 'relative',
          zIndex: 3,
          px: { xs: 2, sm: 4, md: 8, lg: 12 },
          maxWidth: '2000px',
          mx: 'auto',
        }}
      >
        <Stack spacing={4} alignItems="center" textAlign="center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                mb: 4,
                maxWidth: 1800,
                fontSize: { xs: '3rem', md: '4.5rem' }, // Taille légèrement augmentée
                fontWeight: 600, // Un peu plus gras
                background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 10px rgba(247, 74, 161, 0.3)', // Légère ombre pour améliorer la lisibilité
              }}
            >
              Swipez, Réservez et Profitez !
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                maxWidth: 800, 
                mb: 4,
                color: '#ffffff', // Blanc pur au lieu de text.secondary
                fontWeight: 400, // Normal
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)', // Légère ombre pour la lisibilité
              }}
            >
              Plus besoin de chercher où aller ! Découvrez nos parcours sélectionnés 
              avec soin pour vivre des expériences uniques, réservez en toute simplicité
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                href="#itineraires"
                sx={{
                  minWidth: 200,
                  background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                  },
                }}
              >
                Découvrir les itinéraires
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  minWidth: 200,
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: '#ffffff',
                  '&:hover': {
                    borderColor: '#ffffff',
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Je réserve mon itinéraire
              </Button>
            </Stack>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero; 