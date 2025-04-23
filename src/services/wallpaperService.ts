import axiosInstance from '../config/axios';
import { WallpaperResponse, Wallpaper, Comment } from '../types/WallpaperTypes';


export const getAllWallpapers = async (page: number = 1, limit: number = 10): Promise<WallpaperResponse> => {
    try {
        const response = await axiosInstance.get('/getAllWallpapers', {
            params: {
                page,
                limit
            }
        });
        
        console.log('getAllWallpapers API Response:', response.data); // Debug log
        
        // API yanıtını direkt olarak döndürüyoruz
        return response.data;
    } catch (error) {
        console.error('Duvar kağıtları yüklenirken hata oluştu:', error);
        return {
            status: false,
            data: {
                status: false,
                data: [],
                pagination: {
                    current_page: 1,
                    per_page: 10,
                    total: 0,
                    total_pages: 0
                }
            },
            message: 'Duvar kağıtları yüklenirken bir hata oluştu'
        };
    }
};

export const getPopularWallpapers = async (): Promise<WallpaperResponse> => {
    try {
        const response = await axiosInstance.get('/getPopularWallpapers');
        console.log('getPopularWallpapers Raw API Response:', response.data);
        
        // API yanıtını direkt olarak döndürüyoruz
        return response.data;
    } catch (error) {
        console.error('Popüler duvar kağıtları yüklenirken hata oluştu:', error);
        return {
            status: false,
            data: {
                status: false,
                data: [],
                pagination: {
                    current_page: 1,
                    per_page: 10,
                    total: 0,
                    total_pages: 0
                }
            },
            message: 'Popüler duvar kağıtları yüklenirken bir hata oluştu'
        };
    }
};

export const likeWallpaper = async (wallpaperId: number): Promise<{ status: boolean; message: string }> => {
    try {
        const response = await axiosInstance.post('/likeWallpaper', {
            wallpaper_id: wallpaperId
        });
        
        console.log('likeWallpaper Raw API Response:', response.data);
        
        if (response.data && response.data.status) {
            return {
                status: true,
                message: 'Duvar kağıdı beğenildi'
            };
        }
        
        return {
            status: false,
            message: response.data?.message || 'Beğeni işlemi sırasında bir hata oluştu'
        };
    } catch (error) {
        console.error('Beğeni işlemi sırasında hata oluştu:', error);
        return {
            status: false,
            message: 'Beğeni işlemi sırasında bir hata oluştu'
        };
    }
};

export const unlikeWallpaper = async (wallpaperId: number): Promise<{ status: boolean; message: string }> => {
    try {
        const response = await axiosInstance.post('/unlikeWallpaper', {
            wallpaper_id: wallpaperId
        });
        
        console.log('unlikeWallpaper Raw API Response:', response.data);
        
        if (response.data && response.data.status) {
            return {
                status: true,
                message: 'Duvar kağıdı beğenisi kaldırıldı'
            };
        }
        
        return {
            status: false,
            message: response.data?.message || 'Beğeni kaldırılırken bir hata oluştu'
        };
    } catch (error) {
        console.error('Beğeni kaldırılırken hata oluştu:', error);
        return {
            status: false,
            message: 'Beğeni kaldırılırken bir hata oluştu'
        };
    }
};

export const getWallpapersByCategory = async (categoryId: number, page: number = 1, limit: number = 10): Promise<WallpaperResponse> => {
    try {
        const response = await axiosInstance.get(`/getWallpapersByCategory/${categoryId}`, {
            params: {
                page,
                limit
            }
        });
        
        console.log(`getWallpapersByCategory/${categoryId} API Response:`, response.data);
        
        // API yanıtını direkt olarak döndürüyoruz
        return response.data;
    } catch (error) {
        console.error('Kategoriye ait duvar kağıtları yüklenirken hata oluştu:', error);
        return {
            status: false,
            message: 'Kategoriye ait duvar kağıtları yüklenirken bir hata oluştu',
            data: [],
            pagination: {
                current_page: 1,
                per_page: 10,
                total: 0,
                total_pages: 0
            }
        };
    }
};

export const getWallpaperById = async (wallpaperId: number): Promise<{
    status: boolean;
    message: string;
    data: Wallpaper;
}> => {
    try {
        const response = await axiosInstance.get(`/getWallpaperById/${wallpaperId}`);
        
        console.log(`getWallpaperById/${wallpaperId} API Response:`, response.data);
        
        // API yanıtını direkt olarak döndürüyoruz
        return response.data;
    } catch (error) {
        console.error('Duvar kağıdı detayları yüklenirken hata oluştu:', error);
        return {
            status: false,
            message: 'Duvar kağıdı detayları yüklenirken bir hata oluştu',
            data: {} as Wallpaper
        };
    }
};

export const getCommentsByWallpaper = async (wallpaperId: number): Promise<{
    status: boolean;
    data: Comment[];
}> => {
    try {
        const response = await axiosInstance.get(`/getCommentsByWallpaper/${wallpaperId}`);
        
        console.log(`getCommentsByWallpaper/${wallpaperId} API Response:`, response.data);
        
        // API yanıtını direkt olarak döndürüyoruz
        return response.data;
    } catch (error) {
        console.error('Duvar kağıdı yorumları yüklenirken hata oluştu:', error);
        return {
            status: false,
            data: []
        };
    }
};

export const addComment = async (wallpaperId: number, comment: string): Promise<{
    status: boolean;
    message: string;
    data?: Comment;
}> => {
    try {
        const response = await axiosInstance.post('/addComment', {
            wallpaper_id: wallpaperId,
            comment: comment
        });
        console.log('addComment API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Yorum eklenirken hata oluştu:', error);
        return {
            status: false,
            message: 'Yorum eklenirken bir hata oluştu'
        };
    }
};

export const deleteComment = async (commentId: number): Promise<{
    status: boolean;
    message: string;
}> => {
    try {
        const response = await axiosInstance.post('/deleteComment', {
            comment_id: commentId
        });
        console.log('deleteComment API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Yorum silinirken hata oluştu:', error);
        return {
            status: false,
            message: 'Yorum silinirken bir hata oluştu'
        };
    }
};

export const searchWallpapers = async (params: {
    query?: string;
    category?: number;
    is_premium?: number;
    user_id?: number;
    sort?: string;
    direction?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}): Promise<WallpaperResponse> => {
    try {
        const response = await axiosInstance.get('/searchWallpapers', {
            params
        });
        
        console.log('searchWallpapers API Response:', response.data);
        
        // API yanıtını döndürüyoruz
        return response.data;
    } catch (error) {
        console.error('Duvar kağıtları aranırken hata oluştu:', error);
        return {
            status: false,
            message: 'Duvar kağıtları aranırken bir hata oluştu',
            data: [],
            pagination: {
                current_page: 1,
                per_page: 10,
                total: 0,
                total_pages: 0
            }
        };
    }
}; 