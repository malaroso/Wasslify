import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '../../context/AuthContext';
import AlertComponent from '../../components/AlertComponent';


const LoginScreen = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);


    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const { onLogin } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState<'success' | 'error' | 'pending'>('pending');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            if (username && password) {
                const result = await onLogin?.(username, password);
                
                if (result?.success) {

                    
                } else {
                    console.log("result mesaj => " ,result?.message);
                    setAlertTitle('Hata');
                    setAlertMessage(result?.message || 'Giriş yapılamadı');
                    setAlertVisible(true);
                    setAlertStatus('error');
                }
            } else {
                setAlertTitle('Uyarı');
                setAlertMessage('Lütfen tüm alanları doldurun!');
                setAlertVisible(true);
                setAlertStatus('pending');
            }
        } catch (error) {
            setAlertTitle('Hata');
            setAlertMessage('Bir hata oluştu');
            setAlertVisible(true);
            setAlertStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAwareScrollView 
            contentContainerStyle={{ flexGrow: 1 , backgroundColor: '#000'}}
            enableOnAndroid={true}
        >
            <View style={styles.container}>
                <Video
                    source={require('../../../assets/videos/videoFour.mp4')}
                    style={styles.video}
                    isMuted
                    shouldPlay
                    isLooping
                    resizeMode={ResizeMode.COVER}
                />
                <View style={styles.overlay} />
                <View style={styles.content}>
              
                    <View style={styles.middleSection}>
                        <View style={styles.formContainer}>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>My Username</Text>
                                <TextInput
                                    label=""
                                    mode="flat"
                                    style={styles.input}
                                    placeholderTextColor="#ccc"
                                    textColor="#fff"
                                    value={username}
                                    onChangeText={setUsername}
                                    theme={{ 
                                        colors: { 
                                            text: '#fff',
                                            primary: '#fff',
                                            placeholder: '#ccc',
                                            onSurfaceVariant: '#fff'
                                        } 
                                    }}
                                />
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>My Password</Text>
                                <TextInput
                                    label=""
                                    mode="flat"
                                    style={styles.input}
                                    placeholderTextColor="#ccc"
                                    secureTextEntry={!passwordVisible}
                                    value={password}
                                    onChangeText={setPassword}
                                    textColor="#fff"
                                    right={<TextInput.Icon 
                                        icon={passwordVisible ? "eye-off" : "eye"} 
                                        color="#fff" 
                                        onPress={togglePasswordVisibility}
                                    />}
                                    theme={{ 
                                        colors: { 
                                            text: '#fff',
                                            primary: '#fff',
                                            placeholder: '#ccc',
                                            onSurfaceVariant: '#fff'
                                        } 
                                    }}
                                />
                            </View>
                            <View style={styles.optionsContainer}>
                                <Text style={styles.forgotPassword}>Forget Password?</Text>
                            </View>
                            <TouchableOpacity style={styles.continueButton} onPress={handleLogin} disabled={isLoading}>
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.continueButtonText}>Login</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bottomSection}>
                        <Text style={styles.orText}>or login with</Text>
                        <Button mode="contained" style={styles.appleButton}>
                            <Ionicons name="logo-apple" size={20} color="#fff" />
                            {'  '}Sign in with Apple
                        </Button>
                        <Button mode="contained" style={styles.googleButton}>
                            <MaterialCommunityIcons name="google" size={20} color="#fff" />
                            {'  '}Sign in with Google
                        </Button>
                    </View>
                </View>
            </View>
            <AlertComponent
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
                status={alertStatus}
            />
        </KeyboardAwareScrollView>
    );
}; 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    video: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },
    topSection: {
        marginTop:  40,
        alignItems: 'center',
        marginBottom: 0,
    },
    header: {
        fontSize: 24,
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Montserrat-Bold',
        marginBottom: 2,
    },
    title: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
    },
    middleSection: {
        flex: 1,
        position: 'relative',
        minHeight: 300,
    },
    formContainer: {
        width: '100%',
        maxWidth: 500,
        position: 'absolute',
        bottom: 20,
        marginTop: 40,
        alignSelf: 'center',
        paddingHorizontal: 10,
    },
    formGroup: {
        marginBottom: 10,
    },
    input: {
        marginBottom: 10,
        color: '#fff',
        backgroundColor: 'transparent',
        fontSize: 16,
        height: 50,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    forgotPassword: {
        color: '#fff',
    },
    continueButton: {
        backgroundColor: 'orange',
        marginTop: 20,
        height: 50,
        justifyContent: 'center',
    },
    orText: {
        textAlign: 'center',
        marginVertical: 20,
        color: '#fff',
    },
    appleButton: {
        backgroundColor: '#000',
        marginBottom: 12,
    },
    googleButton: {
        backgroundColor: '#DB4437',
        marginBottom: 12,
    },
    label: {
        color: '#fff',
        marginBottom: 5,
    },
    bottomSection: {
        paddingBottom: 20,
    },
    continueButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default LoginScreen;