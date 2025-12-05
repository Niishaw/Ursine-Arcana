import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useFonts } from 'expo-font';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useAuth } from '@/context/AuthContext';
import { AntDesign } from '@expo/vector-icons';
import NeonText from '@/components/common/NeonText';
import Logo from '../../assets/images/ursus_arcana_logo_main.png';

WebBrowser.maybeCompleteAuthSession();

/**
 * Login / Welcome Screen
 * Grindr-style layout with logo, email/phone login, and Google sign-in
 */
export default function LoginScreen() {
  const { signIn, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phonePassword, setPhonePassword] = useState('');

  const [fontsLoaded] = useFonts({
    'Pacifico-Regular': require('../../assets/fonts/Pacifico-Regular.ttf'),
  });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    const signInWithGoogle = async () => {
      if (response?.type !== 'success') return;

      const idToken = (response.params as { id_token?: string }).id_token;
      if (!idToken) {
        Alert.alert('Google Sign-In failed', 'No ID token returned.');
        return;
      }

      try {
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not sign in with Google.';
        Alert.alert('Google Sign-In failed', message);
      }
    };

    signInWithGoogle();
  }, [response]);

  const handleLogin = async () => {
    if (activeTab === 'email') {
      if (!email || !password) {
        Alert.alert('Missing fields', 'Please enter your email and password.');
        return;
      }

      try {
        await signIn(email, password);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        Alert.alert('Login failed', message);
      }
    } else {
      if (!phoneNumber || !phonePassword) {
        Alert.alert('Missing fields', 'Please enter your phone number and password.');
        return;
      }

      // Phone login: verify phone via OTP, then authenticate with password
      Alert.alert('Coming soon', 'Phone number login is not implemented yet.');
    }
  };

  const handlePlaceholder = (provider: string) => {
    Alert.alert('Coming soon', `${provider} sign-in is not set up yet.`);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="flex-1 px-6 pt-16 pb-10 items-center">
            {/* Header: logo + Sign Up */}
            <View className="w-full mb-6" style={{ maxWidth: 400 }}>
              <View className="items-center mb-0 mt-10">
                <Image source={Logo} className="w-44 h-44" resizeMode="contain" />
              </View>

              <TouchableOpacity
                onPress={() => handlePlaceholder('Sign Up')}
                className="absolute right-0 top-0 py-2"
                activeOpacity={0.8}
              >
                <Text className="text-accent-500 font-semibold text-base">Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Title and subtitle */}
            <View className="w-full mb-8" style={{ maxWidth: 410 }}>
              <NeonText
                className="text-2xl font-semibold mb-2 text-center"
                style={{ fontFamily: 'Pacifico-Regular', lineHeight: 40, fontSize: 30 }}
              >
                Welcome to your kink...
              </NeonText>
              {/* <NeonText
              className="text-sm text-center"
              style={{ color: '#00FFFF', fontSize: 15, lineHeight: 40 }}
            >
              Sign in to join the pack.
            </NeonText> */}
            </View>

            {/* Auth tabs and form */}
            <View className="w-full" style={{ maxWidth: 400 }}>
              {/* Tabs - underline style like Grindr */}
              <View className="flex-row mb-6 border-b border-border-light">
                <TouchableOpacity
                  onPress={() => setActiveTab('email')}
                  className="flex-1 items-center pb-2"
                  activeOpacity={0.9}
                >
                  <Text
                    className={`text-sm font-semibold pb-1 ${
                      activeTab === 'email' ? 'border-b-2' : ''
                    }`}
                    style={{
                      color: activeTab === 'email' ? '#FF00FF' : '#00FFFF',
                      borderColor: '#FF00FF',
                    }}
                  >
                    Email
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActiveTab('phone')}
                  className="flex-1 items-center pb-2"
                  activeOpacity={0.9}
                >
                  <Text
                    className={`text-sm font-semibold pb-1 ${
                      activeTab === 'phone' ? 'border-b-2' : ''
                    }`}
                    style={{
                      color: activeTab === 'phone' ? '#FF00FF' : '#00FFFF',
                      borderColor: '#FF00FF',
                    }}
                  >
                    Phone
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Form fields */}
              {activeTab === 'email' ? (
                <View className="space-y-4 mb-6">
                  <View>
                    <Text className="text-text-secondary text-sm mb-2">Email</Text>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Email"
                      placeholderTextColor="#9CA3AF"
                      keyboardType={Platform.OS === 'ios' ? 'email-address' : 'default'}
                      autoCapitalize="none"
                      autoCorrect={false}
                      className="border-b border-border-light pb-3 text-text-primary text-base"
                    />
                  </View>

                  <View>
                    <Text className="text-text-secondary text-sm mb-2">Password</Text>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry
                      className="border-b border-border-light pb-3 text-text-primary text-base"
                    />
                  </View>
                </View>
              ) : (
                <View className="space-y-4 mb-6">
                  <View>
                    <Text className="text-text-secondary text-sm mb-2">Phone number</Text>
                    <TextInput
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      placeholder="Phone number"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                      className="border-b border-border-light pb-3 text-text-primary text-base"
                    />
                  </View>

                  <View>
                    <Text className="text-text-secondary text-sm mb-2">Password</Text>
                    <TextInput
                      value={phonePassword}
                      onChangeText={setPhonePassword}
                      placeholder="Password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry
                      className="border-b border-border-light pb-3 text-text-primary text-base"
                    />
                  </View>
                </View>
              )}

              {/* Login button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className={`w-full py-4 rounded-full items-center mb-3 ${
                  loading ? 'bg-accent-700' : 'bg-accent-500'
                }`}
                activeOpacity={0.9}
              >
                <Text className="text-white font-semibold text-base">
                  {loading ? 'Logging in...' : 'Log in'}
                </Text>
              </TouchableOpacity>

              {/* Forgot password */}
              <TouchableOpacity
                onPress={() => handlePlaceholder('Forgot password')}
                className="w-full items-center mb-6"
                activeOpacity={0.8}
              >
                <Text className="text-sm" style={{ color: '#00FFFF' }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Google button */}
            <View className="w-full mt-4 mb-2" style={{ maxWidth: 400 }}>
              <TouchableOpacity
                onPress={() => {
                  if (!request) {
                    Alert.alert('Google Sign-In unavailable', 'Please try again in a moment.');
                    return;
                  }

                  promptAsync();
                }}
                className="w-full py-4 rounded-full bg-white flex-row items-center justify-center"
                activeOpacity={0.9}
              >
                {/* Google icon */}
                <AntDesign name="google" size={20} color="#4285F4" style={{ marginRight: 12 }} />
                <Text className="text-neutral-900 font-semibold">Continue with Google</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
