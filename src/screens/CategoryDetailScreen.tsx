import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import BottomNavigator from '../components/BottomNavigator';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/NavigationTypes';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { getWallpapersByCategory } from '../services/wallpaperService';
import { addFavorite, removeFavorite } from '../services/favoriteService';
import { likeWallpaper, unlikeWallpaper } from '../services/wallpaperService';
import { Wallpaper, WallpaperResponse } from '../types/WallpaperTypes';
import LottieView from 'lottie-react-native';
import { getAllCategories } from '../services/categoryService';
import { Category } from '../types/CategoryTypes';

type CategoryDetailRouteProp = RouteProp<RootStackParamList, 'CategoryDetail'>;

const CategoryDetailScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<CategoryDetailRouteProp>();
    const { categoryId } = route.params;
    
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);

    const fetchCategoryInfo = async () => {
        try {
            const response = await getAllCategories();
            if (response.status) {
                const category = response.data.find(cat => cat.id === categoryId);
                if (category) {
                    setCategoryInfo(category);
                }
            }
        } catch (error) {
            console.error('Kategori bilgisi alınırken hata oluştu:', error);
        }
    };

    const fetchWallpapers = async () => {
        try {
            setLoading(true);
            const response = await getWallpapersByCategory(categoryId, page);
            console.log('API Response:', response); // Debug için

            if (response.status && Array.isArray(response.data)) {
                const newWallpapers = response.data;
                if (page === 1) {
                    setWallpapers(newWallpapers);
                } else {
                    setWallpapers(prev => [...prev, ...newWallpapers]);
                }

                // Sayfalama kontrolü
                if (response.pagination) {
                    setHasMore(response.pagination.current_page < response.pagination.total_pages);
                } else {
                    setHasMore(newWallpapers.length > 0);
                }
            } else {
                console.error('Geçersiz API yanıtı:', response);
                setHasMore(false);
            }
        } catch (error) {
            console.error('Duvar kağıtları yüklenirken hata oluştu:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallpapers();
        fetchCategoryInfo();
    }, [categoryId, page]);

    const handleFavoritePress = async (wallpaper: Wallpaper) => {
        try {
            if (wallpaper.is_favorited === 1) {
                // Favorilerden kaldır
                const response = await removeFavorite(wallpaper.id);
                if (response.status) {
                    // Duvar kağıtlarını güncelle
                    setWallpapers(prev => prev.map(w => 
                        w.id === wallpaper.id 
                            ? { ...w, is_favorited: 0 }
                            : w
                    ));
                } else {
                    Alert.alert('Hata', response.message);
                }
            } else {
                // Favorilere ekle
                const response = await addFavorite(wallpaper.id);
                if (response.status) {
                    // Duvar kağıtlarını güncelle
                    setWallpapers(prev => prev.map(w => 
                        w.id === wallpaper.id 
                            ? { ...w, is_favorited: 1 }
                            : w
                    ));
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
                // Duvar kağıtlarını güncelle
                setWallpapers(prev => prev.map(w => 
                    w.id === wallpaper.id 
                        ? { ...w, is_liked: wallpaper.is_liked === 1 ? 0 : 1 }
                        : w
                ));
            } else {
                Alert.alert('Hata', response.message);
            }
        } catch (error) {
            console.error('Beğeni işlemi sırasında hata oluştu:', error);
            Alert.alert('Hata', 'İşlem sırasında bir hata oluştu');
        }
    };

    const renderWallpaperItem = (wallpaper: Wallpaper) => (
        <TouchableOpacity 
            key={wallpaper.id} 
            style={styles.item}
            onPress={() => navigation.navigate('WallpaperDetail', { wallpaperId: wallpaper.id })}
        >
            <Image
                source={{ uri: wallpaper.image_url }}
                style={styles.image}
            />
            <View style={styles.itemActions}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleFavoritePress(wallpaper)}
                >
                    <FontAwesome5 
                        name="heart" 
                        size={16} 
                        color={wallpaper.is_favorited === 1 ? "#ff4757" : "#fff"} 
                        solid={wallpaper.is_favorited === 1}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleLikePress(wallpaper)}
                >
                    <FontAwesome5 
                        name="thumbs-up" 
                        size={16} 
                        color={wallpaper.is_liked === 1 ? "#ffffff" : "#dddddd"} 
                        solid={wallpaper.is_liked === 1}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.itemOverlay}>
                <Text style={styles.itemTitle}>{wallpaper.title}</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <FontAwesome5 name="eye" size={12} color="#fff" />
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
                        <FontAwesome5 name="download" size={12} color="#fff" />
                        <Text style={styles.statText}>{wallpaper.downloads}</Text>
                    </View>
                </View>
            </View>
            {wallpaper.is_premium === 1 && (
                <View style={styles.premiumBadge}>
                    <FontAwesome5 name="crown" size={10} color="#fff" />
                    <Text style={styles.premiumText}>Premium</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.headerBanner}>
                    <Image 
                        source={require('../../assets/images/loginScreenTwo.jpg')} 
                        style={styles.headerImage}
                    />
                    <View style={styles.headerOverlay}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{categoryInfo?.name || 'Kategori'}</Text>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <ScrollView 
                        style={styles.scrollContent} 
                        showsVerticalScrollIndicator={false}
                        onScroll={({ nativeEvent }) => {
                            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                            const paddingToBottom = 20;
                            const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
                            
                            if (isCloseToBottom) {
                                handleLoadMore();
                            }
                        }}
                        scrollEventThrottle={400}
                    >
                        <View style={styles.gridContainer}>
                            {Array.isArray(wallpapers) && wallpapers.map(renderWallpaperItem)}
                        </View>
                        {loading && (
                            <View style={styles.loadingContainer}>
                                <LottieView
                                    source={require('../../assets/animations/loaderanimate.json')}
                                    autoPlay
                                    loop
                                    style={styles.loadingAnimation}
                                />
                            </View>
                        )}
                        {!loading && !hasMore && wallpapers.length > 0 && (
                            <View style={styles.endMessageContainer}>
                                <LottieView
                                    source={require('../../assets/animations/endanimate.json')}
                                    autoPlay
                                    loop={false}
                                    style={styles.endAnimation}
                                />
                                <Text style={styles.endMessageText}>Tüm duvar kağıtları yüklendi</Text>
                            </View>
                        )}
                        {!loading && wallpapers.length === 0 && (
                            <View style={styles.emptyContainer}>
                                <LottieView
                                    source={require('../../assets/animations/empty-planet.json')}
                                    autoPlay
                                    loop={true}
                                    style={styles.emptyAnimation}
                                />
                                <Text style={styles.emptyText}>Bu kategoride duvar kağıdı bulunamadı</Text>
                            </View>
                        )}
                        <View style={{ height: 100 }}></View>
                    </ScrollView>
                </View>
            </View>

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
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 15,
    },
    scrollContent: {
        flex: 1,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
    },
    item: {
        width: '48%',
        marginBottom: 15,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    itemOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
    },
    itemTitle: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        marginBottom: 5,
    },
    statsContainer: {
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingAnimation: {
        width: 120,
        height: 120,
    },
    endMessageContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    endAnimation: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
    endMessageText: {
        color: '#666',
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        textAlign: 'center',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyAnimation: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
        textAlign: 'center',
    },
    itemActions: {
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
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    premiumBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#f1c40f',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    premiumText: {
        color: '#fff',
        fontSize: 10,
        marginLeft: 3,
        fontWeight: 'bold',
    },
});

export default CategoryDetailScreen; 