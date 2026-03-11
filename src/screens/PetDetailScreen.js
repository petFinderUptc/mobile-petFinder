import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPetById } from '../services/petService';
import { COLORS, SPACING, FONT_SIZES } from '../constants/config';

const PetDetailScreen = ({ route, navigation }) => {
  const { petId } = route.params;
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPetDetails();
  }, [petId]);

  const loadPetDetails = async () => {
    try {
      const data = await getPetById(petId);
      setPet(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el detalle del reporte');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    Alert.alert(
      'Contactar Usuario',
      '¿Cómo deseas contactar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'WhatsApp',
          onPress: () => {
            // Open WhatsApp (requires phone number from backend)
            Linking.openURL('whatsapp://send?phone=1234567890');
          },
        },
        {
          text: 'Llamar',
          onPress: () => {
            Linking.openURL('tel:1234567890');
          },
        },
      ]
    );
  };

  const openInMaps = () => {
    if (pet.latitude && pet.longitude) {
      const url = Platform.select({
        ios: `maps:0,0?q=${pet.latitude},${pet.longitude}`,
        android: `geo:0,0?q=${pet.latitude},${pet.longitude}`,
      });
      Linking.openURL(url);
    } else {
      Alert.alert('Ubicación no disponible');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar el reporte</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={
          pet.imageUrl
            ? { uri: pet.imageUrl }
            : require('../../assets/placeholder-pet.png')
        }
        style={styles.image}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{pet.name || 'Sin nombre'}</Text>
            <Text style={styles.petType}>{pet.type}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              pet.status === 'lost' ? styles.badgeLost : styles.badgeFound,
            ]}
          >
            <Text style={styles.statusText}>
              {pet.status === 'lost' ? 'Perdido' : 'Encontrado'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.iconRow}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            <Text style={styles.locationText}>{pet.location}</Text>
          </View>
          {pet.latitude && pet.longitude && (
            <TouchableOpacity style={styles.mapButton} onPress={openInMaps}>
              <Ionicons name="map" size={16} color={COLORS.primary} />
              <Text style={styles.mapButtonText}>Ver en mapa</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{pet.description}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.iconRow}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>
              Reportado el {new Date(pet.createdAt).toLocaleDateString('es-ES')}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
          <Text style={styles.contactButtonText}>Contactar</Text>
        </TouchableOpacity>

        <View style={{ height: SPACING.xl }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.backgroundSecondary,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  petType: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
    marginTop: SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  badgeLost: {
    backgroundColor: '#FEE2E2',
  },
  badgeFound: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  locationText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 1,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
  },
  mapButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  contactButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  contactButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default PetDetailScreen;
