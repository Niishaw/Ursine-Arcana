import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

/**
 * Login Screen
 * Email/password authentication
 */
export default function LoginScreen() {
  const { dob } = useLocalSearchParams<{ dob: string }>();
  const { signIn, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }

    try {
      await signIn(email, password);
      // Navigation handled by auth state change in index.tsx
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      Alert.alert("Login Failed", message);
    }
  };

  const handleSignUp = () => {
    router.push({
      pathname: "/(auth)/signup",
      params: { dob },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center">
          {/* Header */}
          <View className="items-center mb-12">
            <Text className="text-3xl font-bold text-text-primary">
              Welcome Back
            </Text>
            <Text className="text-text-secondary mt-2">
              Sign in to continue
            </Text>
          </View>

          {/* Form */}
          <View className="mb-8">
            <View className="mb-4">
              <Text className="text-text-secondary text-sm mb-2">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="bg-surface-secondary rounded-xl px-4 py-4 text-text-primary text-base"
              />
            </View>

            <View className="mb-4">
              <Text className="text-text-secondary text-sm mb-2">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                className="bg-surface-secondary rounded-xl px-4 py-4 text-text-primary text-base"
              />
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
              className="self-end"
            >
              <Text className="text-accent-500 text-sm">Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`rounded-xl py-4 items-center mb-4 ${
              loading ? "bg-accent-700" : "bg-accent-500"
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-border-light" />
            <Text className="text-text-tertiary mx-4">or</Text>
            <View className="flex-1 h-px bg-border-light" />
          </View>

          {/* Sign up link */}
          <TouchableOpacity
            onPress={handleSignUp}
            className="border border-accent-500 rounded-xl py-4 items-center"
          >
            <Text className="text-accent-500 font-semibold text-lg">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
