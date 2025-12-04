import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { isAdult, MINIMUM_AGE } from "@ursine-arcana/shared";
import DatePicker from "@/components/common/DatePicker";

/**
 * Age Gate Screen
 * Users must confirm they are 18+ before accessing the app
 */
export default function AgeGateScreen() {
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleContinue = () => {
    if (!dateOfBirth) {
      Alert.alert("Date Required", "Please enter your date of birth.");
      return;
    }

    if (!isAdult(dateOfBirth)) {
      Alert.alert(
        "Age Requirement",
        `You must be at least ${MINIMUM_AGE} years old to use Ursine Arcana.`,
        [{ text: "OK" }],
      );
      return;
    }

    // Store DOB temporarily and proceed to login
    router.push({
      pathname: "/(auth)/login",
      params: { dob: dateOfBirth.toISOString() },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <View className="flex-1 px-6 justify-center">
        {/* Logo placeholder */}
        <View className="items-center mb-12">
          <Text className="text-4xl font-bold text-text-primary">
            URSINE ARCANA
          </Text>
          <Text className="text-text-secondary mt-2">
            Connect with your pack
          </Text>
        </View>

        {/* Age verification */}
        <View className="bg-surface-primary rounded-2xl p-6 mb-8">
          <Text className="text-xl font-semibold text-text-primary mb-4">
            Verify Your Age
          </Text>
          <Text className="text-text-secondary mb-6">
            Ursine Arcana is for adults only. You must be at least {MINIMUM_AGE}{" "}
            years old to use this app.
          </Text>

          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            className="bg-surface-secondary rounded-xl p-4 mb-4"
          >
            <Text className="text-text-tertiary text-sm mb-1">
              Date of Birth
            </Text>
            <Text className="text-text-primary text-lg">
              {dateOfBirth
                ? dateOfBirth.toLocaleDateString()
                : "Tap to select your date of birth"}
            </Text>
          </TouchableOpacity>

          <DatePicker
            visible={showPicker}
            date={dateOfBirth || new Date(2000, 0, 1)}
            onConfirm={(date) => {
              setDateOfBirth(date);
              setShowPicker(false);
            }}
            onCancel={() => setShowPicker(false)}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
          />
        </View>

        {/* Continue button */}
        <TouchableOpacity
          onPress={handleContinue}
          className="bg-accent-500 rounded-xl py-4 items-center"
        >
          <Text className="text-white font-semibold text-lg">Continue</Text>
        </TouchableOpacity>

        {/* Legal text */}
        <Text className="text-text-tertiary text-xs text-center mt-6 px-4">
          By continuing, you confirm that you are at least {MINIMUM_AGE} years
          old and agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}
