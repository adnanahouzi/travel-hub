import React from 'react';
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

export const SelectedRoomsModal = ({ visible, onClose, selectedRooms, onRemoveRoom, onValidate }) => {
    if (!visible) return null;

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
                        <Text style={styles.headerTitle}>Chambres sélectionnées</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="chevron-down" size={24} color="#1F2937" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        {selectedRooms.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>Aucune chambre sélectionnée</Text>
                            </View>
                        ) : (
                            selectedRooms.map((item, index) => (
                                <View key={index} style={styles.roomItem}>
                                    <View style={styles.roomInfo}>
                                        <Text style={styles.roomName}>
                                            {item.count} x {item.room.name}
                                        </Text>
                                        {item.preference !== 'none' && (
                                            <Text style={styles.preferenceText}>
                                                {item.preference === 'non-smoking' ? 'Salle non-fumeur' : item.preference}
                                            </Text>
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => onRemoveRoom(index)}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.validateButton, selectedRooms.length === 0 && styles.validateButtonDisabled]}
                            onPress={onValidate}
                            disabled={selectedRooms.length === 0}
                        >
                            <Text style={styles.validateButtonText}>Valider</Text>
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
        maxHeight: height * 0.5,
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
    },
    closeButton: {
        padding: 4,
    },
    content: {
        padding: 20,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 16,
    },
    roomItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    roomInfo: {
        flex: 1,
        marginRight: 16,
    },
    roomName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    preferenceText: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
    },
    deleteButton: {
        padding: 8,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    validateButton: {
        backgroundColor: '#E85D40',
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
    },
    validateButtonDisabled: {
        backgroundColor: '#F3F4F6',
    },
    validateButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
