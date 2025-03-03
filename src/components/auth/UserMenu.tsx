import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  IconButton, 
  Tooltip,
  Typography
} from '@mui/material';
import { 
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  Favorite as FavoriteIcon,
  ShoppingBag as ShoppingBagIcon,
  Star as StarIcon,
  ExploreOutlined as ExploreIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useProfileTab } from '../../contexts/ProfileTabContext';

const UserMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { currentUser, logout, isAdmin } = useAuth();
  const { setActiveTab } = useProfileTab();
  const navigate = useNavigate();
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };
  
  const handleAdminPanel = () => {
    handleClose();
    navigate('/admin/users');
  };

  const handleProfile = () => {
    setActiveTab(0); // Onglet Profil
    handleClose();
    navigate('/profile');
  };
  
  const handleFavorites = () => {
    handleClose();
    navigate('/favorites');
  };
  
  const handleOrders = () => {
    handleClose();
    navigate('/orders');
  };
  
  const handleCustomExperiences = () => {
    handleClose();
    navigate('/custom-experiences');
  };
  
  // Obtenir les initiales de l'utilisateur pour l'avatar
  const getInitials = () => {
    if (!currentUser?.displayName) return '?';
    return currentUser.displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Compte">
          <IconButton
            onClick={handleMenu}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={anchorEl ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={anchorEl ? 'true' : undefined}
          >
            {currentUser?.photoURL ? (
              <Avatar 
                src={currentUser.photoURL} 
                alt={currentUser.displayName || 'Utilisateur'} 
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: 'primary.main',
                  background: 'linear-gradient(45deg, #f59e3f, #f74AA1)'
                }}
              >
                {getInitials()}
              </Avatar>
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {currentUser?.displayName || 'Utilisateur'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentUser?.email}
          </Typography>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mon profil</ListItemText>
        </MenuItem>
        
        {isAdmin && (
          <MenuItem onClick={handleAdminPanel}>
            <ListItemIcon>
              <AdminIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Administration</ListItemText>
          </MenuItem>
        )}
        
        <MenuItem onClick={handleFavorites}>
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mes favoris</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleOrders}>
          <ListItemIcon>
            <ShoppingBagIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mes commandes</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleCustomExperiences}>
          <ListItemIcon>
            <ExploreIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mes expériences personnalisées</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Se déconnecter</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu; 