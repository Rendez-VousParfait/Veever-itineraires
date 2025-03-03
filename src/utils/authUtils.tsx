import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Alert, Box, CircularProgress, Container, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * et/ou des droits d'administrateur
 */
export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { currentUser, loading, isAdmin } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - État:', {
    currentUser: currentUser?.email,
    loading,
    isAdmin,
    requireAdmin,
    pathname: location.pathname
  });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </div>
    );
  }

  if (!currentUser) {
    console.log('ProtectedRoute - Utilisateur non connecté, redirection...');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log('ProtectedRoute - Accès admin refusé');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2>Accès non autorisé</h2>
        <p>Vous n'avez pas les droits d'administrateur nécessaires pour accéder à cette page.</p>
      </div>
    );
  }

  console.log('ProtectedRoute - Accès autorisé');
  return <>{children}</>;
}

/**
 * Vérifie si l'utilisateur est administrateur
 */
export const isUserAdmin = (user: any, userData: any): boolean => {
  if (!user || !userData) return false;
  return userData.role === 'admin';
}; 