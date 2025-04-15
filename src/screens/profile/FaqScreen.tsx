import React, { useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity, Text } from 'react-native';
import BottomNavigator from '../../components/BottomNavigator';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/NavigationTypes';

const faqData = [
    {
        question: 'How do I subscribe?',
        answer: 'You can subscribe by selecting the package you want from the "Subscription" section in the app.'
    },
    {
        question: 'Can my subscription be canceled?',
        answer: 'Yes, you can cancel your subscription at any time. You can cancel your subscription by going to the settings section.'
    },
    {
        question: 'How do I use the app?',
        answer: 'The app allows you to manage and customize your wallpapers. You can select your wallpapers from the main screen and customize them.'
    },
    {
        question: 'Can I get technical support?',
        answer: 'Yes, you can get technical support by going to the "Support" section in the app.'
    }
];

const FaqScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

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
                        <Text style={styles.headerTitle}>FAQ/Support</Text>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.header}>Frequently Asked Questions</Text>
                        {faqData.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.faqItem} onPress={() => toggleExpand(index)}>
                                <View style={styles.questionContainer}>
                                    <Text style={styles.question}>{item.question}</Text>
                                    <FontAwesome5 name={expandedIndex === index ? 'chevron-up' : 'chevron-down'} size={16} color="#333" />
                                </View>
                                {expandedIndex === index && (
                                    <Text style={styles.answer}>{item.answer}</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

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
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1000,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    header: {
        fontSize: 20,
        marginTop: 20,  
        fontFamily: 'Montserrat-Medium',
        marginBottom: 28,
        textAlign: 'center',
        color: '#333',
    },
    faqItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
        color: '#333',
        marginBottom: 10,
        flex: 1,
    },
    answer: {
        fontSize: 16,
        color: '#555',
        marginTop: 10,
    }
});

export default FaqScreen;      
