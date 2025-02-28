import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Indigo moderne
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899', // Rose vif
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: '#0f172a', // Bleu très foncé
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Acumin Extra Condensed", "Arial", sans-serif !important',
      fontWeight: 600, // Semi Bold
      fontSize: '3.5rem',
    },
    h2: {
      fontFamily: '"Acumin Extra Condensed", "Arial", sans-serif !important',
      fontWeight: 600, // Semi Bold
      fontSize: '2.5rem',
    },
    subtitle1: {
      fontFamily: '"Poppins", "Arial", sans-serif',
      fontWeight: 400, // Regular
    },
    subtitle2: {
      fontFamily: '"Poppins", "Arial", sans-serif',
      fontWeight: 700, // Bold
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 600,
        },
        contained: {
          background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
          '&:hover': {
            background: 'linear-gradient(45deg, #f59e3f, #f74AA1)',
          },
        },
        outlined: {
          borderColor: '#6366f1',
          '&:hover': {
            borderColor: '#4f46e5',
            background: 'rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
        },
      },
    },
  },
}); 