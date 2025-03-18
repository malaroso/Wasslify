import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import { useAuth } from '../context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/auth/LoginScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import { RootStackParamList } from '../types/NavigationTypes';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PasswordChangeScreen from '../screens/auth/PasswordChangeScreen';
import ProfileUpdate from '../screens/auth/ProfileUpdate';
import CleanScreen from '../screens/CleanScreen';
import PixabayScreen from '../screens/PixabayScreen';
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation = () => {
    const {authState} = useAuth();
    console.log('appNavigation authState: ', authState);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Welcome">
                {!authState?.authenticated ? (
                    <>
                        <Stack.Screen name="Welcome" component={WelcomeScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Favorites" component={FavoritesScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="PasswordChange" component={PasswordChangeScreen} />
                        <Stack.Screen name="ProfileUpdate" component={ProfileUpdate} />
                        <Stack.Screen name="PixabayScreen" component={PixabayScreen} />
                        <Stack.Screen name="CleanScreen" component={CleanScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigation;