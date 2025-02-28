import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { motion } from 'framer-motion';
import VersusCard from './VersusCard';
import SwipeCard from './SwipeCard';
import { foodImages, activityImages } from '../assets/images';

interface FormData {
  itineraryType: 'hotel-restaurant-activity' | 'restaurant-activity' | '';
  accommodation: {
    types: string[];
    budget: string;
    style: string;
  };
  restaurant: {
    cuisineTypes: string[];
    ambiance: string;
    budget: string;
  };
  activity: {
    type: string;
    intensity: string;
    budget: string;
  };
  dateAndConstraints: {
    date: string;
    time: string;
    location: string;
  };
  personalization: {
    groupDynamics: string;
    vibe: string;
    specificRequests: string;
  };
  preferences: {
    [key: string]: boolean;
  };
}

const PersonalityForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    itineraryType: '',
    accommodation: {
      types: [],
      budget: '',
      style: '',
    },
    restaurant: {
      cuisineTypes: [],
      ambiance: '',
      budget: '',
    },
    activity: {
      type: '',
      intensity: '',
      budget: '',
    },
    dateAndConstraints: {
      date: '',
      time: '',
      location: '',
    },
    personalization: {
      groupDynamics: '',
      vibe: '',
      specificRequests: '',
    },
    preferences: {},
  });

  const handleNext = () => {
    if (activeStep === 0 && formData.itineraryType === 'restaurant-activity') {
      setActiveStep(2);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 2 && formData.itineraryType === 'restaurant-activity') {
      setActiveStep(0);
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const getSteps = (): string[] => {
    if (formData.itineraryType === 'restaurant-activity') {
      return [
        'Type d\'itinéraire',
        'Restaurant',
        'Activité',
        'Date et lieu',
        'Ambiance'
      ];
    }
    return [
      'Type d\'itinéraire',
      'Hébergement',
      'Restaurant',
      'Activité',
      'Date et lieu',
      'Ambiance'
    ];
  };

  const renderStep1 = () => (
    <Box>
      <Typography variant="h6" gutterBottom align="center" sx={{ mb: 4 }}>
        Quelle aventure souhaitez-vous vivre ?
      </Typography>
      <VersusCard
        option1={{
          value: 'hotel-restaurant-activity',
          label: 'Week-end Complet',
          icon: '🏨',
          description: 'Une expérience complète avec hôtel, restaurant et activité',
        }}
        option2={{
          value: 'restaurant-activity',
          label: 'Sortie Express',
          icon: '🍽️',
          description: 'Une sortie avec restaurant et activité uniquement',
        }}
        selectedValue={formData.itineraryType}
        onChange={(value) => setFormData({ ...formData, itineraryType: value as FormData['itineraryType'] })}
      />
    </Box>
  );

  const renderStep2 = () => (
    <Box>
      <Typography variant="h6" gutterBottom align="center" sx={{ mb: 4 }}>
        Quel style d'hébergement vous fait rêver ?
      </Typography>
      
      <FormGroup sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Sélectionnez vos préférences (plusieurs choix possibles)
        </Typography>
        {[
          { value: 'city-center', label: '🏢 Hôtel en centre-ville' },
          { value: 'garden', label: '🌿 Hôtel avec jardin ou terrasse' },
          { value: 'atypical', label: '🏕️ Hébergement atypique' },
          { value: 'spa', label: '🛁 Hôtel avec spa' },
          { value: 'luxury', label: '💎 Hôtel de luxe' },
        ].map(({ value, label }) => (
          <FormControlLabel
            key={value}
            control={
              <Checkbox
                checked={formData.accommodation.types.includes(value)}
                onChange={(e) => {
                  const types = e.target.checked
                    ? [...formData.accommodation.types, value]
                    : formData.accommodation.types.filter(t => t !== value);
                  setFormData({
                    ...formData,
                    accommodation: { ...formData.accommodation, types },
                  });
                }}
              />
            }
            label={<Typography variant="body1">{label}</Typography>}
          />
        ))}
      </FormGroup>

      <Typography variant="subtitle1" gutterBottom align="center">
        Quel est votre budget ?
      </Typography>
      <VersusCard
        option1={{
          value: 'economic',
          label: 'Économique',
          icon: '💰',
          description: 'Moins de 100€ par nuit',
        }}
        option2={{
          value: 'premium',
          label: 'Premium',
          icon: '💎',
          description: '100€ et plus par nuit',
        }}
        selectedValue={formData.accommodation.budget}
        onChange={(value) => setFormData({
          ...formData,
          accommodation: { ...formData.accommodation, budget: value },
        })}
      />

      <Typography variant="subtitle1" gutterBottom align="center">
        Plutôt moderne ou traditionnel ?
      </Typography>
      <VersusCard
        option1={{
          value: 'modern',
          label: 'Design Moderne',
          icon: '🏢',
          description: 'Style contemporain et épuré',
        }}
        option2={{
          value: 'traditional',
          label: 'Charme Traditionnel',
          icon: '🏰',
          description: 'Ambiance authentique et chaleureuse',
        }}
        selectedValue={formData.accommodation.style}
        onChange={(value) => setFormData({
          ...formData,
          accommodation: { ...formData.accommodation, style: value },
        })}
      />
    </Box>
  );

  const renderRestaurantPreferences = () => (
    <Box>
      <Typography variant="h6" gutterBottom align="center" sx={{ mb: 4 }}>
        Vos goûts culinaires
      </Typography>
      <SwipeCard
        options={[
          {
            id: 'gastronomy',
            label: 'Gastronomie française',
            icon: '👨‍🍳',
            description: 'Une expérience raffinée et savoureuse',
            image: foodImages.gastronomy,
          },
          {
            id: 'world',
            label: 'Cuisine du monde',
            icon: '🌍',
            description: 'Voyagez à travers les saveurs',
            image: foodImages.worldCuisine,
          },
          {
            id: 'wine',
            label: 'Accord mets et vins',
            icon: '🍷',
            description: 'Pour les amateurs de bons vins',
            image: foodImages.wine,
          },
          {
            id: 'local',
            label: 'Spécialités locales',
            icon: '🏠',
            description: 'Découvrez les saveurs de la région',
            image: foodImages.local,
          },
          {
            id: 'trendy',
            label: 'Restaurants tendance',
            icon: '✨',
            description: 'Les adresses qui font le buzz',
            image: foodImages.trendy,
          },
        ]}
        onSwipe={handleSwipe}
        onComplete={() => handleNext()}
      />
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 12 }}>
        Swipez à droite pour "J'aime" 💚 ou à gauche pour "Je n'aime pas" ❌
      </Typography>
    </Box>
  );

  const renderActivityPreferences = () => (
    <Box>
      <Typography variant="h6" gutterBottom align="center" sx={{ mb: 4 }}>
        Swipez pour nous dire ce que vous aimez !
      </Typography>
      <SwipeCard
        options={[
          {
            id: 'outdoor',
            label: 'Activités en plein air',
            icon: '🌳',
            description: 'Profiter de la nature et du grand air',
            image: activityImages.outdoor,
          },
          {
            id: 'indoor',
            label: 'Activités en intérieur',
            icon: '🏰',
            description: 'Confort et ambiance cosy garantis',
            image: activityImages.indoor,
          },
          {
            id: 'water',
            label: 'Activités nautiques',
            icon: '🌊',
            description: 'Sensations et fraîcheur au programme',
            image: activityImages.water,
          },
          {
            id: 'adrenaline',
            label: 'Sensations fortes',
            icon: '🎢',
            description: 'Pour les amateurs de frissons',
            image: activityImages.adrenaline,
          },
          {
            id: 'culture',
            label: 'Culture et découverte',
            icon: '🎨',
            description: 'Enrichissez-vous l\'esprit',
            image: activityImages.culture,
          },
        ]}
        onSwipe={handleSwipe}
        onComplete={() => handleNext()}
      />
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 12 }}>
        Swipez à droite pour "J'aime" 💚 ou à gauche pour "Je n'aime pas" ❌
      </Typography>
    </Box>
  );

  const renderStep5 = () => (
    <Box>
      <Typography variant="h6" gutterBottom align="center" sx={{ mb: 4 }}>
        Quand et où ?
      </Typography>

      <Stack spacing={4}>
        <FormControl fullWidth>
          <Typography variant="subtitle1" gutterBottom>
            Date souhaitée
          </Typography>
          <input
            type="date"
            value={formData.dateAndConstraints.date}
            onChange={(e) => setFormData({
              ...formData,
              dateAndConstraints: { ...formData.dateAndConstraints, date: e.target.value },
            })}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              background: 'rgba(30, 41, 59, 0.7)',
              color: '#f8fafc',
            }}
          />
        </FormControl>

        <FormControl fullWidth>
          <Typography variant="subtitle1" gutterBottom>
            Heure de début
          </Typography>
          <input
            type="time"
            value={formData.dateAndConstraints.time}
            onChange={(e) => setFormData({
              ...formData,
              dateAndConstraints: { ...formData.dateAndConstraints, time: e.target.value },
            })}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              background: 'rgba(30, 41, 59, 0.7)',
              color: '#f8fafc',
            }}
          />
        </FormControl>

        <Box>
          <Typography variant="subtitle1" gutterBottom align="center">
            Zone préférée
          </Typography>
          <VersusCard
            option1={{
              value: 'center',
              label: 'Centre-ville',
              icon: '🏙️',
              description: 'Au cœur de l\'action',
            }}
            option2={{
              value: 'outskirts',
              label: 'Périphérie',
              icon: '🌳',
              description: 'Plus calme et nature',
            }}
            selectedValue={formData.dateAndConstraints.location}
            onChange={(value) => setFormData({
              ...formData,
              dateAndConstraints: { ...formData.dateAndConstraints, location: value },
            })}
          />
        </Box>
      </Stack>
    </Box>
  );

  const renderStep6 = () => (
    <Box>
      <Typography variant="h6" gutterBottom align="center" sx={{ mb: 4 }}>
        Quelle ambiance recherchez-vous ?
      </Typography>

      <Typography variant="subtitle1" gutterBottom align="center">
        Style de groupe
      </Typography>
      <VersusCard
        option1={{
          value: 'friends',
          label: 'Entre amis',
          icon: '🥂',
          description: 'Ambiance décontractée et conviviale',
        }}
        option2={{
          value: 'special',
          label: 'Événement spécial',
          icon: '🎉',
          description: 'Anniversaire, EVG/EVJF, etc.',
        }}
        selectedValue={formData.personalization.groupDynamics}
        onChange={(value) => setFormData({
          ...formData,
          personalization: { ...formData.personalization, groupDynamics: value },
        })}
      />

      <Typography variant="subtitle1" gutterBottom align="center" sx={{ mt: 4 }}>
        Ambiance souhaitée
      </Typography>
      <VersusCard
        option1={{
          value: 'chill',
          label: 'Chill & Cosy',
          icon: '🎵',
          description: 'Musique douce, ambiance détendue',
        }}
        option2={{
          value: 'party',
          label: 'Party & Fun',
          icon: '🎧',
          description: 'Musique festive, ambiance animée',
        }}
        selectedValue={formData.personalization.vibe}
        onChange={(value) => setFormData({
          ...formData,
          personalization: { ...formData.personalization, vibe: value },
        })}
      />

      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Une demande particulière ?
        </Typography>
        <textarea
          value={formData.personalization.specificRequests}
          onChange={(e) => setFormData({
            ...formData,
            personalization: { ...formData.personalization, specificRequests: e.target.value },
          })}
          placeholder="Allergies, préférences, occasions spéciales..."
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '12px',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            background: 'rgba(30, 41, 59, 0.7)',
            color: '#f8fafc',
            resize: 'vertical',
          }}
        />
      </Box>
    </Box>
  );

  const handleSwipe = (id: string, direction: 'left' | 'right') => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [id]: direction === 'right',
      },
    });
  };

  const renderCurrentStep = () => {
    switch (activeStep) {
      case 0:
        return renderStep1();
      case 1:
        return formData.itineraryType === 'hotel-restaurant-activity' ? renderStep2() : null;
      case 2:
        return renderRestaurantPreferences();
      case 3:
        return renderActivityPreferences();
      case 4:
        return renderStep5();
      case 5:
        return renderStep6();
      default:
        return null;
    }
  };

  const isNextButtonDisabled = () => {
    switch (activeStep) {
      case 0:
        return !formData.itineraryType;
      case 1:
        if (formData.itineraryType === 'hotel-restaurant-activity') {
          return formData.accommodation.types.length === 0 ||
                 !formData.accommodation.budget ||
                 !formData.accommodation.style;
        }
        return false;
      case 2:
      case 3:
        // Les étapes de swipe sont gérées automatiquement
        return false;
      case 4:
        return !formData.dateAndConstraints.date ||
               !formData.dateAndConstraints.time ||
               !formData.dateAndConstraints.location;
      case 5:
        return !formData.personalization.groupDynamics ||
               !formData.personalization.vibe;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    console.log('Formulaire soumis:', formData);
  };

  return (
    <Box
      component="section"
      id="creer"
      sx={{
        py: { xs: 8, md: 12 },
        background: '#10192c',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h2" 
            textAlign="center" 
            gutterBottom
            sx={{
              mb: 8,
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 600,
              background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Créez votre aventure
          </Typography>
          <Typography 
            variant="subtitle1" 
            textAlign="center" 
            color="text.secondary" 
            sx={{ 
              mb: 6,
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            Laissez-vous guider pour une expérience sur mesure
          </Typography>

          <Card>
            <CardContent sx={{ p: 4 }}>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {getSteps().map((label: string) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderCurrentStep()}
              </motion.div>

              <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'flex-end' }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  variant="outlined"
                >
                  Retour
                </Button>
                {activeStep === getSteps().length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isNextButtonDisabled()}
                  >
                    Créer mon itinéraire
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    disabled={isNextButtonDisabled()}
                  >
                    Continuer
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PersonalityForm; 