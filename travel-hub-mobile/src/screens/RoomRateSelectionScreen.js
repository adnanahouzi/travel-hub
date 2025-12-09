import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
    ScrollView,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ApiService } from '../services/api.service';

const { width } = Dimensions.get('window');

export const RoomRateSelectionScreen = ({ navigation, route }) => {
    const { roomGroup } = route.params || {};
    const [selectedRateId, setSelectedRateId] = useState(null);

    // Use the first offer in the group for display details (images, title, capacity)
    // as they are all the same room configuration
    const displayOffer = roomGroup?.offers?.[0];

    if (!displayOffer) return null;

    const handleSelectRate = async (offer) => {
        try {
            // Call prebook API
            const prebookRequest = {
                offerId: offer.offerId,
                usePaymentSdk: false
            };

            const response = await ApiService.prebook(prebookRequest);

            // Navigate directly to BookingSummary with the prebooking response
            navigation.navigate('BookingSummary', {
                selectedRooms: [{
                    room: {
                        ...offer,
                        name: getOfferDisplayName(offer)
                    },
                    count: 1
                }],
                prebookResponse: response,  // Single response, not batch
                simulationId: response.simulationId,
                reviewsSummary: route.params?.reviewsSummary
            });
        } catch (error) {
            console.error('Prebook error:', error);
            // Could show an alert here if needed
        }
    };

    const getOfferDisplayName = (offer) => {
        if (offer.roomBreakdown?.length > 0) {
            if (offer.roomBreakdown.length === 1 && offer.roomBreakdown[0].count === 1) {
                return offer.roomBreakdown[0].name;
            }
            return offer.roomBreakdown.map(b => `${b.count} x ${b.name}`).join(' + ');
        }
        return offer.name || 'Offre de chambre';
    };

    const getCancellationTag = (offer) => {
        const isRefundable =
            (offer.cancellationPolicies && offer.cancellationPolicies.refundableTag === 'RFN') ||
            (offer.perks && offer.perks.some(p => p.toLowerCase().includes('free cancellation') || p.toLowerCase().includes('annulation gratuite')));

        return isRefundable ?
            { text: 'Annulation gratuite', color: '#059669', icon: 'checkmark-circle-outline' } :
            { text: 'Non remboursable', color: '#DC2626', icon: 'close-circle-outline' };
    };

    const getBreakfastTag = (offer) => {
        const hasBreakfast =
            (offer.boardName && (offer.boardName.toLowerCase().includes('breakfast') || offer.boardName.toLowerCase().includes('petit-déjeuner'))) ||
            (offer.perks && offer.perks.some(p => p.toLowerCase().includes('breakfast') || p.toLowerCase().includes('petit-déjeuner')));

        const hasHalfBoard =
            (offer.boardType === 'HB') ||
            (offer.boardName && (offer.boardName.toLowerCase().includes('half board') || offer.boardName.toLowerCase().includes('demi')));

        if (hasHalfBoard) {
            return { text: 'Demi-pension', color: '#059669', icon: 'restaurant-outline' };
        }
        return hasBreakfast ?
            { text: 'Petit-déjeuner offert', color: '#059669', icon: 'cafe-outline' } :
            { text: 'Petit-déjeuner non offert', color: '#DC2626', icon: 'close-circle-outline' };
    };

    const renderRateCard = ({ item }) => {
        const cancellation = getCancellationTag(item);
        const breakfast = getBreakfastTag(item);

        // Price Calculation (use offerRetailRate - mapped to total in RetailRateDetailDto)
        const totalPrice = item.retailRate?.total?.[0]?.amount || 0;
        const currency = item.retailRate?.total?.[0]?.currency || 'MAD';
        // offerInitialPrice is mapped to initialPrice in RetailRateDetailDto
        const initialPrice = item.retailRate?.initialPrice?.[0]?.amount;
        const formattedPrice = new Intl.NumberFormat('fr-MA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(totalPrice);

        const points = Math.round(totalPrice * 0.1); // Mock points

        return (
            <View style={styles.rateCard}>
                <View style={styles.rateHeader}>
                    <Text style={styles.rateTitle}>
                        {item.name || 'Offre Standard'}
                    </Text>
                </View>

                <View style={styles.amenitiesContainer}>
                    <View style={styles.amenityRow}>
                        <Ionicons name={breakfast.icon} size={16} color={breakfast.color} />
                        <Text style={[styles.amenityText, { color: breakfast.color }]}>{breakfast.text}</Text>
                    </View>
                    <View style={styles.amenityRow}>
                        <Ionicons name={cancellation.icon} size={16} color={cancellation.color} />
                        <Text style={[styles.amenityText, { color: cancellation.color }]}>{cancellation.text}</Text>
                    </View>
                </View>

                <View style={styles.priceSection}>
                    <View>
                        {initialPrice && initialPrice > totalPrice && (
                            <Text style={styles.originalPrice}>
                                {initialPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                            </Text>
                        )}
                        <View style={styles.priceRow}>
                            <Text style={styles.price}>{formattedPrice} {currency}</Text>
                            <Text style={styles.perNight}>/La nuitée</Text>
                        </View>
                        <Text style={styles.totalPrice}>{(totalPrice * 2).toFixed(2)}DH Total</Text>
                        <Text style={styles.duration}>2 night, {item.roomBreakdown?.[0]?.count || 1} Rooms</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.selectButton}
                        onPress={() => handleSelectRate(item)}
                    >
                        <Text style={styles.selectButtonText}>Choisir cette chambre</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderHeader = () => {
        const images = displayOffer.roomBreakdown?.[0]?.roomPhotos?.map(p => p.url) || ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&q=80'];
        const title = displayOffer.roomBreakdown?.map(b => `${b.count > 1 ? b.count + ' x ' : ''}${b.name}`).join(' + ');
        const capacity = displayOffer.roomBreakdown?.reduce((acc, r) => acc + (r.adultCount || 0) + (r.childCount || 0), 0) || 2;
        const size = displayOffer.roomBreakdown?.[0]?.roomSize ? `${displayOffer.roomBreakdown[0].roomSize} m²` : '25 m²';

        return (
            <View>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: images[0] }} style={styles.headerImage} resizeMode="cover" />
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.imageBadge}>
                        <Ionicons name="image-outline" size={12} color="#374151" />
                        <Text style={styles.imageBadgeText}>1/{images.length}</Text>
                    </View>
                </View>

                <View style={styles.headerContent}>
                    <Text style={styles.mainTitle}>{title}</Text>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Ionicons name="bed-outline" size={16} color="#6B7280" />
                            <Text style={styles.infoText}>{capacity} personnes</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="resize-outline" size={16} color="#6B7280" />
                            <Text style={styles.infoText}>{size}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderHeader()}
            <FlatList
                data={roomGroup?.offers || []}
                renderItem={renderRateCard}
                keyExtractor={(item, index) => item.offerId || index.toString()}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    imageContainer: {
        height: 250,
        width: '100%',
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 20,
        // backgroundColor: 'rgba(0,0,0,0.3)',
        // borderRadius: 20,
        // padding: 8,
    },
    imageBadge: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    imageBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
        marginLeft: 4,
    },
    headerContent: {
        padding: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    mainTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    infoText: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 4,
    },
    listContent: {
        padding: 20,
    },
    rateCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    rateHeader: {
        marginBottom: 12,
    },
    rateTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    amenitiesContainer: {
        marginBottom: 16,
    },
    amenityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    amenityText: {
        fontSize: 13,
        marginLeft: 8,
        fontWeight: '500',
    },
    priceSection: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 16,
        alignItems: 'flex-end',
    },
    originalPrice: {
        fontSize: 16,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        textAlign: 'right',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'flex-end',
        marginBottom: 4,
    },
    price: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    perNight: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 4,
    },
    totalPrice: {
        fontSize: 14,
        color: '#4B5563',
        textAlign: 'right',
    },
    duration: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'right',
        marginBottom: 16,
    },
    selectButton: {
        backgroundColor: '#E85D40',
        width: '100%',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    selectButtonText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
    }
});
