import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/NavigationTypes";

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];
type MaterialIconsName = React.ComponentProps<typeof MaterialIcons>['name'];

const BottomNavigator = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList>>();

    const getIconProps = (screenName: keyof RootStackParamList) => {
        const isActive = route.name === screenName;
        return {
            color: isActive ? '#000' : '#999',
            name: screenName === 'Favorites' ? (isActive ? 'heart' : 'heart-outline') as IoniconsName : 'home' as IoniconsName,
            materialName: screenName === 'Profile' ? (isActive ? 'person' : 'person-outline') as MaterialIconsName : 'home' as MaterialIconsName,
        };
    };

    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
                <Ionicons name="home" size={26} color={getIconProps('Home').color} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Favorites')}>
                <Ionicons name={getIconProps('Favorites').name} size={26} color={getIconProps('Favorites').color} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PixabayScreen')}>
                <Feather name="download" size={26} color={getIconProps('PixabayScreen').color} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
                <MaterialIcons name={getIconProps('Profile').materialName} size={26} color={getIconProps('Profile').color} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        height: 80,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
    },
    navItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    menuItem: {
        paddingVertical: 5,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#f0f0f0',
    },

});

export default BottomNavigator;