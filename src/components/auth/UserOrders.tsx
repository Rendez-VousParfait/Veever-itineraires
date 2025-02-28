import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Collapse,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  AccessTime,
  CalendarToday,
  Person,
  Euro,
  CheckCircle,
  Cancel,
  Pending,
  Schedule
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getUserOrders, Order } from '../../firebase/itineraryService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

const UserOrders: React.FC = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const userOrders = await getUserOrders(currentUser.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
        setError('Impossible de charger vos commandes. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, [currentUser]);

  const handleExpandOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusChip = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Chip 
            icon={<Pending />} 
            label="En attente" 
            size="small"
            sx={{ 
              bgcolor: 'rgba(255, 193, 7, 0.1)', 
              color: '#ffc107',
              borderColor: 'rgba(255, 193, 7, 0.3)',
              border: '1px solid'
            }} 
          />
        );
      case 'confirmed':
        return (
          <Chip 
            icon={<CheckCircle />} 
            label="Confirmée" 
            size="small"
            sx={{ 
              bgcolor: 'rgba(76, 175, 80, 0.1)', 
              color: '#4caf50',
              borderColor: 'rgba(76, 175, 80, 0.3)',
              border: '1px solid'
            }} 
          />
        );
      case 'completed':
        return (
          <Chip 
            icon={<CheckCircle />} 
            label="Terminée" 
            size="small"
            sx={{ 
              bgcolor: 'rgba(33, 150, 243, 0.1)', 
              color: '#2196f3',
              borderColor: 'rgba(33, 150, 243, 0.3)',
              border: '1px solid'
            }} 
          />
        );
      case 'cancelled':
        return (
          <Chip 
            icon={<Cancel />} 
            label="Annulée" 
            size="small"
            sx={{ 
              bgcolor: 'rgba(244, 67, 54, 0.1)', 
              color: '#f44336',
              borderColor: 'rgba(244, 67, 54, 0.3)',
              border: '1px solid'
            }} 
          />
        );
      default:
        return null;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (orders.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Vous n'avez pas encore de commandes
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.href = '/#itineraires'}
          sx={{ mt: 2 }}
        >
          Découvrir nos itinéraires
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Mes commandes ({orders.length})
      </Typography>
      
      <TableContainer component={Paper} sx={{ 
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(12px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 214, 198, 0.3)',
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary' }}>Détails</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Itinéraire</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Date</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Prix</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Statut</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Commandé le</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <TableRow 
                  sx={{ 
                    '&:hover': { 
                      bgcolor: 'rgba(255, 255, 255, 0.05)' 
                    },
                    cursor: 'pointer'
                  }}
                  onClick={() => order.id && handleExpandOrder(order.id)}
                >
                  <TableCell>
                    <IconButton size="small">
                      {expandedOrderId === order.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{order.itineraryTitle}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{order.date}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{order.price}€</TableCell>
                  <TableCell>{getStatusChip(order.status)}</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>{formatDate(order.createdAt)}</TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={expandedOrderId === order.id} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4}>
                            <Card sx={{ 
                              height: '100%',
                              background: 'rgba(15, 23, 42, 0.5)',
                              border: '1px solid rgba(255, 214, 198, 0.2)',
                              borderRadius: '8px'
                            }}>
                              <CardMedia
                                component="img"
                                height="140"
                                image={order.itineraryImage}
                                alt={order.itineraryTitle}
                              />
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  {order.itineraryTitle}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={8}>
                            <Paper sx={{ 
                              p: 2,
                              height: '100%',
                              background: 'rgba(15, 23, 42, 0.5)',
                              border: '1px solid rgba(255, 214, 198, 0.2)',
                              borderRadius: '8px'
                            }}>
                              <Typography variant="subtitle1" gutterBottom>
                                Détails de la commande
                              </Typography>
                              
                              <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                              
                              <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                    <Person sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                      <strong>Participants:</strong> {order.participants}
                                    </Typography>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                    <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                      <strong>Date:</strong> {order.date}
                                    </Typography>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Euro sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                      <strong>Prix total:</strong> {order.price}€
                                    </Typography>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Contact:</strong> {order.contactInfo.name}
                                  </Typography>
                                  
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Email:</strong> {order.contactInfo.email}
                                  </Typography>
                                  
                                  <Typography variant="body2">
                                    <strong>Téléphone:</strong> {order.contactInfo.phone}
                                  </Typography>
                                </Grid>
                                
                                {order.specialRequests && (
                                  <Grid item xs={12}>
                                    <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                      <strong>Demandes spéciales:</strong>
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                                      "{order.specialRequests}"
                                    </Typography>
                                  </Grid>
                                )}
                              </Grid>
                            </Paper>
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserOrders; 