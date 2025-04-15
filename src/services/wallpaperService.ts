import axiosInstance from '../config/axios';
import { WallpaperResponse } from '../types/WallpaperTypes';

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