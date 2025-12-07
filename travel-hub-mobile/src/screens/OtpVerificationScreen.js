import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ApiService } from '../services/api.service';

export const OtpVerificationScreen = ({ route, navigation }) => {
    const { bookingData, totalAmount } = route.params;
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const inputRef = useRef(null);

    useEffect(() => {
        // Focus input on mount
        if (inputRef.current) {
            inputRef.current.focus();
        }

        // Countdown timer
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleVerify = async () => {
        if (code.length !== 4) {
            Alert.alert('Erreur', 'Veuillez entrer un code valide à 4 chiffres');
            return;
        }

        try {
            setLoading(true);

            // Call submit booking endpoint
            const response = await ApiService.submitBooking(bookingData);


            console.log('Booking ID:', response.data?.bookingId);

            // Navigate to Success Screen
            navigation.navigate('BookingSuccess', {
                totalAmount: totalAmount,
                bookingId: response.data?.bookingId
            });
        } catch (error) {
            console.error('OTP Verification error:', error);
            Alert.alert('Erreur', 'Code incorrect ou erreur de validation');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        setTimer(30);
        Alert.alert('Info', 'Code renvoyé');
        // Implement resend logic here if needed
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#E85D40" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirmation</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name="chatbox-ellipses-outline" size={60} color="#E85D40" />
                </View>

                <Text style={styles.title}>Code de confirmation</Text>
                <Text style={styles.subtitle}>
                    Entrez le code de vérification a été envoyé au numéro ******{bookingData.holder.phone.slice(-3)} pour terminer l'opération
                </Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Code</Text>
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        value={code}
                        onChangeText={setCode}
                        keyboardType="number-pad"
                        maxLength={4}
                        placeholder="1234"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
                    onPress={handleVerify}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.verifyButtonText}>Valider</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleResend}
                    disabled={timer > 0}
                    style={styles.resendButton}
                >
                    <Text style={[styles.resendText, timer > 0 && styles.resendTextDisabled]}>
                        {timer > 0 ? `Renvoyer le code (${timer}s)` : 'Renvoyer le code'}
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 24,
        marginTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inputLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    input: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        padding: 0,
    },
    verifyButton: {
        width: '100%',
        backgroundColor: '#E85D40',
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 24,
    },
    verifyButtonDisabled: {
        opacity: 0.7,
    },
    verifyButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    resendButton: {
        padding: 8,
    },
    resendText: {
        color: '#E85D40',
        fontSize: 16,
        fontWeight: '600',
    },
    resendTextDisabled: {
        color: '#9CA3AF',
    },
});
