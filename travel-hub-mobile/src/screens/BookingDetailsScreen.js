import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    Platform,
    Linking,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ApiService } from '../services/api.service';

const { width } = Dimensions.get('window');

export const BookingDetailsScreen = ({ route, navigation }) => {
    // Support both 'id' (from MyBookings) and 'bookingId' (from BookingSuccess)
    const bookingId = route.params?.id || route.params?.bookingId; // Database ID (clientReference)
    const [booking, setBooking] = useState(null);
    const [hotelDetails, setHotelDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [bookingId]);

    const fetchData = async () => {
        if (!bookingId) {
            Alert.alert('Erreur', 'ID de réservation manquant');
            setLoading(false);
            return;
        }
        try {
            // Fetch booking details (now includes hotel information)
            const bookingResponse = await ApiService.getBooking(bookingId);
            const bookingData = bookingResponse.data;
            setBooking(bookingData);

            // Hotel details are now included in the booking response
            if (bookingData.hotel) {
                setHotelDetails(bookingData.hotel);
            }
        } catch (error) {
            console.error('Error fetching details:', error);
            Alert.alert('Erreur', 'Impossible de récupérer les détails');
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
                <Text>Aucune information trouvée.</Text>
            </View>
        );
    }

    const room = booking.rooms && booking.rooms.length > 0 ? booking.rooms[0] : null;
    // Use hotel image from booking response (same priority as MyBookingsScreen)
    const hotelImage = hotelDetails?.thumbnail || hotelDetails?.mainPhoto ||
        (hotelDetails?.images && hotelDetails.images.length > 0 ? hotelDetails.images[0].url : null) ||
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

    // Format dates in French: "07 Décembre"
    const formatDateFrench = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return format(date, 'dd MMMM', { locale: fr });
        } catch (e) {
            return dateStr;
        }
    };

    // Format check-in/check-out times: "14h00 - 00h00"
    const formatTimeRange = (timeFrom, timeTo) => {
        if (!timeFrom && !timeTo) return '14h00 - 00h00';
        const from = timeFrom || '14h00';
        const to = timeTo || '00h00';
        return `${from} - ${to}`;
    };

    const checkinDate = formatDateFrench(booking.checkin);
    const checkoutDate = formatDateFrench(booking.checkout);
    const checkinTime = formatTimeRange(
        hotelDetails?.checkinCheckoutTimes?.checkinFrom,
        hotelDetails?.checkinCheckoutTimes?.checkinTo
    );
    // Use same format for checkout: "14h00 - 00h00"
    const checkoutTime = formatTimeRange(
        hotelDetails?.checkinCheckoutTimes?.checkoutFrom,
        hotelDetails?.checkinCheckoutTimes?.checkoutTo
    ) || '14h00 - 00h00';

    // Format price: "4.359,00 DH"
    const formatPrice = (price, currency) => {
        if (!price) return `0,00 ${currency || 'DH'}`;
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return `${numPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency || 'DH'}`;
    };

    const formattedPrice = formatPrice(booking.price, booking.currency);
    const points = Math.round(booking.price * 0.1);

    // Format date for payment: "Aujourd'hui, 11h45" or "07 Décembre, 11h45"
    const formatPaymentDate = () => {
        if (!booking.createdAt) return 'Date non disponible';
        try {
            const date = new Date(booking.createdAt);
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();
            const timeStr = format(date, 'HH:mm', { locale: fr });
            if (isToday) {
                return `Aujourd'hui, ${timeStr}`;
            }
            return `${format(date, 'dd MMMM', { locale: fr })}, ${timeStr}`;
        } catch (e) {
            return 'Date non disponible';
        }
    };

    // Build full address
    const fullAddress = [
        hotelDetails?.address,
        hotelDetails?.city,
        hotelDetails?.zip
    ].filter(Boolean).join(', ');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hotel Image & Name Overlay */}
                <View style={styles.hotelImageContainer}>
                    <Image
                        source={{ uri: hotelImage }}
                        style={styles.hotelImage}
                        resizeMode="cover"
                    />
                    <View style={styles.hotelNameOverlay}>
                        <Text style={styles.hotelName}>{booking.hotelName}</Text>
                    </View>
                </View>

                {/* Check-in/Check-out Section */}
                <View style={styles.section}>
                    <View style={styles.dateCard}>
                        <View style={styles.dateItem}>
                            <View style={styles.dateIconContainer}>
                                <Ionicons name="time-outline" size={20} color="#6B7280" />
                            </View>
                            <View style={styles.dateContent}>
                                <Text style={styles.dateLabel}>Check in</Text>
                                <Text style={styles.dateValue}>{checkinDate}</Text>
                            </View>
                            <Text style={styles.timeRange}>{checkinTime}</Text>
                        </View>
                        <View style={styles.dateDivider} />
                        <View style={styles.dateItem}>
                            <View style={styles.dateIconContainer}>
                                <Ionicons name="time-outline" size={20} color="#6B7280" />
                            </View>
                            <View style={styles.dateContent}>
                                <Text style={styles.dateLabel}>Check out</Text>
                                <Text style={styles.dateValue}>{checkoutDate}</Text>
                            </View>
                            <Text style={styles.timeRange}>{checkoutTime}</Text>
                        </View>
                    </View>
                </View>

                {/* Location Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Localisation</Text>
                    <View style={styles.mapContainer}>
                        {hotelDetails?.location && (
                            <MapView
                                key={`map-${hotelDetails.location.latitude}-${hotelDetails.location.longitude}`}
                                provider={PROVIDER_GOOGLE}
                                style={styles.map}
                                region={{
                                    latitude: parseFloat(hotelDetails.location.latitude),
                                    longitude: parseFloat(hotelDetails.location.longitude),
                                    latitudeDelta: 0.02,
                                    longitudeDelta: 0.02,
                                }}
                                scrollEnabled={false}
                                zoomEnabled={false}
                                loadingEnabled={true}
                                cacheEnabled={true}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: parseFloat(hotelDetails.location.latitude),
                                        longitude: parseFloat(hotelDetails.location.longitude),
                                    }}
                                >
                                    <Ionicons name="location" size={32} color="#EF4444" />
                                </Marker>
                            </MapView>
                        )}
                        {/* Address overlay on map */}
                        {fullAddress && (
                            <View style={styles.mapAddressOverlay}>
                                <Ionicons name="location" size={20} color="#EF4444" style={styles.mapPinIcon} />
                                <View style={styles.mapAddressTextContainer}>
                                    <Text style={styles.mapAddressText}>{fullAddress}</Text>
                                </View>
                            </View>
                        )}
                        <TouchableOpacity
                            style={styles.expandMapButton}
                            onPress={() => {
                                if (hotelDetails?.location?.latitude && hotelDetails?.location?.longitude) {
                                    const lat = parseFloat(hotelDetails.location.latitude);
                                    const lon = parseFloat(hotelDetails.location.longitude);
                                    const url = Platform.OS === 'ios'
                                        ? `maps:0,0?q=${lat},${lon}`
                                        : `geo:0,0?q=${lat},${lon}`;
                                    Linking.openURL(url);
                                }
                            }}
                        >
                            <Ionicons name="resize-outline" size={20} color="#1F2937" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Rooms Section */}
                {room && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Chambres</Text>
                        <View style={styles.roomCard}>
                            <Image
                                source={{ uri: hotelImage }}
                                style={styles.roomImage}
                                resizeMode="cover"
                            />
                            <View style={styles.roomInfo}>
                                <Text style={styles.roomId}>ID : {room.roomId || '946169146'}</Text>
                                <Text style={styles.roomName}>
                                    {room.roomName || '1 x Chambre Supérieure, 1 grand lit'}
                                </Text>
                                <View style={styles.roomDetailsRow}>
                                    <Ionicons name="people-outline" size={16} color="#6B7280" />
                                    <Text style={styles.roomDetailText}>2 personnes</Text>
                                </View>
                                <View style={styles.roomDetailsRow}>
                                    <Ionicons name="square-outline" size={16} color="#6B7280" />
                                    <Text style={styles.roomDetailText}>30 m²</Text>
                                </View>
                                <View style={styles.cancellationRow}>
                                    <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
                                    <Text style={styles.cancellationText}>
                                        Annulation gratuite avant le {formatDateFrench(booking.checkin)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* Payments Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Paiements</Text>
                    <View style={styles.paymentCard}>
                        <View style={styles.paymentRow}>
                            <View style={styles.paymentIconContainer}>
                                <Ionicons name="star-outline" size={24} color="#6B7280" />
                            </View>
                            <View style={styles.paymentInfo}>
                                <Text style={styles.paymentLabel}>Points gagnés</Text>
                                <Text style={styles.paymentSubtext}>
                                    La mise à jour de votre solde de points s'effectue après la confirmation définitive.
                                </Text>
                            </View>
                            <View style={styles.pointsBadge}>
                                <Ionicons name="flash" size={16} color="#FFF" />
                                <Text style={styles.pointsValue}>{points}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.paymentRow}>
                            <View style={styles.paymentIconContainer}>
                                <Ionicons name="receipt-outline" size={24} color="#6B7280" />
                            </View>
                            <View style={styles.paymentInfo}>
                                <Text style={styles.paymentLabel}>Montant payé</Text>
                                <Text style={styles.paymentSubtext}>{formatPaymentDate()}</Text>
                            </View>
                            <Text style={styles.amountValue}>{formattedPrice}</Text>
                        </View>
                    </View>
                </View>

                {/* Contact Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contacter l'établissement</Text>
                    <TouchableOpacity
                        style={styles.contactCard}
                        onPress={() => {
                            const phoneNumber = hotelDetails?.phone || '+212 6 00 000000';
                            const cleanedPhone = phoneNumber.replace(/[^\d+]/g, '');
                            Linking.openURL(`tel:${cleanedPhone}`);
                        }}
                    >
                        <View style={styles.contactIconContainer}>
                            <Ionicons name="call-outline" size={24} color="#6B7280" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>Appeler le Centre de Relation Client, disponible 24/7</Text>
                            <Text style={styles.contactSubtext}>
                                {hotelDetails?.phone || '+212 6 00 000000'}
                            </Text>
                        </View>
                        <Ionicons name="call-outline" size={24} color="#E85D40" />
                    </TouchableOpacity>
                </View>

                {/* Manage Reservation Section */}
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

                {/* Property Details Section */}
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
                    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('MyBookings')}>
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
    // Hotel Image Section
    hotelImageContainer: {
        width: '100%',
        height: 200,
        position: 'relative',
    },
    hotelImage: {
        width: '100%',
        height: '100%',
    },
    hotelNameOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        padding: 16,
    },
    hotelName: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '700',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
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
    // Date Section
    dateCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
    },
    dateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    dateIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateContent: {
        flex: 1,
        marginLeft: 12,
    },
    dateLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
        textTransform: 'none',
    },
    dateValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    timeRange: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    dateDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E5E7EB',
        marginLeft: 52,
        marginVertical: 8,
        borderStyle: 'dashed',
        borderWidth: 1,
    },
    // Map Section
    mapContainer: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#E5E7EB',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    mapAddressOverlay: {
        position: 'absolute',
        left: 12,
        top: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        maxWidth: width - 100,
    },
    mapPinIcon: {
        marginRight: 8,
    },
    mapAddressTextContainer: {
        flex: 1,
    },
    mapAddressText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '500',
    },
    expandMapButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: '#FFF',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    // Room Section
    roomCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
    },
    roomImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        marginRight: 16,
    },
    roomInfo: {
        flex: 1,
    },
    roomId: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 6,
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
        marginBottom: 6,
    },
    roomDetailText: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 8,
    },
    cancellationRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 8,
    },
    cancellationText: {
        fontSize: 13,
        color: '#6B7280',
        marginLeft: 8,
        flex: 1,
    },
    // Payment Section
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
        marginBottom: 4,
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
        borderRadius: 20,
    },
    pointsValue: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
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
    // Contact Section
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
        marginBottom: 4,
    },
    contactSubtext: {
        fontSize: 14,
        color: '#6B7280',
    },
    // Manage Section
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
    // Bottom Buttons
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
