import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Button,
  Divider
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: (view: 'login' | 'register') => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onOpenAuth }) => {
  const { currentUser, logout } = useAuth();
  
  const menuItems = [
    { text: 'Itinéraires', href: '/#itineraires' },
    { text: 'Sur Mesure', href: '/#creer' },
    { text: 'Surprise Me', href: '/#surprise' },
    { text: 'Blog', href: '/#blog' },
    { text: 'F.A.Q', href: '/#faq' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(12px)',
          borderLeft: '1px solid rgba(99, 102, 241, 0.1)',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>

        <List sx={{ mt: 5 }}>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text} 
              onClick={onClose}
              component="a"
              href={item.href}
              sx={{ 
                py: 2,
                '&:hover': {
                  background: 'rgba(99, 102, 241, 0.1)',
                },
              }}
            >
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    color: 'text.primary',
                  },
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {currentUser ? (
          <>
            <ListItem sx={{ py: 1 }}>
              <ListItemText 
                primary={currentUser.displayName || 'Utilisateur'} 
                secondary={currentUser.email}
                sx={{
                  '& .MuiTypography-root': { color: 'text.primary' },
                  '& .MuiTypography-body2': { color: 'text.secondary' },
                }}
              />
            </ListItem>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleLogout}
              sx={{
                mt: 2,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'text.primary',
              }}
            >
              Se déconnecter
            </Button>
          </>
        ) : (
          <>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                onOpenAuth('login');
                onClose();
              }}
              sx={{
                mb: 2,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'text.primary',
              }}
            >
              Connexion
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                onOpenAuth('register');
                onClose();
              }}
              sx={{
                background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                  opacity: 0.9
                },
              }}
            >
              S'inscrire
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default MobileMenu; 