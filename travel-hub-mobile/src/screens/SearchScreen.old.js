import React, { useState } from 'react';
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
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, startOfWeek, endOfWeek, addMonths, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ApiService } from '../services/api.service';
import { useBooking } from '../context/BookingContext';

const { width, height } = Dimensions.get('window');

export const SearchScreen = ({ navigation }) => {
  const { updateSearchParams, setSearchResults, setLoading, loading } = useBooking();
  
  // Search State
  const [destination, setDestination] = useState('');
  const [places, setPlaces] = useState([]);
  const [showPlaces, setShowPlaces] = useState(false);
  const [placeId, setPlaceId] = useState(null);
  
  // Date State
  const [checkinDate, setCheckinDate] = useState(new Date());
  const [checkoutDate, setCheckoutDate] = useState(addDays(new Date(), 1));
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Guest State
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const [searchTimeout, setSearchTimeout] = useState(null);
  const [activeTab, setActiveTab] = useState('Découvrir');

  // --- Logic Handlers ---

  const handleDestinationChange = (text) => {
    setDestination(text);
    setPlaceId(null); 
    if (searchTimeout) clearTimeout(searchTimeout);

    if (!text.trim()) {
      setPlaces([]);
      setShowPlaces(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const response = await ApiService.searchPlaces(text);
        setPlaces(response.places || []);
        setShowPlaces(true);
      } catch (error) {
        console.error('Autocomplete error:', error);
      }
    }, 500);
    setSearchTimeout(timeout);
  };

  const selectPlace = (place) => {
    setDestination(place.displayName);
    setPlaceId(place.placeId);
    setShowPlaces(false);
  };

  // Custom Calendar Logic
  const handleDayPress = (day) => {
    if (isBefore(day, new Date()) && !isSameDay(day, new Date())) return;

    if (!checkinDate || (checkinDate && checkoutDate)) {
      // Start new selection
      setCheckinDate(day);
      setCheckoutDate(null);
    } else if (checkinDate && !checkoutDate) {
      // Complete selection
      if (isBefore(day, checkinDate)) {
        setCheckinDate(day);
      } else {
        setCheckoutDate(day);
      }
    }
  };

  const confirmDates = () => {
    if (!checkinDate || !checkoutDate) {
      Alert.alert('Dates incomplètes', 'Veuillez sélectionner une date de départ et de fin.');
      return;
    }
    setShowCalendarModal(false);
  };

  const searchHotels = async () => {
    if (!destination.trim()) {
      Alert.alert('Oups', 'Veuillez entrer une destination');
      return;
    }

    if (!checkinDate || !checkoutDate) {
        Alert.alert('Dates manquantes', 'Veuillez sélectionner vos dates.');
        return;
    }

    setLoading(true);
    try {
      let currentPlaceId = placeId;

      if (!currentPlaceId) {
        const placeResponse = await ApiService.searchPlaces(destination);
        if (!placeResponse.places || placeResponse.places.length === 0) {
          Alert.alert('Introuvable', 'Destination introuvable. Essayez autre chose.');
          setLoading(false);
          return;
        }
        const bestMatch = placeResponse.places[0];
        currentPlaceId = bestMatch.placeId;
        setDestination(bestMatch.displayName);
      }

      const childrenAges = children > 0 ? Array(children).fill(10) : [];
      const finalOccupancies = [{ adults, children: childrenAges }];
      const finalCheckin = format(checkinDate, 'yyyy-MM-dd');
      const finalCheckout = format(checkoutDate, 'yyyy-MM-dd');

      updateSearchParams({
        placeId: currentPlaceId,
        placeName: destination,
        occupancies: finalOccupancies,
        checkin: finalCheckin,
        checkout: finalCheckout,
        guestNationality: 'US',
        currency: 'USD'
      });

      const requestBody = {
        placeId: currentPlaceId,
        occupancies: finalOccupancies,
        currency: 'USD',
        guestNationality: 'US',
        checkin: finalCheckin,
        checkout: finalCheckout,
        limit: 20,
      };

      const response = await ApiService.searchRates(requestBody);
      setSearchResults(response.hotels || []);
      navigation.navigate('HotelList');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de lancer la recherche.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- UI Components ---

  const renderCalendar = () => {
    const months = [new Date(), addMonths(new Date(), 1)];
    
    return (
      <Modal visible={showCalendarModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Dates</Text>
              <TouchableOpacity onPress={() => setShowCalendarModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.dateRangeDisplay}>
                <Text style={styles.dateRangeText}>
                    {checkinDate ? format(checkinDate, 'dd MMM', { locale: fr }) : 'Départ'} - {checkoutDate ? format(checkoutDate, 'dd MMM', { locale: fr }) : 'Retour'}
                </Text>
            </View>

            <ScrollView style={styles.calendarScroll}>
              {months.map((monthDate, i) => {
                const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
                const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 });
                const days = eachDayOfInterval({ start, end });

                return (
                  <View key={i} style={styles.monthContainer}>
                    <Text style={styles.monthTitle}>{format(monthDate, 'MMMM yyyy', { locale: fr })}</Text>
                    <View style={styles.daysGrid}>
                      {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, idx) => (
                        <Text key={idx} style={styles.dayLabel}>{d}</Text>
                      ))}
                      {days.map((day, dIdx) => {
                        const isSelected = (checkinDate && isSameDay(day, checkinDate)) || (checkoutDate && isSameDay(day, checkoutDate));
                        const isInRange = checkinDate && checkoutDate && isWithinInterval(day, { start: checkinDate, end: checkoutDate });
                        const isPast = isBefore(day, new Date()) && !isSameDay(day, new Date());
                        const isMonth = day.getMonth() === monthDate.getMonth();

                        return (
                          <TouchableOpacity 
                            key={dIdx} 
                            style={[
                              styles.dayCell, 
                              isSelected && styles.selectedDay,
                              isInRange && !isSelected && styles.rangeDay,
                              !isMonth && styles.otherMonthDay
                            ]}
                            onPress={() => handleDayPress(day)}
                            disabled={isPast}
                          >
                            <Text style={[
                                styles.dayText, 
                                isSelected && styles.selectedDayText,
                                isPast && styles.pastDayText,
                                !isMonth && styles.otherMonthText
                            ]}>
                                {format(day, 'd')}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
              <View style={{height: 80}} />
            </ScrollView>

            <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmDates}>
                    <Text style={styles.confirmButtonText}>Confirmer</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderGuestPicker = () => (
    <Modal visible={showGuestPicker} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Invités</Text>
                <TouchableOpacity onPress={() => setShowGuestPicker(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.guestSection}>
                <Text style={styles.roomTitle}>Chambre 1</Text>
                <View style={styles.guestRow}>
                <View>
                    <Text style={styles.guestLabel}>Adultes</Text>
                    <Text style={styles.guestSubLabel}>13 ans et plus</Text>
                </View>
                <View style={styles.counter}>
                    <TouchableOpacity onPress={() => setAdults(Math.max(1, adults - 1))} style={styles.counterBtn}><Text style={styles.counterBtnText}>-</Text></TouchableOpacity>
                    <Text style={styles.counterVal}>{adults}</Text>
                    <TouchableOpacity onPress={() => setAdults(adults + 1)} style={styles.counterBtn}><Text style={styles.counterBtnText}>+</Text></TouchableOpacity>
                </View>
                </View>

                <View style={styles.guestRow}>
                <View>
                    <Text style={styles.guestLabel}>Enfants</Text>
                    <Text style={styles.guestSubLabel}>2 à 12 ans</Text>
                </View>
                <View style={styles.counter}>
                    <TouchableOpacity onPress={() => setChildren(Math.max(0, children - 1))} style={styles.counterBtn}><Text style={styles.counterBtnText}>-</Text></TouchableOpacity>
                    <Text style={styles.counterVal}>{children}</Text>
                    <TouchableOpacity onPress={() => setChildren(children + 1)} style={styles.counterBtn}><Text style={styles.counterBtnText}>+</Text></TouchableOpacity>
                </View>
                </View>
            </View>

            <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.confirmButton} onPress={() => setShowGuestPicker(false)}>
                <Text style={styles.confirmButtonText}>Confirmer</Text>
                </TouchableOpacity>
            </View>
        </View>
        </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.pointsBadge}>
            <Ionicons name="diamond-outline" size={16} color="#D97706" />
            <Text style={styles.pointsText}>990</Text>
          </View>
        </View>
        
        <Text style={styles.headerTitle}>Vous rêvez de votre{'\n'}prochain voyage ?</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {['Découvrir', 'Favoris', 'Réservations'].map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Card */}
        <View style={styles.searchCard}>
          {/* Destination Input */}
          <View style={styles.inputRow}>
            <Ionicons name="location-outline" size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput 
              style={styles.input}
              placeholder="Barcelone"
              value={destination}
              onChangeText={handleDestinationChange}
            />
          </View>
          {showPlaces && places.length > 0 && (
            <View style={styles.dropdown}>
              {places.map((place, i) => (
                <TouchableOpacity key={i} style={styles.dropdownItem} onPress={() => selectPlace(place)}>
                  <Text numberOfLines={1}>{place.displayName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.rowDivider} />

          {/* Date & Guests Row */}
          <View style={styles.dualRow}>
            <TouchableOpacity style={styles.dateBox} onPress={() => setShowCalendarModal(true)}>
              <Ionicons name="calendar-outline" size={20} color="#9CA3AF" style={styles.icon} />
              <Text style={styles.dateText}>
                {checkinDate && checkoutDate 
                    ? `${format(checkinDate, 'dd MMM', {locale: fr})} - ${format(checkoutDate, 'dd MMM', {locale: fr})}`
                    : 'Dates'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.guestBox} onPress={() => setShowGuestPicker(true)}>
              <Text style={styles.guestText}>{adults + children}</Text>
              <Ionicons name="people-outline" size={20} color="#9CA3AF" style={{marginLeft: 4}} />
            </TouchableOpacity>
          </View>

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

        {/* Best Destinations */}
        <Text style={styles.sectionTitle}>Meilleures destinations</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.destinationsScroll}>
          {[
            { name: 'Londres', country: 'Royaume-Uni', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&q=80' },
            { name: 'Rome', country: 'Italie', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500&q=80' },
            { name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80' },
          ].map((dest, index) => (
            <TouchableOpacity key={index} style={styles.destCard} onPress={() => handleDestinationChange(dest.name)}>
              <Image source={{ uri: dest.img }} style={styles.destImage} />
              <View style={styles.destInfo}>
                <Text style={styles.destName}>{dest.name}</Text>
                <Text style={styles.destCountry}>{dest.country}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={{height: 100}} />
      </ScrollView>

      {/* Modals */}
      {renderGuestPicker()}
      {renderCalendar()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFD7C8', // Salmon/Pink color
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 80, // Extra padding for the floating card
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 24,
    lineHeight: 36,
  },
  tabsScroll: {
    flexDirection: 'row',
  },
  tab: {
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1F2937',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    marginTop: -60, // Pull up to overlap header
  },
  searchCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 32,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#1F2937',
    fontWeight: '500',
  },
  icon: {
    marginRight: 8,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  dualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  guestBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  guestText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  searchButton: {
    backgroundColor: '#E85D40', // Orange/Red
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 20,
    marginBottom: 16,
  },
  destinationsScroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  destCard: {
    width: 200,
    height: 250,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  destImage: {
    width: '100%',
    height: 160,
  },
  destInfo: {
    padding: 12,
  },
  destName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  destCountry: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  // MODAL STYLES
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%', // Covers most of screen
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalFooter: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  },
  confirmButton: {
    backgroundColor: '#E85D40',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#E85D40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // GUEST MODAL
  guestSection: {
    marginTop: 8,
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1F2937',
  },
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  guestLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  guestSubLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  // CALENDAR STYLES
  dateRangeDisplay: {
    marginBottom: 24,
  },
  dateRangeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  calendarScroll: {
    flex: 1,
  },
  monthContainer: {
    marginBottom: 24,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayLabel: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
    fontWeight: '600',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  selectedDay: {
    backgroundColor: '#E85D40',
  },
  selectedDayText: {
    color: '#FFF',
    fontWeight: '700',
  },
  rangeDay: {
    backgroundColor: '#FFE4DD', // Light orange
  },
  pastDayText: {
    color: '#E5E7EB',
  },
  otherMonthDay: {
      opacity: 0, // Hide other month days if you want simpler grid
  },
  otherMonthText: {
      color: 'transparent',
  }
});
