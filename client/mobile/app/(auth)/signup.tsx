import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { isValidEmail } from "@ursine-arcana/shared";
import ConsentCheckbox from "@/components/common/ConsentCheckbox";

/**
 * Sign Up Screen
 * New user registration with consent checkboxes
 */
export default function SignUpScreen() {
  const { dob } = useLocalSearchParams<{ dob: string }>();
  const { signUp, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleSignUp = async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    if (!termsAccepted || !privacyAccepted) {
      Alert.alert(
        "Consent Required",
        "You must accept the Terms of Service and Privacy Policy to continue.",
      );
      return;
    }

    try {
      await signUp(email, password, {
        dateOfBirth: dob ? new Date(dob) : new Date(),
        termsAcceptedAt: new Date(),
        privacyAcceptedAt: new Date(),
      });

      // Navigate to phone verification
      router.push("/(auth)/phone-verify");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Sign up failed";
      Alert.alert("Sign Up Failed", message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 py-8">
            {/* Header */}
            <View className="items-center mb-8">
              <Text className="text-3xl font-bold text-text-primary">
                Create Account
              </Text>
              <Text className="text-text-secondary mt-2">Join the pack</Text>
            </View>

            {/* Form */}
            <View className="mb-6">
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
                <Text className="text-text-secondary text-sm mb-2">
                  Password
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 8 characters"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  className="bg-surface-secondary rounded-xl px-4 py-4 text-text-primary text-base"
                />
              </View>

              <View className="mb-6">
                <Text className="text-text-secondary text-sm mb-2">
                  Confirm Password
                </Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  className="bg-surface-secondary rounded-xl px-4 py-4 text-text-primary text-base"
                />
              </View>
            </View>

            {/* Consent checkboxes */}
            <View className="mb-8">
              <ConsentCheckbox
                checked={termsAccepted}
                onToggle={() => setTermsAccepted(!termsAccepted)}
                label="I accept the Terms of Service"
                linkText="Terms of Service"
                linkUrl="https://ursinearcana.com/terms"
              />

              <ConsentCheckbox
                checked={privacyAccepted}
                onToggle={() => setPrivacyAccepted(!privacyAccepted)}
                label="I accept the Privacy Policy"
                linkText="Privacy Policy"
                linkUrl="https://ursinearcana.com/privacy"
              />
            </View>

            {/* Sign up button */}
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              className={`rounded-xl py-4 items-center mb-4 ${
                loading ? "bg-accent-700" : "bg-accent-500"
              }`}
            >
              <Text className="text-white font-semibold text-lg">
                {loading ? "Creating account..." : "Create Account"}
              </Text>
            </TouchableOpacity>

            {/* Back to login */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="items-center py-4"
            >
              <Text className="text-text-secondary">
                Already have an account?{" "}
                <Text className="text-accent-500">Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
