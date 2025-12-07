import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const BookingSuccessScreen = ({ route, navigation }) => {
    const { totalAmount, bookingId } = route.params;
    const points = Math.round(totalAmount * 0.1);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-circle-outline" size={80} color="#10B981" />
                </View>

                <Text style={styles.title}>Réservation réussie !</Text>

                <Text style={styles.pointsText}>
                    Vous avez gagné <Text style={styles.pointsHighlight}>{points} points</Text>
                </Text>

                <Text style={styles.subtitle}>Bon voyage !</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('BookingDetails', { bookingId: bookingId })}
                >
                    <Text style={styles.buttonText}>Voir la réservation</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    iconContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    pointsText: {
        fontSize: 20,
        color: '#1F2937',
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    pointsHighlight: {
        color: '#E85D40',
        fontWeight: '800',
    },
    subtitle: {
        fontSize: 18,
        color: '#6B7280',
        marginBottom: 48,
        textAlign: 'center',
    },
    button: {
        width: '100%',
        backgroundColor: '#E85D40',
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
