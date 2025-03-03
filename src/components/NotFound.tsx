import React, { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home } from '@mui/icons-material';

const funnyMessages = [
  "Oups ! Cette page s'est évaporée comme un café oublié...",
  "404 - Page partie faire une sieste prolongée",
  "Cette page joue à cache-cache, et elle est très douée !",
  "Houston, nous avons un problème : page introuvable",
  "La page a pris des vacances sans prévenir",
  "Même notre GPS ne trouve pas cette page",
  "Cette page est aussi introuvable que les chaussettes perdues",
  "404 - Page partie surfer sur d'autres vagues du web"
];

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  // Choisir un message aléatoire une seule fois au chargement du composant
  const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

  // Animation variants pour les chiffres 404
  const numberVariants = {
    initial: { y: -100, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        type: "spring",
        stiffness: 100
      }
    }),
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5
      }
    }
  };

  // Animation pour le texte
  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.4
      }
    }
  };

  // Animation pour le bouton
  const buttonVariants = {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: {
        duration: 0.3,
        delay: 0.8
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(247, 74, 161, 0.4)"
    }
  };

  // Animation pour le fond
  const backgroundVariants = {
    initial: { 
      backgroundPosition: "0% 50%"
    },
    animate: {
      backgroundPosition: "100% 50%",
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(-45deg, #10192c, #1a2942, #243752, #2d4562)',
        backgroundSize: '400% 400%'
      }}
      variants={backgroundVariants}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            py: 8,
            position: 'relative'
          }}
        >
          {/* Effet de particules en arrière-plan */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden',
              zIndex: 0,
              opacity: 0.1,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '200vh',
                height: '200vh',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(247, 74, 161, 0.2) 0%, rgba(245, 158, 63, 0.1) 100%)',
                animation: 'rotate 20s linear infinite',
              },
              '@keyframes rotate': {
                '0%': {
                  transform: 'translate(-50%, -50%) rotate(0deg)',
                },
                '100%': {
                  transform: 'translate(-50%, -50%) rotate(360deg)',
                },
              },
            }}
          />

          {/* Conteneur des chiffres 404 */}
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 2, md: 4 },
              mb: 4,
              position: 'relative',
              zIndex: 1
            }}
          >
            {['4', '0', '4'].map((number, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={numberVariants}
                whileHover="hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '6rem', sm: '8rem', md: '12rem' },
                    fontWeight: 900,
                    background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 20px rgba(247, 74, 161, 0.3)',
                    filter: 'drop-shadow(0 0 8px rgba(247, 74, 161, 0.3))',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      filter: 'drop-shadow(0 0 12px rgba(247, 74, 161, 0.5))',
                    }
                  }}
                >
                  {number}
                </Typography>
              </motion.div>
            ))}
          </Box>

          {/* Message d'erreur avec animation */}
          <motion.div variants={textVariants}>
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                fontWeight: 'bold'
              }}
            >
              {randomMessage}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: 'rgba(255,255,255,0.8)',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              En attendant de la retrouver, pourquoi ne pas retourner à l'accueil ?
            </Typography>
          </motion.div>

          {/* Boutons de navigation */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <motion.div variants={buttonVariants} whileHover="hover">
              <Button
                variant="contained"
                startIcon={<Home />}
                onClick={() => navigate('/')}
                sx={{
                  background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                  }
                }}
              >
                Retour à l'accueil
              </Button>
            </motion.div>

            <motion.div variants={buttonVariants} whileHover="hover">
              <Button
                variant="outlined"
                onClick={() => window.history.back()}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderColor: '#F74AA1',
                  color: 'white',
                  '&:hover': {
                    borderColor: '#F59E3F',
                  }
                }}
              >
                Page précédente
              </Button>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
};

export default NotFound; 