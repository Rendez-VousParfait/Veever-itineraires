import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Alert, Box, CircularProgress, Container, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * et/ou des droits d'administrateur
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { currentUser, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Vérification de l'authentification...
        </Typography>
      </Container>
    );
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la page d'accueil
  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si la route nécessite des droits d'administrateur et que l'utilisateur n'est pas admin
  if (requireAdmin && !isAdmin) {
    return (
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Accès refusé. Cette page est réservée aux administrateurs.
        </Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body1">
            Vous n'avez pas les droits nécessaires pour accéder à cette page.
          </Typography>
        </Box>
      </Container>
    );
  }

  // Si tout est OK, afficher le contenu de la route
  return <>{children}</>;
};

/**
 * Vérifie si l'utilisateur est administrateur
 */
export const isUserAdmin = (user: any, userData: any): boolean => {
  if (!user || !userData) return false;
  return userData.role === 'admin';
}; 