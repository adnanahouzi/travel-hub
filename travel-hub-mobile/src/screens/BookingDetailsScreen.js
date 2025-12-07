import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    Dimensions,
    Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ApiService } from '../services/api.service';

const { width } = Dimensions.get('window');

export const BookingDetailsScreen = ({ route, navigation }) => {
    const { bookingId } = route.params;
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookingDetails();
    }, []);

    const fetchBookingDetails = async () => {
        try {
            const response = await ApiService.getBooking(bookingId);
            setBooking(response.data); // Assuming response structure matches BookResponseDto
        } catch (error) {
            console.error('Error fetching booking details:', error);
            Alert.alert('Erreur', 'Impossible de récupérer les détails de la réservation');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E85D40" />
            </View>
        );
    }

    if (!booking) {
        return (
            <View style={styles.errorContainer}>
                <Text>Aucune information trouvée pour cette réservation.</Text>
            </View>
        );
    }

    const room = booking.rooms && booking.rooms.length > 0 ? booking.rooms[0] : null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirmation</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hotel Image & Info */}
                <View style={styles.hotelCard}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/400x200' }} // Placeholder or real image if available
                        style={styles.hotelImage}
                    />
                    <View style={styles.hotelInfoOverlay}>
                        <Text style={styles.hotelName}>{booking.hotelName}</Text>
                        {/* Add stars if available */}
                    </View>
                </View>

                {/* Dates */}
                <View style={styles.section}>
                    <View style={styles.dateRow}>
                        <View style={styles.dateItem}>
                            <Ionicons name="time-outline" size={24} color="#6B7280" />
                            <View style={styles.dateTextContainer}>
                                <Text style={styles.dateLabel}>Arrivé</Text>
                                <Text style={styles.dateValue}>{booking.checkin}</Text>
                            </View>
                            <Text style={styles.timeValue}>14h00 - 00h00</Text>
                        </View>
                        <View style={styles.dateDivider} />
                        <View style={styles.dateItem}>
                            <Ionicons name="time-outline" size={24} color="#6B7280" />
                            <View style={styles.dateTextContainer}>
                                <Text style={styles.dateLabel}>Départ</Text>
                                <Text style={styles.dateValue}>{booking.checkout}</Text>
                            </View>
                            <Text style={styles.timeValue}>14h00 - 00h00</Text>
                        </View>
                    </View>
                </View>

                {/* Location */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Localisation</Text>
                    <View style={styles.mapPreview}>
                        {/* Placeholder for map */}
                        <Image
                            source={{ uri: 'https://via.placeholder.com/400x150' }}
                            style={styles.mapImage}
                        />
                        <View style={styles.mapMarker}>
                            <Image
                                source={{ uri: 'https://via.placeholder.com/40' }}
                                style={styles.markerImage}
                            />
                        </View>
                    </View>
                </View>

                {/* Rooms */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Chambres</Text>
                    <View style={styles.roomCard}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/80' }}
                            style={styles.roomImage}
                        />
                        <View style={styles.roomInfo}>
                            <Text style={styles.roomId}>ID : {booking.bookingId}</Text>
                            <Text style={styles.roomName}>{room ? room.roomName : 'Chambre Standard'}</Text>
                            <View style={styles.roomDetailsRow}>
                                <Ionicons name="bed-outline" size={16} color="#6B7280" />
                                <Text style={styles.roomDetailText}>2 personnes</Text>
                                <MaterialCommunityIcons name="floor-plan" size={16} color="#6B7280" style={{ marginLeft: 8 }} />
                                <Text style={styles.roomDetailText}>30 m²</Text>
                            </View>
                            <View style={styles.cancellationRow}>
                                <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
                                <Text style={styles.cancellationText}>Annulation gratuite avant le 01 Décembre</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Payments */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Paiements</Text>
                    <View style={styles.paymentCard}>
                        <View style={styles.paymentRow}>
                            <View style={styles.paymentIconContainer}>
                                <Ionicons name="star-outline" size={24} color="#6B7280" />
                            </View>
                            <View style={styles.paymentInfo}>
                                <Text style={styles.paymentLabel}>Points gagnés</Text>
                                <Text style={styles.paymentSubtext}>Aujourd'hui, 11h45</Text>
                            </View>
                            <View style={styles.pointsBadge}>
                                <Ionicons name="flash" size={16} color="#FFF" />
                                <Text style={styles.pointsValue}>{Math.round(booking.price * 0.1)}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.paymentRow}>
                            <View style={styles.paymentIconContainer}>
                                <Ionicons name="receipt-outline" size={24} color="#6B7280" />
                            </View>
                            <View style={styles.paymentInfo}>
                                <Text style={styles.paymentLabel}>Montant payé</Text>
                                <Text style={styles.paymentSubtext}>Aujourd'hui, 11h45</Text>
                            </View>
                            <Text style={styles.amountValue}>{booking.price} {booking.currency}</Text>
                        </View>
                    </View>
                </View>

                {/* Contact Property */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contacter la propriété</Text>
                    <TouchableOpacity style={styles.contactCard}>
                        <View style={styles.contactIconContainer}>
                            <Ionicons name="call-outline" size={24} color="#6B7280" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>Appeler</Text>
                            <Text style={styles.contactSubtext}>+212 6 00 000000</Text>
                        </View>
                        <Ionicons name="call-outline" size={24} color="#E85D40" />
                    </TouchableOpacity>
                </View>

                {/* Manage Reservation */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Gérer la réservation</Text>
                    <View style={styles.manageCard}>
                        <TouchableOpacity style={styles.manageRow}>
                            <View style={styles.manageIconContainer}>
                                <Ionicons name="calendar-outline" size={24} color="#6B7280" />
                            </View>
                            <Text style={styles.manageLabel}>Ajouter au calendrier</Text>
                            <Ionicons name="chevron-forward" size={24} color="#E85D40" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.manageRow}>
                            <View style={styles.manageIconContainer}>
                                <Ionicons name="calendar-number-outline" size={24} color="#6B7280" />
                            </View>
                            <Text style={styles.manageLabel}>Changer les dates</Text>
                            <Ionicons name="chevron-forward" size={24} color="#E85D40" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.manageRow}>
                            <View style={styles.manageIconContainer}>
                                <Ionicons name="close-circle-outline" size={24} color="#6B7280" />
                            </View>
                            <Text style={styles.manageLabel}>Annuler la réservation</Text>
                            <Ionicons name="chevron-forward" size={24} color="#E85D40" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.manageRow}>
                            <View style={styles.manageIconContainer}>
                                <Ionicons name="ellipsis-horizontal" size={24} color="#6B7280" />
                            </View>
                            <Text style={styles.manageLabel}>Autre</Text>
                            <Ionicons name="chevron-forward" size={24} color="#E85D40" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Property Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Détails de la propriété</Text>
                    <View style={styles.manageCard}>
                        <TouchableOpacity style={styles.manageRow}>
                            <View style={styles.manageIconContainer}>
                                <Ionicons name="business-outline" size={24} color="#6B7280" />
                            </View>
                            <Text style={styles.manageLabel}>Voir la propriété</Text>
                            <Ionicons name="chevron-forward" size={24} color="#E85D40" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.manageRow}>
                            <View style={styles.manageIconContainer}>
                                <Ionicons name="document-text-outline" size={24} color="#6B7280" />
                            </View>
                            <Text style={styles.manageLabel}>Politique de l'établissement</Text>
                            <Ionicons name="chevron-forward" size={24} color="#E85D40" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.manageRow}>
                            <View style={styles.manageIconContainer}>
                                <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
                            </View>
                            <Text style={styles.manageLabel}>Informations complémentaires</Text>
                            <Ionicons name="chevron-forward" size={24} color="#E85D40" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom Buttons */}
                <View style={styles.bottomButtons}>
                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Mes réservations</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>Télécharger le reçu</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFF',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    hotelCard: {
        margin: 16,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    hotelImage: {
        width: '100%',
        height: 150,
    },
    hotelInfoOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    hotelName: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    dateRow: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    dateItem: {
        flex: 1,
        alignItems: 'flex-start',
    },
    dateTextContainer: {
        marginTop: 8,
        marginBottom: 4,
    },
    dateLabel: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    dateValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    timeValue: {
        fontSize: 12,
        color: '#6B7280',
    },
    dateDivider: {
        width: 1,
        height: '80%',
        backgroundColor: '#E5E7EB',
        marginHorizontal: 16,
    },
    mapPreview: {
        height: 150,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    mapMarker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -20,
        marginTop: -20,
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFF',
        overflow: 'hidden',
    },
    markerImage: {
        width: '100%',
        height: '100%',
    },
    roomCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
    },
    roomImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 16,
    },
    roomInfo: {
        flex: 1,
    },
    roomId: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    roomName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    roomDetailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    roomDetailText: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 4,
    },
    cancellationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cancellationText: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 4,
        flex: 1,
    },
    paymentCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    paymentIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    paymentSubtext: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    pointsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F59E0B',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    pointsValue: {
        color: '#FFF',
        fontWeight: '700',
        marginLeft: 4,
    },
    amountValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    contactCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    contactSubtext: {
        fontSize: 14,
        color: '#6B7280',
    },
    manageCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingHorizontal: 16,
    },
    manageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    manageIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    manageLabel: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    bottomButtons: {
        padding: 16,
        alignItems: 'center',
    },
    primaryButton: {
        width: '100%',
        backgroundColor: '#E85D40',
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 16,
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButton: {
        padding: 8,
    },
    secondaryButtonText: {
        color: '#E85D40',
        fontSize: 16,
        fontWeight: '600',
    },
});
