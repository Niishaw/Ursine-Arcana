import { Redirect } from 'expo-router';

/**
 * Root entry point
 * Always redirect to the splash screen so all platforms see
 * the same initial experience.
 */
export default function Index() {
  return <Redirect href="/splash" />;
}
