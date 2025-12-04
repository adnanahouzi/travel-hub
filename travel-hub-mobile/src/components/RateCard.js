import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const RateCard = ({ rate, onSelect }) => {
  const totalPrice = rate.retailRate?.total?.[0];
  const cancellationPolicy = rate.cancellationPolicies?.refundableTag;

  return (
    <TouchableOpacity style={styles.card} onPress={onSelect}>
      <View style={styles.header}>
        <Text style={styles.roomName} numberOfLines={2}>
          {rate.name}
        </Text>
        {rate.boardName && (
          <View style={styles.boardBadge}>
            <Text style={styles.boardText}>{rate.boardName}</Text>
          </View>
        )}
      </View>

      {rate.roomDescription && (
        <Text style={styles.description} numberOfLines={2}>
          {rate.roomDescription}
        </Text>
      )}

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            {rate.adultCount} Adult{rate.adultCount > 1 ? 's' : ''}
            {rate.childCount > 0 && `, ${rate.childCount} Child${rate.childCount > 1 ? 'ren' : ''}`}
          </Text>
        </View>
        
        {rate.roomSize && (
          <View style={styles.detailRow}>
            <Ionicons name="resize-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {rate.roomSize} {rate.roomSizeUnit}
            </Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Ionicons 
            name={cancellationPolicy === 'RFN' ? 'checkmark-circle' : 'close-circle'} 
            size={16} 
            color={cancellationPolicy === 'RFN' ? '#10b981' : '#ef4444'} 
          />
          <Text style={styles.detailText}>
            {cancellationPolicy === 'RFN' ? 'Free Cancellation' : 'Non-Refundable'}
          </Text>
        </View>
      </View>

      {totalPrice && (
        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.priceLabel}>Total Price</Text>
            {rate.retailRate?.taxesAndFees?.[0] && (
              <Text style={styles.taxInfo}>
                + {rate.retailRate.taxesAndFees[0].description}
              </Text>
            )}
          </View>
          <Text style={styles.price}>
            {totalPrice.currency} {totalPrice.amount.toFixed(2)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 8,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  boardBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  boardText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  taxInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2563eb',
  },
});

