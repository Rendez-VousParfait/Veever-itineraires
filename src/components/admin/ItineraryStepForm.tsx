import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Stack,
  MenuItem,
  Paper,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Hotel,
  Restaurant,
  Spa,
  Search as SearchIcon,
} from '@mui/icons-material';
import { ItineraryStep } from '../../types/itinerary';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Partner } from '../../types/partner';

interface ItineraryStepFormProps {
  steps: ItineraryStep[];
  onChange: (steps: ItineraryStep[]) => void;
}

const STEP_TYPES = [
  { value: 'hotel', label: 'Hôtel', icon: <Hotel /> },
  { value: 'restaurant', label: 'Restaurant', icon: <Restaurant /> },
  { value: 'activity', label: 'Activité', icon: <Spa /> },
] as const;

const DEFAULT_STEP: ItineraryStep = {
  type: 'activity',
  name: '',
  description: '',
  icon: <Spa />,
  details: {
    title: '',
    description: '',
    images: [],
    adresse: '',
    prix: '',
    avis: [],
  },
};

const ItineraryStepForm: React.FC<ItineraryStepFormProps> = ({ steps, onChange }) => {
  const [openPartnerDialog, setOpenPartnerDialog] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);

  useEffect(() => {
    loadPartners();
  }, []);

  useEffect(() => {
    if (partners.length > 0) {
      const filtered = partners.filter(partner => 
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (currentStepIndex !== null ? partner.type === steps[currentStepIndex].type : true)
      );
      setFilteredPartners(filtered);
    }
  }, [searchTerm, partners, currentStepIndex, steps]);

  const loadPartners = async () => {
    try {
      const partnersRef = collection(db, 'partners');
      const querySnapshot = await getDocs(partnersRef);
      const loadedPartners: Partner[] = [];
      querySnapshot.forEach((doc) => {
        loadedPartners.push({ id: doc.id, ...doc.data() } as Partner);
      });
      setPartners(loadedPartners);
    } catch (error) {
      console.error('Erreur lors du chargement des partenaires:', error);
    }
  };

  // Ajouter une nouvelle étape
  const handleAddStep = () => {
    onChange([...steps, { ...DEFAULT_STEP }]);
  };

  // Supprimer une étape
  const handleDeleteStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    onChange(newSteps);
  };

  // Mettre à jour une étape
  const handleStepChange = (index: number, field: string, value: any) => {
    const newSteps = [...steps];
    if (field === 'type') {
      const stepType = STEP_TYPES.find(type => type.value === value);
      newSteps[index] = {
        ...newSteps[index],
        [field]: value,
        icon: null,
      };
    } else if (field.startsWith('details.')) {
      const detailField = field.split('.')[1];
      newSteps[index] = {
        ...newSteps[index],
        details: {
          ...newSteps[index].details,
          [detailField]: value,
        },
      };
    } else {
      newSteps[index] = {
        ...newSteps[index],
        [field]: value,
      };
    }
    onChange(newSteps);
  };

  const handleOpenPartnerSearch = (index: number) => {
    setCurrentStepIndex(index);
    setSearchTerm('');
    setOpenPartnerDialog(true);
  };

  const handleSelectPartner = (partner: Partner) => {
    if (currentStepIndex === null) return;

    const newSteps = [...steps];
    newSteps[currentStepIndex] = {
      type: partner.type,
      name: partner.name,
      description: partner.description,
      icon: null,
      details: {
        title: partner.name,
        description: partner.description,
        images: partner.images,
        adresse: partner.address,
        prix: partner.price,
        duree: partner.duration,
        equipements: partner.equipments,
        niveau: partner.level,
        horaires: partner.schedule,
        menu: partner.menu,
        avis: partner.reviews.map(review => ({
          utilisateur: review.author,
          commentaire: review.comment,
          note: review.rating,
        })),
      },
    };
    onChange(newSteps);
    setOpenPartnerDialog(false);
    setCurrentStepIndex(null);
  };

  // Dans le rendu, on affiche l'icône en fonction du type
  const getStepIcon = (type: 'hotel' | 'restaurant' | 'activity') => {
    switch (type) {
      case 'hotel':
        return <Hotel />;
      case 'restaurant':
        return <Restaurant />;
      case 'activity':
        return <Spa />;
      default:
        return <Spa />;
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Étapes de l'itinéraire
      </Typography>

      <Stack spacing={3}>
        {steps.map((step, index) => (
          <Paper key={index} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getStepIcon(step.type)}
                Étape {index + 1}
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<SearchIcon />}
                  onClick={() => handleOpenPartnerSearch(index)}
                  sx={{ mr: 1 }}
                >
                  Rechercher un partenaire
                </Button>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteStep(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            <Stack spacing={2}>
              <TextField
                select
                fullWidth
                label="Type"
                value={step.type}
                onChange={(e) => handleStepChange(index, 'type', e.target.value)}
              >
                {STEP_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {type.icon}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Nom"
                value={step.name}
                onChange={(e) => handleStepChange(index, 'name', e.target.value)}
              />

              <TextField
                fullWidth
                label="Description"
                value={step.description}
                onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                multiline
                rows={2}
              />

              <TextField
                fullWidth
                label="Titre détaillé"
                value={step.details.title}
                onChange={(e) => handleStepChange(index, 'details.title', e.target.value)}
              />

              <TextField
                fullWidth
                label="Description détaillée"
                value={step.details.description}
                onChange={(e) => handleStepChange(index, 'details.description', e.target.value)}
                multiline
                rows={3}
              />

              <TextField
                fullWidth
                label="Adresse"
                value={step.details.adresse}
                onChange={(e) => handleStepChange(index, 'details.adresse', e.target.value)}
              />

              <TextField
                fullWidth
                label="Prix"
                value={step.details.prix}
                onChange={(e) => handleStepChange(index, 'details.prix', e.target.value)}
              />

              <TextField
                fullWidth
                label="Images (URLs séparées par des virgules)"
                value={step.details.images?.join(', ')}
                onChange={(e) => handleStepChange(index, 'details.images', e.target.value.split(',').map(url => url.trim()))}
                helperText="Entrez les URLs des images séparées par des virgules"
              />
            </Stack>
          </Paper>
        ))}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddStep}
          fullWidth
        >
          Ajouter une étape
        </Button>
      </Stack>

      <Dialog 
        open={openPartnerDialog} 
        onClose={() => setOpenPartnerDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Rechercher un partenaire
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Rechercher"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <Stack spacing={2}>
            {filteredPartners.map((partner) => (
              <Paper 
                key={partner.id}
                sx={{ 
                  p: 2, 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => handleSelectPartner(partner)}
              >
                <Typography variant="h6">{partner.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {partner.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {partner.address} - {partner.price}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPartnerDialog(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ItineraryStepForm; 