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
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { isValidEmail } from "@ursine-arcana/shared";

/**
 * Forgot Password Screen
 * Send password reset email
 */
export default function ForgotPasswordScreen() {
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Email Required", "Please enter your email address.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      await resetPassword(email);
      setSent(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to send reset email";
      Alert.alert("Error", message);
    }
  };

  if (sent) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary">
        <View className="flex-1 px-6 justify-center items-center">
          <Text className="text-6xl mb-6">📧</Text>
          <Text className="text-2xl font-bold text-text-primary text-center mb-4">
            Check Your Email
          </Text>
          <Text className="text-text-secondary text-center mb-8">
            We've sent a password reset link to {email}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-accent-500 rounded-xl py-4 px-8"
          >
            <Text className="text-white font-semibold text-lg">
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center">
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-6"
          >
            <Text className="text-accent-500 text-lg">← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View className="items-center mb-12">
            <Text className="text-3xl font-bold text-text-primary">
              Reset Password
            </Text>
            <Text className="text-text-secondary mt-2 text-center">
              Enter your email and we'll send you a reset link
            </Text>
          </View>

          {/* Form */}
          <View className="mb-8">
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

          {/* Reset button */}
          <TouchableOpacity
            onPress={handleReset}
            disabled={loading}
            className={`rounded-xl py-4 items-center ${
              loading ? "bg-accent-700" : "bg-accent-500"
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              {loading ? "Sending..." : "Send Reset Link"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
