import Constants from 'expo-constants';

// API URL cargada desde .env via app.config.js
export const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 
  'http://localhost:3000/api';

export const APP_NAME = 'PetFinder';
export const APP_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@petfinder:auth_token',
  REFRESH_TOKEN: '@petfinder:refresh_token',
  USER_DATA: '@petfinder:user_data',
};

export const PET_TYPES = {
  DOG: 'dog',
  CAT: 'cat',
  BIRD: 'bird',
  OTHER: 'other',
};

export const PET_STATUS = {
  LOST: 'lost',
  FOUND: 'found',
};

export const COLORS = {
  primary: '#1e88e5',
  secondary: '#64b5f6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#d4183d',
  text: '#111827',
  textSecondary: '#717182',
  background: '#FFFFFF',
  backgroundSecondary: '#e3f2fd',
  border: 'rgba(0, 0, 0, 0.1)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Font Sizes
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};
