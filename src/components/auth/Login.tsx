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

interface LoginProps {
  onToggleForm: () => void;
  onClose: () => void;
}

export default function Login({ onToggleForm, onClose }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const { login, resetPassword } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !password) {
      return setError('Veuillez remplir tous les champs');
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      onClose(); // Fermer le modal après connexion réussie
    } catch (err: any) {
      let errorMessage = 'Échec de la connexion';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte ne correspond à cet email';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Mot de passe incorrect';
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Identifiants invalides';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!email) {
      return setError('Veuillez entrer votre email pour réinitialiser votre mot de passe');
    }

    try {
      setError('');
      setLoading(true);
      await resetPassword(email);
      setResetSent(true);
    } catch (err: any) {
      let errorMessage = 'Échec de la réinitialisation du mot de passe';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte ne correspond à cet email';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Connexion
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {resetSent && <Alert severity="success" sx={{ mb: 2 }}>Un email de réinitialisation a été envoyé</Alert>}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Adresse email"
          name="email"
          autoComplete="email"
          autoFocus
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {loading ? <CircularProgress size={24} /> : 'Se connecter'}
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Link 
            component="button" 
            variant="body2" 
            onClick={handleResetPassword}
            disabled={loading}
          >
            Mot de passe oublié ?
          </Link>
          <Link 
            component="button" 
            variant="body2" 
            onClick={onToggleForm}
            disabled={loading}
          >
            Pas de compte ? S'inscrire
          </Link>
        </Box>
      </Box>
    </Paper>
  );
} 