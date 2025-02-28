import { useState } from 'react';
import { Modal, Box } from '@mui/material';
import Login from './Login';
import Register from './Register';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
  const [currentView, setCurrentView] = useState<'login' | 'register'>(initialView);

  const toggleView = () => {
    setCurrentView(currentView === 'login' ? 'register' : 'login');
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="auth-modal"
      aria-describedby="modal-d'authentification"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 'auto' },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          outline: 'none',
        }}
      >
        {currentView === 'login' ? (
          <Login onToggleForm={toggleView} onClose={onClose} />
        ) : (
          <Register onToggleForm={toggleView} onClose={onClose} />
        )}
      </Box>
    </Modal>
  );
} 