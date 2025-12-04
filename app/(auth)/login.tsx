import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";

WebBrowser.maybeCompleteAuthSession();

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080"      // Android emulator
    : "http://localhost:8080";    // iOS simulator / web on same machine

export default function LoginScreen() {
  const { setIsLoggedIn, setUsername } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "961378291358-7lbk7gaeuf4m9lps3qb567h8te5708a5.apps.googleusercontent.com",
    webClientId: "961378291358-q862ql18vlqvshbo2fo6p1v51uib13r5.apps.googleusercontent.com",
  });

  const discovery = {
      authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      tokenEndpoint: 'https://github.com/login/oauth/access_token',
    };
  
    const [githubRequest, githubResponse, githubPromptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!, 
      scopes: ["read:user", "user:email"],
      redirectUri: makeRedirectUri({
        scheme: "thriftmarket", 
      }),
    },
    discovery
  );
  

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const showPasswordFields = isValidEmail(email);


  const handleContinue = async () => {
  if (showPasswordFields) {
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data);
        return;
      }

      console.log("Login success:", data);
      alert("Logged in successfully!");
      
      const backendUsername =
      data?.user?.username ??
      data?.username ??
      email.split("@")[0]; // fallback if backend doesn't send one
      
      setUsername(backendUsername); 
      
      setIsLoggedIn(true);
      router.push("/(tabs)/marketplace"); 
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later.");
    }
  } else {
    console.log("Continue with email:", email);
  }
}; 

  useEffect(() => {
  const handleGoogleLogin = async () => {
    if (!response || response.type !== "success") return;

    const accessToken =
      (response as any).authentication?.accessToken ??
      (response as any).params?.access_token;

    if (!accessToken) {
      setError("Google login failed: no access token.");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken }),
    });

    const data = await res.json();
    console.log("Google backend status:", res.status, "body:", data);

    if (!res.ok) {
      setError("Google login failed.");
      return;
    }

    setIsLoggedIn(true);
    router.replace("/(tabs)/marketplace");
  };

  handleGoogleLogin();
}, [response]);


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.outerContainer}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Thrift Market ™</Text>

          <Text style={styles.subtitle}>Log in</Text>
          <Text style={styles.text}>Enter your email to Log in for this app</Text>

          <TextInput
            style={styles.input}
            placeholder="email@domain.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {showPasswordFields && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>
              {showPasswordFields ? "Log in" : "Continue"}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            disabled={!request}
            onPress={() => promptAsync()}
          >
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
              }}
              style={styles.icon}
            />
            <Text style={styles.thirdPartyText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.githubButton}
            disabled={!githubRequest}
            onPress={() => githubPromptAsync()}
          >
            <Image
              source={{ uri: "https://img.icons8.com/ios11/512/FFFFFF/github.png" }}
              style={styles.icon}
            />
            <Text style={styles.githubButtonText}>Continue with GitHub</Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By clicking continue, you agree to our{" "}
            <Text style={styles.link}>Terms of Service</Text> and{" "}
            <Text style={styles.link}>Privacy Policy</Text>.
          </Text>
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.bottomLink}>Sign Up</Text>
  </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#2979FF",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    width: "100%",
    maxWidth: 420,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2979FF",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  text: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#f3f3f3",
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  continueButton: {
    backgroundColor: "#2979FF",
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  orText: {
    marginHorizontal: 10,
    color: "#666",
    fontWeight: "600",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    width: "100%",
    height: 50,
    justifyContent: "center",
    marginBottom: 12,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  thirdPartyText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  githubButton: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#24292f",
  borderRadius: 10,
  width: "100%",
  height: 50,
  justifyContent: "center",
  marginBottom: 12,
},
githubButtonText: {
  fontSize: 16,
  color: "#fff",
  fontWeight: "500",
},
  terms: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
    marginTop: 8,
    width: "90%",
  },
  link: {
    color: "#2979FF",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
  },
  bottomRow: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 16,
  },
  bottomText: {
  fontSize: 14,
  color: "#000",
  },
  bottomLink: {
  fontSize: 14,
  fontWeight: "600",
  color: "#2979FF",
  textDecorationLine: "underline",
},
});
