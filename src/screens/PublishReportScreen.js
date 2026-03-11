import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import { createPet } from '../services/petService';
import { COLORS, SPACING, FONT_SIZES, PET_TYPES, PET_STATUS } from '../constants/config';

const PublishReportScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog',
    status: 'lost',
    description: '',
    location: '',
    latitude: null,
    longitude: null,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    // Request camera permissions
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    
    // Request location permissions
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

    if (cameraStatus !== 'granted' || locationStatus !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Esta aplicación necesita acceso a la cámara y ubicación para funcionar correctamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const takePicture = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Get address from coordinates
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const locationString = [
        address.street,
        address.city,
        address.region,
      ]
        .filter(Boolean)
        .join(', ');

      setFormData((prev) => ({
        ...prev,
        location: locationString || 'Ubicación detectada',
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));

      Alert.alert('¡Ubicación detectada!', locationString);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    } finally {
      setLoadingLocation(false);
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.description || !formData.location) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos');
      return false;
    }
    if (!image) {
      Alert.alert('Foto requerida', 'Por favor toma o selecciona una foto de la mascota');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const reportData = {
        ...formData,
        imageUrl: image, // In real app, upload to server first
      };

      await createPet(reportData);
      
      Alert.alert(
        '¡Reporte publicado!',
        'Tu reporte ha sido publicado exitosamente',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Inicio');
              // Reset form
              setFormData({
                name: '',
                type: 'dog',
                status: 'lost',
                description: '',
                location: '',
                latitude: null,
                longitude: null,
              });
              setImage(null);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo publicar el reporte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Publicar Reporte</Text>
        <Text style={styles.subtitle}>Ayuda a una mascota a volver a casa</Text>
      </View>

      {/* Image Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Foto de la mascota *</Text>
        {image ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImage(null)}
            >
              <Ionicons name="close-circle" size={32} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imagePickerContainer}>
            <TouchableOpacity style={styles.imageButton} onPress={takePicture}>
              <Ionicons name="camera" size={32} color={COLORS.primary} />
              <Text style={styles.imageButtonText}>Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Ionicons name="images" size={32} color={COLORS.primary} />
              <Text style={styles.imageButtonText}>Elegir de galería</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Status Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Estado *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.status === 'lost' && styles.statusButtonActive,
            ]}
            onPress={() => handleInputChange('status', 'lost')}
          >
            <Text
              style={[
                styles.statusButtonText,
                formData.status === 'lost' && styles.statusButtonTextActive,
              ]}
            >
              Perdido
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.status === 'found' && styles.statusButtonActive,
            ]}
            onPress={() => handleInputChange('status', 'found')}
          >
            <Text
              style={[
                styles.statusButtonText,
                formData.status === 'found' && styles.statusButtonTextActive,
              ]}
            >
              Encontrado
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Name */}
      <View style={styles.section}>
        <Text style={styles.label}>Nombre de la mascota *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Max, Luna, Bobby..."
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
        />
      </View>

      {/* Type */}
      <View style={styles.section}>
        <Text style={styles.label}>Tipo de mascota *</Text>
        <View style={styles.buttonGroup}>
          {[
            { value: 'dog', label: 'Perro', icon: 'paw' },
            { value: 'cat', label: 'Gato', icon: 'fish' },
            { value: 'other', label: 'Otro', icon: 'help-circle' },
          ].map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeButton,
                formData.type === type.value && styles.typeButtonActive,
              ]}
              onPress={() => handleInputChange('type', type.value)}
            >
              <Ionicons
                name={type.icon}
                size={20}
                color={
                  formData.type === type.value ? '#fff' : COLORS.textSecondary
                }
              />
              <Text
                style={[
                  styles.typeButtonText,
                  formData.type === type.value && styles.typeButtonTextActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.label}>Descripción *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe características, comportamiento, última vez visto..."
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Location */}
      <View style={styles.section}>
        <View style={styles.locationHeader}>
          <Text style={styles.label}>Ubicación *</Text>
          <TouchableOpacity
            style={styles.gpsButton}
            onPress={getCurrentLocation}
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <>
                <Ionicons name="location" size={16} color={COLORS.primary} />
                <Text style={styles.gpsButtonText}>Usar GPS</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Calle, ciudad, barrio..."
          value={formData.location}
          onChangeText={(value) => handleInputChange('location', value)}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.submitButtonText}>Publicar Reporte</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={{ height: SPACING.xl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    height: 100,
    paddingTop: SPACING.md,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  imageButton: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  imageButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statusButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  statusButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  typeButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    gap: SPACING.xs,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  gpsButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default PublishReportScreen;
