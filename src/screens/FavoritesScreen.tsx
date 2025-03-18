import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import BottomNavigator from '../components/BottomNavigator';

const favorites = [
    { id: '1', name: 'Colorful', image: require('../../assets/images/Abstract.jpg') },
    { id: '2', name: 'Nature', image: require('../../assets/images/Nature.jpg') },
    // Diğer favori öğeler...
];

const lists = [
    { id: '1', name: 'My List 1', image: require('../../assets/images/Abstract.jpg') },
    { id: '2', name: 'My List 2', image: require('../../assets/images/Nature.jpg') },
    // Diğer listeler...
];

const FavoritesScreen = () => {
    const [activeTab, setActiveTab] = useState('Favorites');

    const renderContent = () => {
        const data = activeTab === 'Favorites' ? favorites : lists;
        return (
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item}>
                        <Image source={item.image} style={styles.image} />
                        <Text style={styles.name}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.headerBanner}>
                    <Image 
                        source={require('../../assets/images/loginScreenOne.jpg')} 
                        style={styles.headerImage}
                    />
                    <View style={styles.headerOverlay}>
                        <View style={styles.buttonContent}>
                            <TouchableOpacity
                                style={[
                                    styles.nextButton,
                                    { backgroundColor: activeTab === 'Favorites' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)' }
                                ]}
                                onPress={() => setActiveTab('Favorites')}
                            >
                                <Text style={styles.buttonText}>Favorites</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.nextButton,
                                    { backgroundColor: activeTab === 'Lists' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)' }
                                ]}
                                onPress={() => setActiveTab('Lists')}
                            >
                                <Text style={styles.buttonText}>Lists</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {renderContent()}
                    </ScrollView>
                </View>
            </View>
            <BottomNavigator />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    headerBanner: {
        height: 120,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    headerOverlay: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 20,
        height: '100%',
        justifyContent: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 15,
    },
    scrollContent: {
        flex: 1,
    },
    item: {
        flex: 1,
        margin: 5,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 12,
    },
    name: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
});

export default FavoritesScreen;      
