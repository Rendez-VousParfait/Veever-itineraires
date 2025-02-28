import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { Rocket, Star, Palette, TouchApp } from '@mui/icons-material';

const benefits = [
  {
    title: 'Un parcours clé en main',
    description: 'Plus besoin de passer des heures à organiser.',
    icon: <Rocket sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Des expériences uniques',
    description: 'Des lieux testés et approuvés par nos experts.',
    icon: <Star sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Un itinéraire adapté à votre style',
    description: 'Choisissez entre romantique ou entre potes.',
    icon: <Palette sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Réservation facile',
    description: 'Un seul clic et tout est prêt.',
    icon: <TouchApp sx={{ fontSize: 40 }} />,
  },
];

const WhyChooseVeever: React.FC = () => {
  return (
    <Box
      component="section"
      id="pourquoi"
      sx={{
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        background: '#10192c',
      }}
    >
      <Container 
        maxWidth={false}
        sx={{ 
          px: { xs: 2, sm: 4, md: 8, lg: 12 },
          maxWidth: '2000px',
          mx: 'auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 8,
              fontFamily: '"Acumin Extra Condensed", "Arial", sans-serif',
              fontWeight: 600,
              fontSize: { xs: '2.5rem', md: '4rem' },
              background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Pourquoi choisir un itinéraire Veever ?
          </Typography>
        </motion.div>

        <Grid container spacing={{ xs: 4, md: 6, lg: 8 }}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(30, 41, 59, 0.7)',
                    backdropFilter: 'blur(12px)',
                    border: '2px solid rgba(255, 214, 198, 0.3)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(255, 214, 198, 0.2)',
                      border: '2px solid rgba(255, 214, 198, 0.5)',
                      '& .icon-wrapper': {
                        transform: 'scale(1.1)',
                        background: 'linear-gradient(45deg, #FFD6C6, #FB793F)',
                      },
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box
                      className="icon-wrapper"
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '20px',
                        background: 'rgba(251, 121, 63, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        transition: 'all 0.3s ease',
                        color: '#FB793F',
                      }}
                    >
                      {benefit.icon}
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 2,
                        fontFamily: '"Poppins", "Arial", sans-serif',
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #FFD6C6, #FB793F)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {benefit.title}
                    </Typography>
                    <Typography 
                      variant="subtitle1"
                      sx={{
                        fontFamily: '"Poppins", "Arial", sans-serif',
                        fontWeight: 400,
                        color: '#CBD5E1',
                      }}
                    >
                      {benefit.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default WhyChooseVeever; 