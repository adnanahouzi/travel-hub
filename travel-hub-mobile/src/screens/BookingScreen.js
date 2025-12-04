import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components';

export const BookingScreen = ({ navigation, route }) => {
  const { rate } = route.params || {};
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    // Validate guest information
    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      Alert.alert(
        'Booking Confirmation',
        'Your booking has been processed successfully! (Demo mode)',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Search'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to complete booking');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = rate?.retailRate?.total?.[0];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Booking</Text>
      </View>

      {/* Booking Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Summary</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.roomName}>{rate?.name}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Board Type</Text>
            <Text style={styles.summaryValue}>{rate?.boardName || 'Room Only'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Guests</Text>
            <Text style={styles.summaryValue}>
              {rate?.adultCount} Adult{rate?.adultCount > 1 ? 's' : ''}
              {rate?.childCount > 0 && `, ${rate.childCount} Child${rate.childCount > 1 ? 'ren' : ''}`}
            </Text>
          </View>
          {totalPrice && (
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {totalPrice.currency} {totalPrice.amount.toFixed(2)}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Guest Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Guest Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>First Name *</Text>
          <TextInput
            style={styles.input}
            value={guestInfo.firstName}
            onChangeText={(text) => setGuestInfo({ ...guestInfo, firstName: text })}
            placeholder="Enter first name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Last Name *</Text>
          <TextInput
            style={styles.input}
            value={guestInfo.lastName}
            onChangeText={(text) => setGuestInfo({ ...guestInfo, lastName: text })}
            placeholder="Enter last name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email *</Text>
          <TextInput
            style={styles.input}
            value={guestInfo.email}
            onChangeText={(text) => setGuestInfo({ ...guestInfo, email: text })}
            placeholder="Enter email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone</Text>
          <TextInput
            style={styles.input}
            value={guestInfo.phone}
            onChangeText={(text) => setGuestInfo({ ...guestInfo, phone: text })}
            placeholder="Enter phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* Cancellation Policy */}
      {rate?.cancellationPolicies && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cancellation Policy</Text>
          <View style={styles.policyCard}>
            <View style={styles.policyRow}>
              <Ionicons
                name={rate.cancellationPolicies.refundableTag === 'RFN' ? 'checkmark-circle' : 'close-circle'}
                size={24}
                color={rate.cancellationPolicies.refundableTag === 'RFN' ? '#10b981' : '#ef4444'}
              />
              <Text style={styles.policyText}>
                {rate.cancellationPolicies.refundableTag === 'RFN'
                  ? 'Free cancellation available'
                  : 'Non-refundable rate'}
              </Text>
            </View>
            {rate.cancellationPolicies.cancelPolicyInfos?.map((info, index) => (
              <Text key={index} style={styles.policyDetail}>
                • Cancel before {info.cancelTime} for a fee of {info.currency} {info.amount}
              </Text>
            ))}
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Confirm Booking"
          onPress={handleBooking}
          loading={loading}
        />
      </View>
    </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  section: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563eb',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a1a',
  },
  policyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  policyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  policyDetail: {
    fontSize: 13,
    color: '#666',
    marginLeft: 32,
    marginTop: 4,
  },
  buttonContainer: {
    padding: 16,
    marginTop: 16,
    marginBottom: 40,
  },
});

