import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LoadingSpinner } from '../components';
import { ApiService } from '../services/api.service';
import { useBooking } from '../context/BookingContext';

const { width, height } = Dimensions.get('window');

export const HotelDetailsScreen = ({ navigation }) => {
  const { selectedHotel, searchParams } = useBooking();
  const [hotelDetails, setHotelDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Image Slider State
  const [activeSlide, setActiveSlide] = useState(0);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const fullscreenScrollRef = useRef(null);

  useEffect(() => {
    loadHotelDetails();
  }, []);

  const loadHotelDetails = async () => {
    if (!selectedHotel) return;

    try {
      setLoading(true);
      
      // Ensure occupancies are correct
      let occupancies = searchParams.occupancies;
      if (!occupancies || occupancies.length === 0) {
        occupancies = [{ adults: 2, children: [] }];
      } else {
        occupancies = occupancies.map(occ => ({
          ...occ,
          children: Array.isArray(occ.children) ? occ.children : (Number.isInteger(occ.children) && occ.children > 0 ? Array(occ.children).fill(10) : [])
        }));
      }

      const rateParams = {
        occupancies: occupancies,
        currency: searchParams.currency || 'USD',
        guestNationality: searchParams.guestNationality || 'US',
        checkin: searchParams.checkin,
        checkout: searchParams.checkout,
        roomMapping: true,
        language: 'fr', // Requested French
      };

      const details = await ApiService.getHotelRates(selectedHotel.hotelId, rateParams);
      setHotelDetails(details);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les détails de l\'hôtel');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedHotel && !hotelDetails) {
    return (
      <View style={styles.center}>
        <Text>Aucun hôtel sélectionné</Text>
      </View>
    );
  }

  const hotel = hotelDetails || selectedHotel;
  
  // Collect all available images
  let images = [];
  if (hotelDetails?.images && hotelDetails.images.length > 0) {
    // Use images from hotel details (with full hotel data)
    images = hotelDetails.images.map(img => img.url).filter(url => url);
  } else if (hotel.photos && hotel.photos.length > 0) {
    // Fallback to photos from search results
    images = hotel.photos.map(p => p.url).filter(url => url);
  } else if (hotel.mainPhoto) {
    // Last resort: use main photo
    images = [hotel.mainPhoto];
  } else {
    // Placeholder
    images = ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'];
  }

  // Calculate total price from first available rate for display
  const displayRate = hotelDetails?.rates?.[0];
  const totalPrice = displayRate?.retailRate?.total?.[0]?.amount || 0;
  const currency = displayRate?.retailRate?.total?.[0]?.currency || 'USD';
  const points = Math.round(totalPrice * 10); // Mock points calculation

  const onScroll = (nativeEvent) => {
    if (nativeEvent) {
      const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
      if (slide !== activeSlide) {
        setActiveSlide(slide);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header / Image Carousel */}
        <View style={styles.sliderContainer}>
          <ScrollView
            ref={scrollViewRef}
            pagingEnabled
            horizontal
            onScroll={({ nativeEvent }) => onScroll(nativeEvent)}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            style={styles.slider}
          >
            {images.map((img, index) => (
              <TouchableOpacity 
                key={index}
                activeOpacity={0.9}
                onPress={() => {
                  setViewerIndex(index);
                  setShowImageViewer(true);
                }}
              >
                <Image
                  source={{ uri: img }}
                  style={styles.sliderImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* View All Photos Button */}
          <TouchableOpacity 
            style={styles.imageCounter}
            onPress={() => {
              setViewerIndex(activeSlide);
              setShowImageViewer(true);
            }}
          >
            <Ionicons name="images" size={14} color="#FFF" />
            <Text style={styles.imageCounterText}>
              {activeSlide + 1} / {images.length}
            </Text>
          </TouchableOpacity>
          
          {/* Pagination Dots (show max 10) */}
          {images.length <= 10 && (
            <View style={styles.pagination}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[styles.dot, activeSlide === index && styles.activeDot]}
                />
              ))}
            </View>
          )}

          {/* Header Buttons */}
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.rightButtons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="heart-outline" size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconButton, { marginLeft: 8 }]}>
                <Ionicons name="share-outline" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Title Section */}
          <Text style={styles.hotelName}>{hotel.name}</Text>
          
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.starText}>Hôtel {hotel.starRating || 4} étoiles</Text>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{hotel.rating || '8.6'}</Text>
            </View>
            <Text style={styles.reviewCount}>({hotel.reviewCount || 1020} avis)</Text>
          </View>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryLabel}>Dates</Text>
                <Text style={styles.summaryValue}>
                  {searchParams.checkin ? format(new Date(searchParams.checkin), 'dd MMM yyyy', { locale: fr }) : '--'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.summaryLabel}>Réservation pour</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="person-outline" size={14} color="#374151" />
                  <Text style={styles.summaryValue}> {searchParams.occupancies?.[0]?.adults || 2} invités</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryLabel}>Prix</Text>
                <Text style={styles.priceValue}>{Math.round(totalPrice)} $</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.summaryLabel}>Points gagnés</Text>
                <View style={styles.pointsPill}>
                  <Ionicons name="diamond-outline" size={12} color="#D97706" />
                  <Text style={styles.pointsValue}>{points}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.perksText}>Petit déjeuner inclus, Annulation gratuite</Text>
          </View>

          {/* Map Card */}
          <View style={styles.mapCard}>
            <View style={styles.mapInfo}>
              <Ionicons name="location" size={20} color="#374151" />
              <Text style={styles.addressText} numberOfLines={2}>{hotel.address}</Text>
            </View>
            <Image 
              source={{ uri: 'https://via.placeholder.com/100x100.png?text=Map' }} 
              style={styles.mapImage} 
            />
          </View>

          {/* Amenities */}
          <Text style={styles.sectionTitle}>Équipements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.amenitiesScroll}>
            {['Wifi', 'Piscine', 'Parking', 'Spa', 'Gym'].map((item, i) => (
              <View key={i} style={styles.amenityItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#6B7280" />
                <Text style={styles.amenityText}>{item}</Text>
              </View>
            ))}
            <Text style={styles.seeAllText}>Voir tout</Text>
          </ScrollView>

        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => {
            // Pass rates to the RoomListScreen
            navigation.navigate('RoomList', { 
              hotelId: hotel.hotelId, 
              rates: hotelDetails?.rates || [] 
            });
          }}
        >
          <Text style={styles.bookButtonText}>Choisir les chambres</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner message="Chargement..." />
        </View>
      )}

      {/* Fullscreen Image Viewer Modal */}
      <Modal
        visible={showImageViewer}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setShowImageViewer(false)}
      >
        <SafeAreaView style={styles.imageViewerContainer}>
          <StatusBar barStyle="light-content" />
          
          {/* Header */}
          <View style={styles.imageViewerHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowImageViewer(false)}
            >
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.imageViewerTitle}>
              {viewerIndex + 1} / {images.length}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Image Gallery */}
          <ScrollView
            ref={fullscreenScrollRef}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={({ nativeEvent }) => {
              const slide = Math.ceil(
                nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
              );
              if (slide !== viewerIndex) {
                setViewerIndex(slide);
              }
            }}
            contentOffset={{ x: viewerIndex * width, y: 0 }}
          >
            {images.map((img, index) => (
              <View key={index} style={styles.imageViewerSlide}>
                <Image
                  source={{ uri: img }}
                  style={styles.fullscreenImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          {/* Thumbnail Strip */}
          <View style={styles.thumbnailContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailScroll}
            >
              {images.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setViewerIndex(index);
                    fullscreenScrollRef.current?.scrollTo({
                      x: index * width,
                      y: 0,
                      animated: true,
                    });
                  }}
                  style={[
                    styles.thumbnail,
                    viewerIndex === index && styles.activeThumbnail,
                  ]}
                >
                  <Image
                    source={{ uri: img }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    height: 300,
    position: 'relative',
  },
  slider: {
    flex: 1,
  },
  sliderImage: {
    width: width,
    height: 300,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  imageCounterText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFF',
  },
  headerButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFF',
    marginTop: -20,
  },
  hotelName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  starText: {
    marginLeft: 4,
    color: '#1F2937',
    fontWeight: '500',
  },
  scoreBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  scoreText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 12,
  },
  reviewCount: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 12,
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsValue: {
    color: '#D97706',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 4,
  },
  perksText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  mapCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  mapInfo: {
    flex: 1,
    paddingRight: 12,
  },
  addressText: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 18,
  },
  mapImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  amenitiesScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  amenityItem: {
    width: 80,
    height: 80,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  amenityText: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 8,
  },
  seeAllText: {
    color: '#E85D40',
    fontWeight: '600',
    alignSelf: 'center',
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  bookButton: {
    backgroundColor: '#E85D40',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Fullscreen Image Viewer Styles
  imageViewerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageViewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageViewerSlide: {
    width: width,
    height: height - 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: width,
    height: '100%',
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 12,
  },
  thumbnailScroll: {
    paddingHorizontal: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  activeThumbnail: {
    borderColor: '#10B981',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
});
