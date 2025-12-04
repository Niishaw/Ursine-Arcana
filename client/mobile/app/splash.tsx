import { useEffect } from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Logo from '../assets/images/ursus_arcana_logo_main.png';

/**
 * Splash Screen
 * Shows the Ursine Arcana logo for a few seconds before navigating
 * to the main welcome / login screen.
 */
export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 items-center justify-center">
        <Image source={Logo} style={{ width: '80%', height: '80%' }} resizeMode="contain" />
      </View>
    </SafeAreaView>
  );
}
