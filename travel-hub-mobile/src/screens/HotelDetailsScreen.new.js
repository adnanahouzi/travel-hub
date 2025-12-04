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

// Mock data for UI matching since API might not provide everything
const MOCK_HIGHLIGHTS = [
  { label: 'Propreté', score: 7.1 },
  { label: 'Service', score: 7.5 },
  { label: 'Emplacement', score: 8.0 },
  { label: 'Qualité de la chambre', score: 7.7 },
  { label: 'Équipements', score: 7.1 },
  { label: 'Rapport qualité-prix', score: 6.7 },
  { label: 'Alimentation et boissons', score: 7.3 },
];

const MOCK_GUEST_TYPES = [
  { label: 'Familles', value: '63%', icon: 'people-outline' },
  { label: 'Couples', value: '18%', icon: 'heart-outline' },
  { label: 'Solo', value: '11%', icon: 'person-outline' },
  { label: 'Group', value: '8%', icon: 'people-circle-outline' },
];

const MOCK_CATEGORIES = [
  { label: 'Propreté', score: 5, color: '#F59E0B' },
  { label: 'Service', score: 9, color: '#10B981' },
  { label: 'Localisation', score: 2, color: '#EF4444' },
  { label: 'Qualité', score: 5, color: '#F59E0B' },
  { label: 'Equipements', score: 9, color: '#10B981' },
  { label: 'Rapport qualité-prix', score: 2, color: '#EF4444' },
  { label: 'Restauration', score: 5, color: '#F59E0B' },
  { label: 'Expérience', score: 9, color: '#10B981' },
];

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
    images = hotelDetails.images.map(img => img.url).filter(url => url);
  } else if (hotel.photos && hotel.photos.length > 0) {
    images = hotel.photos.map(p => p.url).filter(url => url);
  } else if (hotel.mainPhoto) {
    images = [hotel.mainPhoto];
  } else {
    images = ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'];
  }

  // Calculate total price from first available rate for display
  const displayRate = hotelDetails?.rates?.[0];
  const totalPrice = displayRate?.retailRate?.total?.[0]?.amount || 0;
  const currency = displayRate?.retailRate?.total?.[0]?.currency || 'DH';

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
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
          
          {/* Header Buttons */}
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#E85D40" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="create-outline" size={24} color="#E85D40" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Hotel Title & Dates */}
          <View style={styles.titleSection}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <View style={styles.starRow}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.starText}>{hotel.starRating || 5}</Text>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text style={styles.locationText}>{hotel.address}</Text>
            </View>
          </View>

          {/* Services Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services</Text>
            
            <View style={styles.serviceItem}>
              <View style={styles.serviceIconBox}>
                <Ionicons name="location-outline" size={24} color="#1F2937" />
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>Évasion au cœur de Marrakech</Text>
                <Text style={styles.serviceDesc}>
                  Idéalement situé près de la médina, l'Es Saadi Marrakech Resort - Palace vous plonge dans l'effervescence de la culture marocaine tout en offrant un cadre paisible et raffiné.
                </Text>
              </View>
            </View>

            <View style={styles.serviceItem}>
              <View style={styles.serviceIconBox}>
                <Ionicons name="star-outline" size={24} color="#1F2937" />
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>Séjour mémorable et accueillant</Text>
                <Text style={styles.serviceDesc}>
                  Profitez d'un service exceptionnel et d'une atmosphère chaleureuse, où chaque détail est pensé pour rendre votre expérience inoubliable.
                </Text>
              </View>
            </View>

            <View style={styles.serviceItem}>
              <View style={styles.serviceIconBox}>
                <Ionicons name="business-outline" size={24} color="#1F2937" />
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>Détente et bien-être</Text>
                <Text style={styles.serviceDesc}>
                  Découvrez notre spa luxueux et notre piscine rafraîchissante, parfaits pour se ressourcer après une journée d'exploration.
                </Text>
              </View>
            </View>
          </View>

          {/* Amenities (Avantages) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Avantages</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Voir les avantages</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.amenitiesGrid}>
              {['Restaurant', 'Piscine', 'Chambres familiales', 'Équipements pour les personnes handicapées', 'Chambres non-fumeurs'].map((item, i) => (
                <View key={i} style={styles.amenityPill}>
                  <Ionicons 
                    name={i === 0 ? 'restaurant-outline' : i === 1 ? 'water-outline' : i === 2 ? 'people-outline' : i === 3 ? 'accessibility-outline' : 'logo-no-smoking'} 
                    size={16} 
                    color="#6B7280" 
                  />
                  <Text style={styles.amenityText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Avis</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Lire les avis</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.reviewCard}>
              <View style={styles.reviewScoreBox}>
                <Text style={styles.reviewScore}>{hotel.rating || '8.6'}</Text>
              </View>
              <View>
                <Text style={styles.reviewLabel}>Very good</Text>
                <Text style={styles.reviewCount}>Basé sur {hotel.reviewCount || 2832} avis</Text>
              </View>
            </View>

            <Text style={styles.subSectionTitle}>Les éléments les plus appréciés</Text>
            <View style={styles.highlightsGrid}>
              {MOCK_HIGHLIGHTS.map((item, i) => (
                <View key={i} style={styles.highlightPill}>
                  <Text style={styles.highlightText}>{item.label} ({item.score})</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.subSectionTitle, { marginTop: 24 }]}>Types d'invités</Text>
            <View style={styles.guestTypesGrid}>
              {MOCK_GUEST_TYPES.map((item, i) => (
                <View key={i} style={styles.guestTypeItem}>
                  <View style={styles.guestTypeIconBox}>
                    <Ionicons name={item.icon} size={24} color="#1F2937" />
                  </View>
                  <Text style={styles.guestTypeLabel}>{item.label}</Text>
                  <Text style={styles.guestTypeValue}>{item.value}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.subSectionTitle, { marginTop: 24 }]}>Catégories</Text>
            <View style={styles.categoriesGrid}>
              {MOCK_CATEGORIES.map((item, i) => (
                <View key={i} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryLabel}>{item.label}</Text>
                    <Text style={styles.categoryScore}>{item.score}</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { width: `${item.score * 10}%`, backgroundColor: item.color }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.fromText}>À partir de</Text>
          <Text style={styles.footerPrice}>
            {totalPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => {
            navigation.navigate('RoomList', { 
              hotelId: hotel.hotelId, 
              rates: hotelDetails?.rates || [] 
            });
          }}
        >
          <Text style={styles.bookButtonText}>Choisissez une chambre</Text>
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
  headerButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFF',
    marginTop: -20,
  },
  titleSection: {
    marginBottom: 24,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starText: {
    marginLeft: 4,
    fontWeight: '600',
    color: '#F59E0B',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 6,
    color: '#6B7280',
    fontSize: 14,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  serviceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  amenityText: {
    fontSize: 13,
    color: '#4B5563',
  },
  seeAllText: {
    color: '#E85D40',
    fontWeight: '600',
    fontSize: 14,
  },
  reviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  reviewScoreBox: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 16,
  },
  reviewScore: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  reviewCount: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  highlightPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  highlightText: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '500',
  },
  guestTypesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  guestTypeItem: {
    alignItems: 'center',
    flex: 1,
  },
  guestTypeIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  guestTypeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  guestTypeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  categoryScore: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 10,
  },
  fromText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  bookButton: {
    backgroundColor: '#E85D40',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
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

