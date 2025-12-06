import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Dimensions,
  Modal,
  useWindowDimensions
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useBooking } from '../context/BookingContext';

const { width } = Dimensions.get('window');

export const BookingSummaryScreen = ({ navigation, route }) => {
  const { selectedRooms, batchResponse, reviewsSummary } = route.params;
  const { selectedHotel, searchParams } = useBooking();

  // Data Mapping
  const totalPrice = batchResponse.totalAmount || 0;
  const currency = batchResponse.currency || 'MAD';
  const prebookResponses = batchResponse.responses || [];

  // Get T&Cs from the first response
  const termsAndConditions = prebookResponses[0]?.data?.termsAndConditions;

  const points = Math.round(totalPrice * 0.1); // 10% points

  const checkinDate = new Date(prebookResponses[0]?.data?.checkin || searchParams.checkin);
  const checkoutDate = new Date(prebookResponses[0]?.data?.checkout || searchParams.checkout);

  // Formatting
  const formattedPrice = new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(totalPrice);

  const handleConfirm = () => {
    // In a real app, this would call the booking API with all prebookIds
    const prebookIds = prebookResponses.map(r => r.data?.prebookId).join(', ');

    Alert.alert(
      'Réservation confirmée',
      `Votre réservation a été confirmée avec succès.\nRéférences: ${prebookIds}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Search')
        }
      ]
    );
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const { width: contentWidth } = useWindowDimensions();

  const openConditionsModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#E85D40" />
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Hotel Info */}
        {/* Hotel Info */}
        <View style={styles.hotelSection}>
          <View style={styles.hotelInfoContainer}>
            {/* Left Column: Name, Stars, Address */}
            <View style={styles.hotelInfoLeft}>
              <Text style={styles.hotelName}>{selectedHotel.name}</Text>

              <View style={styles.starRow}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={14}
                    color={i < (selectedHotel.starRating || 5) ? "#F59E0B" : "#E5E7EB"}
                  />
                ))}
              </View>

              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={14} color="#6B7280" />
                <Text style={styles.addressText} numberOfLines={2}>{selectedHotel.address}</Text>
              </View>
            </View>

            {/* Right Column: Image and Rating */}
            <View style={styles.hotelInfoRight}>
              <Image
                source={{ uri: selectedHotel.mainPhoto || 'https://via.placeholder.com/400x200' }}
                style={styles.hotelImage}
                resizeMode="cover"
              />
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingScore}>{(reviewsSummary?.rating || selectedHotel.rating || 0).toFixed(1)}</Text>
                <Text style={styles.ratingCount}>{reviewsSummary?.total || selectedHotel.reviewCount || 0} avis</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Dates & Price Card */}
        <View style={styles.summaryCard}>
          {/* Dates */}
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Arrivé</Text>
            <Text style={styles.dateValue}>
              {format(checkinDate, 'dd MMMM', { locale: fr })}, 14h00 - 00h00
            </Text>
          </View>

          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Départ</Text>
            <Text style={styles.dateValue}>
              {format(checkoutDate, 'dd MMMM', { locale: fr })}, jusqu'à 12h00
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Price Breakdown */}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Payez maintenant</Text>
            <Text style={styles.priceValue}>{formattedPrice} {currency}</Text>
          </View>

          {batchResponse.totalIncludedTaxes > 0 && (
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Taxes et frais inclus</Text>
              <Text style={styles.taxValue}>{new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(batchResponse.totalIncludedTaxes)} {currency}</Text>
            </View>
          )}

          {batchResponse.totalExcludedTaxes > 0 && (
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Total à payer sur place</Text>
              <Text style={styles.taxValue}>{new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(batchResponse.totalExcludedTaxes)} {currency}</Text>
            </View>
          )}



          <View style={styles.divider} />



          <View style={styles.pointsRow}>
            <Text style={styles.pointsLabel}>Points que vous gagnez</Text>
            <View style={styles.pointsValueContainer}>
              <Ionicons name="flash" size={14} color="#FFF" />
              <Text style={styles.pointsValueText}>{points}</Text>
            </View>
          </View>
        </View>

        {/* Traveler Info */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informations de voyage</Text>
          <TouchableOpacity>
            <Text style={styles.editLink}>Modifier</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <Text style={styles.infoText}>John Doe</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="phone-portrait-outline" size={20} color="#6B7280" />
            <Text style={styles.infoText}>+212 60000000</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <Text style={styles.infoText}>john.doe@email.com</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={20} color="#6B7280" />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.infoLabel}>Demandes spéciales</Text>
              <Text style={styles.infoValue}>Aucun</Text>
            </View>
          </View>
        </View>

        {/* Rooms Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Chambres</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.editLink}>Modifier</Text>
          </TouchableOpacity>
        </View>

        {prebookResponses.map((response, index) => {
          // Extract rate details from the response
          // Structure: response.data.roomTypes[0].rates[0]
          const roomType = response.data?.roomTypes?.[0];
          const rate = roomType?.rates?.[0];
          console.log('Debug Rate:', JSON.stringify(rate, null, 2));

          if (!rate) return null;

          const ratePrice = rate.retailRate?.total?.[0]?.amount || 0;
          const rateCurrency = rate.retailRate?.total?.[0]?.currency || 'MAD';
          const commission = rate.commission?.[0]?.amount || 0;
          const commissionCurrency = rate.commission?.[0]?.currency || 'MAD';

          return (
            <View key={index} style={styles.roomCard}>
              {/* Image removed as per request */}
              <View style={styles.roomDetails}>
                <Text style={styles.roomName}>{rate.name}</Text>

                <View style={styles.roomSpecs}>
                  <Ionicons name="bed-outline" size={14} color="#6B7280" />
                  <Text style={styles.roomSpecText}>
                    {(rate.adultCount || 0) + (rate.childCount || 0)} personnes
                  </Text>
                  {rate.boardName && (
                    <>
                      <View style={styles.specDot} />
                      <Text style={styles.roomSpecText}>{rate.boardName}</Text>
                    </>
                  )}
                </View>

                <View style={styles.rateFinancials}>
                  <Text style={styles.ratePrice}>
                    Prix: {new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(ratePrice)} {rateCurrency}
                  </Text>

                  {/* Taxes */}
                  {response.data?.totalIncludedTaxes > 0 && (
                    <Text style={styles.taxText}>
                      Taxes et frais inclus: {new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(response.data.totalIncludedTaxes)} {rateCurrency}
                    </Text>
                  )}
                  {response.data?.totalExcludedTaxes > 0 && (
                    <Text style={styles.taxText}>
                      Taxes à payer sur place: {new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(response.data.totalExcludedTaxes)} {rateCurrency}
                    </Text>
                  )}

                  {/* Cancellation Policy */}
                  <View style={styles.cancellationContainer}>
                    {rate.cancellationPolicies?.refundableTag === 'NRFN' ? (
                      <View style={styles.policyRow}>
                        <Ionicons name="close-circle-outline" size={14} color="#EF4444" />
                        <Text style={[styles.policyText, { color: '#EF4444' }]}>Non remboursable</Text>
                      </View>
                    ) : (
                      rate.cancellationPolicies?.cancelPolicyInfos?.length > 0 && (
                        <View style={styles.policyRow}>
                          <Ionicons name="checkmark-circle-outline" size={14} color="#059669" />
                          <Text style={[styles.policyText, { color: '#059669' }]}>
                            Annulation gratuite avant le {rate.cancellationPolicies.cancelPolicyInfos[0]?.cancelTime ? format(new Date(rate.cancellationPolicies.cancelPolicyInfos[0].cancelTime), 'dd/MM/yyyy') : ''}
                          </Text>
                        </View>
                      )
                    )}
                  </View>

                  {/* Reservation Conditions Link */}
                  {(rate.remarks || termsAndConditions) && (
                    <TouchableOpacity
                      onPress={() => openConditionsModal(rate.remarks ? `${rate.remarks}<br/><br/>${termsAndConditions || ''}` : termsAndConditions)}
                      style={styles.conditionsLinkContainer}
                    >
                      <Text style={styles.conditionsLinkText}>Conditions de réservations chambre</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        <Text style={styles.disclaimer}>
          En réservant, vous acceptez les conditions de séjours et les conditions des points AWB , et comprenez que nous partagerons vos données personnelles pour faciliter votre réservation.
        </Text>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.footerLabel}>Total a payer:</Text>
          <Text style={styles.footerSubLabel}>*frais de service inclus</Text>
        </View>
        <Text style={styles.footerPrice}>{formattedPrice} {currency}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Confirmer</Text>
        </TouchableOpacity>
      </View>

      {/* Conditions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Conditions de réservation</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <RenderHtml
                contentWidth={contentWidth}
                source={{ html: modalContent }}
                tagsStyles={{
                  p: { marginBottom: 10, fontSize: 14, color: '#374151' },
                  ul: { marginBottom: 10 },
                  li: { marginBottom: 5, fontSize: 14, color: '#374151' },
                  b: { fontWeight: '700', color: '#1F2937' }
                }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  hotelSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  hotelInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hotelInfoLeft: {
    flex: 1,
    paddingRight: 16,
  },
  hotelInfoRight: {
    alignItems: 'flex-end',
  },
  hotelName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
    lineHeight: 18,
  },
  hotelImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
  },
  ratingBadge: {
    alignItems: 'flex-end',
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 2,
  },
  ratingCount: {
    fontSize: 11,
    color: '#6B7280',
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    marginTop: 2,
  },
  taxLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  taxValue: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  totalRow: {
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  pointsValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsValueText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
  },
  editLink: {
    fontSize: 14,
    color: '#E85D40',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 15,
    color: '#1F2937',
    marginLeft: 12,
    fontWeight: '500',
  },
  infoLabel: {
    fontSize: 15,
    color: '#6B7280',
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  roomCard: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  roomDetails: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  roomSpecs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomSpecText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  specDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  rateFinancials: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  ratePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  rateCommission: {
    fontSize: 13,
    color: '#059669',
    marginTop: 2,
  },
  taxText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  cancellationContainer: {
    marginTop: 8,
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  policyText: {
    fontSize: 13,
    marginLeft: 4,
    fontWeight: '500',
  },
  additionalInfoCard: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  bulletPoint: {
    marginBottom: 12,
  },
  bulletText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  readMoreLink: {
    fontSize: 14,
    color: '#E85D40',
    fontWeight: '600',
    marginTop: 4,
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 120 : 100, // Positioned above buttons
    left: 20,
    right: 20,
    backgroundColor: '#FFFF', // Transparent or matching bg
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFF5F0', // Light orange bg for total
  },
  totalContainer: {
    justifyContent: 'center',
  },
  footerLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  footerSubLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E85D40',
  },
  confirmButton: {
    backgroundColor: '#E85D40',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    flex: 1,
    marginLeft: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  conditionsLinkContainer: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  conditionsLinkText: {
    fontSize: 14,
    color: '#E85D40',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalScroll: {
    flex: 1,
  },
});
