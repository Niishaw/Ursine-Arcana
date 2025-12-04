import { Stack } from "expo-router";

/**
 * Auth stack layout
 * Contains age gate, login, signup, and verification screens
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#111827" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="age-gate" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="phone-verify" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
