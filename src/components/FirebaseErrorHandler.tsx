import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import ErrorIcon from '@mui/icons-material/Error';

// Liste des erreurs Firebase connues avec leurs solutions
const errorSolutions: Record<string, string> = {
  'cors': 'Problème de sécurité cross-origin. Essayez de vider le cache du navigateur ou d\'utiliser une navigation privée.',
  'access control checks': 'Problème de sécurité cross-origin avec les vérifications de contrôle d\'accès. Essayez les solutions proposées.',
  'auth/requires-recent-login': 'Votre session a expiré. Veuillez vous reconnecter.',
  'permission-denied': 'Vous n\'avez pas les autorisations nécessaires pour accéder à ces données.',
  'network-error': 'Problème de connexion réseau. Vérifiez votre connexion internet.'
};

// Interface pour les erreurs Firebase
interface FirebaseError extends Error {
  code?: string;
}

// Fonction pour détecter automatiquement les erreurs CORS
const detectCorsErrors = () => {
  const originalFetch = window.fetch;
  
  window.fetch = function(...args) {
    return originalFetch.apply(this, args).catch(error => {
      if (error.message && (
        error.message.includes('access control checks') || 
        error.message.includes('cors') ||
        error.message.includes('CORS')
      )) {
        // Déclencher un événement personnalisé pour l'erreur CORS
        const corsErrorEvent = new CustomEvent('firebaseCorsError', { detail: error });
        window.dispatchEvent(corsErrorEvent);
      }
      throw error;
    });
  };
  
  return originalFetch; // Retourner la fonction d'origine pour restauration
};

// Options de solution pour les erreurs CORS
const corsErrorSolutions = [
  {
    title: 'Rafraîchir la page',
    description: 'Recharge la page pour rétablir la connexion',
    icon: <RefreshIcon />,
    action: () => window.location.reload()
  },
  {
    title: 'Vider le cache du navigateur',
    description: 'Efface les données stockées localement qui peuvent causer le problème',
    icon: <DeleteIcon />,
    action: () => {
      // Instructions pour vider le cache
      alert('Pour vider le cache du navigateur:\n1. Ouvrez les paramètres de votre navigateur\n2. Allez dans "Historique" ou "Confidentialité"\n3. Sélectionnez "Vider les données de navigation"\n4. Cochez "Cookies et données de site" et "Images et fichiers en cache"\n5. Cliquez sur "Effacer les données"');
    }
  },
  {
    title: 'Utiliser une navigation privée',
    description: 'Ouvrez l\'application dans une fenêtre de navigation privée/incognito',
    icon: <SecurityIcon />,
    action: () => {
      // Instructions pour la navigation privée
      alert('Ouvrez une fenêtre de navigation privée/incognito et accédez à nouveau à l\'application.');
    }
  },
  {
    title: 'Désactiver les extensions bloquantes',
    description: 'Certaines extensions de navigateur peuvent bloquer les requêtes',
    icon: <SettingsIcon />,
    action: () => {
      // Instructions pour désactiver les extensions
      alert('Pour désactiver temporairement vos extensions:\n1. Cliquez sur l\'icône des extensions dans votre navigateur\n2. Désactivez temporairement les bloqueurs de publicités, VPN, ou autres extensions de sécurité\n3. Rafraîchissez la page');
    }
  }
];

const FirebaseErrorHandler: React.FC = () => {
  const [error, setError] = useState<{type: string, message: string} | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [originalFetch, setOriginalFetch] = useState<typeof window.fetch | null>(null);

  useEffect(() => {
    // Détecter les erreurs CORS et stocker la fonction fetch originale
    const origFetch = detectCorsErrors();
    setOriginalFetch(origFetch);
    
    // Écouter l'événement personnalisé pour les erreurs CORS
    const corsErrorHandler = (event: any) => {
      const errorMessage = event.detail?.message || 'Erreur CORS inconnue';
      const isAccessControlError = errorMessage.includes('access control checks');
      
      setError({
        type: isAccessControlError ? 'access control checks' : 'cors',
        message: `Problème de connexion au serveur Firebase: ${errorMessage}`
      });
      setShowDialog(true);
    };
    
    // Écouter les changements d'état d'authentification pour détecter les erreurs
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        // Utilisateur connecté avec succès, rien à faire
      }, 
      (firebaseError: FirebaseError) => {
        // Erreur d'authentification
        let errorType = 'unknown';
        if (firebaseError.code) {
          errorType = firebaseError.code;
        }
        
        setError({
          type: errorType,
          message: firebaseError.message
        });
        setShowDialog(true);
      }
    );
    
    window.addEventListener('firebaseCorsError', corsErrorHandler);
    
    // Écouter les erreurs non interceptées
    const unhandledErrorHandler = (event: ErrorEvent) => {
      if (event.message && (
        event.message.includes('Firestore') || 
        event.message.includes('Firebase') ||
        event.message.includes('access control checks')
      )) {
        const isAccessControlError = event.message.includes('access control checks');
        
        setError({
          type: isAccessControlError ? 'access control checks' : 'cors',
          message: event.message
        });
        setShowDialog(true);
      }
    };
    
    window.addEventListener('error', unhandledErrorHandler);
    
    return () => {
      window.removeEventListener('firebaseCorsError', corsErrorHandler);
      window.removeEventListener('error', unhandledErrorHandler);
      unsubscribe();
      
      // Restaurer la fonction fetch d'origine
      if (originalFetch && window.fetch !== originalFetch) {
        window.fetch = originalFetch;
      }
    };
  }, [originalFetch]);
  
  const handleClose = () => {
    setShowDialog(false);
    setTimeout(() => setError(null), 300);
  };
  
  const handleRefresh = () => {
    // Vider le cache et recharger
    window.location.reload();
  };
  
  const getSolution = () => {
    if (!error) return '';
    
    for (const key in errorSolutions) {
      if (error.type.includes(key) || error.message.includes(key)) {
        return errorSolutions[key];
      }
    }
    
    return 'Essayez de rafraîchir la page ou de vous reconnecter.';
  };
  
  const isAccessControlError = error?.type === 'access control checks' || 
                               error?.message.includes('access control checks');
  
  return (
    <>
      <Dialog
        open={showDialog}
        onClose={handleClose}
        aria-labelledby="firebase-error-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="firebase-error-dialog-title" sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          color: 'error.main'
        }}>
          <ErrorIcon color="error" />
          Problème de connexion à Firebase
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {error?.message || 'Une erreur inattendue s\'est produite.'}
          </Typography>
          
          {isAccessControlError ? (
            <>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2, mb: 1 }}>
                Ce problème est généralement causé par les paramètres de sécurité du navigateur qui bloquent certaines requêtes cross-origin.
              </Typography>
              
              <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                Solutions recommandées:
              </Typography>
              
              <List>
                {corsErrorSolutions.map((solution, index) => (
                  <ListItem 
                    button 
                    key={index} 
                    onClick={solution.action}
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'divider', 
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      }
                    }}
                  >
                    <ListItemIcon>
                      {solution.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={solution.title} 
                      secondary={solution.description}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
              {getSolution()}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fermer
          </Button>
          <Button onClick={handleRefresh} color="primary" variant="contained">
            Rafraîchir la page
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FirebaseErrorHandler; 