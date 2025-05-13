import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import store from './app/store'
import App from './App'
import './index.css'
import authService from './services/authService'

// Create a responsive theme with mobile-first approach
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green - representing growth and support
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#fff',
    },
    secondary: {
      main: '#5E35B1', // Purple - representing compassion
      light: '#7E57C2',
      dark: '#4527A0',
      contrastText: '#fff',
    },
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
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
      default: '#F5F7FA',
      paper: '#ffffff'
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d'
    },
    divider: 'rgba(0, 0, 0, 0.12)'
  },
  typography: {
    fontFamily: '"Roboto", "Poppins", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '3.5rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '2.25rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          padding: '10px 16px',
          fontWeight: 500,
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)'
          }
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1B5E20'
          }
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#4527A0'
          }
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px'
          }
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(46, 125, 50, 0.04)'
          }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0,0,0,0.08)'
        },
        elevation2: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)'
        }
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0,0,0,0.08)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
          borderRadius: 12,
          overflow: 'hidden'
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24
          }
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: 'rgba(46, 125, 50, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(46, 125, 50, 0.18)'
            }
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8
        },
        standardSuccess: {
          backgroundColor: 'rgba(46, 125, 50, 0.12)',
          color: '#1B5E20'
        },
        standardInfo: {
          backgroundColor: 'rgba(2, 136, 209, 0.12)',
          color: '#01579B'
        },
        standardWarning: {
          backgroundColor: 'rgba(237, 108, 2, 0.12)',
          color: '#E65100'
        },
        standardError: {
          backgroundColor: 'rgba(211, 47, 47, 0.12)',
          color: '#C62828'
        }
      }
    }
  },
});

// Setup authentication interceptors
authService.setupAuthInterceptors();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
