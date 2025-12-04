import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { getSpeciesLabel, getTribeLabel } from "@ursine-arcana/shared";

/**
 * Profile Screen - Current user's profile
 */
export default function ProfileScreen() {
  const { userProfile, signOut } = useAuth();

  const handleEditProfile = () => {
    router.push("/(main)/settings/edit-profile");
  };

  const handleSettings = () => {
    router.push("/(main)/settings");
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/age-gate");
  };

  if (!userProfile) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary items-center justify-center">
        <Text className="text-text-secondary">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-primary" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-3 flex-row items-center justify-between border-b border-border-light">
          <Text className="text-2xl font-bold text-text-primary">Profile</Text>
          <TouchableOpacity onPress={handleSettings}>
            <Text className="text-2xl">⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Profile header */}
        <View className="items-center pt-6 pb-4">
          {/* Avatar */}
          <TouchableOpacity onPress={handleEditProfile}>
            {userProfile.profileImageUrl ? (
              <Image
                source={{ uri: userProfile.profileImageUrl }}
                className="w-32 h-32 rounded-full"
              />
            ) : (
              <View className="w-32 h-32 rounded-full bg-surface-secondary items-center justify-center">
                <Text className="text-5xl">🐾</Text>
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-accent-500 rounded-full w-10 h-10 items-center justify-center">
              <Text className="text-white text-lg">✏️</Text>
            </View>
          </TouchableOpacity>

          {/* Name and species */}
          <Text className="text-2xl font-bold text-text-primary mt-4">
            {userProfile.displayName || "Set your name"}
          </Text>
          <Text className="text-text-secondary mt-1">
            {userProfile.species !== "other"
              ? getSpeciesLabel(userProfile.species)
              : userProfile.customSpecies || "Select your species"}
          </Text>
        </View>

        {/* Bio */}
        {userProfile.bio && (
          <View className="px-4 py-4 border-t border-border-light">
            <Text className="text-text-secondary text-sm mb-1">About</Text>
            <Text className="text-text-primary">{userProfile.bio}</Text>
          </View>
        )}

        {/* Tribes */}
        {userProfile.tribes.length > 0 && (
          <View className="px-4 py-4 border-t border-border-light">
            <Text className="text-text-secondary text-sm mb-2">Tribes</Text>
            <View className="flex-row flex-wrap">
              {userProfile.tribes.map((tribe) => (
                <View
                  key={tribe}
                  className="bg-surface-secondary rounded-full px-3 py-1 mr-2 mb-2"
                >
                  <Text className="text-text-primary text-sm">
                    {getTribeLabel(tribe)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tags */}
        {userProfile.tags.length > 0 && (
          <View className="px-4 py-4 border-t border-border-light">
            <Text className="text-text-secondary text-sm mb-2">Interests</Text>
            <View className="flex-row flex-wrap">
              {userProfile.tags.map((tag) => (
                <View
                  key={tag}
                  className="bg-accent-500/20 rounded-full px-3 py-1 mr-2 mb-2"
                >
                  <Text className="text-accent-400 text-sm">{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        <View className="px-4 py-6">
          <TouchableOpacity
            onPress={handleEditProfile}
            className="bg-accent-500 rounded-xl py-4 items-center mb-3"
          >
            <Text className="text-white font-semibold text-lg">
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignOut}
            className="border border-error-main rounded-xl py-4 items-center"
          >
            <Text className="text-error-main font-semibold text-lg">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
