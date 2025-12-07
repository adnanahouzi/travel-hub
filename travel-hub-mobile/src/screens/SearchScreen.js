import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Image,
  Dimensions,
  TextInput,
  Modal,
  ImageBackground,
  StatusBar,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, startOfWeek, endOfWeek, addMonths, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ApiService } from '../services/api.service';
import { useBooking } from '../context/BookingContext';
import { HotelCard } from '../components';

const { width, height } = Dimensions.get('window');

export const SearchScreen = ({ navigation }) => {
  const { searchParams, updateSearchParams, setSearchResults, setTotalResults, setLoading, loading, setSelectedHotel } = useBooking();

  // Search State
  const [destination, setDestination] = useState('');
  const [places, setPlaces] = useState([]);
  const [showPlaces, setShowPlaces] = useState(false);
  const [placeId, setPlaceId] = useState(null);
  const [placeName, setPlaceName] = useState('');

  // Date State
  const [checkinDate, setCheckinDate] = useState(addDays(new Date(), 1));
  const [checkoutDate, setCheckoutDate] = useState(addDays(new Date(), 7));
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectingCheckout, setSelectingCheckout] = useState(false);

  // Guest State
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const [searchTimeout, setSearchTimeout] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [nearbyHotels, setNearbyHotels] = useState([]);

  // Categories
  const categories = [
    { id: 'Tout', label: 'Tout', icon: 'business' },
    { id: 'Luxe', label: 'Luxe', icon: 'diamond' },
    { id: 'Plage', label: 'Plage', icon: 'water' },
    { id: 'Désert', label: 'Désert', icon: 'sunny' },
    { id: 'Nature', label: 'Nature', icon: 'leaf' },
    { id: 'Montagne', label: 'Montagne', icon: 'triangle' },
    { id: 'Calme', label: 'Calme', icon: 'leaf-outline' },
  ];

  // --- Logic Handlers ---

  const handleDestinationChange = (text) => {
    setDestination(text);
    setPlaceId(null);
    if (searchTimeout) clearTimeout(searchTimeout);

    if (text.trim().length > 2) {
      const timeout = setTimeout(async () => {
        try {
          const response = await ApiService.searchPlaces({ textQuery: text });
          setPlaces(response.places || []);
          setShowPlaces(true);
        } catch (error) {
          console.error('Error searching places:', error);
        }
      }, 500);
      setSearchTimeout(timeout);
    } else {
      setPlaces([]);
      setShowPlaces(false);
    }
  };

  const selectPlace = (place) => {
    setDestination(place.displayName);
    setPlaceName(place.displayName);
    setPlaceId(place.placeId);
    setPlaces([]);
    setShowPlaces(false);

    // Fetch place coordinates in background (non-blocking)
    ApiService.getPlaceDetails(place.placeId, 'fr')
      .then(placeDetails => {
        if (placeDetails && placeDetails.location) {
          updateSearchParams({
            searchLocation: {
              latitude: placeDetails.location.latitude,
              longitude: placeDetails.location.longitude,
              description: placeDetails.description || place.displayName
            }
          });
        }
      })
      .catch(error => {
        console.error('Error fetching place details:', error);
        // Continue without coordinates - not critical for search
      });
  };

  const searchHotels = async () => {
    if (!destination.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir une destination');
      return;
    }

    try {
      setLoading(true);

      let currentPlaceId = placeId;
      let currentPlaceName = placeName || destination;
      let searchLocation = searchParams.searchLocation;

      // If no place selected, try to resolve from text
      if (!currentPlaceId) {
        try {
          const placesResponse = await ApiService.searchPlaces({ textQuery: destination });
          if (placesResponse.places && placesResponse.places.length > 0) {
            const bestMatch = placesResponse.places[0];
            currentPlaceId = bestMatch.placeId;
            currentPlaceName = bestMatch.displayName;

            // Get coordinates for distance calculation
            const details = await ApiService.getPlaceDetails(currentPlaceId, 'fr');
            if (details && details.location) {
              searchLocation = {
                latitude: details.location.latitude,
                longitude: details.location.longitude,
                description: details.description || bestMatch.displayName
              };
            }
          }
        } catch (err) {
          console.error('Error resolving place from text:', err);
        }
      }
      // If place is selected but location is missing (race condition or previous failure)
      else if (!searchLocation && currentPlaceId) {
        try {
          const details = await ApiService.getPlaceDetails(currentPlaceId, 'fr');
          if (details && details.location) {
            searchLocation = {
              latitude: details.location.latitude,
              longitude: details.location.longitude,
              description: details.description || currentPlaceName
            };
          }
        } catch (err) {
          console.error('Error resolving location for selected place:', err);
        }
      }

      const occupancies = [
        {
          adults: adults,
          children: children > 0 ? Array(children).fill(10) : []
        }
      ];

      updateSearchParams({
        placeId: currentPlaceId,
        placeName: currentPlaceName,
        searchLocation: searchLocation,
        checkin: format(checkinDate, 'yyyy-MM-dd'),
        checkout: format(checkoutDate, 'yyyy-MM-dd'),
        occupancies: occupancies,
        guestNationality: 'MA',
        currency: 'MAD',
      });

      const searchRequest = {
        placeId: currentPlaceId,
        checkin: format(checkinDate, 'yyyy-MM-dd'),
        checkout: format(checkoutDate, 'yyyy-MM-dd'),
        occupancies: occupancies,
        guestNationality: 'MA',
        currency: 'MAD',
        limit: 50,
        offset: 0, // Start from beginning
        roomMapping: false,
        sort: [
          {
            field: 'top_picks',
            direction: 'ascending'
          }
        ]
      };

      const results = await ApiService.searchRates(searchRequest);
      setSearchResults(results.hotels || []);
      // If total is provided by API use it, otherwise assume there are more results (e.g. 10000)
      // pagination will stop when a page returns fewer items than the limit
      setTotalResults(results.total || 10000);
      navigation.navigate('HotelList');
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Erreur', 'Impossible de rechercher les hôtels');
    } finally {
      setLoading(false);
    }
  };

  // Calendar Logic
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateSelect = (date) => {
    if (!selectingCheckout) {
      setCheckinDate(date);
      setSelectingCheckout(true);
      if (isBefore(checkoutDate, date)) {
        setCheckoutDate(addDays(date, 1));
      }
    } else {
      if (isBefore(date, checkinDate)) {
        setCheckinDate(date);
        setCheckoutDate(addDays(date, 1));
      } else {
        setCheckoutDate(date);
        setSelectingCheckout(false);
        setShowCalendarModal(false);
      }
    }
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <View style={styles.calendarGrid}>
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
          <Text key={i} style={styles.calendarDayLabel}>{day}</Text>
        ))}
        {days.map((day, index) => {
          const isSelected = isSameDay(day, checkinDate) || isSameDay(day, checkoutDate);
          const isInRange = isWithinInterval(day, { start: checkinDate, end: checkoutDate });
          const isToday = isSameDay(day, new Date());
          const isPast = isBefore(day, new Date()) && !isToday;
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.calendarDay,
                isSelected && styles.calendarDaySelected,
                isInRange && !isSelected && styles.calendarDayInRange,
                isPast && styles.calendarDayDisabled
              ]}
              onPress={() => !isPast && handleDateSelect(day)}
              disabled={isPast}
            >
              <Text style={[
                styles.calendarDayText,
                isSelected && styles.calendarDayTextSelected,
                !isCurrentMonth && styles.calendarDayTextOtherMonth,
                isPast && styles.calendarDayTextDisabled
              ]}>
                {day.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Load nearby hotels (mock data for now)
  useEffect(() => {
    // In real app, this would fetch based on user location
    setNearbyHotels([
      { id: '1', name: 'The Red House', city: 'Marrakech', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', rating: 5, price: 2620, currency: 'DH' },
      { id: '2', name: 'Novotel', city: 'Casablanca', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600', rating: 4, price: 1850, currency: 'DH' },
    ]);
  }, []);

  const nightCount = differenceInDays(checkoutDate, checkinDate);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' }}
          style={styles.hero}
          imageStyle={{ opacity: 0.4 }}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Planifiez votre{'\n'}hébergement</Text>

            {/* Top Action Buttons */}
            <View style={styles.topActions}>
              <TouchableOpacity style={[styles.actionButton, styles.actionButtonActive]}>
                <Text style={styles.actionButtonTextActive}>Découvrir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Mes réservations</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Mes favoris</Text>
              </TouchableOpacity>
            </View>

            {/* Search Card */}
            <View style={styles.searchCard}>
              {/* Destination */}
              <View style={styles.searchRow}>
                <Ionicons name="location-outline" size={24} color="#6B7280" style={styles.searchIcon} />
                <View style={styles.searchInputContainer}>
                  <Text style={styles.searchLabel}>Destination</Text>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher un séjour"
                    placeholderTextColor="#9CA3AF"
                    value={destination}
                    onChangeText={handleDestinationChange}
                  />
                  {showPlaces && places.length > 0 && (
                    <View style={styles.placesDropdown}>
                      {places.map((place, index) => (
                        <TouchableOpacity
                          key={place.placeId || index}
                          style={styles.placeItem}
                          onPress={() => selectPlace(place)}
                        >
                          <Ionicons name="location" size={16} color="#E85D40" />
                          <Text style={styles.placeText}>{place.displayName}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                <TouchableOpacity>
                  <Ionicons name="navigate-circle-outline" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              {/* Date and Duration */}
              <TouchableOpacity
                style={styles.searchRow}
                onPress={() => {
                  setSelectingCheckout(false);
                  setShowCalendarModal(true);
                }}
              >
                <Ionicons name="calendar-outline" size={24} color="#6B7280" style={styles.searchIcon} />
                <View style={styles.searchInputContainer}>
                  <Text style={styles.searchLabel}>Date</Text>
                  <Text style={styles.searchValue}>
                    du {format(checkinDate, 'd', { locale: fr })} au {format(checkoutDate, 'd MMMM', { locale: fr })}
                  </Text>
                </View>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationLabel}>Durée</Text>
                  <Text style={styles.durationValue}>{nightCount} nuitées</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Guests */}
              <TouchableOpacity
                style={styles.searchRow}
                onPress={() => setShowGuestPicker(true)}
              >
                <Ionicons name="people-outline" size={24} color="#6B7280" style={styles.searchIcon} />
                <View style={styles.searchInputContainer}>
                  <Text style={styles.searchLabel}>Chambres et invités</Text>
                  <Text style={styles.searchValue}>
                    {rooms} chambres • {adults} Adultes, {children} Enfants
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Search Button */}
              <TouchableOpacity
                style={styles.searchButton}
                onPress={searchHotels}
                disabled={loading}
              >
                <Text style={styles.searchButtonText}>
                  {loading ? 'Recherche...' : 'Rechercher'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Ionicons
                name={category.icon}
                size={20}
                color={activeCategory === category.id ? '#1F2937' : '#6B7280'}
              />
              <Text style={[
                styles.categoryText,
                activeCategory === category.id && styles.categoryTextActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Nearby Hotels */}
        <View style={styles.nearbySection}>
          <View style={styles.nearbySectionHeader}>
            <Text style={styles.nearbySectionTitle}>Hôtels près de chez moi</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.nearbyHotelsScroll}
          >
            {nearbyHotels.map((hotel) => (
              <TouchableOpacity
                key={hotel.id}
                style={styles.nearbyHotelCard}
                onPress={() => {
                  setSelectedHotel(hotel);
                  navigation.navigate('HotelDetails');
                }}
              >
                <Image
                  source={{ uri: hotel.image }}
                  style={styles.nearbyHotelImage}
                />
                <View style={styles.nearbyHotelInfo}>
                  <Text style={styles.nearbyHotelCity}>{hotel.city}</Text>
                  <Text style={styles.nearbyHotelName}>{hotel.name}</Text>
                  <View style={styles.nearbyHotelFooter}>
                    <Text style={styles.nearbyHotelPrice}>
                      {hotel.price.toLocaleString()} {hotel.currency}
                    </Text>
                    <View style={styles.nearbyHotelRating}>
                      <Ionicons name="star" size={14} color="#F59E0B" />
                      <Text style={styles.nearbyHotelRatingText}>{hotel.rating}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* View Map Button */}
          <TouchableOpacity style={styles.viewMapButton}>
            <Ionicons name="map-outline" size={18} color="#1F2937" />
            <Text style={styles.viewMapText}>Vue carte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendarModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Sélectionner les dates</Text>
              <TouchableOpacity onPress={() => setShowCalendarModal(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarMonthNav}>
              <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, -1))}>
                <Ionicons name="chevron-back" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.calendarMonthText}>
                {format(currentMonth, 'MMMM yyyy', { locale: fr })}
              </Text>
              <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <Ionicons name="chevron-forward" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            {renderCalendar()}

            <TouchableOpacity
              style={styles.calendarDoneButton}
              onPress={() => setShowCalendarModal(false)}
            >
              <Text style={styles.calendarDoneButtonText}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Guest Picker Modal */}
      <Modal
        visible={showGuestPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGuestPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.guestModal}>
            <View style={styles.guestModalHeader}>
              <Text style={styles.guestModalTitle}>Chambres et invités</Text>
              <TouchableOpacity onPress={() => setShowGuestPicker(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Chambres</Text>
              <View style={styles.guestCounter}>
                <TouchableOpacity
                  style={styles.guestButton}
                  onPress={() => setRooms(Math.max(1, rooms - 1))}
                >
                  <Ionicons name="remove" size={20} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.guestValue}>{rooms}</Text>
                <TouchableOpacity
                  style={styles.guestButton}
                  onPress={() => setRooms(rooms + 1)}
                >
                  <Ionicons name="add" size={20} color="#1F2937" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Adultes</Text>
              <View style={styles.guestCounter}>
                <TouchableOpacity
                  style={styles.guestButton}
                  onPress={() => setAdults(Math.max(1, adults - 1))}
                >
                  <Ionicons name="remove" size={20} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.guestValue}>{adults}</Text>
                <TouchableOpacity
                  style={styles.guestButton}
                  onPress={() => setAdults(adults + 1)}
                >
                  <Ionicons name="add" size={20} color="#1F2937" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Enfants</Text>
              <View style={styles.guestCounter}>
                <TouchableOpacity
                  style={styles.guestButton}
                  onPress={() => setChildren(Math.max(0, children - 1))}
                >
                  <Ionicons name="remove" size={20} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.guestValue}>{children}</Text>
                <TouchableOpacity
                  style={styles.guestButton}
                  onPress={() => setChildren(children + 1)}
                >
                  <Ionicons name="add" size={20} color="#1F2937" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.guestDoneButton}
              onPress={() => setShowGuestPicker(false)}
            >
              <Text style={styles.guestDoneButtonText}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  hero: {
    width: '100%',
    minHeight: 520,
    backgroundColor: '#1F2937',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 24,
    lineHeight: 42,
  },
  topActions: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonActive: {
    backgroundColor: '#E85D40',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonTextActive: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  searchCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInputContainer: {
    flex: 1,
  },
  searchLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  searchInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    padding: 0,
  },
  searchValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  durationBadge: {
    alignItems: 'flex-end',
  },
  durationLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  durationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  placesDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
    maxHeight: 200,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 8,
  },
  placeText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  searchButton: {
    backgroundColor: '#E85D40',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  categoriesContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoriesContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  categoryButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#1F2937',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#1F2937',
    fontWeight: '700',
  },
  nearbySection: {
    padding: 20,
  },
  nearbySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nearbySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
  },
  seeAllText: {
    fontSize: 14,
    color: '#E85D40',
    fontWeight: '600',
  },
  nearbyHotelsScroll: {
    paddingBottom: 16,
    gap: 16,
  },
  nearbyHotelCard: {
    width: 280,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginRight: 16,
  },
  nearbyHotelImage: {
    width: '100%',
    height: 200,
  },
  nearbyHotelInfo: {
    padding: 12,
  },
  nearbyHotelCity: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  nearbyHotelName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  nearbyHotelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nearbyHotelPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  nearbyHotelRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  nearbyHotelRatingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  viewMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    borderRadius: 24,
    marginTop: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  viewMapText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  calendarModal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: height * 0.8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  calendarMonthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarMonthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textTransform: 'capitalize',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  calendarDayLabel: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  calendarDay: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  calendarDaySelected: {
    backgroundColor: '#E85D40',
  },
  calendarDayInRange: {
    backgroundColor: '#FEE2E2',
  },
  calendarDayDisabled: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontSize: 14,
    color: '#1F2937',
  },
  calendarDayTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },
  calendarDayTextOtherMonth: {
    color: '#D1D5DB',
  },
  calendarDayTextDisabled: {
    color: '#D1D5DB',
  },
  calendarDoneButton: {
    backgroundColor: '#E85D40',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  calendarDoneButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  guestModal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  guestModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  guestModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  guestLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  guestCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  guestButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    minWidth: 24,
    textAlign: 'center',
  },
  guestDoneButton: {
    backgroundColor: '#E85D40',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  guestDoneButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

