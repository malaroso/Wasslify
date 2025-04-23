import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity, Alert, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/NavigationTypes';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { getWallpaperById, getCommentsByWallpaper, addComment, deleteComment } from '../services/wallpaperService';
import { addFavorite, removeFavorite } from '../services/favoriteService';
import { likeWallpaper, unlikeWallpaper } from '../services/wallpaperService';
import { Wallpaper, Comment } from '../types/WallpaperTypes';
import LottieView from 'lottie-react-native';
import BottomNavigator from '../components/BottomNavigator';
import { useAuth } from '../context/AuthContext';

type WallpaperDetailRouteProp = RouteProp<RootStackParamList, 'WallpaperDetail'>;

const WallpaperDetailScreen = () => {
    const route = useRoute<WallpaperDetailRouteProp>();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { wallpaperId } = route.params;
    const { authState } = useAuth(); // Kullanıcı bilgisini al
    const currentUserId = authState?.userId;

    const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchWallpaperDetails();
    }, [wallpaperId]);

    const fetchWallpaperDetails = async () => {
        try {
            setLoading(true);
            const response = await getWallpaperById(wallpaperId);
            
            if (response.status && response.data) {
                setWallpaper(response.data);
                setError(null);
                // Yorumları yükle
                fetchComments();
            } else {
                setError(response.message || 'Duvar kağıdı detayları yüklenemedi');
            }
        } catch (error) {
            console.error('Duvar kağıdı detayları yüklenirken hata oluştu:', error);
            setError('Duvar kağıdı detayları yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            setLoadingComments(true);
            const response = await getCommentsByWallpaper(wallpaperId);
            
            if (response.status && Array.isArray(response.data)) {
                setComments(response.data);
            } else {
                console.error('Yorumlar yüklenemedi:', response);
            }
        } catch (error) {
            console.error('Yorumlar yüklenirken hata oluştu:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;
        
        try {
            setLoadingComments(true);
            const response = await addComment(wallpaperId, newComment.trim());
            
            if (response.status) {
                // Yorum başarıyla eklendi
                Alert.alert('Başarılı', response.message || 'Yorumunuz başarıyla eklendi');
                setNewComment(''); // Yorum alanını temizle
                
                // Yorum eklendikten sonra duvar kağıdı detaylarını ve yorumları yenile
                fetchWallpaperDetails();
                fetchComments();
            } else {
                // Yorum eklenirken hata oluştu
                Alert.alert('Hata', response.message || 'Yorum eklenirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Yorum gönderilirken hata oluştu:', error);
            Alert.alert('Hata', 'Yorum gönderilirken bir hata oluştu');
        } finally {
            setLoadingComments(false);
        }
    };

    const handleFavoritePress = async () => {
        if (!wallpaper) return;

        try {
            if (wallpaper.is_favorited === 1) {
                // Favorilerden kaldır
                const response = await removeFavorite(wallpaper.id);
                if (response.status) {
                    setWallpaper(prev => {
                        if (!prev) return null;
                        return { ...prev, is_favorited: 0 };
                    });
                    Alert.alert('Başarılı', response.message);
                } else {
                    Alert.alert('Hata', response.message);
                }
            } else {
                // Favorilere ekle
                const response = await addFavorite(wallpaper.id);
                if (response.status) {
                    setWallpaper(prev => {
                        if (!prev) return null;
                        return { ...prev, is_favorited: 1 };
                    });
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

    const handleLikePress = async () => {
        if (!wallpaper) return;

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
                setWallpaper(prev => {
                    if (!prev) return null;
                    return { ...prev, is_liked: prev.is_liked === 1 ? 0 : 1 };
                });
                Alert.alert('Başarılı', response.message);
            } else {
                Alert.alert('Hata', response.message);
            }
        } catch (error) {
            console.error('Beğeni işlemi sırasında hata oluştu:', error);
            Alert.alert('Hata', 'İşlem sırasında bir hata oluştu');
        }
    };

    const handleDownload = () => {
        // Download functionality to be implemented
        Alert.alert('İndiriliyor', 'Duvar kağıdı indirilmeye başlandı');
    };

    const handleSetWallpaper = () => {
        // Set as wallpaper functionality to be implemented
        Alert.alert('Duvar Kağıdı Ayarlanıyor', 'Duvar kağıdı ayarlanıyor');
    };

    const handleDeleteComment = async (commentId: number) => {
        // Silme işlemi onayı iste
        Alert.alert(
            "Yorumu Sil",
            "Bu yorumu silmek istediğinize emin misiniz?",
            [
                {
                    text: "İptal",
                    style: "cancel"
                },
                {
                    text: "Sil",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoadingComments(true);
                            const response = await deleteComment(commentId);
                            
                            if (response.status) {
                                // Yorum başarıyla silindi
                                Alert.alert('Başarılı', response.message || 'Yorum başarıyla silindi');
                                
                                // Yorumları yenile
                                fetchWallpaperDetails();
                                fetchComments();
                            } else {
                                // Yorum silinirken hata oluştu
                                Alert.alert('Hata', response.message || 'Yorum silinirken bir hata oluştu');
                            }
                        } catch (error) {
                            console.error('Yorum silinirken hata oluştu:', error);
                            Alert.alert('Hata', 'Yorum silinirken bir hata oluştu');
                        } finally {
                            setLoadingComments(false);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <LottieView
                    source={require('../../assets/animations/loaderanimate.json')}
                    autoPlay
                    loop
                    style={styles.loadingAnimation}
                />
            </SafeAreaView>
        );
    }

    if (error || !wallpaper) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Text style={styles.errorText}>{error || 'Duvar kağıdı bulunamadı'}</Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={fetchWallpaperDetails}
                >
                    <Text style={styles.retryButtonText}>Yeniden Dene</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleFavoritePress}
                    >
                        <Ionicons 
                            name={wallpaper.is_favorited === 1 ? "heart" : "heart-outline"} 
                            size={24} 
                            color={wallpaper.is_favorited === 1 ? "#ff4757" : "#fff"} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleLikePress}
                    >
                        <FontAwesome5 
                            name="thumbs-up" 
                            solid={wallpaper.is_liked === 1}
                            size={16} 
                            color={wallpaper.is_liked === 1 ? "#ffffff" : "#dddddd"} 
                        />
                    </TouchableOpacity>
                </View>
            </View>
            
            <ScrollView style={styles.scrollView}>
                <Image 
                    source={{ uri: wallpaper.image_url }}
                    style={styles.wallpaperImage}
                    resizeMode="cover"
                />
                
                {wallpaper.is_premium === 1 && (
                    <View style={styles.premiumBadge}>
                        <FontAwesome5 name="crown" size={12} color="#fff" />
                        <Text style={styles.premiumText}>Premium</Text>
                    </View>
                )}
                
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{wallpaper.title}</Text>
                    <Text style={styles.description}>{wallpaper.description}</Text>
                    
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailItem}>
                            <Ionicons name="eye" size={16} color="#666" />
                            <Text style={styles.detailText}>{wallpaper.views} görüntülenme</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <FontAwesome5 name="thumbs-up" size={14} color="#666" />
                            <Text style={styles.detailText}>{wallpaper.likes_count} beğeni</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="chatbubble-outline" size={16} color="#666" />
                            <Text style={styles.detailText}>{wallpaper.comments_count} yorum</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="download" size={16} color="#666" />
                            <Text style={styles.detailText}>{wallpaper.downloads} indirme</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="calendar" size={16} color="#666" />
                            <Text style={styles.detailText}>{new Date(wallpaper.created_at).toLocaleDateString()}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity 
                            style={styles.downloadButton}
                            onPress={handleDownload}
                        >
                            <Ionicons name="download" size={20} color="#fff" />
                            <Text style={styles.downloadButtonText}>İndir</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.setWallpaperButton}
                            onPress={handleSetWallpaper}
                        >
                            <Ionicons name="phone-portrait" size={20} color="#fff" />
                            <Text style={styles.setWallpaperButtonText}>Duvar Kağıdı Yap</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Yorumlar Bölümü */}
                    <View style={styles.commentsSection}>
                        <View style={styles.commentsTitleContainer}>
                            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#333" />
                            <Text style={styles.commentsTitle}>Yorumlar ({wallpaper.comments_count})</Text>
                        </View>
                        
                        {/* Yorum Yazma Alanı */}
                        <View style={styles.commentInputOuterContainer}>
                            <View style={styles.commentInputContainer}>
                                <View style={styles.commentAvatarContainer}>
                                    <Text style={styles.commentAvatarText}>U</Text>
                                </View>
                                <TextInput
                                    style={styles.commentInput}
                                    placeholder="Bir yorum yazın..."
                                    placeholderTextColor="#999"
                                    value={newComment}
                                    onChangeText={setNewComment}
                                    multiline
                                    editable={!loadingComments}
                                    maxLength={500}
                                />
                                <TouchableOpacity 
                                    style={[
                                        styles.commentSendButton, 
                                        (loadingComments || newComment.trim() === '') && styles.commentSendButtonDisabled
                                    ]}
                                    onPress={handleSubmitComment}
                                    disabled={loadingComments || newComment.trim() === ''}
                                >
                                    {loadingComments ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Ionicons name="send" size={18} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            </View>
                            {newComment.length > 0 && (
                                <Text style={styles.commentCharCount}>
                                    {newComment.length}/500
                                </Text>
                            )}
                        </View>
                        
                        {/* Yorumlar Listesi */}
                        {loadingComments && comments.length === 0 ? (
                            <View style={styles.loadingCommentsContainer}>
                                <LottieView
                                    source={require('../../assets/animations/loaderanimate.json')}
                                    autoPlay
                                    loop
                                    style={styles.loadingCommentsAnimation}
                                />
                                <Text style={styles.loadingCommentsText}>Yorumlar yükleniyor...</Text>
                            </View>
                        ) : comments.length > 0 ? (
                            comments.map(comment => (
                                <View key={comment.id} style={styles.commentItem}>
                                    <View style={styles.commentHeader}>
                                        <View style={styles.commentUserAvatar}>
                                            <Text style={styles.commentUserInitial}>{comment.user_name.charAt(0)}</Text>
                                        </View>
                                        <View style={styles.commentUserInfo}>
                                            <Text style={styles.commentUserName}>{comment.user_name}</Text>
                                            <Text style={styles.commentDate}>{new Date(comment.created_at).toLocaleDateString()}</Text>
                                        </View>
                                        {comment.user_id === currentUserId && (
                                            <TouchableOpacity 
                                                style={styles.deleteCommentButton}
                                                onPress={() => handleDeleteComment(comment.id)}
                                            >
                                                <MaterialIcons name="delete-outline" size={20} color="#ff3b30" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <Text style={styles.commentText}>{comment.comment}</Text>
                                </View>
                            ))
                        ) : (
                            <View style={styles.noCommentsContainer}>
                                <LottieView 
                                    source={require('../../assets/animations/empty-planet.json')} 
                                    autoPlay 
                                    loop 
                                    style={styles.noCommentsAnimation}
                                />
                                <Text style={styles.noCommentsText}>Henüz yorum yapılmamış.</Text>
                                <Text style={styles.noCommentsSubText}>Bu duvar kağıdı hakkında ilk yorumu sen yap!</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
            
            <BottomNavigator />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 15,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerActions: {
        flexDirection: 'row',
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    scrollView: {
        flex: 1,
    },
    wallpaperImage: {
        width: '100%',
        height: 500,
    },
    contentContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        padding: 20,
        paddingBottom: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    detailsContainer: {
        marginBottom: 20,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 10,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    downloadButton: {
        flex: 1,
        backgroundColor: '#4285F4',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        marginRight: 10,
    },
    downloadButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    setWallpaperButton: {
        flex: 1,
        backgroundColor: '#34A853',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
    },
    setWallpaperButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingAnimation: {
        width: 150,
        height: 150,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    premiumBadge: {
        position: 'absolute',
        top: 70,
        right: 20,
        backgroundColor: '#f1c40f',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    premiumText: {
        color: '#fff',
        fontSize: 12,
        marginLeft: 3,
        fontWeight: 'bold',
    },
    commentsSection: {
        marginTop: 30,
    },
    commentsTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    commentInputOuterContainer: {
        marginBottom: 20,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    commentAvatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    commentAvatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    commentInput: {
        flex: 1,
        minHeight: 36,
        maxHeight: 100,
        paddingVertical: 8,
        paddingHorizontal: 5,
        fontSize: 14,
        color: '#333',
    },
    commentSendButton: {
        backgroundColor: '#4285F4',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    commentSendButtonDisabled: {
        backgroundColor: '#bbbbbb',
    },
    commentCharCount: {
        color: '#999',
        fontSize: 12,
        alignSelf: 'flex-end',
        marginTop: 4,
        marginRight: 8,
    },
    loadingCommentsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    loadingCommentsText: {
        marginLeft: 10,
        color: '#666',
        fontSize: 14,
    },
    commentItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
    },
    commentUserAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    commentUserInitial: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    commentUserInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    commentUserName: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#333',
        marginBottom: 2,
    },
    commentDate: {
        fontSize: 12,
        color: '#888',
    },
    commentText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#333',
        paddingLeft: 52, // Avatar genişliği + margin
    },
    noCommentsContainer: {
        padding: 30,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginVertical: 10,
    },
    noCommentsText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
    noCommentsAnimation: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
    noCommentsSubText: {
        color: '#999',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
    },
    loadingCommentsAnimation: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
    deleteCommentButton: {
        marginLeft: 'auto',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
    },
});

export default WallpaperDetailScreen;      
