import { useState } from 'react';
import { Box, Button, Typography, Paper, TextField, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function DebugAuth() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Utilisateur Test');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  
  const { signup, login, logout, currentUser } = useAuth();

  const handleSignup = async () => {
    try {
      setError('');
      setResult('Tentative d\'inscription...');
      const userCredential = await signup(email, password);
      setResult(`Inscription réussie: ${JSON.stringify(userCredential.user.uid)}`);
    } catch (err: any) {
      console.error('Erreur de débogage lors de l\'inscription:', err);
      setError(`Erreur d'inscription: ${err.code} - ${err.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      setError('');
      setResult('Tentative de connexion...');
      const userCredential = await login(email, password);
      setResult(`Connexion réussie: ${JSON.stringify(userCredential.user.uid)}`);
    } catch (err: any) {
      console.error('Erreur de débogage lors de la connexion:', err);
      setError(`Erreur de connexion: ${err.code} - ${err.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      setError('');
      setResult('Tentative de déconnexion...');
      await logout();
      setResult('Déconnexion réussie');
    } catch (err: any) {
      console.error('Erreur de débogage lors de la déconnexion:', err);
      setError(`Erreur de déconnexion: ${err.code} - ${err.message}`);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Débogage d'authentification
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          État actuel:
        </Typography>
        <Typography variant="body2" component="pre" sx={{ 
          p: 2, 
          bgcolor: 'background.paper', 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 1,
          overflowX: 'auto'
        }}>
          {currentUser ? 
            JSON.stringify({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              emailVerified: currentUser.emailVerified,
              isAnonymous: currentUser.isAnonymous,
              metadata: {
                creationTime: currentUser.metadata.creationTime,
                lastSignInTime: currentUser.metadata.lastSignInTime
              }
            }, null, 2) 
            : 'Non connecté'
          }
        </Typography>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {result && <Alert severity="info" sx={{ mb: 2 }}>{result}</Alert>}
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleSignup}
          sx={{ flex: 1 }}
        >
          S'inscrire
        </Button>
        <Button 
          variant="contained" 
          onClick={handleLogin}
          sx={{ flex: 1 }}
        >
          Se connecter
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleLogout}
          sx={{ flex: 1 }}
        >
          Se déconnecter
        </Button>
      </Box>
    </Paper>
  );
} 