import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useBooking } from '../context/BookingContext';

const { width } = Dimensions.get('window');

export const BookingSummaryScreen = ({ navigation, route }) => {
  const { rate, prebookData } = route.params;
  const { selectedHotel, searchParams } = useBooking();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Use prebook data if available, otherwise fall back to rate
  const totalPrice = prebookData?.price || rate.retailRate.total[0].amount;
  const prebookId = prebookData?.prebookId;
  const currency = prebookData?.currency || rate.retailRate.total[0].currency;
  const points = Math.round(totalPrice * 10);
  const checkinDate = new Date(prebookData?.checkin || searchParams.checkin);
  const checkoutDate = new Date(prebookData?.checkout || searchParams.checkout);

  const renderPaymentModal = () => (
    <Modal
      visible={showPaymentModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowPaymentModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Options de paiement</Text>
            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <Text style={styles.paymentLabel}>Attijari Pay</Text>
          <TouchableOpacity style={styles.paymentOptionCard}>
            <View style={styles.walletIcon}>
              <Ionicons name="wallet" size={24} color="#D97706" />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.walletTitle}>Solde du compte</Text>
              <Text style={styles.walletSub}>**** ******** 3564</Text>
            </View>
            <Text style={styles.walletBalance}>36 461,20DH</Text>
          </TouchableOpacity>

          <Text style={styles.paymentLabel}>Autres options</Text>
          <View style={styles.otherOptionsRow}>
            <TouchableOpacity style={styles.otherOptionBtn}>
              <Ionicons name="add-circle-outline" size={20} color="#6B7280" />
              <Text style={styles.otherOptionText}>Ajouter de l'argent</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.otherOptionBtn}>
              <Ionicons name="swap-horizontal-outline" size={20} color="#6B7280" />
              <Text style={styles.otherOptionText}>Échange</Text>
            </TouchableOpacity>
          </View>

          <View style={{flex: 1}} />

          <TouchableOpacity 
            style={styles.confirmPayBtn}
            onPress={() => {
              setShowPaymentModal(false);
              // TODO: Call the book API with prebookId
              Alert.alert(
                'Succès', 
                `Réservation confirmée !\nPrebook ID: ${prebookId || 'N/A'}`
              );
              navigation.navigate('Search');
            }}
          >
            <Text style={styles.confirmPayText}>Payez {Math.round(totalPrice)} {currency}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vérifier</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
        {/* Hotel Summary Card */}
        <View style={styles.hotelCard}>
          <Image
            source={{ uri: selectedHotel.mainPhoto || 'https://via.placeholder.com/400x200' }}
            style={styles.hotelImage}
            resizeMode="cover"
          />
          <View style={styles.hotelOverlay}>
            <Text style={styles.hotelName}>{selectedHotel.name}</Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timelineCard}>
          <View style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <Text style={styles.timelineLabel}>Enregistrement</Text>
              <Text style={styles.timelineDate}>{format(checkinDate, 'EEE dd MMMM', {locale: fr})}</Text>
              <Text style={styles.timelineTime}>14h00 - 00h00</Text>
            </View>
            <View style={styles.timelineCenter}>
              <View style={styles.timelineLine} />
              <View style={styles.timelineDot} />
            </View>
            <View style={styles.timelineRight}>
              <Text style={styles.timelineLabel}>Vérifier</Text>
              <Text style={styles.timelineDate}>{format(checkoutDate, 'EEE dd MMMM', {locale: fr})}</Text>
              <Text style={styles.timelineTime}>Jusqu'à 12h00</Text>
            </View>
          </View>
        </View>

        {/* Map & Address */}
        <View style={styles.mapCard}>
          <View style={styles.mapInfo}>
            <Ionicons name="location" size={20} color="#374151" />
            <Text style={styles.addressText} numberOfLines={2}>{selectedHotel.address}</Text>
          </View>
          <Image 
            source={{ uri: 'https://via.placeholder.com/100x100.png?text=Map' }} 
            style={styles.mapImage} 
          />
        </View>

        {/* Actions List */}
        <View style={styles.actionsList}>
          {[
            'Contacter la propriété', 
            'Gérer la réservation', 
            'Ajouter une réservation au calendrier',
            'Détails de la propriété'
          ].map((action, i) => (
            <TouchableOpacity key={i} style={styles.actionItem}>
              <Text style={styles.actionText}>{action}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Section */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentHeader}>
            <Text style={styles.paymentTitle}>Paiements</Text>
            <Text style={styles.paymentDetails}>Détails</Text>
          </View>
          
          <View style={styles.paymentCard}>
            <View style={styles.paymentIcon}>
              <Ionicons name="key-outline" size={24} color="#E85D40" />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.paymentText}>Séjours</Text>
              <Text style={styles.paymentSubtext}>Aujourd'hui</Text>
            </View>
            <Text style={styles.paymentPoints}>+{points} points</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.payButton}
          onPress={() => setShowPaymentModal(true)}
        >
          <Text style={styles.payButtonText}>
            Payez {Math.round(totalPrice)} {currency}
            {prebookId && ` • Session: ${prebookId.substring(0, 8)}...`}
          </Text>
        </TouchableOpacity>
      </View>

      {renderPaymentModal()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  backButton: {
    padding: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  hotelCard: {
    marginHorizontal: 20,
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  hotelImage: {
    width: '100%',
    height: '100%',
  },
  hotelOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  hotelName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  timelineCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineLeft: {
    flex: 1,
  },
  timelineRight: {
    flex: 1,
    alignItems: 'flex-end', // Changed to right align
  },
  timelineCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  timelineLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  timelineTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  timelineLine: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    position: 'absolute',
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E85D40',
  },
  mapCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  mapInfo: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 12,
  },
  addressText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 8,
    lineHeight: 18,
    flex: 1,
  },
  mapImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  actionsList: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  paymentSection: {
    marginHorizontal: 20,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  paymentDetails: {
    fontSize: 14,
    color: '#E85D40',
    fontWeight: '600',
  },
  paymentCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  paymentSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  paymentPoints: {
    fontWeight: '700',
    color: '#1F2937',
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
  payButton: {
    backgroundColor: '#E85D40',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
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
  paymentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    marginTop: 8,
  },
  paymentOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  walletIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  walletTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  walletSub: {
    fontSize: 12,
    color: '#6B7280',
  },
  walletBalance: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  otherOptionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  otherOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
  },
  otherOptionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  confirmPayBtn: {
    backgroundColor: '#E85D40',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmPayText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

