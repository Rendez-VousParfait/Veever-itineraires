import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Link, 
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterProps {
  onToggleForm: () => void;
  onClose: () => void;
}

export default function Register({ onToggleForm, onClose }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup, updateUserProfile } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      return setError('Veuillez remplir tous les champs');
    }
    
    if (password !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas');
    }
    
    if (password.length < 6) {
      return setError('Le mot de passe doit contenir au moins 6 caractères');
    }

    try {
      setError('');
      setLoading(true);
      
      console.log('Tentative d\'inscription avec:', { email });
      
      const userCredential = await signup(email, password);
      console.log('Inscription réussie:', userCredential);
      
      try {
        setTimeout(async () => {
          try {
            await updateUserProfile(name);
            console.log('Profil mis à jour avec succès');
          } catch (profileUpdateError: any) {
            console.error('Erreur lors de la mise à jour du profil après délai:', profileUpdateError);
          }
        }, 1500);
      } catch (profileError: any) {
        console.error('Erreur lors de la mise à jour du profil:', profileError);
        // Continuer même si la mise à jour du profil échoue
      }
      
      onClose(); // Fermer le modal après inscription réussie
    } catch (err: any) {
      console.error('Erreur d\'inscription complète:', err);
      
      let errorMessage = 'Échec de l\'inscription';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Cet email est déjà utilisé';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Email invalide';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Mot de passe trop faible';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Problème de connexion réseau. Vérifiez votre connexion internet.';
      } else if (err.message) {
        errorMessage = `Erreur: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Inscription
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Nom complet"
          name="name"
          autoComplete="name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Adresse email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Mot de passe"
          type="password"
          id="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ 
            mt: 3, 
            mb: 2,
            background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
            '&:hover': {
              background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
              opacity: 0.9
            }
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'S\'inscrire'}
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Link 
            component="button" 
            variant="body2" 
            onClick={onToggleForm}
            disabled={loading}
          >
            Déjà un compte ? Se connecter
          </Link>
        </Box>
      </Box>
    </Paper>
  );
} 