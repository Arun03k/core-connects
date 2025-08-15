// Color Theme Configuration for CoreConnect
// Centralized color management for consistent design system

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#7C4DFF', // Main primary color
    600: '#7B1FA2',
    700: '#6A1B9A',
    800: '#4A148C',
    900: '#38006B',
  },

  // Secondary Colors
  secondary: {
    50: '#E8EAF6',
    100: '#C5CAE9',
    200: '#9FA8DA',
    300: '#7986CB',
    400: '#5C6BC0',
    500: '#3F51B5', // Main secondary color
    600: '#3949AB',
    700: '#303F9F',
    800: '#283593',
    900: '#1A237E',
  },

  // Neutral Colors
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Semantic Colors
  success: {
    50: '#E8F5E8',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336',
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },

  warning: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800',
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },

  info: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },

  // Background Colors
  background: {
    default: '#FFFFFF',
    paper: '#FAFAFA',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
    gradient: {
      primary: 'linear-gradient(135deg, #7C4DFF 0%, #3F51B5 100%)',
      secondary: 'linear-gradient(45deg, #E8EAF6 0%, #F3E5F5 100%)',
      overlay: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)',
    },
  },

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#616161',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
    hint: '#9E9E9E',
  },

  // Border Colors
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#757575',
    focus: '#7C4DFF',
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },

  // Component Specific Colors
  dialog: {
    backdrop: 'rgba(0, 0, 0, 0.5)',
    paper: '#FFFFFF',
    header: '#7C4DFF',
  },

  input: {
    background: '#FAFAFA',
    border: '#E0E0E0',
    focus: '#7C4DFF',
    error: '#F44336',
  },

  button: {
    hover: 'rgba(124, 77, 255, 0.08)',
    focus: 'rgba(124, 77, 255, 0.12)',
  },
} as const;

// Color utility functions
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // Handle rgba colors
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)$/g, `${opacity})`);
  }
  
  // Handle rgb colors
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }
  
  return color;
};

export const isDarkColor = (color: string): boolean => {
  // Simple luminance calculation for hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  }
  return false;
};

export default colors;
