import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Rating,
  Avatar,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Star, FlashOn, Celebration, Diamond, Lock, AccessTime, LocalOffer, Favorite } from '@mui/icons-material';

type ItineraryType = 'couples' | 'groups';

const priceTiers = {
  couples: [
    {
      price: 149,
      priceDisplay: '149€',
      priceSubtext: 'pour deux',
      title: 'Escapade Express',
      description: 'Une aventure romantique de 3h pour les amoureux',
      features: [
        'Une activité surprise en duo',
        'Ambiance romantique garantie',
        'Photos souvenirs offertes',
      ],
      icon: <FlashOn sx={{ fontSize: 40 }} />,
      color: '#F59E3F',
      testimonial: {
        name: 'Marie & Paul',
        comment: 'Un moment magique à deux, parfait pour se retrouver !',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
      }
    },
    {
      price: 299,
      priceDisplay: '299€',
      priceSubtext: 'pour deux',
      title: 'Journée Mystère',
      description: 'Une journée complète de découvertes à deux',
      features: [
        'Une activité surprise premium',
        'Un dîner aux chandelles',
        'Transport privé inclus',
        'Moments privilégiés',
      ],
      icon: <Celebration sx={{ fontSize: 40 }} />,
      color: '#F74AA1',
      testimonial: {
        name: 'Thomas & Julie',
        comment: 'Une journée parfaite pour célébrer notre anniversaire !',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
      },
      popular: true
    },
    {
      price: 499,
      priceDisplay: '499€',
      priceSubtext: 'pour deux',
      title: 'Week-end Premium',
      description: 'L\'expérience romantique ultime sur 2 jours',
      features: [
        'Suite romantique',
        'Spa privatif en duo',
        'Dîners gastronomiques',
        'Activités VIP en couple',
        'Service conciergerie',
      ],
      icon: <Diamond sx={{ fontSize: 40 }} />,
      color: '#9582b9',
      testimonial: {
        name: 'Sophie & Marc',
        comment: 'Un week-end magique qui restera gravé dans nos mémoires !',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
      }
    }
  ],
  groups: [
    {
      price: 49,
      priceDisplay: '49€',
      priceSubtext: 'par personne',
      minGroupSize: '4-8',
      title: 'Escapade Express',
      description: 'Une aventure fun de 3h entre amis',
      features: [
        'Une activité surprise ludique',
        'Ambiance festive garantie',
        'Photos de groupe offertes',
        'À partir de 4 personnes',
      ],
      icon: <FlashOn sx={{ fontSize: 40 }} />,
      color: '#F59E3F',
      testimonial: {
        name: 'Groupe de Julie',
        comment: 'Un super moment de rigolade entre amis !',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=100&auto=format&fit=crop',
      }
    },
    {
      price: 89,
      priceDisplay: '89€',
      priceSubtext: 'par personne',
      minGroupSize: '6-12',
      title: 'Journée Mystère',
      description: 'Une journée complète d\'aventures en groupe',
      features: [
        'Activités team building',
        'Repas convivial inclus',
        'Transport groupe inclus',
        'Animateur dédié',
        'À partir de 6 personnes',
      ],
      icon: <Celebration sx={{ fontSize: 40 }} />,
      color: '#F74AA1',
      testimonial: {
        name: 'Team de Pierre',
        comment: 'Parfait pour notre team building, tout le monde a adoré !',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=100&auto=format&fit=crop',
      },
      popular: true
    },
    {
      price: 159,
      priceDisplay: '159€',
      priceSubtext: 'par personne',
      minGroupSize: '8-15',
      title: 'Week-end Premium',
      description: 'L\'expérience groupe ultime sur 2 jours',
      features: [
        'Villa privée',
        'Activités exclusives',
        'Chef privé sur place',
        'Soirée à thème',
        'Service conciergerie',
        'À partir de 8 personnes',
      ],
      icon: <Diamond sx={{ fontSize: 40 }} />,
      color: '#9582b9',
      testimonial: {
        name: 'EVG de Max',
        comment: 'Un week-end de folie pour mon EVG, merci Veever !',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=100&auto=format&fit=crop',
      }
    }
  ]
};

const SurpriseMe: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ItineraryType>('couples');

  return (
    <Box
      component="section"
      id="surprise"
      sx={{
        py: { xs: 8, md: 12 },
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
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 2,
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 600,
              background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Offre Surprise Me
          </Typography>

          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
          >
            Laissez-vous surprendre par une expérience unique, créée sur mesure pour vous
          </Typography>

          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 6,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Stack 
              direction="row" 
              spacing={2}
              sx={{
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(12px)',
                borderRadius: '50px',
                p: 1,
                border: '1px solid rgba(255, 214, 198, 0.3)',
              }}
            >
              <ToggleButtonGroup
                value={selectedType}
                exclusive
                onChange={(_, value) => value && setSelectedType(value)}
                aria-label="type d'itinéraire"
                sx={{ 
                  '& .MuiToggleButtonGroup-grouped': {
                    border: 0,
                    borderRadius: '50px !important',
                    mx: 0.5,
                    px: 3,
                    py: 1,
                    '&.Mui-selected': {
                      background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                      color: 'white',
                    },
                    '&:not(.Mui-selected)': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ToggleButton value="couples" aria-label="couples">
                  Couples
                </ToggleButton>
                <ToggleButton value="groups" aria-label="groupes">
                  Groupes
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Box>

          <Grid container spacing={4} alignItems="stretch">
            {priceTiers[selectedType].map((tier, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  style={{ height: '100%' }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      background: 'rgba(30, 41, 59, 0.7)',
                      backdropFilter: 'blur(12px)',
                      border: '2px solid rgba(255, 214, 198, 0.3)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 24px ${tier.color}33`,
                        border: `2px solid ${tier.color}`,
                      },
                    }}
                  >
                    {tier.popular && (
                      <Chip
                        label="Plus populaire"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    )}
                    
                    <CardContent sx={{ p: 4, flexGrow: 1 }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '20px',
                          background: `${tier.color}1A`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                          color: tier.color,
                        }}
                      >
                        {tier.icon}
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="h3"
                          sx={{
                            mb: 0.5,
                            fontWeight: 'bold',
                            color: tier.color,
                          }}
                        >
                          {tier.priceDisplay}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 500,
                          }}
                        >
                          {tier.priceSubtext}
                        </Typography>
                      </Box>

                      <Typography
                        variant="h5"
                        sx={{
                          mb: 2,
                          fontWeight: 'bold',
                          background: `linear-gradient(45deg, ${tier.color}, #F74AA1)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {tier.title}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{ mb: 4 }}
                      >
                        {tier.description}
                      </Typography>

                      <Stack spacing={2} sx={{ mb: 4 }}>
                        {tier.features.map((feature, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Star sx={{ color: tier.color, fontSize: 20 }} />
                            <Typography color="text.secondary">
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>

                      <Box sx={{ mb: 4 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Avatar
                            src={tier.testimonial.avatar}
                            sx={{ width: 48, height: 48 }}
                          />
                          <Box>
                            <Typography variant="subtitle2" color="white">
                              {tier.testimonial.name}
                            </Typography>
                            <Rating
                              value={tier.testimonial.rating}
                              readOnly
                              size="small"
                              sx={{ color: tier.color }}
                            />
                          </Box>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontStyle: 'italic',
                            pl: 1,
                            borderLeft: `3px solid ${tier.color}`,
                          }}
                        >
                          "{tier.testimonial.comment}"
                        </Typography>
                      </Box>

                      <Stack spacing={2}>
                        <Button
                          variant="contained"
                          size="large"
                          sx={{
                            background: `linear-gradient(45deg, ${tier.color}, #F74AA1)`,
                            '&:hover': {
                              background: `linear-gradient(45deg, ${tier.color}, #F74AA1)`,
                              transform: 'scale(1.02)',
                            },
                          }}
                        >
                          Réserver ma surprise
                        </Button>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                          }}
                        >
                          <Lock sx={{ fontSize: 16 }} />
                          <Typography variant="caption">
                            Paiement sécurisé
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 4 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime sx={{ color: '#F59E3F' }} />
                <Typography color="text.secondary">
                  Annulation gratuite jusqu'à 48h avant
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalOffer sx={{ color: '#F74AA1' }} />
                <Typography color="text.secondary">
                  Garantie meilleur prix
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Favorite sx={{ color: '#9582b9' }} />
                <Typography color="text.secondary">
                  Satisfait ou remboursé
                </Typography>
              </Box>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SurpriseMe; 