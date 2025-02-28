import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 3,
        borderTop: '1px solid rgba(99, 102, 241, 0.1)',
      }}
    >
      <Container 
        maxWidth={false}
        sx={{ 
          px: { xs: 2, sm: 4, md: 8, lg: 12 },
          maxWidth: '2000px',
          mx: 'auto',
        }}
      >
        <Grid container spacing={8} mb={6}>
          <Grid item xs={12} md={3}>
            <Box
              component="img"
              src="/images/logo-veever.png"
              alt="Veever"
              sx={{
                height: '150px',
                width: 'auto',
                mb: 3,
              }}
            />
            <Typography color="text.secondary" mb={3}>
              Des expériences uniques pour des moments inoubliables.
            </Typography>
            <Stack direction="row" spacing={1}>
              {[<Facebook />, <Instagram />, <Twitter />].map((icon, index) => (
                <IconButton
                  key={index}
                  sx={{
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(99, 102, 241, 0.2)',
                    },
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" mb={2}>Liens utiles</Typography>
            <Stack spacing={1}>
              {[
                'Nos itinéraires',
                'Sur Mesure',
                'Surprise Me',
                'Blog',
                'F.A.Q'
              ].map((text) => (
                <Button
                  key={text}
                  color="inherit"
                  href={
                    text === 'Blog' 
                      ? '/#blog' 
                      : text === 'Surprise Me'
                        ? '/#surprise'
                        : text === 'Sur Mesure'
                          ? '/#creer'
                          : text === 'F.A.Q'
                            ? '/#faq'
                            : `/#${text.toLowerCase().replace(/\s+/g, '')}`
                  }
                  sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}
                >
                  {text}
                </Button>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" mb={2}>Contact</Typography>
            <Stack spacing={1} color="text.secondary">
              <Typography>Email: contact@veever.fr</Typography>
              <Typography>Tél: 01 23 45 67 89</Typography>
              <Typography>Du lundi au vendredi, 9h-19h</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" mb={2}>Newsletter</Typography>
            <Typography color="text.secondary" mb={2}>
              Recevez nos nouveaux itinéraires en avant-première
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Votre email"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
                },
              }}
            >
              S'inscrire
            </Button>
          </Grid>
        </Grid>

        <Box
          sx={{
            pt: 3,
            borderTop: '1px solid rgba(99, 102, 241, 0.1)',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item xs={12} md="auto">
              <Typography color="text.secondary">
                © {new Date().getFullYear()} Veever. Tous droits réservés.
              </Typography>
            </Grid>
            <Grid item xs={12} md="auto">
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                color="text.secondary"
              >
                <Button color="inherit">Mentions légales</Button>
                <Button color="inherit">Politique de confidentialité</Button>
                <Button color="inherit">CGV</Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 