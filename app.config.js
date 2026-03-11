export default {
  expo: {
    name: 'PetFinder',
    slug: 'mobile-petfinder',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#1e88e5',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.petfinder.app',
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#1e88e5',
        foregroundImage: './assets/android-icon-foreground.png',
      },
      package: 'com.petfinder.app',
      permissions: [
        'CAMERA',
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        'expo-camera',
        {
          cameraPermission: 'La aplicación necesita acceso a la cámara para tomar fotos de mascotas.',
        },
      ],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission: 'La aplicación necesita acceso a tu ubicación para mostrar mascotas cercanas.',
        },
      ],
      [
        'expo-notifications',
        {
          color: '#1e88e5',
        },
      ],
    ],
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
      eas: {
        projectId: process.env.EAS_PROJECT_ID || 'project-id-here',
      },
    },
  },
};
