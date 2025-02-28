import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { getUsersByRole, UserData, UserRole } from '../../firebase/userService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const UserManagement: React.FC = () => {
  const { isAdmin, setUserRole, currentUser } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // État pour le dialogue de changement de rôle
  const [openRoleDialog, setOpenRoleDialog] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('user');
  const [roleChangeLoading, setRoleChangeLoading] = useState<boolean>(false);
  
  // Charger tous les utilisateurs
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Charger les utilisateurs normaux
      const regularUsers = await getUsersByRole('user');
      
      // Charger les administrateurs
      const adminUsers = await getUsersByRole('admin');
      
      // Combiner et trier par date de création
      const allUsers = [...regularUsers, ...adminUsers].sort((a, b) => {
        // Vérifier si createdAt est un objet Firestore Timestamp
        if (a.createdAt && b.createdAt) {
          // Vérifier si les objets ont la méthode toMillis (Timestamp)
          if ('toMillis' in a.createdAt && 'toMillis' in b.createdAt) {
            return (b.createdAt as any).toMillis() - (a.createdAt as any).toMillis();
          } 
          // Si ce sont des dates JavaScript
          else if (a.createdAt instanceof Date && b.createdAt instanceof Date) {
            return b.createdAt.getTime() - a.createdAt.getTime();
          }
        }
        return 0;
      });
      
      setUsers(allUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setError('Impossible de charger la liste des utilisateurs. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);
  
  // Ouvrir le dialogue de changement de rôle
  const handleOpenRoleDialog = (user: UserData) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setOpenRoleDialog(true);
  };
  
  // Fermer le dialogue
  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false);
    setSelectedUser(null);
    setRoleChangeLoading(false);
  };
  
  // Changer le rôle d'un utilisateur
  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    
    setRoleChangeLoading(true);
    setError(null);
    
    try {
      await setUserRole(selectedUser.uid, newRole);
      
      // Mettre à jour la liste des utilisateurs
      setUsers(users.map(user => 
        user.uid === selectedUser.uid 
          ? { ...user, role: newRole } 
          : user
      ));
      
      setSuccess(`Le rôle de ${selectedUser.displayName || selectedUser.email} a été modifié avec succès.`);
      setTimeout(() => setSuccess(null), 5000);
      handleCloseRoleDialog();
    } catch (error) {
      console.error('Erreur lors du changement de rôle:', error);
      setError('Impossible de modifier le rôle. Veuillez réessayer.');
    } finally {
      setRoleChangeLoading(false);
    }
  };
  
  // Formater la date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = timestamp.toDate();
      return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };
  
  // Si l'utilisateur n'est pas admin, afficher un message d'erreur
  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, pt: 4 }}>
        <Alert severity="error">
          Vous n'avez pas les droits d'accès à cette page. Cette page est réservée aux administrateurs.
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 8, pt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestion des utilisateurs
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
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/admin/create-admin')}
        >
          Créer un administrateur
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={() => loadUsers()}
          disabled={loading}
        >
          Actualiser la liste
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Créé le</TableCell>
                <TableCell>Dernière connexion</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>{user.displayName || 'Non défini'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role === 'admin' ? 'Administrateur' : 'Utilisateur'} 
                        color={user.role === 'admin' ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => handleOpenRoleDialog(user)}
                        disabled={user.uid === currentUser?.uid} // Empêcher de modifier son propre rôle
                      >
                        Modifier le rôle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Dialogue de changement de rôle */}
      <Dialog open={openRoleDialog} onClose={handleCloseRoleDialog}>
        <DialogTitle>Modifier le rôle utilisateur</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vous êtes sur le point de modifier le rôle de {selectedUser?.displayName || selectedUser?.email}.
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="role-select-label">Rôle</InputLabel>
            <Select
              labelId="role-select-label"
              value={newRole}
              label="Rôle"
              onChange={(e) => setNewRole(e.target.value as UserRole)}
            >
              <MenuItem value="user">Utilisateur</MenuItem>
              <MenuItem value="admin">Administrateur</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog} disabled={roleChangeLoading}>
            Annuler
          </Button>
          <Button 
            onClick={handleRoleChange} 
            variant="contained" 
            disabled={roleChangeLoading || newRole === selectedUser?.role}
          >
            {roleChangeLoading ? <CircularProgress size={24} /> : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement; 