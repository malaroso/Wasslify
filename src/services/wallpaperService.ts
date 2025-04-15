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
            }
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
            }
        };
    }
}; 