import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    Dimensions,
    ImageBackground
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ApiService } from '../services/api.service';

const { width } = Dimensions.get('window');

export const MyBookingsScreen = ({ navigation }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ONGOING'); // Start with Mes réservations active

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await ApiService.listBookings();
            console.log('Full response:', response);
            console.log('response.data:', response.data);

            // Data is directly in response.data, not response.data.data
            if (response.data && Array.isArray(response.data)) {
                console.log('Setting bookings:', response.data);
                setBookings(response.data);
            } else {
                console.log('No data found or not an array');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            console.error('Error details:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED': return '#D97706'; // Gold/Yellow for En cours
            case 'CANCELLED': return '#EF4444'; // Red
            case 'COMPLETED': return '#10B981'; // Green/Teal
            default: return '#6B7280'; // Grey
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'En cours';
            case 'CANCELLED': return 'Annulé';
            case 'CANCELLED_WITH_CHARGES': return 'Annulé avec frais';
            case 'COMPLETED': return 'Complété';
            default: return status;
        }
    };

    const renderBookingItem = ({ item }) => {
        // Use placeholder image for now since BookingListResponse doesn't include hotel images
        const hotelImage = 'https://via.placeholder.com/80';
        const statusColor = getStatusColor(item.status);
        const statusLabel = getStatusLabel(item.status);

        // Format date to show only day-month
        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const [year, month, day] = dateStr.split('-');
            const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
            const monthIndex = parseInt(month, 10) - 1;
            return `${day} ${months[monthIndex] || month}`;
        };

        const formattedCheckin = formatDate(item.checkin);
        const formattedCheckout = formatDate(item.checkout);

        return (
            <TouchableOpacity
                style={styles.bookingCard}
                onPress={() => navigation.navigate('BookingDetails', { bookingId: item.bookingId })}
                activeOpacity={0.9}
            >
                {/* Hotel Info Section */}
                <View style={styles.bookingHeader}>
                    <Image source={{ uri: hotelImage }} style={styles.hotelImageSmall} />
                    <View style={styles.bookingMainInfo}>
                        <View style={styles.topRow}>
                            <View style={styles.nameAndStatus}>
                                <Text style={styles.hotelNameText} numberOfLines={1}>{item.hotel?.name || 'Hotel Name'}</Text>
                                <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
                            </View>
                            <TouchableOpacity style={styles.menuButton} onPress={(e) => { e.stopPropagation(); }}>
                                <Ionicons name="ellipsis-vertical" size={20} color="#E85D40" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.detailsRow}>
                            <View style={styles.dateContainer}>
                                <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                                <Text style={styles.dateText}>{formattedCheckin} - {formattedCheckout}</Text>
                            </View>
                            <Text style={styles.priceText}>{item.price} {item.currency}</Text>
                        </View>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.cardDivider} />

                {/* Action Buttons */}
                {/* Download Invoice Button - Always visible or based on status */}
                <TouchableOpacity
                    style={styles.cardActionRow}
                    onPress={(e) => {
                        e.stopPropagation();
                        // TODO: Implement download invoice
                    }}
                >
                    <View style={[styles.actionIcon, { backgroundColor: '#E0E7FF' }]}>
                        <MaterialCommunityIcons name="file-document-outline" size={20} color="#4F46E5" />
                    </View>
                    <Text style={styles.actionLabel}>Telecharger la facture</Text>
                    <Ionicons name="chevron-forward" size={20} color="#E85D40" />
                </TouchableOpacity>

                {/* Re-book Button - Only for Completed or Cancelled */}
                {(item.status === 'COMPLETED' || item.status === 'CANCELLED' || item.status === 'CANCELLED_WITH_CHARGES') && (
                    <>
                        <View style={styles.cardDivider} />
                        <TouchableOpacity
                            style={styles.cardActionRow}
                            onPress={(e) => {
                                e.stopPropagation();
                                if (item.hotel?.hotelId) {
                                    navigation.navigate('HotelDetails', { hotelId: item.hotel.hotelId });
                                }
                            }}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#F3F4F6' }]}>
                                <Ionicons name="refresh" size={20} color="#6B7280" />
                            </View>
                            <Text style={styles.actionLabel}>Réservez à nouveau</Text>
                            <Ionicons name="chevron-forward" size={20} color="#E85D40" />
                        </TouchableOpacity>
                    </>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Background Image */}
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' }}
                style={styles.header}
                imageStyle={{ opacity: 0.4 }}
            >
                <View style={styles.headerOverlay}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>

                    {/* Points Badge */}
                    <View style={styles.pointsBadge}>
                        <Ionicons name="star" size={16} color="#FFA500" />
                        <Text style={styles.pointsText}>600</Text>
                    </View>

                    <Text style={styles.headerTitle}>Gérez{'\n'}vos réservations</Text>
                </View>
            </ImageBackground>

            {/* Content Area */}
            <View style={styles.contentContainer}>
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, filter === 'ALL' && styles.activeTab]}
                        onPress={() => {
                            setFilter('ALL');
                            navigation.navigate('Search');
                        }}
                    >
                        <Text style={[styles.tabText, filter === 'ALL' && styles.activeTabText]}>Découvrir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, filter === 'ONGOING' && styles.activeTab]}
                        onPress={() => setFilter('ONGOING')}
                    >
                        <Text style={[styles.tabText, filter === 'ONGOING' && styles.activeTabText]}>Mes réservations</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, filter === 'FAVORITES' && styles.activeTab]}
                        onPress={() => setFilter('FAVORITES')}
                    >
                        <Text style={[styles.tabText, filter === 'FAVORITES' && styles.activeTabText]}>Mes favoris</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#E85D40" />
                    </View>
                ) : (
                    <FlatList
                        data={bookings}
                        renderItem={renderBookingItem}
                        keyExtractor={(item) => item.bookingId}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        height: 200,
        justifyContent: 'center',
    },
    headerOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        padding: 8,
    },
    pointsBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        zIndex: 10,
    },
    pointsText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 4,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 36,
    },
    contentContainer: {
        flex: 1,
        marginTop: -30,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: 'transparent',
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 20,
        marginHorizontal: 4,
        minWidth: 80,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#E85D40',
    },
    tabText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 13,
    },
    activeTabText: {
        color: '#FFF',
    },
    listContent: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Booking Card Styles
    bookingCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    bookingHeader: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'flex-start',
    },
    hotelImageSmall: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#E5E7EB',
    },
    bookingMainInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    nameAndStatus: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginRight: 8,
    },
    hotelNameText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginRight: 8,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 13,
        color: '#6B7280',
        marginLeft: 4,
        fontWeight: '500',
    },
    priceText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    menuButton: {
        padding: 4,
        marginTop: -4,
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 16,
    },
    cardActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingVertical: 14,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    actionLabel: {
        flex: 1,
        fontSize: 15,
        color: '#374151',
        fontWeight: '500',
    },
});
