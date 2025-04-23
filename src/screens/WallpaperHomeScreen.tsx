import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    StyleSheet, 
    Image, 
    SafeAreaView, 
    ScrollView, 
    TouchableOpacity, 
    Text, 
    ActivityIndicator, 
    Alert,
    TextInput,
    Modal,
    Switch,
    FlatList,
    Dimensions,
    Animated,
    StatusBar
} from 'react-native';
import BottomNavigator from '../components/BottomNavigator';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/NavigationTypes';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getAllWallpapers, likeWallpaper, unlikeWallpaper, searchWallpapers } from '../services/wallpaperService';
import { getAllCategories } from '../services/categoryService';
import { addFavorite, removeFavorite } from '../services/favoriteService';
import { Wallpaper, WallpaperResponse } from '../types/WallpaperTypes';
import { Category } from '../types/CategoryTypes';
import LottieView from 'lottie-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.75;
const BOTTOM_SHEET_MIN_HEIGHT = 0;

const WallpaperHomeScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [filterVisible, setFilterVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [isPremiumFilter, setIsPremiumFilter] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [isSearchActive, setIsSearchActive] = useState(false);
    
    // Bottom sheet animation
    const bottomSheetAnimation = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;
    
    // Open/close bottom sheet
    const openBottomSheet = () => {
        setFilterVisible(true);
        Animated.timing(bottomSheetAnimation, {
            toValue: BOTTOM_SHEET_MAX_HEIGHT,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };
    
    const closeBottomSheet = () => {
        Animated.timing(bottomSheetAnimation, {
            toValue: BOTTOM_SHEET_MIN_HEIGHT,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            setFilterVisible(false);
        });
    };

    // Kategori listesini yükle
    useEffect(() => {
        fetchCategories();
    }, []);

    // Sayfa değiştiğinde veya filtreleme yapıldığında duvar kağıtlarını yükle
    useEffect(() => {
        if (isSearchActive || searchQuery || selectedCategory !== null || isPremiumFilter !== null || sortBy) {
            handleSearch();
        } else {
            fetchWallpapers();
        }
    }, [page, isSearchActive, selectedCategory, isPremiumFilter, sortBy, sortDirection]);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            if (response.status) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Kategoriler yüklenirken hata oluştu:', error);
        }
    };

    const fetchWallpapers = async () => {
        try {
            setLoading(true);
            const response = await getAllWallpapers(page);
            console.log('Fetch wallpapers API Response:');

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

    const handleSearch = async () => {
        try {
            setLoading(true);
            
            // Arama parametrelerini hazırla
            const searchParams: any = {
                page,
                limit: 10
            };
            
            if (searchQuery) {
                searchParams.query = searchQuery;
            }
            
            if (selectedCategory !== null) {
                searchParams.category = selectedCategory;
            }
            
            if (isPremiumFilter !== null) {
                searchParams.is_premium = isPremiumFilter;
            }
            
            if (sortBy) {
                searchParams.sort = sortBy;
                searchParams.direction = sortDirection;
            }
            
            const response = await searchWallpapers(searchParams);
            
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
                console.error('Geçersiz arama API yanıtı:', response);
                setHasMore(false);
            }
        } catch (error) {
            console.error('Duvar kağıtları aranırken hata oluştu:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = () => {
        setPage(1); // Aramada sayfa numarasını sıfırla
        setIsSearchActive(true);
        handleSearch();
    };

    const checkAndResetSearchState = () => {
        // Eğer tüm filtreler boşsa, arama durumunu sıfırla ve duvar kağıtlarını yeniden yükle
        if (!searchQuery && selectedCategory === null && isPremiumFilter === null && sortBy === null) {
            setIsSearchActive(false);
            fetchWallpapers(); // Tüm duvar kağıtlarını yeniden yükle
        }
    };

    // Arama sorgusunu temizlediğimizde
    const clearSearchQuery = () => {
        setSearchQuery('');
        // Tüm diğer filtreler de boşsa, arama durumunu sıfırla
        if (selectedCategory === null && isPremiumFilter === null && sortBy === null) {
            setIsSearchActive(false);
            fetchWallpapers();
        } else {
            // Başka filtreler varsa sadece aramayı güncelle
            setPage(1);
            handleSearch();
        }
    };

    // Kategori filtresini temizlediğimizde
    const clearCategoryFilter = () => {
        setSelectedCategory(null);
        // Tüm diğer filtreler de boşsa, arama durumunu sıfırla
        if (!searchQuery && isPremiumFilter === null && sortBy === null) {
            setIsSearchActive(false);
            fetchWallpapers();
        } else {
            // Başka filtreler varsa sadece aramayı güncelle
            setPage(1);
            handleSearch();
        }
    };

    // Premium filtresini temizlediğimizde
    const clearPremiumFilter = () => {
        setIsPremiumFilter(null);
        // Tüm diğer filtreler de boşsa, arama durumunu sıfırla
        if (!searchQuery && selectedCategory === null && sortBy === null) {
            setIsSearchActive(false);
            fetchWallpapers();
        } else {
            // Başka filtreler varsa sadece aramayı güncelle
            setPage(1);
            handleSearch();
        }
    };

    // Sıralama filtresini temizlediğimizde
    const clearSortFilter = () => {
        setSortBy(null);
        // Tüm diğer filtreler de boşsa, arama durumunu sıfırla
        if (!searchQuery && selectedCategory === null && isPremiumFilter === null) {
            setIsSearchActive(false);
            fetchWallpapers();
        } else {
            // Başka filtreler varsa sadece aramayı güncelle
            setPage(1);
            handleSearch();
        }
    };

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
                    //Alert.alert('Başarılı', response.message);
                } else {
                    //Alert.alert('Hata', response.message);
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
                    //Alert.alert('Başarılı', response.message);
                } else {
                    //Alert.alert('Hata', response.message);
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
                //Alert.alert('Başarılı', response.message);
            } else {
                //Alert.alert('Hata', response.message);
            }
        } catch (error) {
            console.error('Beğeni işlemi sırasında hata oluştu:', error);
            Alert.alert('Hata', 'İşlem sırasında bir hata oluştu');
        }
    };

    const renderWallpaperItem = (wallpaper: Wallpaper, index: number) => (
        <TouchableOpacity 
            key={`wallpaper-${wallpaper.id}-${index}`} 
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
                <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">{wallpaper.title}</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <FontAwesome5 name="eye" size={12} color="#fff" />
                        <Text style={styles.statText}>{wallpaper.views || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <FontAwesome5 name="thumbs-up" size={12} color="#fff" />
                        <Text style={styles.statText}>{wallpaper.likes_count || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <FontAwesome5 name="comment" size={12} color="#fff" />
                        <Text style={styles.statText}>{wallpaper.comments_count || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <FontAwesome5 name="download" size={12} color="#fff" />
                        <Text style={styles.statText}>{wallpaper.downloads || 0}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
        setIsPremiumFilter(null);
        setSortBy(null);
        setSortDirection('desc');
        setIsSearchActive(false);
        setPage(1);
        setFilterVisible(false);
        fetchWallpapers();
    };

    const applyFilters = () => {
        setPage(1);
        setIsSearchActive(true);
        setFilterVisible(false);
        handleSearch();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
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
                        <View style={styles.headerContent}>
                            <Text style={styles.HeaderText}>Duvar Kağıtları</Text>
                        </View>
                    </View>
                </View>
                {/* İçerik */}
                <View style={styles.contentContainer}>
                    {/* Arama Çubuğu */}
                    <View style={styles.searchOuterContainer}>
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                            <TextInput 
                                style={styles.searchInput}
                                placeholder="Duvar kağıdı ara..."
                                placeholderTextColor="#999"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                returnKeyType="search"
                                onSubmitEditing={handleSearchSubmit}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity
                                    style={styles.clearButton}
                                    onPress={() => {
                                        clearSearchQuery();
                                    }}
                                >
                                    <Ionicons name="close-circle" size={20} color="#999" />
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity 
                            style={styles.filterButton}
                            onPress={openBottomSheet}
                        >
                            <MaterialIcons name="tune" size={24} color="#4285F4" />
                        </TouchableOpacity>
                    </View>
                    
                    {/* Aktif filtreler */}
                    {isSearchActive && (
                        <View style={styles.activeFiltersContainer}>
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false}
                            >
                                {searchQuery && (
                                    <View key={`filter-search-${Date.now()}`} style={styles.filterChip}>
                                        <Text style={styles.filterChipText}>
                                            Arama: {searchQuery}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                clearSearchQuery();
                                            }}
                                        >
                                            <Ionicons name="close-circle" size={16} color="#666" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                                
                                {selectedCategory !== null && (
                                    <View key={`filter-category-${Date.now()}`} style={styles.filterChip}>
                                        <Text style={styles.filterChipText}>
                                            Kategori: {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                clearCategoryFilter();
                                            }}
                                        >
                                            <Ionicons name="close-circle" size={16} color="#666" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                                
                                {isPremiumFilter !== null && (
                                    <View key={`filter-premium-${Date.now()}`} style={styles.filterChip}>
                                        <Text style={styles.filterChipText}>
                                            {isPremiumFilter === 1 ? 'Premium' : 'Ücretsiz'}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                clearPremiumFilter();
                                            }}
                                        >
                                            <Ionicons name="close-circle" size={16} color="#666" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                                
                                {sortBy && (
                                    <View key={`filter-sort-${Date.now()}`} style={styles.filterChip}>
                                        <Text style={styles.filterChipText}>
                                            Sıralama: {
                                                sortBy === 'created_at' ? 'Tarih' : 
                                                sortBy === 'views' ? 'Görüntülenme' : 
                                                sortBy === 'downloads' ? 'İndirme' : 
                                                sortBy === 'likes' ? 'Beğeni' : 
                                                sortBy
                                            } ({sortDirection === 'desc' ? 'Azalan' : 'Artan'})
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                clearSortFilter();
                                            }}
                                        >
                                            <Ionicons name="close-circle" size={16} color="#666" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                                
                                {isSearchActive && (
                                    <TouchableOpacity
                                        style={styles.resetButton}
                                        onPress={resetFilters}
                                    >
                                        <Text style={styles.resetButtonText}>Sıfırla</Text>
                                    </TouchableOpacity>
                                )}
                            </ScrollView>
                        </View>
                    )}

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
                            {Array.isArray(wallpapers) && wallpapers.length > 0 ? (
                                wallpapers.map((wallpaper, index) => renderWallpaperItem(wallpaper, index))
                            ) : !loading && (
                                <View style={styles.emptyContainer}>
                                    <LottieView
                                        source={require('../../assets/animations/empty-planet.json')}
                                        autoPlay
                                        loop
                                        style={styles.emptyAnimation}
                                    />
                                    <Text style={styles.emptyText}>Duvar kağıdı bulunamadı</Text>
                                </View>
                            )}
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
                        <View style={{ height: 100 }}></View>
                    </ScrollView>
                </View>
            </View>
            
            {/* Bottom Sheet */}
            {filterVisible && (
                <TouchableOpacity 
                    style={styles.bottomSheetOverlay} 
                    activeOpacity={1}
                    onPress={closeBottomSheet}
                >
                    <Animated.View 
                        style={[
                            styles.bottomSheetContainer, 
                            { height: bottomSheetAnimation }
                        ]}
                    >
                        <TouchableOpacity 
                            activeOpacity={1} 
                            style={styles.bottomSheetContent}
                            onPress={e => e.stopPropagation()}
                        >
                            <View style={styles.bottomSheetHandle} />
                            
                            <View style={styles.bottomSheetHeader}>
                                <Text style={styles.bottomSheetTitle}>Filtreler</Text>
                                <TouchableOpacity onPress={closeBottomSheet} style={styles.closeButton}>
                                    <Ionicons name="close" size={22} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            
                            <ScrollView style={styles.filterScrollContent} showsVerticalScrollIndicator={false}>
                                {/* Kategori Filtresi */}
                                <View style={styles.filterSection}>
                                    <View style={styles.filterSectionHeader}>
                                        <View style={styles.filterTitleContainer}>
                                            <Ionicons name="grid-outline" size={20} color="#4285F4" />
                                            <Text style={styles.filterSectionTitle}>Kategori</Text>
                                        </View>
                                    </View>
                                    <ScrollView 
                                        horizontal 
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.categoriesScroll}
                                    >
                                        <TouchableOpacity
                                            key={`category-all-${Date.now()}`}
                                            style={[
                                                styles.categoryChip,
                                                selectedCategory === null && styles.categoryChipSelected
                                            ]}
                                            onPress={() => setSelectedCategory(null)}
                                        >
                                            <Ionicons 
                                                name="apps" 
                                                size={16} 
                                                color={selectedCategory === null ? "#fff" : "#555"} 
                                            />
                                            <Text style={[
                                                styles.categoryChipText,
                                                selectedCategory === null && styles.categoryChipTextSelected
                                            ]}>Tümü</Text>
                                        </TouchableOpacity>
                                        
                                        {categories.map(category => (
                                            <TouchableOpacity
                                                key={`category-${category.id}`}
                                                style={[
                                                    styles.categoryChip,
                                                    selectedCategory === category.id && styles.categoryChipSelected
                                                ]}
                                                onPress={() => setSelectedCategory(category.id)}
                                            >
                                                <Text style={[
                                                    styles.categoryChipText,
                                                    selectedCategory === category.id && styles.categoryChipTextSelected
                                                ]}>{category.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                                
                                {/* Premium Filtresi */}
                                <View style={styles.filterSection}>
                                    <View style={styles.filterSectionHeader}>
                                        <View style={styles.filterTitleContainer}>
                                            <FontAwesome5 name="crown" size={16} color="#f1c40f" />
                                            <Text style={styles.filterSectionTitle}>Duvar Kağıdı Türü</Text>
                                        </View>
                                    </View>
                                    <View style={styles.premiumFilterContainer}>
                                        <TouchableOpacity
                                            key={`premium-all-${Date.now()}`}
                                            style={[
                                                styles.premiumFilterButton,
                                                isPremiumFilter === null && styles.premiumFilterButtonSelected
                                            ]}
                                            onPress={() => setIsPremiumFilter(null)}
                                        >
                                            <Ionicons 
                                                name="albums-outline" 
                                                size={16} 
                                                color={isPremiumFilter === null ? "#fff" : "#555"} 
                                            />
                                            <Text style={[
                                                styles.premiumFilterButtonText,
                                                isPremiumFilter === null && styles.premiumFilterButtonTextSelected
                                            ]}>Tümü</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            key={`premium-free-${Date.now()}`}
                                            style={[
                                                styles.premiumFilterButton,
                                                isPremiumFilter === 0 && styles.premiumFilterButtonSelected
                                            ]}
                                            onPress={() => setIsPremiumFilter(0)}
                                        >
                                            <Ionicons 
                                                name="image-outline" 
                                                size={16} 
                                                color={isPremiumFilter === 0 ? "#fff" : "#555"} 
                                            />
                                            <Text style={[
                                                styles.premiumFilterButtonText,
                                                isPremiumFilter === 0 && styles.premiumFilterButtonTextSelected
                                            ]}>Ücretsiz</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            key={`premium-paid-${Date.now()}`}
                                            style={[
                                                styles.premiumFilterButton,
                                                isPremiumFilter === 1 && styles.premiumFilterButtonSelected
                                            ]}
                                            onPress={() => setIsPremiumFilter(1)}
                                        >
                                            <FontAwesome5 
                                                name="crown" 
                                                size={14} 
                                                color={isPremiumFilter === 1 ? "#fff" : "#f1c40f"} 
                                            />
                                            <Text style={[
                                                styles.premiumFilterButtonText,
                                                isPremiumFilter === 1 && styles.premiumFilterButtonTextSelected
                                            ]}>Premium</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                                {/* Sıralama */}
                                <View style={styles.filterSection}>
                                    <View style={styles.filterSectionHeader}>
                                        <View style={styles.filterTitleContainer}>
                                            <MaterialIcons name="sort" size={20} color="#4285F4" />
                                            <Text style={styles.filterSectionTitle}>Sıralama</Text>
                                        </View>
                                    </View>
                                    <View style={styles.sortOptionsGrid}>
                                        <TouchableOpacity
                                            key={`sort-created-at-${Date.now()}`}
                                            style={[
                                                styles.sortOptionButton,
                                                sortBy === 'created_at' && styles.sortOptionButtonSelected
                                            ]}
                                            onPress={() => setSortBy('created_at')}
                                        >
                                            <Ionicons 
                                                name="calendar-outline" 
                                                size={18} 
                                                color={sortBy === 'created_at' ? "#fff" : "#555"} 
                                            />
                                            <Text style={[
                                                styles.sortOptionButtonText,
                                                sortBy === 'created_at' && styles.sortOptionButtonTextSelected
                                            ]}>Tarih</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            key={`sort-views-${Date.now()}`}
                                            style={[
                                                styles.sortOptionButton,
                                                sortBy === 'views' && styles.sortOptionButtonSelected
                                            ]}
                                            onPress={() => setSortBy('views')}
                                        >
                                            <Ionicons 
                                                name="eye-outline" 
                                                size={18} 
                                                color={sortBy === 'views' ? "#fff" : "#555"} 
                                            />
                                            <Text style={[
                                                styles.sortOptionButtonText,
                                                sortBy === 'views' && styles.sortOptionButtonTextSelected
                                            ]}>Görüntülenme</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            key={`sort-downloads-${Date.now()}`}
                                            style={[
                                                styles.sortOptionButton,
                                                sortBy === 'downloads' && styles.sortOptionButtonSelected
                                            ]}
                                            onPress={() => setSortBy('downloads')}
                                        >
                                            <Ionicons 
                                                name="download-outline" 
                                                size={18} 
                                                color={sortBy === 'downloads' ? "#fff" : "#555"} 
                                            />
                                            <Text style={[
                                                styles.sortOptionButtonText,
                                                sortBy === 'downloads' && styles.sortOptionButtonTextSelected
                                            ]}>İndirme</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            key={`sort-likes-${Date.now()}`}
                                            style={[
                                                styles.sortOptionButton,
                                                sortBy === 'likes' && styles.sortOptionButtonSelected
                                            ]}
                                            onPress={() => setSortBy('likes')}
                                        >
                                            <Ionicons 
                                                name="thumbs-up-outline" 
                                                size={18} 
                                                color={sortBy === 'likes' ? "#fff" : "#555"} 
                                            />
                                            <Text style={[
                                                styles.sortOptionButtonText,
                                                sortBy === 'likes' && styles.sortOptionButtonTextSelected
                                            ]}>Beğeni</Text>
                                        </TouchableOpacity>
                                    </View>
                                    
                                    {sortBy && (
                                        <View style={styles.sortDirectionContainer}>
                                            <Text style={styles.sortDirectionLabel}>Sıralama Yönü:</Text>
                                            <TouchableOpacity
                                                style={styles.sortDirectionButton}
                                                onPress={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
                                            >
                                                <Text style={styles.sortDirectionButtonText}>
                                                    {sortDirection === 'desc' ? 'Azalan' : 'Artan'}
                                                </Text>
                                                <MaterialIcons 
                                                    name={sortDirection === 'desc' ? 'arrow-downward' : 'arrow-upward'} 
                                                    size={16} 
                                                    color="#4285F4" 
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                            
                            <View style={styles.bottomSheetButtons}>
                                <TouchableOpacity
                                    style={styles.resetFiltersButton}
                                    onPress={resetFilters}
                                >
                                    <Ionicons name="refresh-outline" size={18} color="#333" style={{marginRight: 8}} />
                                    <Text style={styles.resetFiltersButtonText}>Sıfırla</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={styles.applyFiltersButton}
                                    onPress={applyFilters}
                                >
                                    <MaterialIcons name="done" size={18} color="#fff" style={{marginRight: 8}} />
                                    <Text style={styles.applyFiltersButtonText}>Uygula</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            )}
            
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

    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 15,
    },
    searchOuterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        paddingHorizontal: 10,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 45,
    },
    headerBanner: {
        height: 140,
        position: 'relative',
        width: '100%',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    headerOverlay: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 15,
        height: '100%',
        justifyContent: 'center',
        paddingTop: StatusBar.currentHeight || 0, // Status bar yüksekliğini hesaba kat
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    HeaderText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Montserrat-Bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        textAlign: 'center',
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 20,
        left: 15,
        zIndex: 10,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 30,
        fontSize: 16,
        color: '#333',
    },
    clearButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    activeFiltersContainer: {
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 5,
    },
    filterChipText: {
        color: '#333',
        fontSize: 12,
        marginRight: 5,
    },
    resetButton: {
        paddingHorizontal: 15,
        paddingVertical: 6,
        backgroundColor: '#ff4757',
        borderRadius: 20,
        marginRight: 8,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
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
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statItem: {
        flexDirection: 'row',
        width: '48%',
        alignItems: 'center',
    },
    statText: {
        color: '#fff',
        fontSize: 12,
        marginLeft: 5,
    },
    loader: {
        marginVertical: 20,
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
    bottomSheetOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
    },
    bottomSheetContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        zIndex: 1001,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 20,
    },
    bottomSheetContent: {
        flex: 1,
        padding: 20,
    },
    bottomSheetHandle: {
        width: 50,
        height: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginBottom: 20,
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    bottomSheetTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Montserrat-Bold',
    },
    filterScrollContent: {
        marginBottom: 20,
    },
    filterSection: {
        marginBottom: 25,
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    filterSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    filterTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterSectionTitle: {
        color: '#333',
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        marginLeft: 10,
    },
    categoriesScroll: {
        flexDirection: 'row',
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        marginRight: 10,
        marginVertical: 5,
        minWidth: 80,
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    categoryChipSelected: {
        backgroundColor: '#4285F4',
        borderColor: '#4285F4',
    },
    categoryChipText: {
        color: '#555',
        fontSize: 13,
        fontFamily: 'Montserrat-Medium',
        marginLeft: 5,
    },
    categoryChipTextSelected: {
        color: '#fff',
    },
    premiumFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    premiumFilterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        margin: 5,
        minWidth: 100,
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    premiumFilterButtonSelected: {
        backgroundColor: '#4285F4',
        borderColor: '#4285F4',
    },
    premiumFilterButtonText: {
        color: '#555',
        fontSize: 13,
        fontFamily: 'Montserrat-Medium',
        marginLeft: 6,
    },
    premiumFilterButtonTextSelected: {
        color: '#fff',
    },
    sortOptionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    sortOptionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        marginBottom: 10,
        width: '48%',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sortOptionButtonSelected: {
        backgroundColor: '#4285F4',
        borderColor: '#4285F4',
    },
    sortOptionButtonText: {
        color: '#555',
        fontSize: 13,
        fontFamily: 'Montserrat-Medium',
        marginLeft: 6,
    },
    sortOptionButtonTextSelected: {
        color: '#fff',
    },
    sortDirectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 10,
        backgroundColor: '#f0f7ff',
        borderRadius: 15,
        padding: 10,
    },
    sortDirectionLabel: {
        color: '#333',
        fontSize: 13,
        fontFamily: 'Montserrat-Medium',
        marginRight: 10,
    },
    sortDirectionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    sortDirectionButtonText: {
        color: '#333',
        fontSize: 12,
        fontFamily: 'Montserrat-Medium',
        marginRight: 5,
    },
    bottomSheetButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 10,
    },
    resetFiltersButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 25,
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
    },
    resetFiltersButtonText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Montserrat-Medium',
    },
    applyFiltersButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 25,
        backgroundColor: '#4285F4',
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    applyFiltersButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Montserrat-Medium',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyAnimation: {
        width: 150,
        height: 150,
    },
    emptyText: {
        color: '#666',
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        textAlign: 'center',
    },
    closeButton: {
        width: 34,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff4757',
        borderRadius: 17,
    },
    premiumBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#f1c40f',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 10,
    },
    premiumText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 3,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});

export default WallpaperHomeScreen;      
