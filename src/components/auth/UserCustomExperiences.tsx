import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Cancel,
  Pending,
  Schedule,
  AttachMoney,
  AccessTime,
  Group,
  LocalActivity,
  Restaurant,
  Hotel
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getUserCustomExperiences, CustomExperience } from '../../firebase/itineraryService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

const UserCustomExperiences: React.FC = () => {
  const { currentUser } = useAuth();
  const [customExperiences, setCustomExperiences] = useState<CustomExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomExperiences = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const userCustomExperiences = await getUserCustomExperiences(currentUser.uid);
        setCustomExperiences(userCustomExperiences);
      } catch (error) {
        console.error('Erreur lors du chargement des expériences sur mesure:', error);
        setError('Impossible de charger vos expériences sur mesure. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    loadCustomExperiences();
  }, [currentUser]);

  const handleAccordionChange = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusChip = (status: CustomExperience['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Chip 
            icon={<Pending />} 
            label="En attente" 
            size="small"
            sx={{ 
              bgcolor: 'rgba(255, 193, 7, 0.1)', 
              color: '#ffc107',
              borderColor: 'rgba(255, 193, 7, 0.3)',
              border: '1px solid'
            }} 
          />
        );
      case 'processing':
        return (
          <Chip 
            icon={<Schedule />} 
            label="En cours de traitement" 
            size="small"
            sx={{ 
              bgcolor: 'rgba(33, 150, 243, 0.1)', 
              color: '#2196f3',
              borderColor: 'rgba(33, 150, 243, 0.3)',
              border: '1px solid'
            }} 
          />
        );
      case 'ready':
        return (
          <Chip 
            icon={<CheckCircle />} 
            label="Prête" 
            size="small"
            sx={{ 
              bgcolor: 'rgba(76, 175, 80, 0.1)', 
              color: '#4caf50',
              borderColor: 'rgba(76, 175, 80, 0.3)',
              border: '1px solid'
            }} 
          />
        );
      case 'cancelled':
        return (
          <Chip 
            icon={<Cancel />} 
            label="Annulée" 
            size="small"
            sx={{ 
              bgcolor: 'rgba(244, 67, 54, 0.1)', 
              color: '#f44336',
              borderColor: 'rgba(244, 67, 54, 0.3)',
              border: '1px solid'
            }} 
          />
        );
      default:
        return null;
    }
  };

  const getStepIndex = (status: CustomExperience['status']) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'ready': return 2;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (customExperiences.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Vous n'avez pas encore d'expériences sur mesure
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.href = '/#creer'}
          sx={{ mt: 2 }}
        >
          Créer une expérience sur mesure
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Mes expériences sur mesure ({customExperiences.length})
      </Typography>
      
      <Grid container spacing={3}>
        {customExperiences.map((experience) => (
          <Grid item xs={12} key={experience.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper sx={{ 
                p: 3,
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 214, 198, 0.3)',
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{experience.title}</Typography>
                  {getStatusChip(experience.status)}
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Créée le {formatDate(experience.createdAt)}
                </Typography>
                
                <Stepper 
                  activeStep={getStepIndex(experience.status)} 
                  alternativeLabel
                  sx={{ 
                    mb: 3,
                    '& .MuiStepLabel-label': {
                      color: 'text.secondary'
                    },
                    '& .MuiStepLabel-completed': {
                      color: 'primary.main'
                    },
                    '& .MuiStepLabel-active': {
                      color: 'primary.main'
                    }
                  }}
                >
                  <Step>
                    <StepLabel>Demande reçue</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>En préparation</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Proposition prête</StepLabel>
                  </Step>
                </Stepper>
                
                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                
                <Accordion 
                  expanded={expandedId === experience.id}
                  onChange={() => experience.id && handleAccordionChange(experience.id)}
                  sx={{ 
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(255, 214, 198, 0.2)',
                    borderRadius: '8px !important',
                    '&:before': {
                      display: 'none',
                    },
                    '& .MuiAccordionSummary-root': {
                      borderRadius: '8px',
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Détails de votre demande</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" paragraph>
                      {experience.description}
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Card sx={{ 
                          background: 'rgba(15, 23, 42, 0.3)',
                          border: '1px solid rgba(255, 214, 198, 0.1)',
                          borderRadius: '8px'
                        }}>
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                              Préférences générales
                            </Typography>
                            <List dense>
                              <ListItem>
                                <ListItemIcon>
                                  <AttachMoney sx={{ color: 'text.secondary' }} />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Budget" 
                                  secondary={experience.preferences.budget} 
                                  primaryTypographyProps={{ color: 'text.primary' }}
                                  secondaryTypographyProps={{ color: 'text.secondary' }}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <AccessTime sx={{ color: 'text.secondary' }} />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Durée" 
                                  secondary={experience.preferences.duration} 
                                  primaryTypographyProps={{ color: 'text.primary' }}
                                  secondaryTypographyProps={{ color: 'text.secondary' }}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <Group sx={{ color: 'text.secondary' }} />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Taille du groupe" 
                                  secondary={experience.preferences.groupSize} 
                                  primaryTypographyProps={{ color: 'text.primary' }}
                                  secondaryTypographyProps={{ color: 'text.secondary' }}
                                />
                              </ListItem>
                            </List>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={8}>
                        <Card sx={{ 
                          background: 'rgba(15, 23, 42, 0.3)',
                          border: '1px solid rgba(255, 214, 198, 0.1)',
                          borderRadius: '8px'
                        }}>
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                              Préférences détaillées
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Types d'activités:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {experience.preferences.activityTypes.map((activity, index) => (
                                  <Chip 
                                    key={index} 
                                    label={activity} 
                                    size="small"
                                    icon={<LocalActivity />}
                                    sx={{ 
                                      bgcolor: 'rgba(99, 102, 241, 0.1)', 
                                      color: '#6366f1',
                                      borderColor: 'rgba(99, 102, 241, 0.3)',
                                      border: '1px solid'
                                    }} 
                                  />
                                ))}
                              </Box>
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Préférences culinaires:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {experience.preferences.foodPreferences.map((food, index) => (
                                  <Chip 
                                    key={index} 
                                    label={food} 
                                    size="small"
                                    icon={<Restaurant />}
                                    sx={{ 
                                      bgcolor: 'rgba(245, 158, 63, 0.1)', 
                                      color: '#F59E3F',
                                      borderColor: 'rgba(245, 158, 63, 0.3)',
                                      border: '1px solid'
                                    }} 
                                  />
                                ))}
                              </Box>
                            </Box>
                            
                            <Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Types d'hébergement:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {experience.preferences.accommodationTypes.map((accommodation, index) => (
                                  <Chip 
                                    key={index} 
                                    label={accommodation} 
                                    size="small"
                                    icon={<Hotel />}
                                    sx={{ 
                                      bgcolor: 'rgba(247, 74, 161, 0.1)', 
                                      color: '#F74AA1',
                                      borderColor: 'rgba(247, 74, 161, 0.3)',
                                      border: '1px solid'
                                    }} 
                                  />
                                ))}
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                    
                    {experience.status === 'ready' && experience.proposal && (
                      <Box sx={{ mt: 3 }}>
                        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                        
                        <Typography variant="h6" gutterBottom>
                          Notre proposition
                        </Typography>
                        
                        <Paper sx={{ 
                          p: 3, 
                          mt: 2,
                          background: 'rgba(76, 175, 80, 0.05)',
                          border: '1px solid rgba(76, 175, 80, 0.2)',
                          borderRadius: '8px'
                        }}>
                          <Typography variant="body1" paragraph>
                            {experience.proposal.description}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Typography variant="h6" color="primary">
                              Prix: {experience.proposal.price}€
                            </Typography>
                            
                            <Button 
                              variant="contained" 
                              color="primary"
                              onClick={() => window.location.href = '/booking/custom'}
                            >
                              Réserver cette expérience
                            </Button>
                          </Box>
                        </Paper>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserCustomExperiences; 