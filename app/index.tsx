import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect root URL to the login screen so web '/' is matched
  return <Redirect href="/(auth)/login" />;
}
