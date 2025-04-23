import axiosInstance from '../config/axios';
import { Category, CategoryResponse } from '../types/CategoryTypes';

/**
 * Tüm kategorileri getirir
 * @returns Promise<CategoryResponse>
 */
export const getAllCategories = async (): Promise<CategoryResponse> => {
    try {
        const response = await axiosInstance.get('/getAllCategories');
        
        console.log('Kategoriler başarıyla yüklendi:');
        
        return response.data;
    } catch (error) {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
        return {
            status: false,
            message: 'Kategoriler yüklenirken hata oluştu',
            data: []
        };
    }
};

/**
 * ID'ye göre kategori detaylarını getirir
 * @param id Kategori ID
 * @returns Promise<{status: boolean; message: string; data: Category | null}>
 */
export const getCategoryById = async (id: number): Promise<{status: boolean; message: string; data: Category | null}> => {
    try {
        const response = await axiosInstance.get(`/categories/${id}`);
        
        console.log('Kategori detayları başarıyla yüklendi:', response.data);
        
        return response.data;
    } catch (error) {
        console.error(`Kategori detayları yüklenirken hata oluştu (ID: ${id}):`, error);
        return {
            status: false,
            message: 'Kategori detayları yüklenirken hata oluştu',
            data: null
        };
    }
}; 