import React, { useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity, Text, Modal, TextInput } from 'react-native';
import BottomNavigator from '../../components/BottomNavigator';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/NavigationTypes';

const savedPaymentMethods = [
    {
        id: '1',
        type: 'apple',
        name: 'Apple Pay',
        icon: 'apple'
    },
    {
        id: '2',
        type: 'klarna',
        name: 'Klarna',
        icon: 'credit-card'
    }
];

const newPaymentMethods = [
    {
        id: '3',
        type: 'card',
        name: 'Debit/Card',
        icon: 'credit-card'
    },
    {
        id: '4',
        type: 'paypal',
        name: 'PayPal',
        icon: 'paypal'
    }
];

const PaymentScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');

    const handleAddPayment = (type: string) => {
        if (type === 'card') {
            setShowAddPaymentModal(true);
        }
    };

    const handleSaveCard = () => {
        // Handle save card logic here
        setShowAddPaymentModal(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.headerBanner}>
                    <Image   source={require('../../../assets/images/loginScreenTwo.jpg')} style={styles.headerImage} />
                    <View style={styles.headerOverlay}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <FontAwesome5 name="arrow-left" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Payment Method</Text>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.sectionTitle}>Saved payment methods</Text>
                        {savedPaymentMethods.map((method) => (
                            <View key={method.id} style={styles.paymentItem}>
                                <View style={styles.paymentItemLeft}>
                                    <FontAwesome name={method.icon as any} size={24} color="#000" style={styles.paymentIcon} />
                                    <Text style={styles.paymentName}>{method.name}</Text>
                                </View>
                            </View>
                        ))}

                        <Text style={[styles.sectionTitle, styles.addTitle]}>Add payment method</Text>
                        {newPaymentMethods.map((method) => (
                            <TouchableOpacity 
                                key={method.id} 
                                style={styles.paymentItem}
                                onPress={() => handleAddPayment(method.type)}
                            >
                                <View style={styles.paymentItemLeft}>
                                    <FontAwesome name={method.icon as any} size={24} color="#000" style={styles.paymentIcon} />
                                    <Text style={styles.paymentName}>{method.name}</Text>
                                </View>
                                <Text style={styles.addButton}>Add</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showAddPaymentModal}
                onRequestClose={() => setShowAddPaymentModal(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalView}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity 
                                style={styles.backButtonForModal} 
                                onPress={() => setShowAddPaymentModal(false)}
                            >
                                <FontAwesome5 name="times" size={28} color="#000" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Add Payment</Text>
                            <Text style={styles.modalSubtitle}>Add a new payment method to your account</Text>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            <View style={styles.inputContainer}>
                                <View style={styles.inputWithIcon}>
                                    <FontAwesome5 name="credit-card" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, styles.inputWithIconPadding]}
                                        placeholder="Card Number"
                                        value={cardNumber}
                                        onChangeText={setCardNumber}
                                        keyboardType="numeric"
                                        maxLength={16}
                                    />
                                </View>
                            </View>

                            <View style={styles.rowContainer}>
                                <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                                    <View style={styles.inputWithIcon}>
                                        <FontAwesome5 name="calendar" size={20} color="#666" style={styles.inputIcon} />
                                        <TextInput
                                            style={[styles.input, styles.inputWithIconPadding]}
                                            placeholder="MM/YY"
                                            value={expiryDate}
                                            onChangeText={setExpiryDate}
                                            maxLength={5}
                                        />
                                    </View>
                                </View>
                                <View style={[styles.inputContainer, { flex: 1 }]}>
                                    <View style={styles.inputWithIcon}>
                                        <FontAwesome5 name="lock" size={20} color="#666" style={styles.inputIcon} />
                                        <TextInput
                                            style={[styles.input, styles.inputWithIconPadding]}
                                            placeholder="CVC"
                                            value={cvc}
                                            onChangeText={setCvc}
                                            keyboardType="numeric"
                                            maxLength={3}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <View style={styles.inputWithIcon}>
                                    <FontAwesome5 name="user" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, styles.inputWithIconPadding]}
                                        placeholder="Card Holder Name"
                                        value={cardHolderName}
                                        onChangeText={setCardHolderName}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            <TouchableOpacity 
                                style={styles.saveButton}
                                onPress={handleSaveCard}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </ScrollView>
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
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        color: '#333',
        marginBottom: 0,
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
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1000,
    },
    backButtonForModal: {
        position: 'absolute',
        top: 0,
        right: 10,
        zIndex: 1000,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
        marginTop: 10,
    },
    addTitle: {
        marginTop: 30,
    },
    paymentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    paymentItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentIcon: {
        marginRight: 15,
    },
    paymentName: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    addButton: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: '500',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: '70%',
    },
    modalHeader: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 30,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
        fontFamily: 'Montserrat-Medium',
    },
    modalContent: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
    },
    inputIcon: {
        padding: 15,
        width: 50,
    },
    input: {
        flex: 1,
        padding: 15,
        fontSize: 16,
        borderWidth: 0,
    },
    inputWithIconPadding: {
        paddingLeft: 0,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default PaymentScreen;      
