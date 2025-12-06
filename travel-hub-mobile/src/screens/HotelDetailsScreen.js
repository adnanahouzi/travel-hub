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
  StatusBar,
  Linking,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LoadingSpinner } from '../components';
import { ApiService } from '../services/api.service';
import { useBooking } from '../context/BookingContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import RenderHTML from 'react-native-render-html';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

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
  const [reviews, setReviews] = useState(null);
  const [reviewsOffset, setReviewsOffset] = useState(0);
  const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(false);

  // Image Slider State
  const [activeSlide, setActiveSlide] = useState(0);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const fullscreenScrollRef = useRef(null);

  // Facilities Modal State
  const [showAllFacilities, setShowAllFacilities] = useState(false);

  // Reviews Modal State
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  useEffect(() => {
    loadHotelDetails();
    loadReviews();
  }, []);

  const getIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('wifi')) return 'wifi-outline';
    if (lowerName.includes('pool') || lowerName.includes('piscine')) return 'water-outline';
    if (lowerName.includes('spa') || lowerName.includes('massage')) return 'sparkles-outline';
    if (lowerName.includes('gym') || lowerName.includes('fitness') || lowerName.includes('sport')) return 'barbell-outline';
    if (lowerName.includes('restaurant') || lowerName.includes('bar') || lowerName.includes('food')) return 'restaurant-outline';
    if (lowerName.includes('parking')) return 'car-outline';
    if (lowerName.includes('air') || lowerName.includes('clim')) return 'snow-outline';
    if (lowerName.includes('family') || lowerName.includes('famille')) return 'people-outline';
    if (lowerName.includes('handicap')) return 'accessibility-outline';
    if (lowerName.includes('smoke') || lowerName.includes('fumeur')) return 'ban-outline';
    return 'checkmark-circle-outline';
  };

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
        currency: searchParams.currency || 'MAD',
        guestNationality: searchParams.guestNationality || 'MA',
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

  const loadReviews = async () => {
    if (!selectedHotel) return;

    try {
      setReviewsOffset(0);
      const reviewsData = await ApiService.getHotelReviews(selectedHotel.hotelId, {
        limit: 10,
        offset: 0,
        getSentiment: true,
      });
      console.log('Reviews API Response:', JSON.stringify(reviewsData, null, 2));
      setReviews(reviewsData);
      setTotalReviews(reviewsData.total || 0);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const loadMoreReviews = async () => {
    if (!selectedHotel || loadingMoreReviews) return;

    try {
      setLoadingMoreReviews(true);
      const nextOffset = reviewsOffset + 10;

      const moreReviews = await ApiService.getHotelReviews(selectedHotel.hotelId, {
        limit: 10,
        offset: nextOffset,
        getSentiment: true,
      });

      if (moreReviews?.data?.length > 0) {
        setReviews(prev => ({
          ...prev,
          data: [...(prev?.data || []), ...moreReviews.data]
        }));
        setReviewsOffset(nextOffset);
      }
    } catch (error) {
      console.error('Failed to load more reviews:', error);
    } finally {
      setLoadingMoreReviews(false);
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

  // Build complete address
  const fullAddress = [
    hotel.address,
    hotel.city,
    hotel.zip,
    hotel.country
  ].filter(Boolean).join(', ');

  const hotelDescriptionHtml = hotel.description || hotel.hotelDescription || '';
  const importantInformationHtml = hotel.importantInformation || '';

  // Extract items from importantInformation - handle both HTML <li> tags and plain text with asterisks/bullets
  const importantItems = [];
  if (importantInformationHtml) {
    // First try to extract <li> tags (HTML format)
    const liRegex = /<li[^>]*>(.*?)<\/li>/gis;
    let match;
    // eslint-disable-next-line no-cond-assign
    while ((match = liRegex.exec(importantInformationHtml)) !== null) {
      importantItems.push(match[1].trim());
    }

    // If no <li> tags found, try splitting by asterisks or bullet points (plain text format)
    if (importantItems.length === 0) {
      const lines = importantInformationHtml
        .split(/\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line.replace(/^[*•\-]\s*/, '')) // Remove leading *, •, or - bullets
        .filter(line => line.length > 0);

      importantItems.push(...lines);
    }
  }

  // Get real facilities
  const facilities = hotel.facilities || [];
  const displayFacilities = facilities.slice(0, 10); // Show first 10

  const onScroll = (nativeEvent) => {
    if (nativeEvent) {
      const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
      if (slide !== activeSlide) {
        setActiveSlide(slide);
      }
    }
  };

  const openMaps = () => {
    if (!hotel.location?.latitude || !hotel.location?.longitude) {
      Alert.alert('Erreur', 'Coordonnées de localisation non disponibles');
      return;
    }

    const { latitude, longitude } = hotel.location;
    const label = encodeURIComponent(hotel.name || 'Hotel');

    // iOS uses Apple Maps, Android uses Google Maps
    const scheme = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
    });

    Linking.openURL(scheme).catch(() => {
      // Fallback to Google Maps web if native app fails
      const webUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(webUrl);
    });
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

          {/* View All Photos Button - Updated Style */}
          <View style={styles.imageCounterContainer}>
            <TouchableOpacity
              style={styles.imageCounter}
              onPress={() => {
                setViewerIndex(activeSlide);
                setShowImageViewer(true);
              }}
            >
              <Ionicons name="images" size={14} color="#1F2937" />
              <Text style={styles.imageCounterText}>
                {activeSlide + 1}/{images.length}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Header Buttons - Updated Style */}
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="heart-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Hotel Title & Info Section - Redesigned */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <View style={styles.starRow}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={16}
                    color={i < (hotel.starRating || 5) ? "#F59E0B" : "#E5E7EB"}
                  />
                ))}
              </View>
            </View>

            <View style={styles.locationInfoRow}>
              <View style={styles.locationLeft}>
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {hotel.city ? `À 1,2 km du centre-ville, ${hotel.city}` : fullAddress}
                </Text>
              </View>
              <View style={styles.ratingRight}>
                <Text style={styles.ratingScore}>{(hotel.rating || 8.2).toFixed(1).replace('.', ',')}</Text>
                <Text style={styles.ratingCount}>{reviews?.total || 2832} Avis</Text>
              </View>
            </View>
          </View>

          {/* Booking Summary Card - NEW */}
          <View style={styles.bookingCard}>
            <View style={styles.bookingRow}>
              <Text style={styles.bookingLabel}>Date</Text>
              <View style={styles.bookingValueContainer}>
                <Ionicons name="calendar-outline" size={16} color="#E85D40" style={{ marginRight: 6 }} />
                <Text style={styles.bookingValueRed}>
                  {searchParams.checkin ?
                    `${format(new Date(searchParams.checkin), 'dd', { locale: fr })} - ${format(new Date(searchParams.checkout), 'dd MMM', { locale: fr })}` :
                    '07 - 12 Déc'}
                </Text>
              </View>
            </View>

            <View style={styles.bookingRow}>
              <Text style={styles.bookingLabel}>Réserver pour</Text>
              <View style={styles.bookingValueContainer}>
                <Ionicons name="people-outline" size={16} color="#E85D40" style={{ marginRight: 6 }} />
                <Text style={styles.bookingValueRed}>
                  {searchParams.occupancies ?
                    `${searchParams.occupancies.reduce((acc, curr) => acc + curr.adults + curr.children.length, 0)} personnes` :
                    '5 personnes'}
                </Text>
              </View>
            </View>

            <View style={styles.bookingRow}>
              <Text style={styles.bookingLabel}>Prix <Text style={styles.bookingLabelSmall}>(à partir de)</Text></Text>
              <Text style={styles.bookingPrice}>
                {totalPrice > 0 ? totalPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : '4.350,00'} {currency}
              </Text>
            </View>

            <View style={styles.bookingRow}>
              <Text style={styles.bookingLabel}>Points que vous gagnez</Text>
              <View style={styles.bookingValueContainer}>
                <View style={styles.coinIcon}>
                  <Text style={styles.coinText}>$</Text>
                </View>
                <Text style={styles.pointsValue}>{Math.floor((totalPrice || 4350) / 10)}</Text>
              </View>
            </View>
          </View>

          {/* Location Section - Redesigned */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Localisation</Text>
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: hotel.location?.latitude || 31.6295,
                  longitude: hotel.location?.longitude || -7.9811,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: hotel.location?.latitude || 31.6295,
                    longitude: hotel.location?.longitude || -7.9811,
                  }}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      source={{ uri: images[0] }}
                      style={styles.mapMarkerImage}
                    />
                  </View>
                </Marker>
              </MapView>
              <TouchableOpacity style={styles.expandMapButton} onPress={openMaps}>
                <Ionicons name="expand-outline" size={20} color="#1F2937" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Amenities (Équipements) - Redesigned */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Équipements</Text>
              <TouchableOpacity onPress={() => setShowAllFacilities(true)}>
                <Text style={styles.seeAllText}>Tout afficher</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.amenitiesCard}>
              {displayFacilities.slice(0, 5).map((facility, i) => (
                <View key={i} style={styles.amenityRow}>
                  <Ionicons name={getIcon(facility)} size={20} color="#6B7280" style={{ width: 24 }} />
                  <Text style={styles.amenityText}>{facility}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Services Section */}
          {hotelDescriptionHtml?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Services</Text>
              <View style={styles.servicesCard}>
                <RenderHTML
                  contentWidth={width - 72}
                  source={{ html: hotelDescriptionHtml }}
                  tagsStyles={{
                    p: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 8 },
                    strong: { fontWeight: '700', color: '#111827' },
                    ul: { paddingLeft: 16, marginBottom: 8 },
                    li: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 4 },
                    br: { marginBottom: 4 },
                  }}
                />
              </View>
            </View>
          )}


          {/* Reviews */}
          {
            reviews && reviews.data && reviews.data.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Avis</Text>
                  <TouchableOpacity onPress={() => setShowReviewsModal(true)}>
                    <Text style={styles.seeAllText}>Lire les {reviews.total || reviews.data.length} avis</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.reviewCard}>
                  <View style={styles.reviewScoreBox}>
                    <Text style={styles.reviewScore}>{(hotel.rating || 0).toFixed ? hotel.rating.toFixed(1) : (hotel.rating || 0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.reviewLabel}>
                      {hotel.rating >= 9 ? 'Excellent' : hotel.rating >= 8 ? 'Très bien' : hotel.rating >= 7 ? 'Bien' : hotel.rating >= 6 ? 'Agréable' : 'Correct'}
                    </Text>
                    <Text style={styles.reviewCount}>
                      Basé sur {(reviews.total || hotel.reviewCount || 0).toLocaleString()} avis
                    </Text>
                  </View>
                </View>

                {/* Positive Highlights from Sentiment Analysis */}
                {reviews.sentimentAnalysis?.pros && reviews.sentimentAnalysis.pros.length > 0 && (
                  <>
                    <Text style={styles.subSectionTitle}>Les éléments les plus appréciés</Text>
                    <View style={styles.highlightsGrid}>
                      {reviews.sentimentAnalysis.pros.slice(0, 6).map((pro, i) => (
                        <View key={i} style={styles.highlightPill}>
                          <Text style={styles.highlightText}>{pro}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                {/* Guest Types from Reviews */}
                {reviews.data && (() => {
                  // Calculate guest type percentages from reviews
                  const typeCounts = {};
                  reviews.data.forEach(review => {
                    if (review.type) {
                      typeCounts[review.type] = (typeCounts[review.type] || 0) + 1;
                    }
                  });

                  const total = reviews.data.length;
                  const guestTypes = Object.entries(typeCounts)
                    .map(([type, count]) => {
                      let label = type;
                      let icon = 'person-outline';

                      const lowerType = type.toLowerCase();
                      if (lowerType.includes('family') || lowerType.includes('famille')) {
                        label = 'Familles';
                        icon = 'people-outline';
                      } else if (lowerType.includes('couple')) {
                        label = 'Couples';
                        icon = 'heart-outline';
                      } else if (lowerType.includes('solo')) {
                        label = 'Solo';
                        icon = 'person-outline';
                      } else if (lowerType.includes('group')) {
                        label = 'Group';
                        icon = 'people-circle-outline';
                      }

                      return {
                        label,
                        value: `${Math.round((count / total) * 100)}%`,
                        icon
                      };
                    })
                    .sort((a, b) => parseInt(b.value) - parseInt(a.value))
                    .slice(0, 4);

                  return guestTypes.length > 0 ? (
                    <>
                      <Text style={[styles.subSectionTitle, { marginTop: 24 }]}>Types d'invités</Text>
                      <View style={styles.guestTypesGrid}>
                        {guestTypes.map((item, i) => (
                          <View key={i} style={styles.guestTypeItem}>
                            <View style={styles.guestTypeIconBox}>
                              <Ionicons name={item.icon} size={24} color="#1F2937" />
                            </View>
                            <Text style={styles.guestTypeLabel}>{item.label}</Text>
                            <Text style={styles.guestTypeValue}>{item.value}</Text>
                          </View>
                        ))}
                      </View>
                    </>
                  ) : null;
                })()}

                {/* Categories from Sentiment Analysis */}
                {reviews.sentimentAnalysis?.categories && reviews.sentimentAnalysis.categories.length > 0 && (
                  <>
                    <Text style={[styles.subSectionTitle, { marginTop: 24 }]}>Catégories d'avis</Text>
                    <View style={styles.categoriesGrid}>
                      {reviews.sentimentAnalysis.categories.map((category, i) => {
                        const rating = parseFloat(category.rating || 0);
                        const color = rating >= 8 ? '#10B981' : rating >= 6 ? '#F59E0B' : '#EF4444';

                        return (
                          <View key={i} style={styles.categoryItem}>
                            <View style={styles.categoryHeader}>
                              <Text style={styles.categoryLabel}>{category.name}</Text>
                              <Text style={styles.categoryScore}>{rating.toFixed(1)}</Text>
                            </View>
                            <View style={styles.progressBarBg}>
                              <View
                                style={[
                                  styles.progressBarFill,
                                  { width: `${(rating / 10) * 100}%`, backgroundColor: color }
                                ]}
                              />
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </>
                )}
              </View>
            )
          }

          {/* Important Information (HTML list) - Moved to bottom */}
          {importantItems.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations importantes</Text>
              <View style={styles.htmlCard}>
                {importantItems.map((itemHtml, index) => (
                  <View key={index} style={styles.importantRow}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={18}
                      color="#E85D40"
                      style={styles.importantIcon}
                    />
                    <View style={{ flex: 1 }}>
                      <RenderHTML
                        contentWidth={width - 80}
                        source={{ html: `<p>${itemHtml}</p>` }}
                        tagsStyles={{
                          p: {
                            fontSize: 14,
                            color: '#4B5563',
                            lineHeight: 20,
                            marginBottom: 6,
                          },
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View >
      </ScrollView >

      {/* Footer - Redesigned */}
      <View style={styles.footer}>
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

      {/* All Facilities Modal */}
      <Modal
        visible={showAllFacilities}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAllFacilities(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.facilitiesModal}>
            <View style={styles.facilitiesModalHeader}>
              <Text style={styles.facilitiesModalTitle}>Tous les avantages</Text>
              <TouchableOpacity onPress={() => setShowAllFacilities(false)}>
                <Ionicons name="close" size={28} color="#111827" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.facilitiesModalContent}>
              {facilities.map((facility, i) => {
                // Map facility names to icons
                const getIcon = (name) => {
                  const lowerName = name.toLowerCase();
                  if (lowerName.includes('restaurant') || lowerName.includes('dining')) return 'restaurant-outline';
                  if (lowerName.includes('pool') || lowerName.includes('piscine')) return 'water-outline';
                  if (lowerName.includes('wifi') || lowerName.includes('internet')) return 'wifi-outline';
                  if (lowerName.includes('parking')) return 'car-outline';
                  if (lowerName.includes('gym') || lowerName.includes('fitness')) return 'barbell-outline';
                  if (lowerName.includes('spa')) return 'sparkles-outline';
                  if (lowerName.includes('family') || lowerName.includes('famille')) return 'people-outline';
                  if (lowerName.includes('handicap') || lowerName.includes('accessibility')) return 'accessibility-outline';
                  if (lowerName.includes('smoking') || lowerName.includes('fumeur')) return 'ban-outline';
                  if (lowerName.includes('air') || lowerName.includes('conditioning')) return 'snow-outline';
                  if (lowerName.includes('bar')) return 'wine-outline';
                  if (lowerName.includes('room service')) return 'receipt-outline';
                  return 'checkmark-circle-outline';
                };

                return (
                  <View key={i} style={styles.facilityModalItem}>
                    <Ionicons name={getIcon(facility)} size={20} color="#10B981" />
                    <Text style={styles.facilityModalText}>{facility}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Reviews Modal */}
      <Modal
        visible={showReviewsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReviewsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reviewsModal}>
            {/* Header */}
            <View style={styles.reviewsModalHeader}>
              <Text style={styles.reviewsModalTitle}>Avis des clients</Text>
              <TouchableOpacity onPress={() => setShowReviewsModal(false)}>
                <Ionicons name="close" size={28} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.reviewsModalScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {/* Content Container */}
              <View>
                {/* Overall Rating Summary */}
                {hotel && (
                  <View style={styles.reviewsSummary}>
                    <View style={styles.reviewsSummaryLeft}>
                      <View style={styles.reviewsScoreBadge}>
                        <Text style={styles.reviewsScoreLarge}>
                          {(hotel.rating || 0).toFixed ? hotel.rating.toFixed(1) : (hotel.rating || 0)}
                        </Text>
                      </View>
                      <View style={styles.reviewsSummaryText}>
                        <Text style={styles.reviewsRatingLabel}>
                          {hotel.rating >= 9 ? 'Excellent' : hotel.rating >= 8 ? 'Très bien' : hotel.rating >= 7 ? 'Bien' : hotel.rating >= 6 ? 'Agréable' : 'Correct'}
                        </Text>
                        <Text style={styles.reviewsTotalText}>
                          {(reviews?.total || reviews?.data?.length || 0).toLocaleString()} avis
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Loading State */}
                {loading && !reviews && (
                  <View style={{ padding: 40, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#6B7280' }}>Chargement des avis...</Text>
                  </View>
                )}

                {/* Category Scores */}
                {reviews?.sentimentAnalysis?.categories && reviews.sentimentAnalysis.categories.length > 0 && (
                  <View style={styles.reviewsCategoriesSection}>
                    {reviews.sentimentAnalysis.categories.slice(0, 6).map((category, i) => {
                      const rating = parseFloat(category.rating || 0);
                      return (
                        <View key={i} style={styles.reviewsCategoryRow}>
                          <Text style={styles.reviewsCategoryName}>{category.name}</Text>
                          <View style={styles.reviewsCategoryRight}>
                            <View style={styles.reviewsCategoryBar}>
                              <View
                                style={[
                                  styles.reviewsCategoryBarFill,
                                  {
                                    width: `${(rating / 10) * 100}%`,
                                    backgroundColor: rating >= 8 ? '#10B981' : rating >= 6 ? '#F59E0B' : '#EF4444'
                                  }
                                ]}
                              />
                            </View>
                            <Text style={styles.reviewsCategoryScore}>{rating.toFixed(1)}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* Individual Reviews */}
                {reviews?.data && reviews.data.length > 0 ? (
                  reviews.data.map((review, index) => (
                    <View key={index}>
                      <View style={styles.reviewItem}>
                        {/* Reviewer Header */}
                        <View style={styles.reviewerHeader}>
                          <View style={styles.reviewerAvatar}>
                            <Text style={styles.reviewerInitial}>
                              {review.name ? review.name.charAt(0).toUpperCase() : '?'}
                            </Text>
                          </View>
                          <View style={styles.reviewerInfo}>
                            <Text style={styles.reviewerName}>{review.name || 'Anonyme'}</Text>
                            <View style={styles.reviewerMeta}>
                              {review.country && review.country.length > 0 && (
                                <>
                                  <Image
                                    source={{ uri: `https://flagcdn.com/w20/${review.country.toLowerCase()}.png` }}
                                    style={styles.countryFlag}
                                  />
                                  <Text style={styles.reviewerMetaText}>{review.country.toUpperCase()}</Text>
                                </>
                              )}
                              {review.type && (
                                <>
                                  {review.country && <Text style={styles.reviewerMetaDot}> · </Text>}
                                  <Text style={styles.reviewerMetaText}>{review.type}</Text>
                                </>
                              )}
                            </View>
                          </View>
                          {review.averageScore && (
                            <View style={styles.reviewScoreBadge}>
                              <Text style={styles.reviewScoreBadgeText}>
                                {review.averageScore.toFixed(1)}
                              </Text>
                            </View>
                          )}
                        </View>

                        {/* Review Date */}
                        {review.date && (
                          <Text style={styles.reviewDate}>
                            {format(new Date(review.date), 'EEE., d MMM. yyyy', { locale: fr })}
                          </Text>
                        )}

                        {/* Review Headline */}
                        {review.headline && (
                          <Text style={styles.reviewHeadline}>{review.headline}</Text>
                        )}

                        {/* Positive Points */}
                        {review.pros && review.pros.trim().length > 0 && (
                          <View style={styles.reviewSection}>
                            <View style={styles.reviewSectionHeader}>
                              <Ionicons name="happy-outline" size={20} color="#10B981" />
                            </View>
                            <Text style={styles.reviewText}>{review.pros}</Text>
                          </View>
                        )}

                        {/* Negative Points */}
                        {review.cons && review.cons.trim().length > 0 && (
                          <View style={styles.reviewSection}>
                            <View style={styles.reviewSectionHeader}>
                              <Ionicons name="sad-outline" size={20} color="#EF4444" />
                            </View>
                            <Text style={styles.reviewText}>{review.cons}</Text>
                          </View>
                        )}

                        {/* Room Type Card removed as requested */}
                      </View>

                      {/* "Utile" Button removed as requested */}

                      {/* Separator */}
                      {index < reviews.data.length - 1 && <View style={styles.reviewSeparator} />}
                    </View>
                  ))
                ) : !loading && (
                  <View style={styles.noReviewsContainer}>
                    <Ionicons name="chatbox-outline" size={48} color="#D1D5DB" />
                    <Text style={styles.noReviewsText}>Aucun avis disponible</Text>
                  </View>
                )}

                {/* Load More Button */}
                {reviews?.data && reviews.data.length < (totalReviews || 9999) && (
                  <TouchableOpacity
                    style={styles.loadMoreReviewsButton}
                    onPress={loadMoreReviews}
                    disabled={loadingMoreReviews}
                  >
                    {loadingMoreReviews ? (
                      <ActivityIndicator color="#0066CC" />
                    ) : (
                      <Text style={styles.loadMoreReviewsText}>
                        Afficher plus d'avis ({reviews.data.length} / {totalReviews || '?'})
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  sliderContainer: {
    height: 380, // Increased height for full screen effect
    position: 'relative',
  },
  slider: {
    flex: 1,
  },
  sliderImage: {
    width: width,
    height: 380,
  },
  imageCounterContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  imageCounter: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageCounterText: {
    color: '#1F2937',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  headerButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)', // Slight dark overlay for visibility
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  locationInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  ratingRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ratingScore: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginRight: 6,
  },
  ratingCount: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  // Booking Summary Card Styles
  bookingCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookingLabel: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  bookingLabelSmall: {
    fontSize: 12,
    fontWeight: '400',
  },
  bookingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingValueRed: {
    fontSize: 15,
    color: '#E85D40',
    fontWeight: '600',
  },
  bookingPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  coinIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F59E0B', // Gold color
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    borderWidth: 1.5,
    borderColor: '#FCD34D',
  },
  coinText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D97706', // Darker gold for text
  },

  // Map Styles
  mapContainer: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 12,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapMarkerContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  mapMarkerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  expandMapButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  htmlCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  importantRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  importantIcon: {
    marginRight: 8,
    marginTop: 2,
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
  mapCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 250,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
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
  // Amenities Styles
  amenitiesCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
  },
  amenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  amenityText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 12,
    fontWeight: '500',
  },

  // Services Styles
  servicesCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bookButton: {
    backgroundColor: '#E85D40',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  facilitiesModal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    paddingBottom: 20,
  },
  facilitiesModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  facilitiesModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  facilitiesModalContent: {
    padding: 20,
  },
  facilityModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  facilityModalText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  // Reviews Modal Styles
  reviewsModal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.9, // Fixed height ensures ScrollView expands
    width: '100%',
    paddingBottom: 20,
  },
  reviewsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  reviewsModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  reviewsSummary: {
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  reviewsSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsScoreBadge: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reviewsScoreLarge: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
  reviewsSummaryText: {
    flex: 1,
  },
  reviewsRatingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  reviewsTotalText: {
    fontSize: 14,
    color: '#6B7280',
  },
  reviewsCategoriesSection: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  reviewsCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewsCategoryName: {
    fontSize: 14,
    color: '#374151',
    width: 100,
  },
  reviewsCategoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  reviewsCategoryBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  reviewsCategoryBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  reviewsCategoryScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    width: 30,
    textAlign: 'right',
  },
  reviewsModalScroll: {
    flex: 1,
  },
  utileBtnContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  utileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  utileBtnText: {
    fontSize: 14,
    color: '#0066CC',
    marginLeft: 6,
    fontWeight: '500',
  },
  reviewItem: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  reviewSeparator: {
    height: 8,
    backgroundColor: '#F3F4F6',
  },
  reviewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E85D40',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reviewerInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  reviewerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    width: 16,
    height: 12,
    marginRight: 6,
    borderRadius: 2,
  },
  reviewerMetaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  reviewerMetaDot: {
    fontSize: 13,
    color: '#6B7280',
  },
  reviewScoreBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  reviewScoreBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  reviewDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  reviewHeadline: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  reviewSection: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  reviewSectionHeader: {
    marginRight: 8,
    marginTop: 2,
  },
  reviewSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  reviewText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 22,
    flex: 1,
  },
  reviewSource: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    fontStyle: 'italic',
  },
  roomTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  roomTypeImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  roomTypeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  roomTypeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  roomTypeDetails: {
    fontSize: 13,
    color: '#6B7280',
  },
  noReviewsContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noReviewsText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
  },
  loadMoreReviewsButton: {
    margin: 20,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  loadMoreReviewsText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0066CC',
  },
});

