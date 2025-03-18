import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, SafeAreaView, TextInput, Text, TouchableOpacity, ActivityIndicator, FlatList, Dimensions, Alert, Platform, Linking, Share } from 'react-native';
import BottomNavigator from '../components/BottomNavigator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { PixabayImage, PixabayResponse } from '../types/PixabayTypes';
import { PIXABAY_API_KEY } from '../config/constants';




const PixabayScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [images, setImages] = useState<PixabayImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState<{[key: number]: boolean}>({});
    const [hasMediaPermission, setHasMediaPermission] = useState(false);


    useEffect(() => {
        (async () => {
            try {
                const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
                
                if (status === 'granted') {
                    setHasMediaPermission(true);
                } else if (canAskAgain) {
                    const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
                    setHasMediaPermission(newStatus === 'granted');
                } else {
                    // İzin verilmedi ve tekrar istenemez
                    setHasMediaPermission(false);
                }
            } catch (error) {
                console.log('İzin kontrolü sırasında hata:', error);
                setHasMediaPermission(false);
            }
        })();
    }, []);

    // Görüntüyü indir ve kaydet
    const downloadAndSaveImage = async (image: PixabayImage) => {
        setDownloading(prev => ({...prev, [image.id]: true}));
        
        try {
            const fileName = `pixabay-${image.id}-${Date.now()}.jpg`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;
            
            const downloadResumable = FileSystem.createDownloadResumable(
                image.largeImageURL,
                fileUri,
                {}
            );
            
            const downloadResult = await downloadResumable.downloadAsync();
            
            if (downloadResult && downloadResult.uri) {
                const permissionCheck = await ensureMediaLibraryPermissions();
                
                if (permissionCheck) {
                    try {
                        const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
                        
                        try {
                            const album = await MediaLibrary.getAlbumAsync('Pixabay');
                            
                            if (album) {
                                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                            } else {
                                await MediaLibrary.createAlbumAsync('Pixabay', asset, false);
                            }
                            
                            Alert.alert('Başarılı', 'Görüntü galerinize kaydedildi!');
                        } catch (albumError) {
                            console.log('Albüm oluşturma hatası:', albumError);
                            // Albüm oluşturulamasa bile dosya kaydedildi
                            Alert.alert('Başarılı', 'Görüntü galeriye kaydedildi!');
                        }
                    } catch (mediaError) {
                        console.log('Medya kütüphanesi hatası:', mediaError);
                        Alert.alert('Kısmi Başarı', 'Görüntü indirildi fakat galeriye eklenemedi.');
                    }
                } else {
                    Alert.alert('Kısmi Başarı', 'Görüntü indirildi fakat galeriye eklenemedi. Galeri izni gerekli.');
                }
            } else {
                Alert.alert('İndirme Hatası', 'Görüntü indirilemedi.');
            }
        } catch (err) {
            const error = err as Error;
            console.log('İndirme hatası:', error);
            Alert.alert('İndirme Hatası', `İndirme sırasında bir hata oluştu.`);
        } finally {
            setDownloading(prev => ({...prev, [image.id]: false}));
        }
    };
    
    // MediaLibrary izinlerini kontrol eden ve sağlayan yardımcı fonksiyon
    const ensureMediaLibraryPermissions = async (): Promise<boolean> => {
        try {
            // Mevcut izin durumunu kontrol et
            const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
            
            // İzin zaten varsa
            if (status === 'granted') {
                setHasMediaPermission(true);
                return true;
            }
            
            // İzin yoksa ve isteme şansımız varsa
            if (canAskAgain) {
                const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
                const hasPermission = newStatus === 'granted';
                setHasMediaPermission(hasPermission);
                return hasPermission;
            }
            
            // İzin yok ve isteme şansımız da yok
            setHasMediaPermission(false);
            return false;
        } catch (error) {
            console.log('İzin kontrolü hatası:', error);
            return false;
        }
    };
    
    // Görüntü indirme fonksiyonu - Expo uyumlu
    const downloadImage = async (image: PixabayImage) => {
        const hasPermission = await ensureMediaLibraryPermissions();
        
        if (!hasPermission) {
            Alert.alert(
                'İzin Gerekli', 
                'Görüntüleri kaydetmek için medya kitaplığı izni gerekli.',
                [
                    { text: 'İptal', style: 'cancel' },
                    { text: 'Ayarlar', onPress: () => Linking.openSettings() }
                ]
            );
            return;
        }
        
        downloadAndSaveImage(image);
    };
    
    // Görüntü paylaşma fonksiyonu
    const shareImage = async (image: PixabayImage) => {
        try {
            await Share.share({
                message: `Pixabay'de bulduğum harika bir görüntü: ${image.largeImageURL}`,
                url: image.largeImageURL,
                title: 'Pixabay Görüntüsü Paylaş'
            });
        } catch (error) {
            console.log('Paylaşım hatası:', error);
        }
    };

    // Görüntüleri arama fonksiyonu
    const searchImages = async () => {
        if (!searchQuery.trim()) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(
                `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(searchQuery)}&image_type=photo&per_page=20`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                }
            );
            
            const data: PixabayResponse = await response.json();
            
            if (response.ok) {
                setImages(data.hits);
                if (data.hits.length === 0) {
                    setError('Arama sonucu bulunamadı');
                }
            } else {
                setError('Görüntü arama hatası: API yanıt vermiyor');
            }
        } catch (err) {
            const error = err as Error;
            setError('Bağlantı hatası: ' + error.message);
        } finally {
            setLoading(false);
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
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Görüntü aramak için yazın..."
                                placeholderTextColor="#DDDDDD"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={searchImages}
                            />
                            <TouchableOpacity 
                                style={styles.searchButton}
                                onPress={searchImages}
                            >
                                <Text style={styles.searchButtonText}>Ara</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
                    ) : error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : (
                        <FlatList
                            data={images}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={1}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContainer}
                            renderItem={({item}) => (
                                <View style={styles.card}>
                                    <Image 
                                        source={{uri: item.largeImageURL}} 
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.cardContent}>
                                        <View style={styles.userInfoContainer}>
                                            <Text style={styles.photographerText}>Fotoğrafçı: {item.user}</Text>
                                            <View style={styles.statsContainer}>
                                                <Text style={styles.statsText}>❤️ {item.likes}</Text>
                                                <Text style={styles.statsText}>👁️ {item.views}</Text>
                                            </View>
                                        </View>
                                        
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity 
                                                style={styles.iconButton} 
                                                onPress={() => downloadImage(item)}
                                                disabled={downloading[item.id]}
                                            >
                                                {downloading[item.id] ? (
                                                    <ActivityIndicator size="small" color="#fff" />
                                                ) : (
                                                    <Ionicons name="download-outline" size={18} color="#fff" />
                                                )}
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity 
                                                style={[styles.iconButton, styles.shareIconButton]} 
                                                onPress={() => shareImage(item)}
                                            >
                                                <Ionicons name="share-social-outline" size={18} color="#fff" />
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity 
                                                style={[styles.iconButton, styles.openIconButton]} 
                                                onPress={() => Linking.openURL(item.largeImageURL)}
                                            >
                                                <Ionicons name="open-outline" size={18} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>
                                    {searchQuery ? 'Arama sonucu bulunamadı' : 'Görüntüleri aramak için yukarıdaki arama çubuğunu kullanın'}
                                </Text>
                            }
                        />
                    )}
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
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        padding: 5,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    searchButton: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    searchButtonText: {
        color: '#333',
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
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 260,
    },
    cardContent: {
        padding: 15,
    },
    userInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    photographerText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
    },
    statsText: {
        color: '#666',
        fontSize: 12,
        marginLeft: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 5,
    },
    iconButton: {
        backgroundColor: '#4CAF50',
        width: 32,
        height: 32,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    shareIconButton: {
        backgroundColor: '#2196F3',
    },
    openIconButton: {
        backgroundColor: '#9E9E9E',
    },
    loader: {
        marginTop: 50,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 30,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#666',
    },
});

export default PixabayScreen;      
