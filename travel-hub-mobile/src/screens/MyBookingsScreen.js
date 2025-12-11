import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    ImageBackground,
    Platform,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ApiService } from '../services/api.service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const MyBookingsScreen = ({ navigation }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('reservations'); // 'discover', 'reservations', 'favorites'
    const [userPoints, setUserPoints] = useState(600); // Mock points - replace with actual user data

    useEffect(() => {
        if (activeTab === 'reservations') {
            loadBookings();
        }
    }, [activeTab]);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const response = await ApiService.listBookings();
            setBookings(response.data || []);
        } catch (error) {
            console.error('Failed to load bookings:', error);
            Alert.alert('Erreur', 'Impossible de charger les réservations');
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        switch (status?.toUpperCase()) {

            case 'COMPLETED':
                return { label: 'Complété', color: '#10B981', bgColor: '#ECFDF5' };

            case 'CONFIRMED':
                return { label: 'En cours', color: '#F59E0B', bgColor: '#FEF3C7' };
            case 'CANCELLED_WITH_CHARGES':
            case 'CANCELLED':
                return { label: 'Annulé', color: '#EF4444', bgColor: '#FEE2E2' };
            default:
                return { label: status || 'En cours', color: '#6B7280', bgColor: '#F3F4F6' };
        }
    };

    const formatDateRange = (checkin, checkout) => {
        if (!checkin || !checkout) return '';
        try {
            const checkinDate = new Date(checkin);
            const checkoutDate = new Date(checkout);
            const checkinDay = format(checkinDate, 'dd', { locale: fr });
            const checkoutFormatted = format(checkoutDate, 'dd MMM', { locale: fr });
            return `${checkinDay} - ${checkoutFormatted}`;
        } catch (e) {
            return '';
        }
    };

    const formatPrice = (price, currency) => {
        if (!price) return '';
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return `${numPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency || 'DH'}`;
    };

    const handleBookingPress = (booking) => {
        // Use clientReference which is the database ID, not bookingId which is the LiteAPI ID
        const bookingId = booking.clientReference || booking.id;
        if (bookingId) {
            navigation.navigate('BookingDetails', { id: bookingId });
        } else {
            console.error('No booking ID found:', booking);
            Alert.alert('Erreur', 'Impossible d\'accéder aux détails de la réservation');
        }
    };

    const handleBookAgain = (booking) => {
        // Navigate to hotel details or search with same criteria
        Alert.alert('Réserver à nouveau', 'Fonctionnalité à venir');
    };

    const handleDownloadInvoice = (booking) => {
        Alert.alert('Télécharger la facture', 'Fonctionnalité à venir');
    };

    const renderBookingCard = ({ item, index }) => {
        const statusConfig = getStatusConfig(item.status);
        const dateRange = formatDateRange(item.checkin, item.checkout);
        const formattedPrice = formatPrice(item.price, item.currency);
        // Use hotel images from API response
        const hotelImage = item.hotel?.thumbnail || item.hotel?.mainPhoto || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';

        const showActions = statusConfig.label === 'Complété' || statusConfig.label === 'Annulé';

        return (
            <>
                <View style={styles.bookingCard}>
                    <TouchableOpacity
                        style={styles.bookingCardContent}
                        onPress={() => handleBookingPress(item)}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={{ uri: hotelImage }}
                            style={styles.hotelImage}
                            resizeMode="cover"
                        />

                        <View style={styles.bookingInfo}>
                            <View style={styles.bookingHeader}>
                                <Text style={styles.hotelName} numberOfLines={1}>
                                    {item.hotelName || item.hotel?.name || 'Hôtel'}
                                </Text>
                                <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                                    <Text style={[styles.statusText, { color: statusConfig.color }]}>
                                        {statusConfig.label}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.bookingDetails}>
                                <View style={styles.dateRow}>
                                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                                    <Text style={styles.dateText}>{dateRange}</Text>
                                </View>
                                <Text style={styles.priceText}>{formattedPrice}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuButton}
                        onPress={() => {
                            // Menu functionality can be added here
                        }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="ellipsis-vertical" size={20} color="#E85D40" />
                    </TouchableOpacity>
                </View>

                {showActions && (
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={styles.actionRow}
                            onPress={() => handleBookAgain(item)}
                        >
                            <View style={styles.actionLeft}>
                                <View style={styles.actionIconContainer}>
                                    <Ionicons name="refresh-outline" size={20} color="#6B7280" />
                                </View>
                                <Text style={styles.actionText}>Réservez à nouveau</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#E85D40" />
                        </TouchableOpacity>

                        {statusConfig.label === 'Complété' && (
                            <TouchableOpacity
                                style={styles.actionRow}
                                onPress={() => handleDownloadInvoice(item)}
                            >
                                <View style={styles.actionLeft}>
                                    <View style={styles.actionIconContainer}>
                                        <Ionicons name="receipt-outline" size={20} color="#6B7280" />
                                    </View>
                                    <Text style={styles.actionText}>Télécharger la facture</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#E85D40" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Aucune réservation</Text>
            <Text style={styles.emptySubtitle}>
                Vos réservations apparaîtront ici
            </Text>
            <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('Search')}
            >
                <Text style={styles.emptyButtonText}>Rechercher un hôtel</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header with background image */}
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800' }}
                style={styles.headerBackground}
                imageStyle={styles.headerImage}
            >
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>

                        <View style={styles.pointsBadge}>
                            <Ionicons name="flash" size={16} color="#F59E0B" />
                            <Text style={styles.pointsText}>{userPoints}</Text>
                        </View>
                    </View>

                    <View style={styles.headerTitle}>
                        <Text style={styles.title}>Géréz</Text>
                        <Text style={styles.title}>vos réservations</Text>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                activeTab === 'discover' && styles.tabActive,
                            ]}
                            onPress={() => navigation.navigate('Search')}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === 'discover' && styles.tabTextActive,
                                ]}
                            >
                                Découvrir
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.tab,
                                activeTab === 'reservations' && styles.tabActive,
                            ]}
                            onPress={() => setActiveTab('reservations')}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === 'reservations' && styles.tabTextActive,
                                ]}
                            >
                                Mes réservations
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.tab,
                                activeTab === 'favorites' && styles.tabActive,
                            ]}
                            onPress={() => setActiveTab('favorites')}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === 'favorites' && styles.tabTextActive,
                                ]}
                            >
                                Mes favoris
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ImageBackground>

            {/* Content */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#E85D40" />
                </View>
            ) : (
                <FlatList
                    data={bookings}
                    renderItem={renderBookingCard}
                    keyExtractor={(item, index) => item.bookingId || `booking-${index}`}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    headerBackground: {
        width: '100%',
        paddingBottom: 20,
    },
    headerImage: {
        opacity: 0.8,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 0 : 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pointsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    pointsText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    headerTitle: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 8,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    tabActive: {
        backgroundColor: '#E85D40',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    tabTextActive: {
        color: '#FFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    bookingCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    bookingCardContent: {
        flexDirection: 'row',
        flex: 1,
        padding: 12,
    },
    hotelImage: {
        width: 64,
        height: 64,
        borderRadius: 12,
    },
    bookingInfo: {
        flex: 1,
        marginLeft: 12,
    },
    bookingHeader: {
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
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    bookingDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 13,
        color: '#6B7280',
    },
    priceText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
    },
    menuButton: {
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 12,
    },
    actionsContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    actionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    actionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    actionText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1F2937',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
    },
    emptyButton: {
        marginTop: 24,
        backgroundColor: '#E85D40',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    emptyButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFF',
    },
});
