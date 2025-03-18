import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import BottomNavigator from '../../components/BottomNavigator';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getUserDetail, updateUser } from '../../services/userServices';
import { UpdateUserRequest, UserDetailData } from '../../types/userTypes';

const ProfileUpdate = () => {
    const navigation = useNavigation();
    const [userDetail, setUserDetail] = useState<UserDetailData | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fetchUserDetail = async () => {
        setFetchLoading(true);
        try {
            const response = await getUserDetail();
            if (response.status && response.data.length > 0) {
                const userData = response.data[0];
                setUserDetail(userData);
                setName(userData.username || '');
                setEmail(userData.email || '');
            }
        } catch (error: any) {
            console.error('Error fetching user detail:', error);
            setError('Kullanıcı bilgileri alınamadı');
        } finally {
            setFetchLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchUserDetail();
        }, [])
    );

    const validateForm = () => {
        if (!name.trim()) {
            setError('Lütfen adınızı giriniz');
            return false;
        }
        if (!email.trim()) {
            setError('Lütfen e-posta adresinizi giriniz');
            return false;
        }
 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Geçerli bir e-posta adresi giriniz');
            return false;
        }
        return true;
    };

    const handleUpdateProfile = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const userData: UpdateUserRequest = {
                name: name,
                email: email
            };

            const response = await updateUser(userData);

            if (response.status) {
                setSuccess('Profil bilgileriniz başarıyla güncellendi');
                
                // 2 saniye sonra geri dön
                setTimeout(() => {
                    navigation.goBack();
                }, 2000);
            } else {
                setError(response.message || 'Profil güncellenirken bir hata oluştu');
            }
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setError(error.response?.data?.message || 'Profil güncellenirken bir hata oluştu');
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
                        <Text style={styles.headerTitle}>Profil Güncelleme</Text>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.headerText}>Profil Bilgileri</Text>
                        <Text style={styles.description}>
                            Kişisel bilgilerinizi güncelleyebilirsiniz.
                        </Text>

                        {fetchLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#4285F4" />
                                <Text style={styles.loadingText}>Bilgileriniz yükleniyor...</Text>
                            </View>
                        ) : (
                            <>
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
                                    <Text style={styles.inputLabel}>Kullanıcı Adı</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Kullanıcı adınızı girin"
                                            value={name}
                                            onChangeText={setName}
                                        />
                                    </View>

                                    <Text style={styles.inputLabel}>E-posta Adresi</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="E-posta adresinizi girin"
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>

                                    <TouchableOpacity 
                                        style={styles.updateButton}
                                        onPress={handleUpdateProfile}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#fff" size="small" />
                                        ) : (
                                            <Text style={styles.updateButtonText}>Profili Güncelle</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
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
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
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

export default ProfileUpdate;      
