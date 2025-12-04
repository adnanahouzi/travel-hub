import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HotelCard, LoadingSpinner } from '../components';
import { useBooking } from '../context/BookingContext';

export const HotelListScreen = ({ navigation }) => {
  const { searchResults, searchParams, loading, setSelectedHotel } = useBooking();

  const handleHotelPress = (hotel) => {
    setSelectedHotel(hotel);
    navigation.navigate('HotelDetails');
  };

  if (loading) {
    return <LoadingSpinner message="Searching for hotels..." />;
  }

  if (searchResults.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bed-outline" size={64} color="#d1d5db" />
        <Text style={styles.emptyText}>No hotels found</Text>
        <Text style={styles.emptySubtext}>Try adjusting your search criteria</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{searchParams.placeName}</Text>
          <Text style={styles.headerSubtitle}>
            {searchResults.length} hotel{searchResults.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={(item, index) => item.hotelId || index.toString()}
        renderItem={({ item }) => (
          <HotelCard hotel={item} onPress={() => handleHotelPress(item)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  list: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

