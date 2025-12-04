import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import {
  SPECIES_OPTIONS,
  getSpeciesByCategory,
  isValidDisplayName,
  isValidBio,
} from "@ursine-arcana/shared";

/**
 * Profile Setup Screen
 * First step of onboarding - basic profile info
 */
export default function ProfileSetupScreen() {
  const { userProfile, refreshUserProfile } = useAuth();

  const [displayName, setDisplayName] = useState(
    userProfile?.displayName || "",
  );
  const [bio, setBio] = useState(userProfile?.bio || "");
  const [species, setSpecies] = useState(userProfile?.species || "other");
  const [customSpecies, setCustomSpecies] = useState(
    userProfile?.customSpecies || "",
  );
  const [loading, setLoading] = useState(false);

  const speciesByCategory = getSpeciesByCategory();

  const handleContinue = async () => {
    // Validate
    const nameValidation = isValidDisplayName(displayName);
    if (!nameValidation.valid) {
      Alert.alert("Invalid Name", nameValidation.error);
      return;
    }

    const bioValidation = isValidBio(bio);
    if (!bioValidation.valid) {
      Alert.alert("Invalid Bio", bioValidation.error);
      return;
    }

    if (species === "other" && !customSpecies.trim()) {
      Alert.alert("Species Required", "Please enter your custom species.");
      return;
    }

    setLoading(true);
    try {
      // TODO: Update profile in Firestore
      await refreshUserProfile();
      router.push("/(onboarding)/special-consent");
    } catch (error) {
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-text-primary">
              Create Your Profile
            </Text>
            <Text className="text-text-secondary mt-2">
              Tell us about yourself
            </Text>
          </View>

          {/* Display Name */}
          <View className="mb-6">
            <Text className="text-text-secondary text-sm mb-2">
              Display Name *
            </Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="How should we call you?"
              placeholderTextColor="#9CA3AF"
              maxLength={50}
              className="bg-surface-secondary rounded-xl px-4 py-4 text-text-primary text-base"
            />
          </View>

          {/* Bio */}
          <View className="mb-6">
            <Text className="text-text-secondary text-sm mb-2">Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell others about yourself..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
              className="bg-surface-secondary rounded-xl px-4 py-4 text-text-primary text-base min-h-[120px]"
            />
            <Text className="text-text-tertiary text-xs mt-1 text-right">
              {bio.length}/500
            </Text>
          </View>

          {/* Species */}
          <View className="mb-6">
            <Text className="text-text-secondary text-sm mb-2">Species *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-2"
            >
              {SPECIES_OPTIONS.slice(0, 10).map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSpecies(option.value)}
                  className={`mr-2 px-4 py-2 rounded-full ${
                    species === option.value
                      ? "bg-accent-500"
                      : "bg-surface-secondary"
                  }`}
                >
                  <Text
                    className={
                      species === option.value
                        ? "text-white font-medium"
                        : "text-text-primary"
                    }
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* More species button */}
            <TouchableOpacity
              onPress={() => {
                // TODO: Open full species picker modal
              }}
              className="bg-surface-secondary rounded-xl px-4 py-3"
            >
              <Text className="text-accent-500 text-center">
                See all species →
              </Text>
            </TouchableOpacity>

            {/* Custom species input */}
            {species === "other" && (
              <TextInput
                value={customSpecies}
                onChangeText={setCustomSpecies}
                placeholder="Enter your species"
                placeholderTextColor="#9CA3AF"
                maxLength={50}
                className="bg-surface-secondary rounded-xl px-4 py-4 text-text-primary text-base mt-3"
              />
            )}
          </View>

          {/* Continue button */}
          <View className="mt-auto pt-6">
            <TouchableOpacity
              onPress={handleContinue}
              disabled={loading}
              className={`rounded-xl py-4 items-center ${
                loading ? "bg-accent-700" : "bg-accent-500"
              }`}
            >
              <Text className="text-white font-semibold text-lg">
                {loading ? "Saving..." : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
