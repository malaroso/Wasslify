import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import BottomNavigator from '../components/BottomNavigator';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/NavigationTypes';
import { getFavorites, removeFavorite } from '../services/favoriteService';
import { Wallpaper } from '../types/WallpaperTypes';
import { FontAwesome5 } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

const lists = [
    { id: '1', name: 'My List 1', image: require('../../assets/images/Abstract.jpg') },
    { id: '2', name: 'My List 2', image: require('../../assets/images/Nature.jpg') },
    // Diğer listeler...
];

const FavoritesScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [activeTab, setActiveTab] = useState('Favorites');
    const [favorites, setFavorites] = useState<Wallpaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [favoriteStates, setFavoriteStates] = useState<{ [key: number]: boolean }>({});

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const response = await getFavorites();
            if (response.status && Array.isArray(response.data)) {
                setFavorites(response.data);
                // Tüm favorilerin durumunu true olarak ayarla
                const newFavoriteStates = response.data.reduce((acc, wallpaper) => {
                    acc[wallpaper.id] = true;
                    return acc;
                }, {} as { [key: number]: boolean });
                setFavoriteStates(newFavoriteStates);
            }
        } catch (error) {
            console.error('Favoriler yüklenirken hata oluştu:', error);
            Alert.alert('Hata', 'Favoriler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleRemoveFavorite = async (wallpaperId: number) => {
        try {
            const response = await removeFavorite(wallpaperId);
            if (response.status) {
                // Favorilerden kaldır
                setFavorites(prev => prev.filter(wallpaper => wallpaper.id !== wallpaperId));
                setFavoriteStates(prev => ({
                    ...prev,
                    [wallpaperId]: false
                }));
                Alert.alert('Başarılı', response.message);
            } else {
                Alert.alert('Hata', response.message);
            }
        } catch (error) {
            console.error('Favori kaldırılırken hata oluştu:', error);
            Alert.alert('Hata', 'Favori kaldırılırken bir hata oluştu');
        }
    };

    const renderFavoriteItem = (wallpaper: Wallpaper) => (
        <TouchableOpacity 
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
                    onPress={() => handleRemoveFavorite(wallpaper.id)}
                >
                    <FontAwesome5 
                        name="heart" 
                        size={16} 
                        color="#ff4444" 
                        solid={true}
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
                        <FontAwesome5 name="download" size={12} color="#fff" />
                        <Text style={styles.statText}>{wallpaper.downloads}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderContent = () => {
        if (activeTab === 'Favorites') {
            if (loading) {
                return (
                    <View style={styles.loadingContainer}>
                        <LottieView
                            source={require('../../assets/animations/loaderanimate.json')}
                            autoPlay
                            loop
                            style={styles.loadingAnimation}
                        />
                    </View>
                );
            }

            if (favorites.length === 0) {
                return (
                    <View style={styles.emptyContainer}>
                        <LottieView
                            source={require('../../assets/animations/empty-planet.json')}
                            autoPlay
                            loop
                            style={styles.emptyAnimation}
                        />
                        <Text style={styles.emptyText}>Henüz favori duvar kağıdınız yok</Text>
                    </View>
                );
            }

            return (
                <FlatList
                    data={favorites}
                    renderItem={({ item }) => renderFavoriteItem(item)}
                    keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                />
            );
        } else {
            return (
                <FlatList
                    data={lists}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.item}>
                            <Image source={item.image} style={styles.image} />
                            <Text style={styles.name}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                />
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.headerBanner}>
                    <Image 
                        source={require('../../assets/images/loginScreenOne.jpg')} 
                        style={styles.headerImage}
                    />
                    <View style={styles.headerOverlay}>
                        <View style={styles.buttonContent}>
                            <TouchableOpacity
                                style={[
                                    styles.nextButton,
                                    { backgroundColor: activeTab === 'Favorites' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)' }
                                ]}
                                onPress={() => setActiveTab('Favorites')}
                            >
                                <Text style={styles.buttonText}>Favoriler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.nextButton,
                                    { backgroundColor: activeTab === 'Lists' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)' }
                                ]}
                                onPress={() => setActiveTab('Lists')}
                            >
                                <Text style={styles.buttonText}>Listeler</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {renderContent()}
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
        height: 120,
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
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 15,
        paddingBottom: 100,
    },
    scrollContent: {
        flex: 1,
    },
    item: {
        flex: 1,
        margin: 5,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 150,
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
    name: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingAnimation: {
        width: 100,
        height: 100,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyAnimation: {
        width: 200,
        height: 200,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
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

});

export default FavoritesScreen;      
