import React, { useState, useEffect } from 'react';
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
import { SelectedRoomsModal } from '../components/SelectedRoomsModal';

const { width } = Dimensions.get('window');
const CARD_IMAGE_WIDTH = width - 40; // Card padding

const getOfferDisplayName = (offer) => {
  if (offer.roomBreakdown?.length > 0) {
    // If simple case (1 type, count 1), just return name
    if (offer.roomBreakdown.length === 1 && offer.roomBreakdown[0].count === 1) {
      return offer.roomBreakdown[0].name;
    }
    return offer.roomBreakdown.map(b => `${b.count} x ${b.name}`).join(' + ');
  }
  return offer.name || 'Offre de chambre';
};

// Generate a unique key for grouping identical room configurations
const getRoomConfigKey = (offer) => {
  if (!offer.roomBreakdown) return 'unknown';
  // Sort by name to ensure consistent key generation independent of order
  const sorted = [...offer.roomBreakdown].sort((a, b) => a.name.localeCompare(b.name));
  return sorted.map(r => `${r.count}x${r.name}`).join('|');
};

export const RoomListScreen = ({ navigation, route }) => {
  const { groupedRates, hotelDetails, reviewsSummary: paramReviewsSummary, selectedOffer } = route.params || {};
  const reviewsSummary = paramReviewsSummary || hotelDetails?.reviewsSummary;
  const [loading, setLoading] = useState(false);
  const [activeSlides, setActiveSlides] = useState({}); // Track active slide for each room
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedRoomsModalVisible, setSelectedRoomsModalVisible] = useState(false);

  // Grouping logic removed as it's now handled by backend
  // uniqueRoomGroups is simply groupedRates which is List<RoomConfigurationGroupDto>
  const uniqueRoomGroups = groupedRates || [];

  // Handle return from RoomRateSelectionScreen
  useEffect(() => {
    if (route.params?.selectedOffer) {
      const offer = route.params.selectedOffer;
      // Check if already selected to avoid duplicates if needed, or allow multiple
      const newSelection = {
        room: {
          ...offer,
          name: getOfferDisplayName(offer)
        },
        count: 1
      };
      setSelectedRooms(prev => [...prev, newSelection]);

      // Show selected rooms modal automatically
      setTimeout(() => {
        setSelectedRoomsModalVisible(true);
      }, 500);

      // Clear the param
      navigation.setParams({ selectedOffer: null });
    }
  }, [route.params?.selectedOffer]);

  const filters = ['Petit-déjeuner', 'Annulation gratuite', 'Payer sur place'];

  const handleSelectGroup = (group) => {
    // Pass the list of offers for this configuration group
    navigation.navigate('RoomRateSelection', { offers: group.offers, roomGroup: group });
  };

  const handleRemoveRoom = (index) => {
    setSelectedRooms(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveRoomType = (offerId) => {
    setSelectedRooms(prev => prev.filter(item => item.room.offerId !== offerId));
  };

  // Note: Validation logic removed - now handled directly in RoomRateSelectionScreen
  // which calls prebook and navigates to BookingSummary

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

  const renderRoomGroupCard = ({ item, index }) => {
    // item is now RoomConfigurationGroupDto
    // Determine lowest price and details from the first offer (cheapest) which is guaranteed by backend sort
    // But we can also use 'startingPrice' field directly

    // Price Calculation (use offerRetailRate - mapped to total in RetailRateDetailDto)
    const totalPrice = item.startingPrice?.total?.[0]?.amount || 0;
    const currency = item.startingPrice?.total?.[0]?.currency || 'MAD';
    // offerInitialPrice is mapped to initialPrice in RetailRateDetailDto
    const initialPrice = item.startingPrice?.initialPrice?.[0]?.amount;
    const formattedPrice = new Intl.NumberFormat('fr-MA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(totalPrice);

    // Need display details (images, capacity etc) from roomBreakdown
    // We can use the first item in roomBreakdown list attached to the group DTO
    // But we need to construct the rendering logic carefully

    // Check if any offer in this group is selected
    const selectedCountInGroup = selectedRooms
      .filter(r => item.offers && item.offers.some(o => o.offerId === r.room.offerId))
      .reduce((acc, curr) => acc + curr.count, 0);

    const isMultiRoom = item.roomBreakdown && item.roomBreakdown.length > 1;

    const renderRoomImages = (room, slideKey) => {
      let images = [];
      if (room.roomPhotos && room.roomPhotos.length > 0) {
        images = room.roomPhotos.map(photo => photo.url).filter(url => url);
      }
      if (images.length === 0) {
        images = ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&q=80'];
      }

      const currentSlide = activeSlides[slideKey] || 0;

      const onScroll = (event) => {
        const slideIndex = Math.ceil(
          event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
        );
        if (slideIndex !== currentSlide) {
          setActiveSlides(prev => ({
            ...prev,
            [slideKey]: slideIndex
          }));
        }
      };

      return (
        <View style={isMultiRoom ? styles.multiRoomImageContainer : styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={onScroll}
            style={styles.imageScroller}
          >
            {images.map((img, imgIndex) => (
              <Image
                key={imgIndex}
                source={{ uri: img }}
                style={isMultiRoom ? styles.multiRoomImage : styles.roomImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {/* Pagination Dots for Single View only to avoid clutter in grid */}
          {!isMultiRoom && images.length > 1 && (
            <View style={styles.paginationContainer}>
              <View style={styles.pagination}>
                {images.map((_, dotIndex) => (
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
      );
    };

    // Calculate generic info from the first offer (e.g. amenities - tough, they vary)
    // We'll show generic amenities or skip them here, focused on room.
    // The previous implementation showed amenities from "displayOffer". We can pick item.offers[0]
    const representativeOffer = item.offers?.[0] || {};

    // Discount Calculation (optional logic based on first offer)
    let discountPercentage = 0;
    if (representativeOffer.retailRate?.initialPrice && representativeOffer.retailRate.initialPrice.length > 0) {
      const initialPrice = representativeOffer.retailRate.initialPrice[0].amount;
      // Use total (offerRetailRate) instead of suggestedSellingPrice
      const retailPrice = representativeOffer.retailRate?.total?.[0]?.amount || totalPrice;
      if (initialPrice > retailPrice) {
        discountPercentage = Math.round(((initialPrice - retailPrice) / initialPrice) * 100);
      }
    }

    // Amenities (Common for offer) - Use representative offer
    const hasBreakfast =
      (representativeOffer.boardName && (representativeOffer.boardName.toLowerCase().includes('breakfast') || representativeOffer.boardName.toLowerCase().includes('petit-déjeuner'))) ||
      (representativeOffer.perks && representativeOffer.perks.some(p => p.toLowerCase().includes('breakfast') || p.toLowerCase().includes('petit-déjeuner')));

    const hasHalfBoard =
      (representativeOffer.boardType === 'HB') ||
      (representativeOffer.boardName && (representativeOffer.boardName.toLowerCase().includes('half board') || representativeOffer.boardName.toLowerCase().includes('demi')));

    const hasFreeCancellation =
      (representativeOffer.cancellationPolicies && representativeOffer.cancellationPolicies.refundableTag === 'RFN') ||
      (representativeOffer.perks && representativeOffer.perks.some(p => p.toLowerCase().includes('free cancellation') || p.toLowerCase().includes('annulation gratuite')));

    // Points
    const points = Math.round(totalPrice * 0.1);

    return (
      <View style={styles.card}>

        {/* Content Section */}
        {isMultiRoom ? (
          <View style={styles.multiRoomContainer}>
            {item.roomBreakdown.map((room, idx) => {
              const capacity = (room.adultCount || 0) + (room.childCount || 0);
              const size = room.roomSize ? `${room.roomSize} ${room.roomSizeUnit || 'm²'}` : null;
              return (
                <View key={idx} style={styles.multiRoomItem}>
                  {renderRoomImages(room, `${item.configurationKey}_${idx}`)}
                  <View style={styles.multiRoomContent}>
                    <Text style={styles.multiRoomTitle} numberOfLines={2}>
                      {room.count > 1 ? `${room.count} x ` : '1 x '}{room.name}
                    </Text>
                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Ionicons name="bed-outline" size={14} color="#6B7280" />
                        <Text style={styles.smallInfoText}>{capacity} pers.</Text>
                      </View>
                      {size && (
                        <View style={styles.infoItem}>
                          <Ionicons name="resize-outline" size={14} color="#6B7280" />
                          <Text style={styles.smallInfoText}>{size}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          // Single Room Type Layout
          <>
            {renderRoomImages(item.roomBreakdown?.[0] || {}, item.configurationKey)}
            {discountPercentage > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{discountPercentage}%</Text>
              </View>
            )}
            <View style={styles.cardContent}>
              <Text style={styles.roomTitle}>
                {item.roomBreakdown?.[0]?.count > 1 ? `${item.roomBreakdown[0].count} x ` : ''}{item.roomBreakdown?.[0]?.name}
              </Text>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="bed-outline" size={16} color="#6B7280" />
                  <Text style={styles.infoText}>
                    {(item.roomBreakdown?.[0]?.adultCount || 0) + (item.roomBreakdown?.[0]?.childCount || 0)} personnes
                  </Text>
                </View>
                {item.roomBreakdown?.[0]?.roomSize && (
                  <View style={styles.infoItem}>
                    <Ionicons name="resize-outline" size={16} color="#6B7280" />
                    <Text style={styles.infoText}>{item.roomBreakdown[0].roomSize} {item.roomBreakdown[0].roomSizeUnit || 'm²'}</Text>
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
                {hasHalfBoard && (
                  <View style={styles.amenityRow}>
                    <Ionicons name="restaurant-outline" size={16} color="#059669" />
                    <Text style={[styles.amenityText, styles.amenityTextGreen]}>Demi-pension</Text>
                  </View>
                )}
                {hasFreeCancellation && (
                  <View style={styles.amenityRow}>
                    <Ionicons name="checkmark-circle-outline" size={16} color="#059669" />
                    <Text style={[styles.amenityText, styles.amenityTextGreen]}>Annulation gratuite</Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}

        {/* Common Footer: Price & Action */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.priceLabel}>Prix (à partir de)</Text>
            <Text style={styles.price}>{formattedPrice} {currency}</Text>
            <View style={styles.pointsContainer}>
              <Ionicons name="flash" size={14} color="#F59E0B" />
              <Text style={styles.pointsText}>{points}</Text>
            </View>
          </View>

          {selectedCountInGroup > 0 ? (
            <View style={styles.selectedContainer}>
              <TouchableOpacity
                style={styles.selectedButton}
                onPress={() => handleSelectGroup(item)}
              >
                <Text style={styles.selectedButtonText}>{selectedCountInGroup} Sél.</Text>
                <Ionicons name="chevron-down" size={16} color="#E85D40" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => handleSelectGroup(item)}
              disabled={loading}
            >
              <Text style={styles.selectButtonText}>Sélectionner</Text>
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
        <TouchableOpacity onPress={() => setSelectedRoomsModalVisible(true)} style={styles.cartIcon}>
          <Ionicons name="cart-outline" size={24} color="#1F2937" />
          {selectedRooms.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{selectedRooms.length}</Text>
            </View>
          )}
        </TouchableOpacity>
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

      {/* Room Groups List */}
      <FlatList
        data={uniqueRoomGroups}
        renderItem={renderRoomGroupCard}
        keyExtractor={(item, index) => item.configurationKey || index.toString()}
        contentContainerStyle={styles.listContent}
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
  cartIcon: {
    position: 'relative'
  },
  cartBadge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: '#E85D40',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
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
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  multiRoomContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  multiRoomItem: {
    width: '50%',
    padding: 8,
  },
  multiRoomImageContainer: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  multiRoomImage: {
    width: (CARD_IMAGE_WIDTH - 32) / 2, // 2 columns minus padding
    height: 120,
  },
  multiRoomContent: {
    flex: 1,
  },
  multiRoomTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    height: 40, // Fixed height for alignment
  },
  smallInfoText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  selectedBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    paddingLeft: 12
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E85D40',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedButtonText: {
    color: '#E85D40',
    fontWeight: '700',
    fontSize: 14,
  },
  selectButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E85D40',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  selectButtonText: {
    color: '#E85D40',
    fontWeight: '700',
    fontSize: 14,
  }
});
