import { Stack } from "expo-router";

/**
 * Onboarding stack layout
 * Contains profile setup, consent, and location permission screens
 */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#111827" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="profile-setup" />
      <Stack.Screen name="special-consent" />
      <Stack.Screen name="location-permission" />
    </Stack>
  );
}
