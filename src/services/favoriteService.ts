import axiosInstance from '../config/axios';
import { WallpaperResponse } from '../types/WallpaperTypes';

export const getFavorites = async (): Promise<WallpaperResponse> => {
    try {
        const response = await axiosInstance.get('/getFavorites');
        console.log('getFavorites Raw API Response:', response.data);
        
        if (response.data && response.data.status && Array.isArray(response.data.data)) {
            return response.data;
        }
        
        return {
            status: false,
            data: [],
            message: 'Favoriler bulunamadı'
        };
    } catch (error) {
        console.error('Favoriler yüklenirken hata oluştu:', error);
        return {
            status: false,
            data: [],
            message: 'Favoriler yüklenirken bir hata oluştu'
        };
    }
};

export const addFavorite = async (wallpaperId: number): Promise<{ status: boolean; message: string }> => {
    try {
        const response = await axiosInstance.post('/addFavorite', {
            wallpaper_id: wallpaperId
        });
        
        console.log('addFavorite Raw API Response:', response.data);
        
        if (response.data && response.data.status) {
            return {
                status: true,
                message: 'Duvar kağıdı favorilere eklendi'
            };
        }
        
        return {
            status: false,
            message: response.data?.message || 'Favori eklenirken bir hata oluştu'
        };
    } catch (error) {
        console.error('Favori eklenirken hata oluştu:', error);
        return {
            status: false,
            message: 'Favori eklenirken bir hata oluştu'
        };
    }
};

export const isFavorite = async (wallpaperId: number): Promise<boolean> => {
    try {
        const response = await getFavorites();
        if (response.status && Array.isArray(response.data)) {
            return response.data.some(wallpaper => wallpaper.id === wallpaperId);
        }
        return false;
    } catch (error) {
        console.error('Favori durumu kontrol edilirken hata oluştu:', error);
        return false;
    }
};

export const removeFavorite = async (wallpaperId: number): Promise<{ status: boolean; message: string }> => {
    try {
        const response = await axiosInstance.post('/removeFavorite', {
            wallpaper_id: wallpaperId
        });
        
        console.log('removeFavorite Raw API Response:', response.data);
        
        if (response.data && response.data.status) {
            return {
                status: true,
                message: 'Duvar kağıdı favorilerden kaldırıldı'
            };
        }
        
        return {
            status: false,
            message: response.data?.message || 'Favori kaldırılırken bir hata oluştu'
        };
    } catch (error) {
        console.error('Favori kaldırılırken hata oluştu:', error);
        return {
            status: false,
            message: 'Favori kaldırılırken bir hata oluştu'
        };
    }
}; 