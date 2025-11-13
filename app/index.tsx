import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  // Redirect root URL to the login screen so web '/' is matched
  return <Redirect href="/login" />;
}
