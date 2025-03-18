import React, { useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import BottomNavigator from '../../components/BottomNavigator';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { updateUserPassword } from '../../services/userServices';

const PasswordChangeScreen = () => {
    const navigation = useNavigation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const validateForm = () => {
        if (!currentPassword) {
            setError('Mevcut şifrenizi giriniz');
            return false;
        }
        if (!newPassword) {
            setError('Yeni şifrenizi giriniz');
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError('Yeni şifreler eşleşmiyor');
            return false;
        }
        if (newPassword.length < 6) {
            setError('Yeni şifre en az 6 karakter olmalıdır');
            return false;
        }
        return true;
    };

    const handleUpdatePassword = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await updateUserPassword(currentPassword, newPassword);

            if (response.status) {
                setSuccess('Şifreniz başarıyla güncellendi');
                // Formu temizle
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                
                // 2 saniye sonra geri dön
                setTimeout(() => {
                    navigation.goBack();
                }, 2000);
            } else {
                setError(response.message || 'Şifre güncellenirken bir hata oluştu');
            }
        } catch (error: any) {
            console.error('Error updating password:', error);
            setError(error.response?.data?.message || 'Şifre güncellenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.headerBanner}>
                    <Image 
                        source={require('../../../assets/images/loginScreenTwo.jpg')} 
                        style={styles.headerImage}
                    />
                    <View style={styles.headerOverlay}>
                        <TouchableOpacity 
                            style={styles.backButton} 
                            onPress={() => navigation.goBack()}
                        >
                            <FontAwesome5 name="arrow-left" size={20} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Şifre Değiştir</Text>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.headerText}>Şifre Ayarları</Text>
                        <Text style={styles.description}>
                            Güvenliğiniz için şifrenizi düzenli olarak değiştirmenizi öneririz.
                        </Text>

                        {error && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        {success && (
                            <View style={styles.successContainer}>
                                <Text style={styles.successText}>{success}</Text>
                            </View>
                        )}

                        <View style={styles.formContainer}>
                            <Text style={styles.inputLabel}>Mevcut Şifre</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mevcut şifrenizi girin"
                                    secureTextEntry={!showCurrentPassword}
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                />
                                <TouchableOpacity 
                                    style={styles.eyeIcon}
                                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    <FontAwesome5 
                                        name={showCurrentPassword ? "eye-slash" : "eye"} 
                                        size={18} 
                                        color="#666" 
                                    />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.inputLabel}>Yeni Şifre</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Yeni şifrenizi girin"
                                    secureTextEntry={!showNewPassword}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                <TouchableOpacity 
                                    style={styles.eyeIcon}
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                >
                                    <FontAwesome5 
                                        name={showNewPassword ? "eye-slash" : "eye"} 
                                        size={18} 
                                        color="#666" 
                                    />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.inputLabel}>Yeni Şifre (Tekrar)</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Yeni şifrenizi tekrar girin"
                                    secureTextEntry={!showConfirmPassword}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <TouchableOpacity 
                                    style={styles.eyeIcon}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <FontAwesome5 
                                        name={showConfirmPassword ? "eye-slash" : "eye"} 
                                        size={18} 
                                        color="#666" 
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity 
                                style={styles.updateButton}
                                onPress={handleUpdatePassword}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.updateButtonText}>Şifreyi Güncelle</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
            <BottomNavigator />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    headerBanner: {
        height: 140,
        position: 'relative',
    },
    headerText: {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        color: '#666',
        fontSize: 14,
        marginBottom: 20,
    },
    headerImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    headerOverlay: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 20,
        height: '100%',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        marginBottom: 100,
    },
    scrollContent: {
        flex: 1,
    },
    formContainer: {
        marginTop: 10,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    input: {
        flex: 1,
        padding: 15,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 15,
    },
    updateButton: {
        backgroundColor: '#4285F4',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 14,
    },
    successContainer: {
        backgroundColor: '#e8f5e9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    successText: {
        color: '#388e3c',
        fontSize: 14,
    },
});

export default PasswordChangeScreen;      
