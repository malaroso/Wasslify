import React, { useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';
import BottomNavigator from '../components/BottomNavigator';




const CleanScreen = () => {


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.headerBanner}>
                    <Image 
                        source={require('../../assets/images/loginScreenTwo.jpg')} 
                        style={styles.headerImage}
                    />
                    <View style={styles.headerOverlay}>
               
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                  
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
        height: 140,
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

});

export default CleanScreen;      
