import axiosInstance from '../config/axios';
import { CategoryResponse } from '../types/CategoryTypes';

export const getAllCategories = async (): Promise<CategoryResponse> => {
    try {
        const response = await axiosInstance.get('/getAllCategories');
        console.log('getAllCategories Raw API Response:', response.data);
        
        if (response.data && response.data.status && Array.isArray(response.data.data)) {
            return response.data;
        }
        
        return {
            status: false,
            data: [],
            message: 'Kategoriler bulunamadı'
        };
    } catch (error) {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
        return {
            status: false,
            data: [],
            message: 'Kategoriler yüklenirken bir hata oluştu'
        };
    }
}; 