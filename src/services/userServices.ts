import { UserDetail, UpdateUserRequest, UpdateUserResponse } from '../types/userTypes';
import axiosInstance from '../config/axios';

export const getUserDetail = async (): Promise<UserDetail> => {
    try {
        const response = await axiosInstance.get('/getuserdetail');
        return response.data;
    } catch (error) {
        console.error('Error fetching user detail:', error);
        throw error;
    }
};

export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<any> => {
    try {
        const response = await axiosInstance.post('/updateUserPassword', {
            current_password: currentPassword,
            new_password: newPassword
        });
        return response.data;
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};

export const updateUser = async (userData: UpdateUserRequest): Promise<UpdateUserResponse> => {
    try {
        const response = await axiosInstance.post('/updateUser', userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};
