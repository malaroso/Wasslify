
import { AuthProvider } from './src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import AppNavigation from './src/navigation/appNavigation';
import { useFonts } from 'expo-font';


export default function App() {
  const [fontsLoaded] = useFonts({
    'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Thin': require('./assets/fonts/Montserrat-Thin.ttf'),
  });

  if (!fontsLoaded) {
      return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#0000ff" />
          </View>
      );
  }


  return (
      <AuthProvider>
          <AppNavigation />
      </AuthProvider>
  
  );
}

