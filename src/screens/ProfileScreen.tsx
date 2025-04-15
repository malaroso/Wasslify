import React, { useState, useCallback, useContext } from 'react';
import { View, StyleSheet, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import BottomNavigator from '../components/BottomNavigator';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { getUserDetail } from '../services/userServices';
import { UserDetailData } from '../types/userTypes';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/NavigationTypes';

const ProfileScreen = () => {
    const [userDetail, setUserDetail] = useState<UserDetailData | null>(null);
    const { onLogout } = useAuth();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const fetchUserDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUserDetail();
            if (response.status) {
                setUserDetail(response.data[0]);
            }
        } catch (error: any) {
            console.error('Error fetching user detail:', error);
            setError(error.message || "Bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUserDetail();
        }, [])
    );

    const Handlelogout = () => {
        setShowLogoutModal(true);
    }

    const confirmLogout = () => {
        if (onLogout) {
            onLogout();
        }
        setShowLogoutModal(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerBanner}>
                <Image 
                    source={require('../../assets/images/loginScreenTwo.jpg')} 
                    style={styles.headerImage}
                />
                <View style={styles.headerOverlay}>
                    <Text style={styles.HeaderText}>My profile</Text>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.profileCard}>
                    <Image source={require('../../assets/images/profile.png')} style={styles.profileImage} />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{userDetail?.username || "Ayodele Motunrayo"}</Text>
                        <Text style={styles.profileAccountNumber}>{userDetail?.email || "example@gmail.com"}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <FontAwesome5 name="edit" size={16} color="#000" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Other settings</Text>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProfileUpdate')}>
                            <View style={styles.buttonLeft}>
                                <FontAwesome5 name="user-alt" size={16} color="#666" style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>Profile settings</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PasswordChange')}>
                            <View style={styles.buttonLeft}>
                                <FontAwesome5 name="lock" size={16} color="#666" style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>Password settings</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Payment')}>
                            <View style={styles.buttonLeft}>
                                <FontAwesome5 name="credit-card" size={16} color="#666" style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>My Payment Methods</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Subscription')}>
                            <View style={styles.buttonLeft}>
                                <FontAwesome5 name="crown" size={16} color="#666" style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>My Subscription</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Faq')}>
                            <View style={styles.buttonLeft}>
                                <FontAwesome5 name="question-circle" size={16} color="#666" style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>FAQ/Support</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.logoutButton} onPress={Handlelogout}>
                            <View style={styles.buttonLeft}>
                                <FontAwesome5 name="sign-out-alt" size={16} color="#f64f59" style={styles.buttonIcon} />
                                <Text style={styles.logoutText}>Log out</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            <Modal animationType="fade" transparent={true} visible={showLogoutModal} onRequestClose={() => setShowLogoutModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <FontAwesome5 name="sign-out-alt" size={30} color="#f64f59" />
                            <Text style={styles.modalTitle}>Logout</Text>
                        </View>
                        
                        <Text style={styles.modalText}>
                            Are you sure you want to logout?
                        </Text>
                        
                        <View style={styles.modalButtons}>
                            <Pressable  style={[styles.modalButton, styles.cancelButton]}  onPress={() => setShowLogoutModal(false)} >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </Pressable>
                            
                            <Pressable  style={[styles.modalButton, styles.confirmButton]}  onPress={confirmLogout}>
                                <Text style={styles.confirmButtonText}>Logout</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <BottomNavigator />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerBanner: {
        height: 150,
        position: 'relative',
        backgroundColor: '#000',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 0.7,
    },
    headerOverlay: {
        padding: 20,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    HeaderText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        marginTop: -50,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    profileAccountNumber: {
        fontSize: 14,
        color: '#666',
        marginTop: 3,
    },
    editButton: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 20,
    },
    scrollContent: {
        flex: 1,
        marginTop: 20,
        marginBottom: 100,
    },
    section: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 20,
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 15,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    buttonLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonIcon: {
        marginRight: 15,
        width: 20,
        textAlign: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    logoutText: {
        fontSize: 16,
        color: '#f64f59',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    modalText: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        flex: 1,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
    },
    confirmButton: {
        backgroundColor: '#f64f59',
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ProfileScreen;      
