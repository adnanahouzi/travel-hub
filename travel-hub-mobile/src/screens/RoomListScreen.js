import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ApiService } from '../services/api.service';

const { width } = Dimensions.get('window');
const CARD_IMAGE_WIDTH = width - 40; // Card padding

export const RoomListScreen = ({ navigation, route }) => {
  const { rates } = route.params;
  const [loading, setLoading] = useState(false);
  const [selectedRateId, setSelectedRateId] = useState(null);
  const [activeSlides, setActiveSlides] = useState({}); // Track active slide for each room

  const filters = ['Petit-déjeuner', 'Annulation gratuite', 'Payer sur place'];

  const handleSelectRoom = async (rate) => {
    if (!rate.offerId) {
      Alert.alert('Erreur', 'Aucun offerId disponible pour cette chambre');
      return;
    }

    try {
      setLoading(true);
      setSelectedRateId(rate.rateId);

      // Call prebook API
      const prebookResponse = await ApiService.prebook(rate.offerId, false);

      console.log('Prebook successful:', prebookResponse);

      // Navigate to summary with prebook data
      navigation.navigate('BookingSummary', {
        rate,
        prebookData: prebookResponse.data
      });
    } catch (error) {
      console.error('Prebook error:', error);
      Alert.alert(
        'Erreur de réservation',
        'Impossible de créer la session de pré-réservation. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
      setSelectedRateId(null);
    }
  };

  const renderRoomCard = ({ item, index }) => {
    // Mock calculations for visual match
    const totalPrice = item.retailRate.total[0].amount;
    const currency = item.retailRate.total[0].currency || 'MAD';
    const nightlyPrice = Math.round(totalPrice / 2); // Assuming 2 nights for demo
    const points = Math.round(totalPrice * 10);

    // Get room images from roomPhotos if available
    let roomImages = [];
    if (item.roomPhotos && item.roomPhotos.length > 0) {
      roomImages = item.roomPhotos.map(photo => photo.url).filter(url => url);
    }

    // Fallback to placeholder if no images
    if (roomImages.length === 0) {
      roomImages = ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&q=80'];
    }

    const currentSlide = activeSlides[item.rateId] || 0;

    const onScroll = (event) => {
      const slideIndex = Math.ceil(
        event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
      );
      if (slideIndex !== currentSlide) {
        setActiveSlides(prev => ({
          ...prev,
          [item.rateId]: slideIndex
        }));
      }
    };

    return (
      <View style={styles.card}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={onScroll}
            style={styles.imageScroller}
          >
            {roomImages.map((img, imgIndex) => (
              <Image
                key={imgIndex}
                source={{ uri: img }}
                style={styles.roomImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Image Counter & Pagination */}
          {roomImages.length > 1 && (
            <>
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentSlide + 1}/{roomImages.length}
                </Text>
              </View>
              <View style={styles.pagination}>
                {roomImages.map((_, dotIndex) => (
                  <View
                    key={dotIndex}
                    style={[
                      styles.paginationDot,
                      currentSlide === dotIndex && styles.paginationDotActive
                    ]}
                  />
                ))}
              </View>
            </>
          )}
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.roomDetails}>22m2 • 2 lits jumeaux ou 1 lit Queen</Text>
          <Text style={styles.roomTitle}>{item.name}</Text>

          <View style={styles.iconRow}>
            <Ionicons name="person-outline" size={14} color="#6B7280" />
            <Text style={styles.iconText}>3 personnes</Text>
            <Ionicons name="wifi-outline" size={14} color="#6B7280" style={{ marginLeft: 12 }} />
            <Text style={styles.iconText}>Wi-Fi gratuit</Text>
          </View>

          <View style={styles.perkRow}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#059669" />
            <Text style={styles.perkText}>Annulation gratuite</Text>
          </View>

          <View style={styles.priceSection}>
            <View>
              <Text style={styles.priceLabel}>Prix</Text>
              <Text style={styles.pointsLabel}>Points gagnés</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={styles.priceRow}>
                <Text style={styles.nightlyPrice}>{nightlyPrice} {currency}</Text>
                <Text style={styles.totalPrice}>{Math.round(totalPrice)} {currency}</Text>
              </View>
              <View style={styles.pointsPill}>
                <Ionicons name="diamond-outline" size={12} color="#D97706" />
                <Text style={styles.pointsValue}>{points}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.selectButton, loading && selectedRateId === item.rateId && styles.selectButtonDisabled]}
            onPress={() => handleSelectRoom(item)}
            disabled={loading}
          >
            {loading && selectedRateId === item.rateId ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.selectButtonText}>Sélectionner</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choisir les chambres</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <View style={styles.filterPill}>
              <Text style={styles.filterText}>{item}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </View>

      {/* Room List */}
      <FlatList
        data={rates}
        renderItem={renderRoomCard}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  filterContainer: {
    backgroundColor: '#FFF',
    paddingBottom: 16,
  },
  filterPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 220,
  },
  imageScroller: {
    flex: 1,
  },
  roomImage: {
    width: CARD_IMAGE_WIDTH,
    height: 220,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  pagination: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: '#FFF',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardContent: {
    padding: 16,
  },
  roomDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  perkText: {
    fontSize: 12,
    color: '#059669',
    marginLeft: 6,
    fontWeight: '500',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  nightlyPrice: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  pointsValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
    marginLeft: 4,
  },
  selectButton: {
    backgroundColor: '#E85D40',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectButtonDisabled: {
    opacity: 0.6,
  },
  selectButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

