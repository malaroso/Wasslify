import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import * as Animatable from 'react-native-animatable';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/NavigationTypes';
import { Ionicons } from '@expo/vector-icons';

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const screens = [
    {
        title: "Hoş Geldiniz!",
        description: "Binlerce özel duvar kağıdını keşfedin ve  cihazınızı özelleştirin.",
        buttonText: "Devam Et",
        video: require('../../../assets/videos/videoTwo.mp4'), 
      },
      {
        title: "Tarzınıza Uygun Öneriler",
        description: "Beğenilerinize göre özel olarak seçilmiş duvar kağıtları sizi bekliyor!",
        buttonText: "Devam Et",
        video: require('../../../assets/videos/videoThree.mp4'), 
      },
      {
        title: "Favorilerini Paylaş!",
        description: "Beğendiğiniz duvar kağıtlarını toplulukla paylaşın ve ilham alın.",
        buttonText: "Giriş Yap",
        video: require('../../../assets/videos/videoFour.mp4'), 
      }
      
  ];

  const handleNext = () => {
    if (step < screens.length - 1) {
      setStep(step + 1);
      setIsLoading(true);
    } else {
      navigation.navigate('Login');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.background}>
      {isLoading && (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      )}
      <Video
        source={screens[step].video}
        style={styles.video}
        isMuted
        shouldPlay
        isLooping
        resizeMode={ResizeMode.COVER}
        onLoad={() => setIsLoading(false)}
      />
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Geç</Text>
      </TouchableOpacity>
      <Animatable.View animation="fadeIn" duration={400} style={styles.bottomOverlay}>
        <Text style={styles.title}>{screens[step].title}</Text>
        <Text style={styles.description}>{screens[step].description}</Text>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>{screens[step].buttonText}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  bottomOverlay: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.37)',
    padding: 20,
    alignItems: 'center',
    minHeight: 250,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 30,
  },
  skipText: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 30,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    color: '#fff',
  },
  description: {
    fontSize: 15,
    marginBottom: 40,
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
    color: '#fff',
  },
  nextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 5,
  },
});

export default WelcomeScreen; 