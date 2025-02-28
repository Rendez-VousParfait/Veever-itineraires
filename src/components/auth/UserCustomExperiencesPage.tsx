import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import UserCustomExperiences from './UserCustomExperiences';

const UserCustomExperiencesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 8, pt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/profile')}
          sx={{ mr: 2 }}
        >
          Retour
        </Button>
        <Typography variant="h4" component="h1">
          Mes expériences sur mesure
        </Typography>
      </Box>
      
      <UserCustomExperiences />
    </Container>
  );
};

export default UserCustomExperiencesPage; 