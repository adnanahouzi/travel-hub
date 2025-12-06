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
import { RoomSelectionModal } from '../components/RoomSelectionModal';
import { SelectedRoomsModal } from '../components/SelectedRoomsModal';

const { width } = Dimensions.get('window');
const CARD_IMAGE_WIDTH = width - 40; // Card padding

export const RoomListScreen = ({ navigation, route }) => {
  const { rates, reviewsSummary } = route.params;
  const [loading, setLoading] = useState(false);
  const [selectedRateId, setSelectedRateId] = useState(null);
  const [activeSlides, setActiveSlides] = useState({}); // Track active slide for each room
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedRoomsModalVisible, setSelectedRoomsModalVisible] = useState(false);

  const filters = ['Petit-déjeuner', 'Annulation gratuite', 'Payer sur place'];

  const handleSelectRoom = (rate) => {
    setSelectedRoom(rate);
    setModalVisible(true);
  };

  const handleConfirmSelection = ({ room, count, preference }) => {
    setModalVisible(false);

    // Add to selected rooms list
    const newSelection = {
      room,
      count,
      preference
    };

    setSelectedRooms(prev => [...prev, newSelection]);

    // Show selected rooms modal automatically
    setTimeout(() => {
      setSelectedRoomsModalVisible(true);
    }, 500);
  };

  const handleRemoveRoom = (index) => {
    setSelectedRooms(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveRoomType = (rateId) => {
    setSelectedRooms(prev => prev.filter(item => item.room.rateId !== rateId));
  };

  const handleValidateSelection = async () => {
    if (selectedRooms.length === 0) return;

    setSelectedRoomsModalVisible(false);

    try {
      setLoading(true);

      // Create requests array
      const requests = selectedRooms.map(item => {
        if (!item.room.offerId) {
          throw new Error(`Aucun offerId pour la chambre: ${item.room.name}`);
        }
        return {
          offerId: item.room.offerId,
          usePaymentSdk: false
        };
      });

      // Call batch prebook API
      const batchResponse = await ApiService.prebook(requests);

      console.log('Batch prebook successful, total:', batchResponse.totalAmount);

      // Navigate to summary with all selected rooms and the batch response
      navigation.navigate('BookingSummary', {
        selectedRooms,
        batchResponse,
        reviewsSummary
      });
    } catch (error) {
      console.error('Prebook error:', error);
      Alert.alert(
        'Erreur de réservation',
        'Impossible de créer les sessions de pré-réservation. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderRoomCard = ({ item, index }) => {
    // Price Calculation
    const totalPrice = item.retailRate.total[0].amount;
    const currency = item.retailRate.total[0].currency || 'MAD';
    const formattedPrice = new Intl.NumberFormat('fr-MA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(totalPrice);

    // Discount Calculation
    let discountPercentage = 0;
    if (item.retailRate.initialPrice && item.retailRate.initialPrice.length > 0) {
      const initialPrice = item.retailRate.initialPrice[0].amount;
      if (initialPrice > totalPrice) {
        discountPercentage = Math.round(((initialPrice - totalPrice) / initialPrice) * 100);
      }
    }

    // Points Calculation (10% of total price)
    const points = Math.round(totalPrice * 0.1);

    // Amenities Mapping
    const hasBreakfast =
      (item.boardName && (item.boardName.toLowerCase().includes('breakfast') || item.boardName.toLowerCase().includes('petit-déjeuner'))) ||
      (item.perks && item.perks.some(p => p.toLowerCase().includes('breakfast') || p.toLowerCase().includes('petit-déjeuner')));

    const hasCoffee = item.perks && item.perks.some(p =>
      p.toLowerCase().includes('coffee') || p.toLowerCase().includes('tea') ||
      p.toLowerCase().includes('café') || p.toLowerCase().includes('thé') ||
      p.toLowerCase().includes('kettle') || p.toLowerCase().includes('bouilloire')
    );

    const hasMinibar = item.perks && item.perks.some(p =>
      p.toLowerCase().includes('mini-bar') || p.toLowerCase().includes('minibar')
    );

    const hasFreeCancellation =
      (item.cancellationPolicies && item.cancellationPolicies.refundableTag === 'RFN') ||
      (item.perks && item.perks.some(p => p.toLowerCase().includes('free cancellation') || p.toLowerCase().includes('annulation gratuite')));

    // Capacity & Size
    const capacity = (item.adultCount || 0) + (item.childCount || 0);
    const roomSize = item.roomSize ? `${item.roomSize} ${item.roomSizeUnit || 'm²'}` : null;

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

    // Check if this room type is selected
    const selectedCount = selectedRooms
      .filter(r => r.room.rateId === item.rateId)
      .reduce((acc, curr) => acc + curr.count, 0);

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

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercentage}%</Text>
            </View>
          )}

          {/* Image Counter & Pagination */}
          {roomImages.length > 1 && (
            <View style={styles.paginationContainer}>
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
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.roomTitle}>{item.name}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="bed-outline" size={16} color="#6B7280" />
              <Text style={styles.infoText}>{capacity} personnes</Text>
            </View>
            {roomSize && (
              <View style={styles.infoItem}>
                <Ionicons name="resize-outline" size={16} color="#6B7280" />
                <Text style={styles.infoText}>{roomSize}</Text>
              </View>
            )}
          </View>

          <View style={styles.amenitiesContainer}>
            {hasBreakfast && (
              <View style={styles.amenityRow}>
                <Ionicons name="cafe-outline" size={16} color="#059669" />
                <Text style={[styles.amenityText, styles.amenityTextGreen]}>Petit-déjeuner offert</Text>
              </View>
            )}
            {hasCoffee && (
              <View style={styles.amenityRow}>
                <Ionicons name="restaurant-outline" size={16} color="#6B7280" />
                <Text style={styles.amenityText}>Machine à café/thé</Text>
              </View>
            )}
            {hasMinibar && (
              <View style={styles.amenityRow}>
                <Ionicons name="wine-outline" size={16} color="#6B7280" />
                <Text style={styles.amenityText}>Mini-bar</Text>
              </View>
            )}
            {hasFreeCancellation && (
              <View style={styles.amenityRow}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#059669" />
                <Text style={[styles.amenityText, styles.amenityTextGreen]}>Annulation gratuite</Text>
              </View>
            )}
          </View>

          <View style={styles.priceSection}>
            <View>
              <Text style={styles.priceLabel}>Prix <Text style={styles.priceSubLabel}>(à partir de)</Text></Text>
              <Text style={styles.pointsLabel}>Points que vous gagnez</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.totalPrice}>{formattedPrice} {currency}</Text>
              <View style={styles.pointsRow}>
                <Ionicons name="flash" size={14} color="#F59E0B" />
                <Text style={styles.pointsValue}>{points}</Text>
              </View>
            </View>
          </View>

          {selectedCount > 0 ? (
            <View style={styles.selectedContainer}>
              <TouchableOpacity
                style={styles.selectedButton}
                onPress={() => handleSelectRoom(item)}
              >
                <Text style={styles.selectedButtonText}>{selectedCount} chambres</Text>
                <Ionicons name="chevron-down" size={16} color="#E85D40" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.trashButton}
                onPress={() => handleRemoveRoomType(item.rateId)}
              >
                <Ionicons name="trash-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.selectButton, loading && selectedRateId === item.rateId && styles.selectButtonDisabled]}
              onPress={() => handleSelectRoom(item)}
              disabled={loading}
            >
              {loading && selectedRateId === item.rateId ? (
                <ActivityIndicator color="#E85D40" />
              ) : (
                <Text style={styles.selectButtonText}>Sélectionner</Text>
              )}
            </TouchableOpacity>
          )}
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

      <RoomSelectionModal
        visible={modalVisible}
        room={selectedRoom}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmSelection}
      />

      <SelectedRoomsModal
        visible={selectedRoomsModalVisible}
        selectedRooms={selectedRooms}
        onClose={() => setSelectedRoomsModalVisible(false)}
        onRemoveRoom={handleRemoveRoom}
        onValidate={handleValidateSelection}
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
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  imageScroller: {
    flex: 1,
  },
  roomImage: {
    width: CARD_IMAGE_WIDTH,
    height: 200,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: '#4B5563',
    width: 6,
    height: 6,
  },
  cardContent: {
    padding: 16,
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  amenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  amenityTextGreen: {
    color: '#059669',
    fontWeight: '500',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceSubLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  pointsLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D97706',
    marginLeft: 4,
  },
  selectButton: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E85D40',
  },
  selectButtonDisabled: {
    opacity: 0.6,
  },
  selectButtonText: {
    color: '#E85D40',
    fontWeight: '700',
    fontSize: 16,
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#E85D40',
    marginRight: 12,
  },
  selectedButtonText: {
    color: '#E85D40',
    fontWeight: '700',
    fontSize: 16,
  },
  trashButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

