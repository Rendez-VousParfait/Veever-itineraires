import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  TextField, 
  Button, 
  Avatar, 
  Grid, 
  Divider,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Favorite,
  ShoppingBag,
  Star
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useProfileTab } from '../../contexts/ProfileTabContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import UserFavorites from './UserFavorites';
import UserOrders from './UserOrders';
import UserCustomExperiences from './UserCustomExperiences';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const UserProfile: React.FC = () => {
  const { 
    currentUser, 
    userData, 
    updateUserProfile, 
    updateUserPhoto, 
    refreshUserData, 
    isAdmin,
    resetPassword
  } = useAuth();
  
  // Utiliser le contexte pour l'onglet actif
  const { activeTab, setActiveTab } = useProfileTab();
  
  // États pour les informations de profil
  const [displayName, setDisplayName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [photoLoading, setPhotoLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // États pour le changement de mot de passe
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  
  // États pour la réinitialisation du mot de passe
  const [resetDialogOpen, setResetDialogOpen] = useState<boolean>(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState<string | null>(null);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);
  const [resetPasswordLoading, setResetPasswordLoading] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialiser le formulaire avec les données actuelles
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
    }
  }, [currentUser]);
  
  // Gérer le changement d'onglet
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Gérer la soumission du formulaire de profil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await updateUserProfile(displayName);
      await refreshUserData();
      setSuccess('Votre profil a été mis à jour avec succès.');
      
      // Masquer le message de succès après 5 secondes
      setTimeout(() => setSuccess(null), 5000);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setError(error.message || 'Une erreur est survenue lors de la mise à jour du profil.');
    } finally {
      setLoading(false);
    }
  };
  
  // Gérer le clic sur le bouton de téléchargement de photo
  const handlePhotoButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Gérer le changement de photo
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide.');
      return;
    }
    
    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('L\'image est trop volumineuse. Veuillez sélectionner une image de moins de 2MB.');
      return;
    }
    
    setPhotoLoading(true);
    setError(null);
    
    try {
      // Utiliser Firebase Storage au lieu de base64
      const storage = getStorage();
      console.log('Téléchargement de la photo vers Firebase Storage...');
      
      // Créer une référence unique avec timestamp pour éviter les problèmes de cache
      const timestamp = new Date().getTime();
      const storageRef = ref(storage, `profile_pictures/${currentUser?.uid}_${timestamp}`);
      
      // Télécharger le fichier
      console.log('Début du téléchargement...');
      const uploadResult = await uploadBytes(storageRef, file);
      console.log('Téléchargement terminé:', uploadResult);
      
      // Obtenir l'URL de téléchargement
      console.log('Récupération de l\'URL...');
      const photoURL = await getDownloadURL(storageRef);
      console.log('URL de la photo:', photoURL);
      
      // Mettre à jour le profil avec l'URL
      console.log('Mise à jour du profil utilisateur...');
      await updateUserPhoto(photoURL);
      console.log('Profil mis à jour avec succès');
      
      setSuccess('Votre photo de profil a été mise à jour avec succès.');
      setTimeout(() => setSuccess(null), 5000);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de la photo:', error);
      
      // Afficher un message d'erreur plus détaillé
      if (error.code === 'storage/unauthorized') {
        setError('Accès non autorisé au stockage. Veuillez vous reconnecter et réessayer.');
      } else if (error.code === 'storage/canceled') {
        setError('Téléchargement annulé. Veuillez réessayer.');
      } else if (error.code === 'storage/unknown') {
        setError('Une erreur inconnue est survenue. Veuillez réessayer plus tard.');
      } else {
        setError(error.message || 'Une erreur est survenue lors de la mise à jour de la photo.');
      }
    } finally {
      setPhotoLoading(false);
    }
  };
  
  // Supprimer la photo de profil
  const handleRemovePhoto = async () => {
    if (!currentUser?.photoURL) return;
    
    setPhotoLoading(true);
    setError(null);
    
    try {
      // Mettre à jour le profil avec une URL vide
      await updateUserPhoto('');
      setSuccess('Votre photo de profil a été supprimée.');
      setTimeout(() => setSuccess(null), 5000);
    } catch (error: any) {
      console.error('Erreur lors de la suppression de la photo:', error);
      setError(error.message || 'Une erreur est survenue lors de la suppression de la photo.');
    } finally {
      setPhotoLoading(false);
    }
  };
  
  // Gérer le changement de mot de passe
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Réinitialiser les messages
    setPasswordError(null);
    setPasswordSuccess(null);
    
    // Vérifier que les mots de passe correspondent
    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }
    
    // Vérifier la complexité du mot de passe
    if (newPassword.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      // Réauthentifier l'utilisateur
      if (!currentUser || !currentUser.email) {
        throw new Error('Utilisateur non connecté ou email manquant.');
      }
      
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Mettre à jour le mot de passe
      await updatePassword(currentUser, newPassword);
      
      // Réinitialiser les champs
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setPasswordSuccess('Votre mot de passe a été mis à jour avec succès.');
      setTimeout(() => setPasswordSuccess(null), 5000);
    } catch (error: any) {
      console.error('Erreur lors du changement de mot de passe:', error);
      
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Le mot de passe actuel est incorrect.');
      } else if (error.code === 'auth/weak-password') {
        setPasswordError('Le nouveau mot de passe est trop faible.');
      } else if (error.code === 'auth/requires-recent-login') {
        setPasswordError('Cette opération est sensible et nécessite une connexion récente. Veuillez vous reconnecter et réessayer.');
      } else {
        setPasswordError(error.message || 'Une erreur est survenue lors du changement de mot de passe.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };
  
  // Gérer la réinitialisation du mot de passe
  const handleResetPassword = async () => {
    if (!currentUser?.email) return;
    
    setResetPasswordLoading(true);
    setResetPasswordError(null);
    
    try {
      await resetPassword(currentUser.email);
      setResetPasswordSuccess('Un email de réinitialisation a été envoyé à votre adresse email.');
      setResetDialogOpen(false);
    } catch (error: any) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      setResetPasswordError(error.message || 'Une erreur est survenue lors de l\'envoi de l\'email de réinitialisation.');
    } finally {
      setResetPasswordLoading(false);
    }
  };
  
  // Formater la date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    try {
      // Si c'est un timestamp Firestore
      if (typeof timestamp.toDate === 'function') {
        return format(timestamp.toDate(), 'dd MMMM yyyy à HH:mm', { locale: fr });
      }
      // Si c'est une date JavaScript
      else if (timestamp instanceof Date) {
        return format(timestamp, 'dd MMMM yyyy à HH:mm', { locale: fr });
      }
      return 'Date invalide';
    } catch (error) {
      return 'Date invalide';
    }
  };
  
  // Obtenir les initiales de l'utilisateur pour l'avatar
  const getInitials = () => {
    if (!currentUser) return '?';
    
    if (currentUser.displayName) {
      return currentUser.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    }
    
    return currentUser.email ? currentUser.email[0].toUpperCase() : '?';
  };
  
  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">
          Vous devez être connecté pour accéder à cette page.
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 8, pt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mon profil
      </Typography>
      
      {resetPasswordSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {resetPasswordSuccess}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Informations utilisateur */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              {currentUser.photoURL ? (
                <Avatar 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'Utilisateur'} 
                  sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                />
              ) : (
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}
                >
                  {getInitials()}
                </Avatar>
              )}
              
              <Box sx={{ 
                position: 'absolute', 
                bottom: 8, 
                right: -10, 
                display: 'flex', 
                gap: 0.5 
              }}>
                <Tooltip title="Changer la photo">
                  <IconButton 
                    color="primary" 
                    aria-label="changer la photo de profil" 
                    component="span"
                    onClick={handlePhotoButtonClick}
                    disabled={photoLoading}
                    size="small"
                    sx={{ 
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'background.default' }
                    }}
                  >
                    {photoLoading ? <CircularProgress size={24} /> : <PhotoCameraIcon />}
                  </IconButton>
                </Tooltip>
                
                {currentUser.photoURL && (
                  <Tooltip title="Supprimer la photo">
                    <IconButton 
                      color="error" 
                      aria-label="supprimer la photo de profil" 
                      component="span"
                      onClick={handleRemovePhoto}
                      disabled={photoLoading}
                      size="small"
                      sx={{ 
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'background.default' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </Box>
            
            <Typography variant="h6" gutterBottom>
              {currentUser.displayName || 'Utilisateur'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {currentUser.email}
            </Typography>
            
            {isAdmin && (
              <Chip 
                label="Administrateur" 
                color="primary" 
                sx={{ mt: 1 }}
              />
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Membre depuis:</strong> {userData ? formatDate(userData.createdAt) : 'N/A'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <strong>Dernière connexion:</strong> {userData ? formatDate(userData.lastLogin) : 'N/A'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Formulaires de modification */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                aria-label="profile tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab icon={<PersonIcon />} label="Profil" id="profile-tab-0" aria-controls="profile-tabpanel-0" />
                <Tab icon={<LockIcon />} label="Mot de passe" id="profile-tab-1" aria-controls="profile-tabpanel-1" />
                <Tab icon={<EmailIcon />} label="Email" id="profile-tab-2" aria-controls="profile-tabpanel-2" />
              </Tabs>
            </Box>
            
            {/* Onglet Profil */}
            <TabPanel value={activeTab} index={0}>
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
              
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="displayName"
                  label="Nom d'affichage"
                  name="displayName"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={loading}
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading || !displayName}
                >
                  {loading ? <CircularProgress size={24} /> : 'Enregistrer les modifications'}
                </Button>
              </Box>
            </TabPanel>
            
            {/* Onglet Mot de passe */}
            <TabPanel value={activeTab} index={1}>
              {passwordError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {passwordError}
                </Alert>
              )}
              
              {passwordSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {passwordSuccess}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handlePasswordChange} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="currentPassword"
                  label="Mot de passe actuel"
                  type="password"
                  id="currentPassword"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={passwordLoading}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="newPassword"
                  label="Nouveau mot de passe"
                  type="password"
                  id="newPassword"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={passwordLoading}
                  helperText="Le mot de passe doit contenir au moins 8 caractères"
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirmer le mot de passe"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={passwordLoading}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                  >
                    {passwordLoading ? <CircularProgress size={24} /> : 'Changer le mot de passe'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setResetDialogOpen(true)}
                    disabled={passwordLoading}
                  >
                    Mot de passe oublié ?
                  </Button>
                </Box>
              </Box>
            </TabPanel>
            
            {/* Onglet Email */}
            <TabPanel value={activeTab} index={2}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Pour des raisons de sécurité, le changement d'adresse email nécessite une vérification. 
                Veuillez contacter l'administrateur pour modifier votre adresse email.
              </Alert>
              
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Adresse email"
                name="email"
                autoComplete="email"
                value={currentUser.email || ''}
                disabled
              />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialogue de réinitialisation de mot de passe */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
      >
        <DialogTitle>Réinitialiser votre mot de passe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Un email de réinitialisation sera envoyé à votre adresse email ({currentUser.email}). 
            Suivez les instructions dans l'email pour réinitialiser votre mot de passe.
          </DialogContentText>
          
          {resetPasswordError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {resetPasswordError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)} disabled={resetPasswordLoading}>
            Annuler
          </Button>
          <Button 
            onClick={handleResetPassword} 
            color="primary" 
            disabled={resetPasswordLoading}
          >
            {resetPasswordLoading ? <CircularProgress size={24} /> : 'Envoyer l\'email'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile; 