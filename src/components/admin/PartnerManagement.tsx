import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Chip,
  ImageList,
  ImageListItem,
  FormControl,
  InputLabel,
  Select,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  Spa as SpaIcon,
  Sync as SyncIcon,
  Image as ImageIcon,
  Groups as GroupsIcon,
  Favorite as CoupleIcon,
} from '@mui/icons-material';
import { getAllItineraries } from '../../firebase/itineraryService';
import { collection, addDoc, getDocs, query, where, serverTimestamp, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase/config';

interface Partner {
  id: string;
  type: 'hotel' | 'restaurant' | 'activity';
  name: string;
  description: string;
  address: string;
  price: string;
  images: string[];
  equipments?: string[];
  menu?: string[];
  schedule?: string;
  targetAudience: ('couples' | 'groups')[];
  reviews: {
    author: string;
    rating: number;
    comment: string;
  }[];
  duration?: string;
  level?: string;
}

const PARTNERS_COLLECTION = 'partners';

const PartnerManagement: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Partner>>({
    type: 'hotel',
    name: '',
    description: '',
    address: '',
    price: '',
    images: [],
    equipments: [],
    menu: [],
    schedule: '',
    targetAudience: [],
    reviews: [],
    duration: '',
    level: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [audienceFilter, setAudienceFilter] = useState<('couples' | 'groups')[]>([]);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const partnersRef = collection(db, PARTNERS_COLLECTION);
      const querySnapshot = await getDocs(partnersRef);
      const loadedPartners: Partner[] = [];
      querySnapshot.forEach((doc) => {
        loadedPartners.push({ id: doc.id, ...doc.data() } as Partner);
      });
      setPartners(loadedPartners);
    } catch (error) {
      console.error('Erreur lors du chargement des partenaires:', error);
      setError('Erreur lors du chargement des partenaires');
    }
  };

  const initializePartnersFromItineraries = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const itineraries = await getAllItineraries();
      const partnersToAdd: Partial<Partner>[] = [];
      const existingPartners = new Set(partners.map(p => p.name));

      itineraries.forEach(itinerary => {
        itinerary.steps?.forEach(step => {
          if (step.details && !existingPartners.has(step.details.title)) {
            existingPartners.add(step.details.title);
            
            // Nettoyer les données avant de les envoyer à Firebase
            const cleanPartner: Partial<Partner> = {
              type: step.type as 'hotel' | 'restaurant' | 'activity',
              name: step.details.title || '',
              description: step.details.description || '',
              address: step.details.adresse || '',
              price: step.details.prix || '',
              images: step.details.images || [],
              // Ne pas inclure les champs optionnels s'ils sont undefined
              ...(step.details.equipements && { equipments: step.details.equipements }),
              ...(step.details.menu && { menu: step.details.menu }),
              ...(step.details.horaires && { schedule: step.details.horaires }),
              targetAudience: step.details.publicCible || [],
              reviews: step.details.avis?.map(avis => ({
                author: avis.utilisateur || '',
                rating: avis.note || 0,
                comment: avis.commentaire || '',
              })) || [],
              duration: step.details.duree || '',
              level: step.details.niveauDifficulte || '',
            };

            // Vérifier que tous les champs requis sont présents et non undefined
            if (cleanPartner.name && cleanPartner.type) {
              partnersToAdd.push(cleanPartner);
            }
          }
        });
      });

      const partnersRef = collection(db, PARTNERS_COLLECTION);
      for (const partner of partnersToAdd) {
        await addDoc(partnersRef, {
          ...partner,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      await loadPartners();
      setSuccess(`${partnersToAdd.length} partenaires ont été initialisés avec succès`);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des partenaires:', error);
      setError('Erreur lors de l\'initialisation des partenaires');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleOpenDialog = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData(partner);
    } else {
      setEditingPartner(null);
      setFormData({
        type: ['hotel', 'restaurant', 'activity'][currentTab] as 'hotel' | 'restaurant' | 'activity',
        name: '',
        description: '',
        address: '',
        price: '',
        images: [],
        equipments: [],
        menu: [],
        schedule: '',
        targetAudience: [],
        reviews: [],
        duration: '',
        level: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPartner(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (!selectedFiles) return [];

    const uploadedUrls: string[] = [];
    setUploadProgress(0);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const storageRef = ref(storage, `partners/${Date.now()}_${file.name}`);
      
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      uploadedUrls.push(url);
      
      setUploadProgress((i + 1) / selectedFiles.length * 100);
    }

    return uploadedUrls;
  };

  const handleImageDelete = async (imageUrl: string, partnerId?: string) => {
    try {
      // Supprimer l'image du storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      // Mettre à jour le partenaire si on est en mode édition
      if (partnerId) {
        const partnerRef = doc(db, PARTNERS_COLLECTION, partnerId);
        await updateDoc(partnerRef, {
          images: formData.images?.filter(img => img !== imageUrl) || [],
        });
      }

      // Mettre à jour le state local
      setFormData(prev => ({
        ...prev,
        images: prev.images?.filter(img => img !== imageUrl) || [],
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      setError('Erreur lors de la suppression de l\'image');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // Upload des nouvelles images
      const uploadedUrls = await uploadImages();
      const updatedImages = [...(formData.images || []), ...uploadedUrls];

      const partnersRef = collection(db, PARTNERS_COLLECTION);
      const partnerData = {
        ...formData,
        images: updatedImages,
      };

      if (editingPartner) {
        await updateDoc(doc(db, PARTNERS_COLLECTION, editingPartner.id), {
          ...partnerData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(partnersRef, {
          ...partnerData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      await loadPartners();
      handleCloseDialog();
      setSuccess('Partenaire enregistré avec succès');
      setSelectedFiles(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Erreur lors de la sauvegarde du partenaire');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (partnerId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteDoc(doc(db, PARTNERS_COLLECTION, partnerId));
      await loadPartners();
      setSuccess('Partenaire supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression du partenaire');
    } finally {
      setLoading(false);
    }
  };

  const handleAudienceFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAudienceFilter(event.target.value as ('couples' | 'groups')[]);
  };

  const getPartnersByType = (type: 'hotel' | 'restaurant' | 'activity') => {
    return partners.filter(partner => {
      const matchesType = partner.type === type;
      const matchesAudience = audienceFilter.length === 0 || 
        audienceFilter.some(filter => partner.targetAudience?.includes(filter));
      return matchesType && matchesAudience;
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des partenaires
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<SyncIcon />}
          onClick={initializePartnersFromItineraries}
          disabled={loading}
        >
          Initialiser depuis les itinéraires
        </Button>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrer par public</InputLabel>
          <Select
            multiple
            value={audienceFilter}
            onChange={handleAudienceFilterChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip
                    key={value}
                    label={value === 'couples' ? 'Couples' : 'Groupes'}
                    icon={value === 'couples' ? <CoupleIcon /> : <GroupsIcon />}
                    size="small"
                  />
                ))}
              </Box>
            )}
          >
            <MenuItem value="couples">
              <CoupleIcon sx={{ mr: 1 }} /> Couples
            </MenuItem>
            <MenuItem value="groups">
              <GroupsIcon sx={{ mr: 1 }} /> Groupes
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab icon={<HotelIcon />} label="Hôtels" />
          <Tab icon={<RestaurantIcon />} label="Restaurants" />
          <Tab icon={<SpaIcon />} label="Activités" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mb: 2 }}
          >
            Ajouter un partenaire
          </Button>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Adresse</TableCell>
                  <TableCell>Prix</TableCell>
                  <TableCell>Public</TableCell>
                  {currentTab === 2 && (
                    <>
                      <TableCell>Durée</TableCell>
                      <TableCell>Niveau</TableCell>
                    </>
                  )}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getPartnersByType(['hotel', 'restaurant', 'activity'][currentTab] as 'hotel' | 'restaurant' | 'activity').map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>{partner.name}</TableCell>
                    <TableCell>{partner.description}</TableCell>
                    <TableCell>{partner.address}</TableCell>
                    <TableCell>{partner.price}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {partner.targetAudience?.map((audience) => (
                          <Chip
                            key={audience}
                            label={audience === 'couples' ? 'Couples' : 'Groupes'}
                            icon={audience === 'couples' ? <CoupleIcon /> : <GroupsIcon />}
                            size="small"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    {currentTab === 2 && (
                      <>
                        <TableCell>{partner.duration || '-'}</TableCell>
                        <TableCell>{partner.level || '-'}</TableCell>
                      </>
                    )}
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(partner)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(partner.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPartner ? 'Modifier le partenaire' : 'Ajouter un partenaire'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Type"
                name="type"
                value={formData.type || ''}
                onChange={handleInputChange}
              >
                <MenuItem value="hotel">Hôtel</MenuItem>
                <MenuItem value="restaurant">Restaurant</MenuItem>
                <MenuItem value="activity">Activité</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prix"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
              />
            </Grid>
            {formData.type === 'hotel' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Équipements"
                  name="equipments"
                  value={formData.equipments?.join(', ') || ''}
                  onChange={handleInputChange}
                  helperText="Séparez les équipements par des virgules"
                />
              </Grid>
            )}
            {formData.type === 'restaurant' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Menu"
                  name="menu"
                  value={formData.menu?.join(', ') || ''}
                  onChange={handleInputChange}
                  helperText="Séparez les plats par des virgules"
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Horaires"
                name="schedule"
                value={formData.schedule || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Public cible</InputLabel>
                <Select
                  multiple
                  name="targetAudience"
                  value={formData.targetAudience || []}
                  onChange={(e) => {
                    const value = e.target.value as ('couples' | 'groups')[];
                    setFormData(prev => ({
                      ...prev,
                      targetAudience: value,
                    }));
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip
                          key={value}
                          label={value === 'couples' ? 'Couples' : 'Groupes'}
                        />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="couples">
                    <CoupleIcon sx={{ mr: 1 }} /> Couples
                  </MenuItem>
                  <MenuItem value="groups">
                    <GroupsIcon sx={{ mr: 1 }} /> Groupes
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formData.type === 'activity' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Durée"
                    name="duration"
                    value={formData.duration || ''}
                    onChange={handleInputChange}
                    helperText="Ex: 2 heures, 1 journée, etc."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Niveau de difficulté"
                    name="level"
                    value={formData.level || ''}
                    onChange={handleInputChange}
                    helperText="Ex: Facile, Moyen, Difficile"
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                multiple
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<ImageIcon />}
                  fullWidth
                >
                  Ajouter des images
                </Button>
              </label>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <Box sx={{ width: '100%', mt: 1 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <ImageList sx={{ width: '100%', height: 200 }} cols={3} rowHeight={164}>
                {formData.images?.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image}
                      alt={`Image ${index + 1}`}
                      loading="lazy"
                      style={{ height: '100%', objectFit: 'cover' }}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                      }}
                      onClick={() => handleImageDelete(image, editingPartner?.id)}
                    >
                      <DeleteIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartnerManagement; 