import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Paper, 
  Box,
  CircularProgress
} from '@mui/material';
import { createAdminUser } from '../../firebase/userService';

const CreateAdminUser: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Veuillez saisir une adresse email.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await createAdminUser(email);
      setSuccess(`L'utilisateur ${email} a été promu administrateur avec succès.`);
      setEmail('');
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'administrateur:', error);
      setError(error.message || 'Une erreur est survenue lors de la création de l\'administrateur.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ mt: 8, pt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Créer un administrateur
        </Typography>
        
        <Typography variant="body1" paragraph>
          Cet outil permet de promouvoir un utilisateur existant au rang d'administrateur.
          L'utilisateur doit déjà être inscrit dans l'application.
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
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !email}
          >
            {loading ? <CircularProgress size={24} /> : 'Promouvoir comme administrateur'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateAdminUser; 