import { createTheme } from '@mui/material/styles';
import type { Theme, ThemeOptions } from '@mui/material/styles';
import { colors } from './colors';

// Extended theme interface for custom properties
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      colors: typeof colors;
    };
  }
  
  interface ThemeOptions {
    custom?: {
      colors?: typeof colors;
    };
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[500],
      light: colors.primary[300],
      dark: colors.primary[700],
      contrastText: colors.text.inverse,
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[300],
      dark: colors.secondary[700],
      contrastText: colors.text.inverse,
    },
    error: {
      main: colors.error[500],
      light: colors.error[300],
      dark: colors.error[700],
    },
    warning: {
      main: colors.warning[500],
      light: colors.warning[300],
      dark: colors.warning[700],
    },
    info: {
      main: colors.info[500],
      light: colors.info[300],
      dark: colors.info[700],
    },
    success: {
      main: colors.success[500],
      light: colors.success[300],
      dark: colors.success[700],
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    divider: colors.border.light,
  },
  
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 300,
      fontSize: '6rem',
      lineHeight: 1.167,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 300,
      fontSize: '3.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 400,
      fontSize: '3rem',
      lineHeight: 1.167,
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 400,
      fontSize: '2.125rem',
      lineHeight: 1.235,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: 1.334,
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.6,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.75,
      letterSpacing: '0.00938em',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase' as const,
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
  },
  
  shape: {
    borderRadius: 12,
  },
  
  spacing: 8,
  
  shadows: [
    'none',
    `0px 2px 1px -1px ${colors.shadow.light}, 0px 1px 1px 0px ${colors.shadow.light}, 0px 1px 3px 0px ${colors.shadow.light}`,
    `0px 3px 1px -2px ${colors.shadow.light}, 0px 2px 2px 0px ${colors.shadow.light}, 0px 1px 5px 0px ${colors.shadow.light}`,
    `0px 3px 3px -2px ${colors.shadow.light}, 0px 3px 4px 0px ${colors.shadow.light}, 0px 1px 8px 0px ${colors.shadow.light}`,
    `0px 2px 4px -1px ${colors.shadow.light}, 0px 4px 5px 0px ${colors.shadow.light}, 0px 1px 10px 0px ${colors.shadow.light}`,
    `0px 3px 5px -1px ${colors.shadow.light}, 0px 5px 8px 0px ${colors.shadow.light}, 0px 1px 14px 0px ${colors.shadow.light}`,
    `0px 3px 5px -1px ${colors.shadow.light}, 0px 6px 10px 0px ${colors.shadow.light}, 0px 1px 18px 0px ${colors.shadow.light}`,
    `0px 4px 5px -2px ${colors.shadow.light}, 0px 7px 10px 1px ${colors.shadow.light}, 0px 2px 16px 1px ${colors.shadow.light}`,
    `0px 5px 5px -3px ${colors.shadow.medium}, 0px 8px 10px 1px ${colors.shadow.light}, 0px 3px 14px 2px ${colors.shadow.light}`,
    `0px 5px 6px -3px ${colors.shadow.medium}, 0px 9px 12px 1px ${colors.shadow.light}, 0px 3px 16px 2px ${colors.shadow.light}`,
    `0px 6px 6px -3px ${colors.shadow.medium}, 0px 10px 14px 1px ${colors.shadow.light}, 0px 4px 18px 3px ${colors.shadow.light}`,
    `0px 6px 7px -4px ${colors.shadow.medium}, 0px 11px 15px 1px ${colors.shadow.light}, 0px 4px 20px 3px ${colors.shadow.light}`,
    `0px 7px 8px -4px ${colors.shadow.medium}, 0px 12px 17px 2px ${colors.shadow.light}, 0px 5px 22px 4px ${colors.shadow.light}`,
    `0px 7px 8px -4px ${colors.shadow.medium}, 0px 13px 19px 2px ${colors.shadow.light}, 0px 5px 24px 4px ${colors.shadow.light}`,
    `0px 7px 9px -4px ${colors.shadow.medium}, 0px 14px 21px 2px ${colors.shadow.light}, 0px 5px 26px 4px ${colors.shadow.light}`,
    `0px 8px 9px -5px ${colors.shadow.medium}, 0px 15px 22px 2px ${colors.shadow.light}, 0px 6px 28px 5px ${colors.shadow.light}`,
    `0px 8px 10px -5px ${colors.shadow.medium}, 0px 16px 24px 2px ${colors.shadow.light}, 0px 6px 30px 5px ${colors.shadow.light}`,
    `0px 8px 11px -5px ${colors.shadow.medium}, 0px 17px 26px 2px ${colors.shadow.light}, 0px 6px 32px 5px ${colors.shadow.light}`,
    `0px 9px 11px -5px ${colors.shadow.medium}, 0px 18px 28px 2px ${colors.shadow.light}, 0px 7px 34px 6px ${colors.shadow.light}`,
    `0px 9px 12px -6px ${colors.shadow.medium}, 0px 19px 29px 2px ${colors.shadow.light}, 0px 7px 36px 6px ${colors.shadow.light}`,
    `0px 10px 13px -6px ${colors.shadow.medium}, 0px 20px 31px 3px ${colors.shadow.light}, 0px 8px 38px 7px ${colors.shadow.light}`,
    `0px 10px 13px -6px ${colors.shadow.medium}, 0px 21px 33px 3px ${colors.shadow.light}, 0px 8px 40px 7px ${colors.shadow.light}`,
    `0px 10px 14px -6px ${colors.shadow.medium}, 0px 22px 35px 3px ${colors.shadow.light}, 0px 8px 42px 7px ${colors.shadow.light}`,
    `0px 11px 14px -7px ${colors.shadow.dark}, 0px 23px 36px 3px ${colors.shadow.light}, 0px 9px 44px 8px ${colors.shadow.light}`,
    `0px 11px 15px -7px ${colors.shadow.dark}, 0px 24px 38px 3px ${colors.shadow.light}, 0px 9px 46px 8px ${colors.shadow.light}`,
  ],
  
  components: {
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backgroundColor: colors.dialog.backdrop,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
          },
        },
        paper: {
          borderRadius: 16,
          boxShadow: `0px 24px 38px 3px ${colors.shadow.medium}, 0px 9px 46px 8px ${colors.shadow.light}`,
          overflow: 'hidden',
          position: 'relative',
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: colors.input.background,
            borderRadius: 12,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: `0 4px 8px ${colors.shadow.light}`,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.input.focus,
              },
            },
            '&.Mui-focused': {
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 12px ${colors.shadow.medium}`,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.input.focus,
                borderWidth: 2,
              },
            },
            '& .MuiInputAdornment-root .MuiSvgIcon-root': {
              transition: 'all 0.3s ease',
            },
          },
          '& .MuiInputLabel-root': {
            transition: 'all 0.3s ease',
            '&.Mui-focused': {
              color: colors.input.focus,
              transform: 'translate(14px, -9px) scale(0.75)',
            },
          },
        },
      },
    },
    
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '12px 24px',
          boxShadow: 'none',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 16px ${colors.shadow.light}`,
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'transform 0.6s ease',
          },
          '&:hover::before': {
            transform: 'translateX(200%)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: `0 8px 16px ${colors.shadow.medium}`,
            filter: 'brightness(1.05)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
            backgroundColor: colors.button.hover,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: colors.button.hover,
          },
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'all 0.3s ease',
        },
        elevation1: {
          boxShadow: `0px 2px 1px -1px ${colors.shadow.light}, 0px 1px 1px 0px ${colors.shadow.light}, 0px 1px 3px 0px ${colors.shadow.light}`,
        },
        elevation4: {
          boxShadow: `0px 4px 5px -2px ${colors.shadow.light}, 0px 7px 10px 1px ${colors.shadow.light}, 0px 2px 16px 1px ${colors.shadow.light}`,
        },
      },
    },
    
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '& .MuiAlert-icon': {
            alignItems: 'center',
          },
        },
        standardError: {
          backgroundColor: `${colors.error[50]}`,
          color: colors.error[800],
          border: `1px solid ${colors.error[200]}`,
        },
        standardSuccess: {
          backgroundColor: `${colors.success[50]}`,
          color: colors.success[800],
          border: `1px solid ${colors.success[200]}`,
        },
        standardInfo: {
          backgroundColor: `${colors.info[50]}`,
          color: colors.info[800],
          border: `1px solid ${colors.info[200]}`,
        },
        standardWarning: {
          backgroundColor: `${colors.warning[50]}`,
          color: colors.warning[800],
          border: `1px solid ${colors.warning[200]}`,
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 8px ${colors.shadow.light}`,
          },
        },
      },
    },
    
    MuiAvatar: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
        },
      },
    },
    
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: colors.button.hover,
          },
        },
      },
    },

    MuiInputAdornment: {
      styleOverrides: {
        root: {
          '& .MuiSvgIcon-root': {
            transition: 'all 0.3s ease',
          },
        },
      },
    },

    MuiCircularProgress: {
      styleOverrides: {
        root: {
          animation: 'spin 1.4s linear infinite',
          '@keyframes spin': {
            '0%': {
              transform: 'rotate(0deg)',
            },
            '100%': {
              transform: 'rotate(360deg)',
            },
          },
        },
      },
    },
  },
  
  custom: {
    colors,
  },
};

export const theme: Theme = createTheme(themeOptions);

export default theme;
