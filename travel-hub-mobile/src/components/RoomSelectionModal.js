import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Dimensions,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export const RoomSelectionModal = ({ visible, onClose, room, onConfirm }) => {
    const [roomCount, setRoomCount] = useState(1);
    const [preference, setPreference] = useState('none'); // 'none' or 'non-smoking'

    // Reset state when modal opens
    useEffect(() => {
        if (visible) {
            setRoomCount(1);
            setPreference('none');
        }
    }, [visible]);

    if (!room) return null;

    const totalPrice = room.retailRate.total[0].amount * roomCount;
    const currency = room.retailRate.total[0].currency || 'MAD';
    const formattedPrice = new Intl.NumberFormat('fr-MA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(totalPrice);

    const handleIncrement = () => {
        // Constraint: Max 1 room as requested
        if (roomCount < 1) {
            setRoomCount(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (roomCount > 1) {
            setRoomCount(prev => prev - 1);
        }
    };

    const handleConfirm = () => {
        onConfirm({
            room,
            count: roomCount,
            preference
        });
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle} numberOfLines={1}>
                            {roomCount} x {room.name}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#EF4444" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        {/* Room Counter */}
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Chambres</Text>
                            <View style={styles.counterContainer}>
                                <TouchableOpacity
                                    style={[styles.counterButton, roomCount <= 1 && styles.counterButtonDisabled]}
                                    onPress={handleDecrement}
                                    disabled={roomCount <= 1}
                                >
                                    <Ionicons name="remove" size={20} color={roomCount <= 1 ? "#D1D5DB" : "#4B5563"} />
                                </TouchableOpacity>

                                <Text style={styles.counterValue}>{roomCount}</Text>

                                <TouchableOpacity
                                    style={[styles.counterButton, roomCount >= 1 && styles.counterButtonDisabled]}
                                    onPress={handleIncrement}
                                    disabled={roomCount >= 1}
                                >
                                    <Ionicons name="add" size={20} color={roomCount >= 1 ? "#D1D5DB" : "#4B5563"} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Preferences */}
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Préférences</Text>
                            <Text style={styles.sectionSubLabel}>Les demandes sont soumises à disponibilité.</Text>

                            <TouchableOpacity
                                style={styles.preferenceRow}
                                onPress={() => setPreference('none')}
                            >
                                <Text style={styles.preferenceText}>Pas de préférences</Text>
                                <View style={[styles.radioButton, preference === 'none' && styles.radioButtonSelected]}>
                                    {preference === 'none' && <View style={styles.radioButtonInner} />}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.preferenceRow}
                                onPress={() => setPreference('non-smoking')}
                            >
                                <Text style={styles.preferenceText}>Salle non-fumeur</Text>
                                <View style={[styles.radioButton, preference === 'non-smoking' && styles.radioButtonSelected]}>
                                    {preference === 'non-smoking' && <View style={styles.radioButtonInner} />}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <View style={styles.priceContainer}>
                            <Text style={styles.totalPrice}>{formattedPrice} {currency}</Text>
                            <Text style={styles.priceNote}>Frais de services inclus</Text>
                        </View>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                            <Text style={styles.confirmButtonText}>Confirmer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: height * 0.6,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        flex: 1,
        marginRight: 16,
    },
    closeButton: {
        padding: 4,
        backgroundColor: '#FEF2F2',
        borderRadius: 8,
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 20,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    sectionSubLabel: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 16,
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    counterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterButtonDisabled: {
        borderColor: '#F3F4F6',
        backgroundColor: '#F9FAFB',
    },
    counterValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginHorizontal: 20,
        minWidth: 20,
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 20,
    },
    preferenceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    preferenceText: {
        fontSize: 15,
        color: '#374151',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: '#E85D40',
        backgroundColor: '#E85D40',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFF',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    priceContainer: {
        flex: 1,
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    priceNote: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    confirmButton: {
        backgroundColor: '#E85D40',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
