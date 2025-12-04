import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const HotelCard = ({ hotel, onPress }) => {
  // Use first room rate as display price
  const firstRate = hotel.roomTypes?.[0]?.rates?.[0];
  const totalPrice = firstRate?.retailRate?.total?.[0]?.amount || 0;
  const currency = firstRate?.retailRate?.total?.[0]?.currency || 'USD';
  
  // Mock calculation for nightly price (assuming 1 night if not specified, purely visual here)
  const nightlyPrice = Math.round(totalPrice); 

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: hotel.mainPhoto || 'https://via.placeholder.com/400x300' }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Rating & Category */}
        <View style={styles.headerRow}>
          <View style={styles.starRow}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.starText}>Hôtel {hotel.starRating || '4.0'} étoiles</Text>
          </View>
          <View style={styles.scoreBadge}>
             <Text style={styles.scoreText}>{hotel.rating ? hotel.rating.toFixed(1) : '8.6'}</Text>
          </View>
        </View>

        {/* Name */}
        <Text style={styles.name} numberOfLines={1}>
          {hotel.name}
        </Text>

        {/* Address */}
        <View style={styles.row}>
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text style={styles.addressText} numberOfLines={1}>{hotel.address}</Text>
        </View>

        {/* Perks */}
        <View style={styles.row}>
          <Ionicons name="checkmark-circle-outline" size={14} color="#6B7280" />
          <Text style={styles.perkText}>Annulation gratuite</Text>
        </View>

        {/* Pricing Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Prix</Text>
            <Text style={styles.pointsLabel}>Points gagnés</Text>
          </View>

          <View style={styles.priceRight}>
            <View style={styles.priceRow}>
                <Text style={styles.nightlyPrice}>98 $</Text>
                <Text style={styles.totalPrice}>{Math.round(totalPrice)} $</Text>
            </View>
            <View style={styles.pointsPill}>
                <Ionicons name="diamond-outline" size={12} color="#D97706" />
                <Text style={styles.pointsValue}>990</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  scoreBadge: {
    backgroundColor: '#ECFDF5', // Light green
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scoreText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  perkText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 16,
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
  priceRight: {
    alignItems: 'flex-end',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  nightlyPrice: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
    textDecorationLine: 'none', // or 'line-through' if it was a discount
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7', // Light yellow
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706', // Dark yellow/orange
    marginLeft: 4,
  },
});
