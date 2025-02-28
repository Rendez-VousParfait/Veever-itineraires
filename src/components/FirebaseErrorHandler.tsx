import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

// Liste des erreurs Firebase connues avec leurs solutions
const errorSolutions: Record<string, string> = {
  'cors': 'Problème de sécurité cross-origin. Essayez de vider le cache du navigateur ou d\'utiliser une navigation privée.',
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
      if (error.message && error.message.includes('access control checks')) {
        // Déclencher un événement personnalisé pour l'erreur CORS
        const corsErrorEvent = new CustomEvent('firebaseCorsError', { detail: error });
        window.dispatchEvent(corsErrorEvent);
      }
      throw error;
    });
  };
  
  return originalFetch; // Retourner la fonction d'origine pour restauration
};

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
      setError({
        type: 'cors',
        message: 'Problème de connexion au serveur Firebase (CORS Error)'
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
        setError({
          type: event.message.includes('access control checks') ? 'cors' : 'unknown',
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
  
  return (
    <>
      <Dialog
        open={showDialog}
        onClose={handleClose}
        aria-labelledby="firebase-error-dialog-title"
      >
        <DialogTitle id="firebase-error-dialog-title">
          Problème de connexion détecté
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {error?.message || 'Une erreur inattendue s\'est produite.'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Solution recommandée:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
            {getSolution()}
          </Typography>
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