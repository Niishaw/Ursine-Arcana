import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";

/**
 * Entry point - redirects based on auth state
 */
export default function Index() {
  const { user, loading, hasCompletedOnboarding } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-primary">
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  // Not logged in -> go to auth
  if (!user) {
    return <Redirect href="/(auth)/age-gate" />;
  }

  // Logged in but hasn't completed onboarding -> go to onboarding
  if (!hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)/profile-setup" />;
  }

  // Fully onboarded -> go to main app
  return <Redirect href="/(main)/feed" />;
}
