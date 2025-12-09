import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";
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
  Platform.OS === "web"
    ? "https://cst438-project3-backend-ae08bf484454.herokuapp.com/api/auth"
    : "https://cst438-project3-backend-ae08bf484454.herokuapp.com/api/auth";

export default function LoginScreen() {
  const { setIsLoggedIn, setUsername, setUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ---------- GOOGLE ----------
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "961378291358-7lbk7gaeuf4m9lps3qb567h8te5708a5.apps.googleusercontent.com",
    webClientId:
      "961378291358-q862ql18vlqvshbo2fo6p1v51uib13r5.apps.googleusercontent.com",
  });

  // ---------- GITHUB ----------
  const extra =
    Constants.expoConfig?.extra ?? (Constants as any).manifest?.extra;
  const GITHUB_CLIENT_ID =
    Platform.OS === "web"
      ? (extra?.githubClientId as string)
      : (extra?.githubClientIdNative as string);

  const discovery = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
  };

  const redirectUri =
    Platform.OS === "web"
      ? makeRedirectUri({ path: "redirect" }) // http://localhost:8081/redirect on web
      : makeRedirectUri({ useProxy: true } as any); // Expo proxy for mobile

  console.log("GitHub redirect URI ->", redirectUri);
  console.log("GITHUB_CLIENT_ID ->", GITHUB_CLIENT_ID);

  const [githubRequest, githubResponse, githubPromptAsync] = useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ["read:user", "user:email"],
      redirectUri,
      usePKCE: false,
    },
    discovery
  );

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const showPasswordFields = isValidEmail(email);

  // ---------- GITHUB LOGIN HANDLER ----------
  useEffect(() => {
    const handleGithubLogin = async () => {
      if (githubResponse?.type !== "success") return;

      const code = githubResponse.params.code as string | undefined;
      console.log("GitHub auth success, code:", code);

      if (!code) {
        console.error("No GitHub code received");
        setError("GitHub did not return a login code.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/github`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            source: Platform.OS === "web" ? "web" : "mobile",
          }),
        });

        const text = await res.text();
        console.log("GitHub backend response:", res.status, text);

        if (!res.ok) {
          setError(text || "GitHub login failed.");
          return;
        }

        const backendUser = JSON.parse(text);
        console.log("GitHub user from backend:", backendUser);

        // 🔹 store full user in auth context
        setUser({
          id: String(backendUser.id),
          email: backendUser.email,
          name: backendUser.username ?? backendUser.email,
        });

        const backendUsername =
          backendUser.username ?? backendUser.email?.split("@")[0];

        setUsername(backendUsername || "github-user");
        setIsLoggedIn(true);

        router.replace("/(tabs)/marketplace");
      } catch (e) {
        console.error("GitHub login error:", e);
        setError("GitHub login error. Please try again.");
      }
    };

    handleGithubLogin();
  }, [githubResponse]);

  // ---------- EMAIL / PASSWORD LOGIN ----------
  const handleContinue = async () => {
    if (showPasswordFields) {
      if (!password) {
        setError("Please enter your password.");
        return;
      }

      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        let data: any = null;
        try {
          data = await response.json();
        } catch {
          // non-JSON error body
        }

        if (!response.ok) {
          const message =
            typeof data === "string"
              ? data
              : data?.message ||
                data?.error ||
                "Login failed. Please try again.";
          setError(message);
          return;
        }

        console.log("Login success:", data);
        alert("Logged in successfully!");

        const backendUser = data; // backend returns the User directly

        // 🔹 store full user
        setUser({
          id: String(backendUser.id),
          email: backendUser.email,
          name: backendUser.username ?? backendUser.email,
        });

        const backendUsername =
          backendUser.username ?? backendUser.email?.split("@")[0];

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

  // ---------- GOOGLE LOGIN HANDLER ----------
  useEffect(() => {
    const handleGoogleLogin = async () => {
      if (!response || response.type !== "success") return;

      try {
        const accessToken =
          (response as any).authentication?.accessToken ??
          (response as any).params?.access_token;

        if (!accessToken) {
          setError("Google login failed: no access token.");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: accessToken }),
        });

        let data: any = null;
        try {
          data = await res.json();
        } catch {
          // non-JSON error body
        }

        console.log("Google backend status:", res.status, "body:", data);

        if (!res.ok) {
          setError(
            (data && (data.message || data.error)) ||
              "Google login failed."
          );
          return;
        }

        const backendUser = data; // backend returns the User directly

        // 🔹 store full user
        setUser({
          id: String(backendUser.id),
          email: backendUser.email,
          name: backendUser.username ?? backendUser.email,
        });

        const backendUsername =
          backendUser.username ?? backendUser.email?.split("@")[0];

        if (backendUsername) {
          setUsername(backendUsername);
        }

        setIsLoggedIn(true);
        router.replace("/(tabs)/marketplace");
      } catch (e) {
        console.error("Google login error:", e);
        setError("Google login failed. Please try again.");
      }
    };

    handleGoogleLogin();
  }, [response]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.outerContainer}
    >
      <ScrollView
        style={{ flex: 1 }}
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
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
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
