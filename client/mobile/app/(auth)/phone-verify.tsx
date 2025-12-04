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

/**
 * Phone Verification Screen
 * Firebase Phone Auth for SMS verification
 */
export default function PhoneVerifyScreen() {
  const { sendPhoneVerification, verifyPhoneCode, loading } = useAuth();

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  const handleSendCode = async () => {
    if (!phone) {
      Alert.alert("Phone Required", "Please enter your phone number.");
      return;
    }

    // Ensure phone is in E.164 format
    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

    try {
      const verId = await sendPhoneVerification(formattedPhone);
      setVerificationId(verId);
      setCodeSent(true);
      Alert.alert(
        "Code Sent",
        "A verification code has been sent to your phone.",
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to send code";
      Alert.alert("Error", message);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || !verificationId) {
      Alert.alert("Code Required", "Please enter the verification code.");
      return;
    }

    try {
      await verifyPhoneCode(verificationId, code);
      // Navigate to onboarding
      router.replace("/(onboarding)/profile-setup");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Invalid code";
      Alert.alert("Verification Failed", message);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      "Skip Verification?",
      "Phone verification helps secure your account. You can verify later in settings.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Skip",
          onPress: () => router.replace("/(onboarding)/profile-setup"),
        },
      ],
    );
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
              Verify Your Phone
            </Text>
            <Text className="text-text-secondary mt-2 text-center">
              We'll send you a code to verify your phone number
            </Text>
          </View>

          {/* Phone input */}
          {!codeSent ? (
            <View className="mb-8">
              <Text className="text-text-secondary text-sm mb-2">
                Phone Number
              </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+27 12 345 6789"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                autoComplete="tel"
                className="bg-surface-secondary rounded-xl px-4 py-4 text-text-primary text-base"
              />
              <Text className="text-text-tertiary text-xs mt-2">
                Include country code (e.g., +27 for South Africa)
              </Text>
            </View>
          ) : (
            <View className="mb-8">
              <Text className="text-text-secondary text-sm mb-2">
                Verification Code
              </Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={6}
                className="bg-surface-secondary rounded-xl px-4 py-4 text-text-primary text-base text-center text-2xl tracking-widest"
              />
              <TouchableOpacity onPress={handleSendCode} className="mt-4">
                <Text className="text-accent-500 text-center">Resend code</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Action button */}
          <TouchableOpacity
            onPress={codeSent ? handleVerifyCode : handleSendCode}
            disabled={loading}
            className={`rounded-xl py-4 items-center mb-4 ${
              loading ? "bg-accent-700" : "bg-accent-500"
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              {loading
                ? "Please wait..."
                : codeSent
                  ? "Verify Code"
                  : "Send Code"}
            </Text>
          </TouchableOpacity>

          {/* Skip option */}
          <TouchableOpacity onPress={handleSkip} className="items-center py-4">
            <Text className="text-text-tertiary">Skip for now</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
