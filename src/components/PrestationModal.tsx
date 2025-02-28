import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Rating,
  Chip,
  ImageList,
  ImageListItem,
  Modal,
  Fade,
  Backdrop,
} from '@mui/material';
import {
  Close,
  AccessTime,
  Euro,
  LocationOn,
  Restaurant,
  Hotel,
  SportsEsports,
  Kitchen,
  Timer,
  FitnessCenter,
  Star,
  ArrowBackIos,
  ArrowForwardIos,
} from '@mui/icons-material';

export interface Avis {
  utilisateur: string;
  commentaire: string;
  note: number;
}

export interface Prestation {
  type: "hebergement" | "activite" | "restaurant";
  nom: string;
  description: string;
  images: string[];
  adresse?: string;
  prix?: string;
  duree?: string;
  equipements?: string[];
  niveau?: string;
  horaires?: string;
  menu?: string[];
  avis: Avis[];
}

interface PrestationModalProps {
  prestation: Prestation;
  isOpen: boolean;
  onClose: () => void;
}

const PrestationModal: React.FC<PrestationModalProps> = ({ prestation, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(prestation.images[0]);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setFullscreenOpen(true);
  };

  const handleFullscreenClose = () => {
    setFullscreenOpen(false);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (currentImageIndex - 1 + prestation.images.length) % prestation.images.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(prestation.images[newIndex]);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (currentImageIndex + 1) % prestation.images.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(prestation.images[newIndex]);
  };

  const getTypeIcon = () => {
    switch (prestation.type) {
      case 'hebergement':
        return <Hotel />;
      case 'restaurant':
        return <Restaurant />;
      case 'activite':
        return <SportsEsports />;
    }
  };

  const getTypeLabel = () => {
    switch (prestation.type) {
      case 'hebergement':
        return 'Hébergement';
      case 'restaurant':
        return 'Restaurant';
      case 'activite':
        return 'Activité';
    }
  };

  const getCtaLabel = () => {
    switch (prestation.type) {
      case 'hebergement':
        return 'Réserver maintenant';
      case 'restaurant':
        return 'Voir le menu';
      case 'activite':
        return 'Réserver l\'activité';
    }
  };

  const averageRating = prestation.avis.reduce((acc, curr) => acc + curr.note, 0) / prestation.avis.length;

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'transparent',
            boxShadow: 'none',
          }
        }}
      >
        <DialogContent
          sx={{
            background: 'rgba(16, 25, 44, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 214, 198, 0.3)',
            borderRadius: '24px',
            p: 0,
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={selectedImage}
              alt={prestation.nom}
              sx={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                cursor: 'pointer',
              }}
              onClick={() => {
                const index = prestation.images.findIndex(img => img === selectedImage);
                handleImageClick(selectedImage, index >= 0 ? index : 0);
              }}
            />
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
              }}
            >
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ p: 4 }}>
            <Stack spacing={4}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '12px',
                      background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {getTypeLabel()}
                  </Box>
                  <Rating value={averageRating} precision={0.5} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    ({prestation.avis.length} avis)
                  </Typography>
                </Stack>

                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {prestation.nom}
                </Typography>

                <Typography color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 3 }}>
                  {prestation.description}
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} flexWrap="wrap">
                  {prestation.adresse && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '12px',
                          background: 'rgba(245, 158, 63, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <LocationOn sx={{ color: '#F59E3F' }} />
                      </Box>
                      <Typography color="text.secondary">
                        {prestation.adresse}
                      </Typography>
                    </Stack>
                  )}

                  {prestation.prix && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '12px',
                          background: 'rgba(247, 74, 161, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Euro sx={{ color: '#F74AA1' }} />
                      </Box>
                      <Typography color="text.secondary">
                        {prestation.prix}
                      </Typography>
                    </Stack>
                  )}

                  {prestation.duree && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '12px',
                          background: 'rgba(99, 102, 241, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <AccessTime sx={{ color: '#6366f1' }} />
                      </Box>
                      <Typography color="text.secondary">
                        {prestation.duree}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>

              {/* Équipements ou Menu */}
              {(prestation.equipements || prestation.menu) && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {prestation.equipements ? 'Équipements' : 'Menu'}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {(prestation.equipements || prestation.menu)?.map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        sx={{
                          bgcolor: 'rgba(255, 214, 198, 0.1)',
                          color: 'text.secondary',
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Galerie d'images */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Photos
                </Typography>
                <ImageList cols={4} gap={8}>
                  {prestation.images.map((image, index) => (
                    <ImageListItem 
                      key={index}
                      onClick={() => handleImageClick(image, index)}
                      sx={{ 
                        cursor: 'pointer',
                        opacity: selectedImage === image ? 1 : 0.6,
                        transition: 'opacity 0.3s',
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      <img
                        src={image}
                        alt={`${prestation.nom} ${index + 1}`}
                        style={{ borderRadius: 8 }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>

              {/* Avis clients */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Avis clients
                </Typography>
                <Stack spacing={2}>
                  {prestation.avis.map((avis, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {avis.utilisateur}
                        </Typography>
                        <Rating value={avis.note} size="small" readOnly />
                      </Stack>
                      <Typography color="text.secondary">
                        {avis.commentaire}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            background: 'rgba(16, 25, 44, 0.8)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255, 214, 198, 0.1)',
            p: 3,
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: 'rgba(255, 214, 198, 0.3)',
              color: '#fff',
              '&:hover': {
                borderColor: 'rgba(255, 214, 198, 0.5)',
                background: 'rgba(255, 214, 198, 0.1)',
              },
            }}
          >
            Fermer
          </Button>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
              '&:hover': {
                background: 'linear-gradient(45deg, #F59E3F, #F74AA1)',
              },
            }}
          >
            {getCtaLabel()}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal plein écran pour les images */}
      <Modal
        open={fullscreenOpen}
        onClose={handleFullscreenClose}
        closeAfterTransition
        slots={{
          backdrop: Backdrop,
        }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={fullscreenOpen}>
          <Box
            sx={{
              position: 'relative',
              width: '90vw',
              height: '90vh',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={handleFullscreenClose}
          >
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: 'absolute',
                left: 16,
                zIndex: 10,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
              }}
            >
              <ArrowBackIos />
            </IconButton>

            <Box
              component="img"
              src={selectedImage}
              alt={prestation.nom}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
              onClick={(e) => e.stopPropagation()}
            />

            <IconButton
              onClick={handleNextImage}
              sx={{
                position: 'absolute',
                right: 16,
                zIndex: 10,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
              }}
            >
              <ArrowForwardIos />
            </IconButton>

            <IconButton
              onClick={handleFullscreenClose}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
              }}
            >
              <Close />
            </IconButton>

            <Typography
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                px: 2,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              {currentImageIndex + 1} / {prestation.images.length}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default PrestationModal; 