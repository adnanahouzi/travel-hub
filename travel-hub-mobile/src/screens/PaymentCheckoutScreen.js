import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useBooking } from '../context/BookingContext';

export const PaymentCheckoutScreen = ({ route, navigation }) => {
    const { prebookData, travelerInfo } = route.params;
    const { searchParams, selectedHotel } = useBooking();

    const [selectedAccount, setSelectedAccount] = useState(null);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    // Mock banking accounts - in real app, fetch from user profile
    const bankingAccounts = [
        { id: '1234567890123456', name: 'Compte Principal', balance: '25,000 DH' },
        { id: '6543210987654321', name: 'Compte Épargne', balance: '50,000 DH' },
    ];

    // Calculate nights
    const nights = differenceInDays(
        new Date(searchParams.checkout),
        new Date(searchParams.checkin)
    );

    // Calculate total guests
    const totalGuests = searchParams.occupancies?.reduce(
        (acc, curr) => acc + curr.adults + (curr.children?.length || 0),
        0
    ) || 0;

    // Service fees (example: 2% of total)
    const serviceFeePercent = 0.02;
    const serviceFee = prebookData.totalAmount * serviceFeePercent;
    const totalAmount = prebookData.totalAmount + serviceFee;

    const handlePayment = async () => {
        if (!selectedAccount) {
            Alert.alert('Attention', 'Veuillez sélectionner un compte à débiter');
            return;
        }

        if (!acceptedTerms) {
            Alert.alert('Attention', 'Veuillez accepter les conditions d\'utilisation');
            return;
        }

        try {
            setLoading(true);

            // Call submit booking endpoint
            // const bookingData = {
            //   simulationId: prebookData.simulationId,
            //   holder: {
            //     firstName: travelerInfo.firstName,
            //     lastName: travelerInfo.lastName,
            //     email: travelerInfo.email,
            //     phone: travelerInfo.phone,
            //   },
            //   bankingAccount: selectedAccount,
            // };

            // const response = await ApiService.submitBooking(bookingData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            Alert.alert(
                'Succès',
                'Votre réservation a été confirmée !',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Search'),
                    },
                ]
            );
        } catch (error) {
            console.error('Payment error:', error);
            Alert.alert('Erreur', 'Impossible de finaliser le paiement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{searchParams.placeName || 'Destination'}</Text>
                    <Text style={styles.headerSubtitle}>
                        {format(new Date(searchParams.checkin), 'EEE, dd/MM', { locale: fr })} | {totalGuests} {totalGuests > 1 ? 'Adultes' : 'Adulte'}{searchParams.occupancies?.[0]?.children?.length > 0 ? ` & ${searchParams.occupancies[0].children.length} enfants` : ''}
                    </Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="chevron-down" size={24} color="#E85D40" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Payment Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Paiements</Text>

                    <TouchableOpacity
                        style={styles.paymentCard}
                        onPress={() => {/* Show account selection modal */ }}
                    >
                        <View style={styles.paymentIconContainer}>
                            <Ionicons name="card-outline" size={24} color="#E85D40" />
                        </View>
                        <View style={styles.paymentInfo}>
                            <Text style={styles.paymentTitle}>Compte à débiter</Text>
                            <Text style={styles.paymentSubtitle}>
                                {selectedAccount ? `${bankingAccounts.length} comptes disponibles` : '2 comptes disponibles'}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Account Selection */}
                    {bankingAccounts.map((account) => (
                        <TouchableOpacity
                            key={account.id}
                            style={[
                                styles.accountCard,
                                selectedAccount === account.id && styles.accountCardSelected,
                            ]}
                            onPress={() => setSelectedAccount(account.id)}
                        >
                            <View style={styles.accountRadio}>
                                {selectedAccount === account.id && (
                                    <View style={styles.accountRadioSelected} />
                                )}
                            </View>
                            <View style={styles.accountInfo}>
                                <Text style={styles.accountName}>{account.name}</Text>
                                <Text style={styles.accountNumber}>•••• {account.id.slice(-4)}</Text>
                            </View>
                            <Text style={styles.accountBalance}>{account.balance}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Invoice Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Facture</Text>

                    <View style={styles.invoiceCard}>
                        <View style={styles.invoiceHeader}>
                            <Text style={styles.hotelName}>{selectedHotel?.name || 'Hôtel'}</Text>
                            <Text style={styles.invoiceAmount}>
                                {prebookData.totalAmount.toLocaleString('fr-MA')} DH
                            </Text>
                        </View>

                        <Text style={styles.invoiceDetails}>
                            {nights} Nuitées - {totalGuests} Personnes
                        </Text>
                        <Text style={styles.invoiceRef}>
                            Ref: {prebookData.simulationId?.slice(0, 10) || 'N/A'}
                        </Text>

                        <View style={styles.divider} />

                        <View style={styles.invoiceRow}>
                            <Text style={styles.invoiceLabel}>Frais de service</Text>
                            <Text style={styles.invoiceValue}>
                                {serviceFee.toFixed(2).replace('.', ',')} DH
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Terms Acceptance */}
                <TouchableOpacity
                    style={styles.termsContainer}
                    onPress={() => setAcceptedTerms(!acceptedTerms)}
                >
                    <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                        {acceptedTerms && <Ionicons name="checkmark" size={16} color="#FFF" />}
                    </View>
                    <Text style={styles.termsText}>
                        J'accepte les{' '}
                        <Text style={styles.termsLink}>Conditions d'utilisation</Text> du service
                    </Text>
                </TouchableOpacity>

                {/* Total */}
                <View style={styles.totalCard}>
                    <View>
                        <Text style={styles.totalLabel}>Total à payer:</Text>
                        <Text style={styles.totalNote}>*Frais de service inclus</Text>
                    </View>
                    <Text style={styles.totalAmount}>
                        {totalAmount.toLocaleString('fr-MA', { minimumFractionDigits: 2 }).replace('.', ',')} DH
                    </Text>
                </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.payButton, loading && styles.payButtonDisabled]}
                    onPress={handlePayment}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.payButtonText}>Payer</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 16,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    paymentIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FEF2F2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    paymentSubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    accountCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    accountCardSelected: {
        borderColor: '#E85D40',
        backgroundColor: '#FEF2F2',
    },
    accountRadio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    accountRadioSelected: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E85D40',
    },
    accountInfo: {
        flex: 1,
    },
    accountName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    accountNumber: {
        fontSize: 14,
        color: '#6B7280',
    },
    accountBalance: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    invoiceCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
    },
    invoiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    hotelName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        flex: 1,
    },
    invoiceAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    invoiceDetails: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    invoiceRef: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    invoiceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    invoiceLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    invoiceValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginHorizontal: 16,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: '#E85D40',
        borderColor: '#E85D40',
    },
    termsText: {
        fontSize: 14,
        color: '#1F2937',
        flex: 1,
    },
    termsLink: {
        color: '#E85D40',
        fontWeight: '600',
    },
    totalCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        padding: 16,
        margin: 16,
        borderRadius: 12,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    totalNote: {
        fontSize: 12,
        color: '#6B7280',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#E85D40',
    },
    payButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: '#E85D40',
        alignItems: 'center',
        justifyContent: 'center',
    },
    payButtonDisabled: {
        opacity: 0.6,
    },
    payButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
});
