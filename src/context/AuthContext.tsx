import axiosInstance from '../config/axios';
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { setLogoutCallback } from '../config/axios';

// Sadece kullanılan prop'ları tutalım
interface AuthProps {
    authState?: { 
        token: string | null;
        authenticated: boolean | null;
        username?: string;
        userId?: number;
    };
    onLogin?: (username: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
        username?: string;
        userId?: number;
    }>({
        token: null,
        authenticated: null
    });
    
    useEffect(() => {
        console.log('AuthContext Token:', authState.token);
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const userId = await SecureStore.getItemAsync(USER_ID_KEY);
            
            if (token) {
                setAuthState({
                    token: token,
                    authenticated: true,
                    userId: userId ? parseInt(userId) : undefined
                });
            }
        };
        loadToken();
        setLogoutCallback(logout);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await axiosInstance.post('/login', {
                username,
                password
            });

            if (response.data.status && response.data.token) {
                const token = response.data.token;

                const tokenData = JSON.parse(atob(token.split('.')[1]));
                const userId = tokenData.userId;

              
                await SecureStore.setItemAsync(TOKEN_KEY, token);
                await SecureStore.setItemAsync(USER_ID_KEY, userId.toString());
                
                setAuthState({
                    token: token,
                    authenticated: true,
                    userId: userId
                });

                return {
                    success: true,
                    data: response.data
                };
            }
            
            return {
                success: false,
                message: response.data.message || "Giriş başarısız Şifrenizi veya kullanıcı adınızı kontrol ediniz."
            };

        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Bir hata oluştu"
            };
        }
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(USER_ID_KEY);
            setAuthState({
                token: null,
                authenticated: false,
                userId: undefined
            });
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    

    const value = {
        onLogin: login,
        onLogout: logout,
        authState
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}