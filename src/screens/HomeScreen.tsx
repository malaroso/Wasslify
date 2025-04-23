import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Animated, Dimensions, Alert } from 'react-native';
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/NavigationTypes';
import BottomNavigator from '../components/BottomNavigator';
import { getUserDetail } from '../services/userServices';
import { getAllWallpapers, getPopularWallpapers, likeWallpaper, unlikeWallpaper } from '../services/wallpaperService';
import { getAllCategories } from '../services/categoryService';
import { addFavorite, removeFavorite, isFavorite } from '../services/favoriteService';
import { Wallpaper } from '../types/WallpaperTypes';
import { Category } from '../types/CategoryTypes';
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
    const [popularWallpapers, setPopularWallpapers] = useState<Wallpaper[]>([]);
    const [loadingPopular, setLoadingPopular] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

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

    const fetchPopularWallpapers = async () => {
        try {
            setLoadingPopular(true);
            const response = await getPopularWallpapers();
            if (response.status) {
                console.log('Popular Wallpapers Data:', response.data);
                setPopularWallpapers(response.data);
            } else {
                console.error('API Error:', response.message);
                setPopularWallpapers([]);
            }
        } catch (error) {
            console.error('Popüler duvar kağıtları yüklenirken hata oluştu:', error);
            setPopularWallpapers([]);
        } finally {
            setLoadingPopular(false);
        }
    };

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            const response = await getAllCategories();
            if (response.status) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Kategoriler yüklenirken hata oluştu:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUserDetail();
            fetchPopularWallpapers();
            fetchCategories();
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

    const handleFavoritePress = async (wallpaper: Wallpaper) => {
        try {
            if (wallpaper.is_favorited === 1) {
                // Favorilerden kaldır
                const response = await removeFavorite(wallpaper.id);
                if (response.status) {
                    // UI'ı güncelle - API'yi yeniden çağırarak güncel verileri alalım
                    fetchPopularWallpapers();
                    Alert.alert('Başarılı', response.message);
                } else {
                    Alert.alert('Hata', response.message);
                }
            } else {
                // Favorilere ekle
                const response = await addFavorite(wallpaper.id);
                if (response.status) {
                    // UI'ı güncelle - API'yi yeniden çağırarak güncel verileri alalım
                    fetchPopularWallpapers();
                    Alert.alert('Başarılı', response.message);
                } else {
                    Alert.alert('Hata', response.message);
                }
            }
        } catch (error) {
            console.error('Favori işlemi sırasında hata oluştu:', error);
            Alert.alert('Hata', 'İşlem sırasında bir hata oluştu');
        }
    };

    const handleLikePress = async (wallpaper: Wallpaper) => {
        try {
            let response;
            if (wallpaper.is_liked === 1) {
                // Beğeniyi kaldır
                response = await unlikeWallpaper(wallpaper.id);
            } else {
                // Beğen
                response = await likeWallpaper(wallpaper.id);
            }
            
            if (response.status) {
                // UI'ı güncelle - API'yi yeniden çağırarak güncel verileri alalım
                fetchPopularWallpapers();
                Alert.alert('Başarılı', response.message);
            } else {
                Alert.alert('Hata', response.message);
            }
        } catch (error) {
            console.error('Beğeni işlemi sırasında hata oluştu:', error);
            Alert.alert('Hata', 'İşlem sırasında bir hata oluştu');
        }
    };

    const renderCategoryItem = (category: Category) => (
        <TouchableOpacity 
            key={category.id} 
            style={styles.categoryItem}
            onPress={() => navigation.navigate('CategoryDetail', { categoryId: category.id })}
        >
            <Image source={{ uri: category.icon }} style={styles.categoryImage} />
            <View style={styles.categoryOverlay}>
                <Text style={styles.categoryName}>{category.name}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderPopularWallpaper = (wallpaper: Wallpaper) => (
        <TouchableOpacity 
            key={wallpaper.id} 
            style={styles.wallpaperItem}
            onPress={() => navigation.navigate('WallpaperDetail', { wallpaperId: wallpaper.id })}
        >
            <Image 
                source={{ uri: wallpaper.image_url }} 
                style={styles.wallpaperImage} 
            />
            <View style={styles.wallpaperActions}> 
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={(e) => {
                        e.stopPropagation(); // Prevent navigating to detail page
                        handleFavoritePress(wallpaper);
                    }}
                >
                    <Ionicons 
                        name={wallpaper.is_favorited === 1 ? "heart" : "heart-outline"} 
                        size={24} 
                        color={wallpaper.is_favorited === 1 ? "#ff4757" : "#fff"} 
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={(e) => {
                        e.stopPropagation(); // Prevent navigating to detail page
                        handleLikePress(wallpaper);
                    }}
                >
                    <FontAwesome5 
                        name="thumbs-up" 
                        solid={wallpaper.is_liked === 1}
                        size={16} 
                        color={wallpaper.is_liked === 1 ? "#ffffff" : "#dddddd"} 
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.wallpaperOverlay}>
                <Text style={styles.wallpaperTitle}>{wallpaper.title}</Text>
                <View style={styles.wallpaperStats}>
                    <View style={styles.statItem}>
                        <Ionicons name="eye" size={12} color="#fff" />
                        <Text style={styles.statText}>{wallpaper.views}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <FontAwesome5 name="thumbs-up" size={12} color="#fff" />
                        <Text style={styles.statText}>{wallpaper.likes_count}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <FontAwesome5 name="comment" size={12} color="#fff" />
                        <Text style={styles.statText}>{wallpaper.comments_count}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="download" size={12} color="#fff" />
                        <Text style={styles.statText}>{wallpaper.downloads}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Side Menu */}
            <Animated.View style={[
                styles.sideMenu,
                { transform: [{ translateX: menuAnimation }] }
            ]}>
                <ScrollView style={styles.menuItems}>
                    {/* Premium Subscription */}
                    <TouchableOpacity style={styles.premiumContainer} onPress={() => navigation.navigate('Subscription')}>
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
                        <Text style={styles.categoryTitle}>Kategoriler</Text>
                        {loadingCategories ? (
                            <View style={styles.loadingContainer}>
                                <LottieView
                                    source={require('../../assets/animations/loaderanimate.json')}
                                    autoPlay
                                    loop
                                    style={styles.loadingAnimation}
                                />
                            </View>
                        ) : categories.map((category) => (
                            <TouchableOpacity 
                                key={category.id} 
                                style={styles.menuItem}
                                onPress={() => {
                                    toggleMenu();
                                    navigation.navigate('CategoryDetail', { categoryId: category.id });
                                }}
                            >
                                <Image source={{ uri: category.icon }} style={styles.menuItemImage} />
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
                        
                        <Text style={styles.headerTitle}>Hello, {userDetail?.username}! </Text>
                        <Text style={styles.headerSubtitle}>Find high-quality free wallpapers!</Text>
                    </View>
                </View>
                
                {/* Content with white background */}
                <View style={styles.contentContainer}>
                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {/* Wallpapers Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Wallpapers</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('WallpaperHome')}>
                                    <Text style={styles.moreText}>More</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {/* Search Bar */}
                            <View style={styles.searchContainer}>
                                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                                <TextInput 
                                    style={styles.searchInput}
                                    placeholder="Duvar kağıdı ara"
                                    placeholderTextColor="#999"
                                />
                            </View>
                            
                            <Text style={styles.sectionSubtitle}>Popular Now</Text>
                            
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                                {loadingPopular ? (
                                    <View style={styles.loadingContainer}>
                                        <LottieView
                                            source={require('../../assets/animations/loaderanimate.json')}
                                            autoPlay
                                            loop
                                            style={styles.loadingAnimation}
                                        />
                                    </View>
                                ) : popularWallpapers.length > 0 ? (
                                    popularWallpapers.map(renderPopularWallpaper)
                                ) : (
                                    <View style={styles.emptyContainer}>
                                        <Text style={styles.emptyText}>Popular wallpaper not found</Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                        
                        {/* Categories Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Categories</Text>
                            </View>
                            
                            <View style={styles.categoriesGrid}>
                                {loadingCategories ? (
                                    <View style={styles.loadingContainer}>
                                        <LottieView
                                            source={require('../../assets/animations/loaderanimate.json')}
                                            autoPlay
                                            loop
                                            style={styles.loadingAnimation}
                                        />
                                    </View>
                                ) : categories.map(renderCategoryItem)}
                            </View>
                            
                            <TouchableOpacity 
                                style={styles.moreButton}
                                onPress={() => navigation.navigate('WallpaperHome')}
                            >
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
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
        position: 'relative',
    },
    wallpaperImage: {
        width: 150,
        height: 200,
        borderRadius: 12,
    },
    wallpaperOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
    },
    wallpaperTitle: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        marginBottom: 5,
    },
    wallpaperStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        color: '#fff',
        fontSize: 12,
        marginLeft: 5,
    },
    loadingContainer: {
        width: 150,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingAnimation: {
        width: 100,
        height: 100,
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
    emptyContainer: {
        width: 150,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
    },
    emptyText: {
        color: '#666',
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        textAlign: 'center',
        padding: 10,
    },
    wallpaperActions: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        zIndex: 2,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;