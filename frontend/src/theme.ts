import { ThemeOptions } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#1565C0', // Indigo/Blue
      light: '#5E92F3',
      dark: '#003C8F',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2E7D32', // Success Green
      light: '#60AD5E',
      dark: '#005005',
      contrastText: '#ffffff',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    warning: {
      main: '#ED6C02',
      light: '#FF9800',
      dark: '#E65100',
    },
    info: {
      main: '#0288D1',
      light: '#03A9F4',
      dark: '#01579B',
    },
    background: {
      default: mode === 'light' ? '#F4F6F8' : '#161C24',
      paper: mode === 'light' ? '#FFFFFF' : '#212B36',
    },
    text: {
      primary: mode === 'light' ? '#212B36' : '#FFFFFF',
      secondary: mode === 'light' ? '#637381' : '#919EAB',
    },
  },
  typography: {
    fontFamily: '"Inter", "DM Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body1: { lineHeight: 1.5 },
    body2: { lineHeight: 1.5 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 16px -8px rgba(21, 101, 192, 0.24)',
          },
        },
        containedPrimary: {
          boxShadow: '0 8px 16px -8px rgba(21, 101, 192, 0.24)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light'
            ? '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)'
            : '0 0 2px 0 rgba(0, 0, 0, 0.2), 0 12px 24px -4px rgba(0, 0, 0, 0.12)',
          border: `1px solid ${mode === 'light' ? 'rgba(145, 158, 171, 0.08)' : 'rgba(145, 158, 171, 0.12)'}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(22, 28, 36, 0.9)',
          backdropFilter: 'blur(6px)',
          color: mode === 'light' ? '#212B36' : '#FFFFFF',
          boxShadow: 'none',
          borderBottom: `1px dashed ${mode === 'light' ? 'rgba(145, 158, 171, 0.24)' : 'rgba(145, 158, 171, 0.24)'}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px dashed ${mode === 'light' ? 'rgba(145, 158, 171, 0.24)' : 'rgba(145, 158, 171, 0.24)'}`,
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#212B36',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          marginRight: 16,
          color: 'inherit',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          paddingTop: 8,
          paddingBottom: 8,
          '&.Mui-selected': {
            backgroundColor: 'rgba(21, 101, 192, 0.08)',
            color: '#1565C0',
            '&:hover': {
              backgroundColor: 'rgba(21, 101, 192, 0.16)',
            },
            '& .MuiListItemIcon-root': {
              color: '#1565C0',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(145, 158, 171, 0.08)',
          },
        },
      },
    },
  },
});
