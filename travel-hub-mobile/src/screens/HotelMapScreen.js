import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image,
    Dimensions,
    ScrollView,
    Animated,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useBooking } from '../context/BookingContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const { width, height } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = 280;

export const HotelMapScreen = ({ navigation }) => {
    const { searchResults, searchParams } = useBooking();
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [activeFilters, setActiveFilters] = useState([]);
    const mapRef = useRef(null);
    const bottomSheetAnim = useRef(new Animated.Value(0)).current;

    // Calculate initial region from first hotel
    const initialRegion = searchResults.length > 0 && searchResults[0].location
        ? {
            latitude: parseFloat(searchResults[0].location.latitude) || 33.5731,
            longitude: parseFloat(searchResults[0].location.longitude) || -7.5898,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
        }
        : {
            latitude: 33.5731,
            longitude: -7.5898,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
        };

    useEffect(() => {
        if (selectedHotel) {
            // Animate bottom sheet up
            Animated.spring(bottomSheetAnim, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        } else {
            // Animate bottom sheet down
            Animated.spring(bottomSheetAnim, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }
    }, [selectedHotel]);

    const handleMarkerPress = (hotel) => {
        setSelectedHotel(hotel);
        if (hotel.location) {
            mapRef.current?.animateToRegion({
                latitude: parseFloat(hotel.location.latitude),
                longitude: parseFloat(hotel.location.longitude),
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 500);
        }
    };

    const handleHotelPress = () => {
        if (selectedHotel) {
            navigation.navigate('HotelDetails');
        }
    };

    const formatSearchCriteria = () => {
        const { checkin, checkout, occupancies } = searchParams;
        let criteriaText = '';

        if (checkin && checkout) {
            try {
                const checkinDate = new Date(checkin);
                const checkoutDate = new Date(checkout);
                criteriaText = `${format(checkinDate, 'dd', { locale: fr })} - ${format(checkoutDate, 'dd MMMM', { locale: fr })}`;
            } catch (e) {
                criteriaText = 'Dates non spécifiées';
            }
        }

        if (occupancies && occupancies.length > 0) {
            const adults = occupancies.reduce((sum, occ) => sum + (occ.adults || 0), 0);
            criteriaText += ` • ${adults} Adulte${adults > 1 ? 's' : ''}`;
        }

        return criteriaText;
    };

    const toggleFilter = (filter) => {
        setActiveFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    const filteredHotels = searchResults
        .filter(hotel => hotel.location)
        .slice(0, 3); // Display only first 3 hotels on map

    const bottomSheetTranslateY = bottomSheetAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [BOTTOM_SHEET_HEIGHT, 0],
    });

    return (
        <View style={styles.container}>
            {/* Map */}
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
                onPress={() => setSelectedHotel(null)}
            >
                {filteredHotels.map((hotel) => {
                    const firstRoomType = hotel.roomTypes?.[0];
                    // Use offerRetailRate as promotional price
                    const totalPrice = firstRoomType?.offerRetailRate?.amount || 0;
                    const currency = firstRoomType?.offerRetailRate?.currency || 'DH';
                    const isSelected = selectedHotel?.hotelId === hotel.hotelId;

                    return (
                        <Marker
                            key={hotel.hotelId}
                            coordinate={{
                                latitude: parseFloat(hotel.location.latitude),
                                longitude: parseFloat(hotel.location.longitude),
                            }}
                            onPress={() => handleMarkerPress(hotel)}
                        >
                            <View style={[
                                styles.markerContainer,
                                isSelected && styles.markerContainerSelected
                            ]}>
                                <Image
                                    source={{ uri: hotel.thumbnail || hotel.mainPhoto || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' }}
                                    style={styles.markerImage}
                                />
                                <View style={[
                                    styles.priceBubble,
                                    isSelected && styles.priceBubbleSelected
                                ]}>
                                    <Text style={[
                                        styles.priceText,
                                        isSelected && styles.priceTextSelected
                                    ]}>
                                        {totalPrice.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {currency}
                                    </Text>
                                </View>
                            </View>
                        </Marker>
                    );
                })}
            </MapView>

            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>

                <View style={styles.searchInfo}>
                    <Text style={styles.locationText} numberOfLines={1}>
                        {searchParams.placeName || 'Résultats'}
                    </Text>
                    <Text style={styles.criteriaText} numberOfLines={1}>
                        {formatSearchCriteria()}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="create-outline" size={20} color="#E85D40" />
                </TouchableOpacity>
            </View>

            {/* Filter Chips */}
            <View style={styles.filtersContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContent}
                >
                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            activeFilters.includes('breakfast') && styles.filterChipActive
                        ]}
                        onPress={() => toggleFilter('breakfast')}
                    >
                        <Text style={[
                            styles.filterChipText,
                            activeFilters.includes('breakfast') && styles.filterChipTextActive
                        ]}>
                            Petit-déjeuner offert
                        </Text>
                        {activeFilters.includes('breakfast') && (
                            <Ionicons name="close-circle" size={16} color="#FFF" style={{ marginLeft: 4 }} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            activeFilters.includes('wifi') && styles.filterChipActive
                        ]}
                        onPress={() => toggleFilter('wifi')}
                    >
                        <Text style={[
                            styles.filterChipText,
                            activeFilters.includes('wifi') && styles.filterChipTextActive
                        ]}>
                            Wifi gratuit
                        </Text>
                        {activeFilters.includes('wifi') && (
                            <Ionicons name="close-circle" size={16} color="#FFF" style={{ marginLeft: 4 }} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            activeFilters.includes('cancellation') && styles.filterChipActive
                        ]}
                        onPress={() => toggleFilter('cancellation')}
                    >
                        <Text style={[
                            styles.filterChipText,
                            activeFilters.includes('cancellation') && styles.filterChipTextActive
                        ]}>
                            Aucun paiement anticipé
                        </Text>
                        {activeFilters.includes('cancellation') && (
                            <Ionicons name="close-circle" size={16} color="#FFF" style={{ marginLeft: 4 }} />
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* List View Button */}
            <TouchableOpacity
                style={styles.listViewButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="list" size={20} color="#1F2937" />
            </TouchableOpacity>

            {/* Center Map Button */}
            <TouchableOpacity
                style={styles.centerButton}
                onPress={() => {
                    if (filteredHotels.length > 0) {
                        mapRef.current?.animateToRegion(initialRegion, 500);
                    }
                }}
            >
                <Ionicons name="locate" size={24} color="#1F2937" />
            </TouchableOpacity>

            {/* Bottom Sheet */}
            {selectedHotel && (
                <Animated.View
                    style={[
                        styles.bottomSheet,
                        { transform: [{ translateY: bottomSheetTranslateY }] }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.bottomSheetContent}
                        onPress={handleHotelPress}
                        activeOpacity={0.95}
                    >
                        {/* Drag Handle */}
                        <View style={styles.dragHandle} />

                        <View style={styles.hotelCard}>
                            <Image
                                source={{ uri: selectedHotel.thumbnail || selectedHotel.mainPhoto || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' }}
                                style={styles.hotelImage}
                            />

                            <View style={styles.hotelInfo}>
                                <View style={styles.hotelTitleRow}>
                                    <Text style={styles.hotelName} numberOfLines={1}>
                                        {selectedHotel.name}
                                    </Text>
                                    <View style={styles.ratingBadge}>
                                        <Text style={styles.ratingText}>
                                            {(selectedHotel.rating || 0).toFixed(1).replace('.', ',')}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.starRow}>
                                    {[...Array(selectedHotel.stars || 5)].map((_, i) => (
                                        <Ionicons key={i} name="star" size={12} color="#F59E0B" />
                                    ))}
                                    <Text style={styles.reviewCount}>
                                        • {(selectedHotel.reviewCount || 0).toLocaleString()} Avis
                                    </Text>
                                </View>

                                <View style={styles.addressRow}>
                                    <Ionicons name="location-outline" size={14} color="#6B7280" />
                                    <Text style={styles.addressText} numberOfLines={1}>
                                        {selectedHotel.address || 'Adresse non disponible'}
                                    </Text>
                                </View>

                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>Prix (à partir de)</Text>
                                    <Text style={styles.price}>
                                        {(selectedHotel.roomTypes?.[0]?.offerRetailRate?.amount || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {selectedHotel.roomTypes?.[0]?.offerRetailRate?.currency || 'DH'}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.viewButton}
                                    onPress={handleHotelPress}
                                >
                                    <Text style={styles.viewButtonText}>Voir les détails</Text>
                                    <Ionicons name="arrow-forward" size={18} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    markerContainerSelected: {
        borderColor: '#E85D40',
        borderWidth: 3,
    },
    markerImage: {
        width: 60,
        height: 50,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    priceBubble: {
        backgroundColor: '#FFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    priceBubbleSelected: {
        backgroundColor: '#E85D40',
    },
    priceText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1F2937',
    },
    priceTextSelected: {
        color: '#FFF',
    },
    topBar: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 28,
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    backButton: {
        marginRight: 12,
    },
    searchInfo: {
        flex: 1,
    },
    locationText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
    },
    criteriaText: {
        fontSize: 12,
        color: '#6B7280',
    },
    editButton: {
        marginLeft: 12,
    },
    filtersContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 130 : 90,
        left: 0,
        right: 0,
    },
    filtersContent: {
        paddingHorizontal: 20,
        gap: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterChipActive: {
        backgroundColor: '#E85D40',
        borderColor: '#E85D40',
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1F2937',
    },
    filterChipTextActive: {
        color: '#FFF',
    },
    listViewButton: {
        position: 'absolute',
        bottom: BOTTOM_SHEET_HEIGHT + 20,
        right: 20,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    centerButton: {
        position: 'absolute',
        bottom: BOTTOM_SHEET_HEIGHT + 78,
        right: 20,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: BOTTOM_SHEET_HEIGHT,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    bottomSheetContent: {
        flex: 1,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    hotelCard: {
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    hotelImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
    },
    hotelInfo: {
        flex: 1,
        marginLeft: 16,
    },
    hotelTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    hotelName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        flex: 1,
        marginRight: 8,
    },
    ratingBadge: {
        backgroundColor: '#10B981',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    ratingText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6, gap: 2,
    },
    reviewCount: {
        fontSize: 11,
        color: '#6B7280',
        marginLeft: 6,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    addressText: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 6,
        flex: 1,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    priceLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E85D40',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
    },
    viewButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
});
