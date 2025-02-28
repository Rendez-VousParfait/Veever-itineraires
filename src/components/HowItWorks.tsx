import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { Search, Payment, Celebration } from '@mui/icons-material';

const steps = [
  {
    number: '1',
    icon: <Search sx={{ fontSize: 40 }} />,
    title: 'Choisissez votre itinéraire',
    description: 'Sélectionnez parmi nos suggestions celui qui vous correspond le mieux.'
  },
  {
    number: '2',
    icon: <Payment sx={{ fontSize: 40 }} />,
    title: 'Réservez en quelques clics',
    description: 'Réservation simple et rapide directement en ligne.'
  },
  {
    number: '3',
    icon: <Celebration sx={{ fontSize: 40 }} />,
    title: 'Profitez de l\'expérience',
    description: 'Recevez toutes les infos et vivez votre aventure sans stress.'
  }
];

const HowItWorks: React.FC = () => {
  return (
    <Box
      component="section"
      id="comment"
      sx={{
        py: 12,
        background: '#10192c',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
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
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 600,
              background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Comment ça marche ?
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 214, 198, 0.15)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(149, 130, 185, 0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(149, 130, 185, 0.2)',
                      '& .step-number': {
                        transform: 'scale(1.1)',
                        background: 'linear-gradient(45deg, #9582b9, #F74AA1)',
                      },
                      '& .step-icon': {
                        color: '#F74AA1',
                      },
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box
                      className="step-number"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '20px',
                        background: 'rgba(149, 130, 185, 0.1)',
                        color: '#9582b9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        margin: '0 auto 20px',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {step.number}
                    </Box>
                    <Box
                      className="step-icon"
                      sx={{
                        color: '#9582b9',
                        mb: 3,
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        background: 'linear-gradient(45deg, #9582b9, #F74AA1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {step.description}
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

export default HowItWorks; 