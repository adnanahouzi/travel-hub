import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LoadingSpinner } from '../components';
import { useBooking } from '../context/BookingContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ApiService } from '../services/api.service';

const { width } = Dimensions.get('window');

export const HotelListScreen = ({ navigation }) => {
  const {
    searchResults,
    searchParams,
    totalResults,
    setTotalResults,
    appendSearchResults,
    loading,
    loadingMore,
    setLoadingMore,
    setSelectedHotel
  } = useBooking();

  const handleHotelPress = (hotel) => {
    setSelectedHotel(hotel);
    navigation.navigate('HotelDetails');
  };

  const loadMoreHotels = async () => {
    if (loadingMore) return;

    try {
      setLoadingMore(true);
      const currentOffset = searchResults.length;
      const limit = 50;

      const searchRequest = {
        placeId: searchParams.placeId,
        checkin: searchParams.checkin,
        checkout: searchParams.checkout,
        occupancies: searchParams.occupancies,
        guestNationality: searchParams.guestNationality || 'MA',
        currency: searchParams.currency || 'MAD',
        limit: limit,
        offset: currentOffset,
        roomMapping: false,
        sort: [
          {
            field: 'top_picks',
            direction: 'ascending'
          }
        ]
      };

      const results = await ApiService.searchRates(searchRequest);
      const newHotels = results.hotels || [];

      appendSearchResults(newHotels);

      // If we received fewer items than the limit, we've reached the end
      if (newHotels.length < limit) {
        setTotalResults(currentOffset + newHotels.length);
      }
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Recherche d'hôtels..." />;
  }

  if (searchResults.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bed-outline" size={64} color="#d1d5db" />
        <Text style={styles.emptyText}>Aucun hôtel trouvé</Text>
        <Text style={styles.emptySubtext}>Essayez de modifier vos critères de recherche</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Retour à la recherche</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Format search criteria
  const formatSearchCriteria = () => {
    const { checkin, checkout, occupancies } = searchParams;
    let criteriaText = '';

    if (checkin && checkout) {
      try {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        criteriaText = `${format(checkinDate, 'dd', { locale: fr })} - ${format(checkoutDate, 'dd MMMM', { locale: fr })}`;
      } catch (e) {
        criteriaText = 'Dates non spécifiées';
      }
    }

    if (occupancies && occupancies.length > 0) {
      const adults = occupancies.reduce((sum, occ) => sum + (occ.adults || 0), 0);
      const children = occupancies.reduce((sum, occ) => sum + (occ.children?.length || 0), 0);
      criteriaText += ` • ${adults} Adulte${adults > 1 ? 's' : ''}`;
      if (children > 0) {
        criteriaText += `, ${children} Enfant${children > 1 ? 's' : ''}`;
      }
    }

    return criteriaText;
  };

  const renderHotelCard = ({ item }) => {
    const firstRoomType = item.roomTypes?.[0];
    const firstRate = firstRoomType?.rates?.[0];
    const totalPrice = firstRoomType?.suggestedSellingPrice.amount || 0;
    const currency = firstRoomType?.suggestedSellingPrice.currency || 'DH';

    // Points calculation (10% of price)
    const points = Math.round(totalPrice * 0.1);

    const reviewScore = item.rating || 0;
    const reviewCount = item.reviewCount ?? 0;
    const reviewText = reviewScore >= 8 ? 'Very good' : reviewScore >= 7 ? 'Good' : 'Pleasant';
    
    // Check if breakfast is included (boardType === "BI")
    const hasBreakfast = firstRate?.boardType === "BI";
    
    // Check if free cancellation is available (refundableTag === "RFN")
    const hasFreeCancellation = firstRate?.cancellationPolicies?.refundableTag === "RFN";

    return (
      <TouchableOpacity
        style={styles.hotelCard}
        onPress={() => handleHotelPress(item)}
        activeOpacity={0.95}
      >
        {/* Hotel Image with Overlays */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.mainPhoto || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' }}
            style={styles.hotelImage}
            resizeMode="cover"
          />

          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingScore}>{reviewScore.toFixed(1).replace('.', ',')}</Text>
          </View>

          {/* Review Text */}
          <View style={styles.reviewTextContainer}>
            <Text style={styles.reviewText}>{reviewText}</Text>
            <Text style={styles.reviewCount}> | {reviewCount.toLocaleString()} Avis</Text>
          </View>

          {/* Favorite Button */}
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={22} color="#E85D40" />
          </TouchableOpacity>
        </View>

        {/* Hotel Info */}
        <View style={styles.hotelInfo}>
          <View style={styles.hotelTitleRow}>
            <Text style={styles.hotelName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.starRatingContainer}>
              {[...Array(item.starRating || 5)].map((_, i) => (
                <Ionicons key={i} name="star" size={12} color="#F59E0B" />
              ))}
            </View>
          </View>

          {/* Location */}
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text style={styles.addressText} numberOfLines={1}>
              {item.distanceText || item.address || 'Marrakech'}
            </Text>
          </View>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <View>
              <Text style={styles.priceLabel}>Prix <Text style={styles.priceSubLabel}>(à partir de)</Text></Text>
            </View>
            <Text style={styles.price}>
              {totalPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
            </Text>
          </View>

          {/* Points */}
          <View style={styles.pointsSection}>
            <Text style={styles.pointsLabel}>Points que vous gagnez</Text>
            <View style={styles.pointsValue}>
              <Ionicons name="flash" size={16} color="#F59E0B" />
              <Text style={styles.pointsNumber}>{points}</Text>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.amenitiesContainer}>
            {hasBreakfast && (
              <View style={styles.amenityRow}>
                <Ionicons name="cafe-outline" size={16} color="#10B981" />
                <Text style={styles.amenityText}>Petit-déjeuner offert</Text>
              </View>
            )}
            {hasFreeCancellation && (
              <View style={styles.amenityRow}>
                <Ionicons name="calendar-outline" size={16} color="#EF4444" />
                <Text style={styles.amenityText}>Annulation gratuite</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#E85D40" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{searchParams.placeName || 'Résultats'}</Text>
          <Text style={styles.headerSubtitle}>{formatSearchCriteria()}</Text>
        </View>

        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={22} color="#E85D40" />
        </TouchableOpacity>
      </View>

      {/* Hotel List */}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.hotelId}
        renderItem={renderHotelCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          searchResults.length > 0 && searchResults.length < totalResults ? (
            <View style={styles.loadMoreContainer}>
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={loadMoreHotels}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <Text style={styles.loadMoreText}>Chargement...</Text>
                ) : (
                  <>
                    <Text style={styles.loadMoreText}>
                      Afficher plus d'hôtels
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#0066CC" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      {/* View Map Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.viewMapButton}>
          <Ionicons name="map-outline" size={18} color="#1F2937" />
          <Text style={styles.viewMapText}>Vue carte</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerBackButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  filterButton: {
    marginLeft: 12,
  },
  listContent: {
    paddingVertical: 16,
  },
  hotelCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  hotelImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingScore: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  reviewTextContainer: {
    position: 'absolute',
    top: 12,
    left: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reviewText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  reviewCount: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hotelInfo: {
    padding: 14,
  },
  hotelTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  starRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    flex: 1,
    marginRight: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  addressText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceSubLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
  },
  pointsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointsLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  pointsValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D97706',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  amenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  amenityText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  priceColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  perNight: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  bottomBar: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  viewMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  viewMapText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#F9FAFB',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 24,
    backgroundColor: '#E85D40',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadMoreContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0066CC',
    backgroundColor: '#FFF',
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066CC',
    marginRight: 8,
  },
});

