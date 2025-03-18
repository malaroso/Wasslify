import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Animated, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/NavigationTypes';
import BottomNavigator from '../components/BottomNavigator';
import { getUserDetail } from '../services/userServices';
const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75;
import AlertComponent from '../components/AlertComponent';
import { UserDetailData } from '../types/userTypes';

const HomeScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuAnimation = useRef(new Animated.Value(-MENU_WIDTH)).current;
    const [userDetail, setUserDetail] = React.useState<UserDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    

    const toggleMenu = () => {
        const toValue = menuOpen ? -MENU_WIDTH : 0;
        
        Animated.timing(menuAnimation, {
            toValue,
            duration: 300,
            useNativeDriver: true,
        }).start();
        
        setMenuOpen(!menuOpen);
    };
    
    const popularWallpapers = [
        { id: '1', image: require('../../assets/images/loginScreenOne.jpg') },
        { id: '2', image: require('../../assets/images/loginScreenTwo.jpg') },
        { id: '3', image: require('../../assets/images/loginScreenThree.jpg') },
    ];
    
    const categories = [
        { id: '1', name: 'Colorful', image: require('../../assets/images/Abstract.jpg') },
        { id: '2', name: 'Auto', image: require('../../assets/images/Animals.jpg') },
        { id: '3', name: 'Nature', image: require('../../assets/images/Cities.jpg') },
        { id: '4', name: 'Urban', image: require('../../assets/images/Forests.jpg') },
        { id: '5', name: 'Space', image: require('../../assets/images/Landscapes.jpg') },
        { id: '6', name: 'Minimalist', image: require('../../assets/images/Minimalist.jpg') },
        { id: '7', name: 'Mountains', image: require('../../assets/images/Mounth.jpg') },
        { id: '8', name: 'Nature', image: require('../../assets/images/Nature.jpg') },
        { id: '9', name: 'Space', image: require('../../assets/images/Space.jpg') },
        { id: '10', name: 'Sunset', image: require('../../assets/images/sunset.jpg') },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Side Menu */}
            <Animated.View style={[
                styles.sideMenu,
                { transform: [{ translateX: menuAnimation }] }
            ]}>
                <ScrollView style={styles.menuItems}>
                    {/* Premium Subscription */}
                    <TouchableOpacity style={styles.premiumContainer} onPress={() => navigation.navigate('Premium')}>
                        <LottieView 
                            source={require('../../assets/animations/getPremium.json')} 
                            autoPlay 
                            loop 
                            style={{ width: '70%', height: 100 }}
                        />
                        <Text style={styles.premiumText}>GET PREMIUM TODAY</Text>
                        <Text style={styles.premiumSubText}>{userDetail?.username} Get discount for premium membership and access to all wallpapers 🚀</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    {/* Categories */}
                    <View style={styles.categorySection}>
                        <Text style={styles.categoryTitle}>Wallpapers</Text>
                        {categories.map((category) => (
                            <TouchableOpacity key={category.id} style={styles.menuItem}>
                                <Image source={category.image} style={styles.menuItemImage} />
                                <Text style={styles.menuItemText}>{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={{height: 220}} />
                </ScrollView>
            </Animated.View>
            
            {/* Menünün overlayı */}
            {menuOpen && (
                <TouchableOpacity 
                    style={styles.overlay} 
                    activeOpacity={1} 
                    onPress={toggleMenu}
                />
            )}
            
            <View style={styles.mainContent}>
                {/* Header Banner */}
                <View style={styles.headerBanner}>
                    <Image 
                        source={require('../../assets/images/loginScreenOne.jpg')} 
                        style={styles.headerImage}
                    />
                    <View style={styles.headerOverlay}>
                        {/* Menu Button */}
                        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                            <Ionicons name="menu" size={28} color="#fff" />
                        </TouchableOpacity>
                        
                        <Text style={styles.headerTitle}>Hello , {userDetail?.username}! </Text>
                        <Text style={styles.headerSubtitle}>Find the high quality free wallpapers you are looking for!</Text>
                    </View>
                </View>
                
                {/* Content with white background */}
                <View style={styles.contentContainer}>
                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {/* Wallpapers Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Wallpapers</Text>
                                <TouchableOpacity>
                                    <Text style={styles.moreText}>More</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {/* Search Bar */}
                            <View style={styles.searchContainer}>
                                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                                <TextInput 
                                    style={styles.searchInput}
                                    placeholder="Search for free wallpaper"
                                    placeholderTextColor="#999"
                                />
                            </View>
                            
                            <Text style={styles.sectionSubtitle}>Popular now</Text>
                            
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                                {popularWallpapers.map((item) => (
                                    <TouchableOpacity key={item.id} style={styles.wallpaperItem}>
                                        <Image source={item.image} style={styles.wallpaperImage} />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                        
                        {/* Categories Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Categories</Text>
                            </View>
                            
                            <View style={styles.categoriesGrid}>
                                {categories.map(category => (
                                    <TouchableOpacity key={category.id} style={styles.categoryItem}>
                                        <Image source={category.image} style={styles.categoryImage} />
                                        <View style={styles.categoryOverlay}>
                                            <Text style={styles.categoryName}>{category.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            
                            <TouchableOpacity style={styles.moreButton}>
                                <Text style={styles.moreButtonText}>More</Text>
                            </TouchableOpacity>
                        </View>
                 
                    </ScrollView>
                </View>
            </View>
            {/* Bottom Navigation */}
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
        paddingBottom: 80,
    },
    sideMenu: {
        position: 'absolute',
        width: MENU_WIDTH,
        height: '120%',
        backgroundColor: '#fff',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '120%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 5,
    },
    menuItems: {
        padding: 15,
    },
    premiumContainer: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
        backgroundColor: '#fff',
    },
    divider: {
        height: 2,
        backgroundColor: '#f0f0f0',
        marginVertical: 15,
    },
    premiumText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: -10,
    },
    premiumSubText: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5,
        textAlign: 'center',
    },
    premiumButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 10,
    },
    premiumButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryItem: {
        width: '48%',
        marginBottom: 15,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    categorySection: {
        marginTop: 20,
    },
    categoryTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 10,
    },

    categoryImage: {
        width: '100%',
        height: 100,
        borderRadius: 12,
    },
    categoryOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    menuButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    headerBanner: {
        height: 180,
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
        fontFamily: 'Montserrat-Bold',
        marginBottom: 5,
        marginTop: 20,
        width: '100%',
        marginLeft: 0, 
    },
    headerSubtitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'Montserrat-Medium',
        marginTop: 0,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      
    },
    scrollContent: {
        flex: 1,
        paddingTop: 15,
    },
    searchContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 45,
        marginVertical: 15,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: '100%',
    },
    section: {
        padding: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    moreText: {
        color: '#4285F4',
        fontWeight: '500',
    },
    horizontalScroll: {
        marginLeft: -5,
    },
    wallpaperItem: {
        marginRight: 15,
        borderRadius: 12,
        overflow: 'hidden',
    },
    wallpaperImage: {
        width: 150,
        height: 200,
        borderRadius: 12,
    },

    moreButton: {
        alignItems: 'center',
        marginTop: 10,
    },
    moreButtonText: {
        color: '#4285F4',
        fontWeight: '500',
    },
    navItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#f0f0f0',
    },
    menuItemImage: {
        width: 40,
        height: 40,
        borderRadius: 12,
        marginRight: 15,
    },
    menuItemText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
    },
});

export default HomeScreen;