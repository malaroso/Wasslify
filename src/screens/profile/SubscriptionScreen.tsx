import React, { useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import BottomNavigator from '../../components/BottomNavigator';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const packages = [
    {
        id: '1',
        name: 'Basic Survival',
        price: '$30',
        period: 'per months',
        description: 'Get Torque\'s basic plan to optimise you lead generation process.',
        features: [
            'Email addresses',
            'Phone numbers',
            'Unlimited Lists',
            'Export contacts',
        ]
    },
    {
        id: '2',
        name: 'Mission Professional',
        price: '$100',
        period: 'per months',
        description: 'Get Torque\'s basic plan to optimise you lead generation process.',
        features: [
            'Email addresses',
            'Phone numbers',
            'Unlimited Lists',
            'Export contacts',
            'Prospecting',
        ]
    },
    {
        id: '3',
        name: 'Corporate Pack',
        price: '$200',
        period: 'per months',
        description: 'Get Torque\'s basic plan to optimise you lead generation process.',
        features: [
            'Email addresses',
            'Phone numbers',
            'Unlimited Lists',
            'Prospecting',
            '50MB Per File Attachment',
        ]
    },
    {
        id: '4',
        name: 'Rocket Premium',
        price: '$300',
        period: 'per months',
        description: 'Get Torque\'s basic plan to optimise you lead generation process.',
        features: [
            'Email addresses',
            'Phone numbers',
            'Unlimited Lists',
            'Export contacts',
            'Prospecting',
            '50MB Per File Attachment',
            'Basic analytics'
        ]
    }
];

const SubscriptionScreen = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<typeof packages[0] | null>(null);

    const handlePress = (packageItem: typeof packages[0]) => {
        setSelectedPackage(packageItem);
        setModalVisible(true);
    };

    const renderPackage = ({ item }: { item: typeof packages[0] }) => (
        <TouchableOpacity onPress={() => handlePress(item)} style={[
            styles.subscriptionCard,
            item.name === 'Basic Survival' && styles.highlightedCard
        ]}>
            <View style={styles.cardHeader}>
                <Text style={styles.packageName}>{item.name}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.packagePrice}>{item.price}</Text>
                    <Text style={styles.packagePeriod}>/ {item.period}</Text>
                </View>
            </View>
            
            <Text style={styles.packageDescription}>{item.description}</Text>
            
            <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>Core Features</Text>
                <Text style={styles.featuresSubtitle}>Boost Tools</Text>
                {item.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.featureText}>{feature}</Text>
                    </View>
                ))}
            </View>
            
            <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>
                    {item.name === 'Mission Professional' ? 'Get Started' : 'Start Trial'}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.headerBanner}>
                    <Image 
                        source={require('../../../assets/images/loginScreenTwo.jpg')} 
                        style={styles.headerImage}
                    />
                    <View style={styles.headerOverlay}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <FontAwesome5 name="arrow-left" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>My Subscription</Text>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <FlatList
                        data={packages}
                        renderItem={renderPackage}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
      

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            style={styles.closeButtonTop}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <FontAwesome5 name="times" size={24} color="#000" />
                        </TouchableOpacity>
                        <ScrollView style={styles.modalScrollView}>
                            <View style={styles.modalInner}>
                                <Text style={styles.modalHeader}>{selectedPackage?.name}</Text>
                                <View style={styles.modalPriceContainer}>
                                    <Text style={styles.modalPrice}>{selectedPackage?.price}</Text>
                                    <Text style={styles.modalPeriod}>/ {selectedPackage?.period}</Text>
                                </View>
                                
                                <Text style={styles.modalDescription}>{selectedPackage?.description}</Text>
                                
                                <View style={styles.modalFeaturesContainer}>
                                    <Text style={styles.modalFeaturesTitle}>Core Features</Text>
                                    <Text style={styles.modalFeaturesSubtitle}>Boost Tools</Text>
                                    {selectedPackage?.features.map((feature: string, index: number) => (
                                        <View key={index} style={styles.modalFeatureItem}>
                                            <Text style={styles.modalBulletPoint}>•</Text>
                                            <Text style={styles.modalFeatureText}>{feature}</Text>
                                        </View>
                                    ))}
                                </View>
                                
                                <View style={styles.clear}></View>
                            </View>
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.subscribeButton} 
                            onPress={() => {/* Add subscription logic here */}} 
                        >
                            <Text style={styles.textStyle}>Change Plan Now</Text>
                        </TouchableOpacity>
                  
                    </View>
                </View>
            </Modal>
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
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
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

    subscriptionCard: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        margin: 10,
    },
    cardHeader: {
        marginBottom: 15,
    },
    packageName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    packagePrice: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
    },
    packagePeriod: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
        marginBottom: 5,
    },
    packageDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    featuresContainer: {
        marginBottom: 20,
    },
    featuresTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    featuresSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginBottom: 10,
    },
    featureItem: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
    },
    bulletPoint: {
        fontSize: 16,
        marginRight: 8,
        color: '#333',
    },
    featureText: {
        fontSize: 14,
        color: '#555',
    },
    actionButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#333',
        fontWeight: '500',
    },
    highlightedCard: {
        borderColor: '#00796b',
        borderWidth: 2,
    },
    selectedPackageCard: {
        backgroundColor: '#e0f7fa',
        borderWidth: 1,
        borderColor: '#00796b',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
    },
    clear: {
        height: 50,
    },
    modalView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 'auto',
        maxWidth: '100%',
        alignSelf: 'center',
        minHeight: '40%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalScrollView: {
        width: '100%',
        maxHeight: '80%',
    },
    modalInner: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    modalHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
    },
    modalPriceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 15,
    },
    modalPrice: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#000',
    },
    modalPeriod: {
        fontSize: 16,
        color: '#666',
        marginLeft: 5,
        marginBottom: 5,
    },
    modalDescription: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalFeaturesContainer: {
        marginBottom: 20,
        width: '100%',
    },
    modalFeaturesTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'left',
        marginBottom: 5,
    },
    modalFeaturesSubtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#555',
        marginBottom: 15,
    },
    modalFeatureItem: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
        width: '80%',
    },
    modalBulletPoint: {
        fontSize: 18,
        marginRight: 10,
        color: '#333',
    },
    modalFeatureText: {
        fontSize: 16,
        color: '#555',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    closeButtonTop: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    subscribeButton: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: '#000',
        borderRadius: 20,
        width: '100%',
        padding: 15,
        elevation: 2
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1000,
    }
});

export default SubscriptionScreen;      
