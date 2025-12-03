// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import {
//   getCurrentProvider,
//   signOutGoogle,
//   signOutGithub,
//   signOutRegular,
// } from "./authSignOut";

// const SignOutScreen: React.FC = () => {
//   const [loading, setLoading] = useState(false);

//   const handleSignOut = async () => {
//     try {
//       setLoading(true);

//       const provider = await getCurrentProvider();

//       switch (provider) {
//         case "google":
//           await signOutGoogle();
//           break;
//         case "github":
//           await signOutGithub();
//           break;
//         case "email":
//         case "unknown":
//         default:
//           await signOutRegular();
//           break;
//       }

//       // TODO: Navigate to your auth/login screen here
//       // e.g. navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
//       Alert.alert("Signed out", "You have been signed out successfully.");
//     } catch (err: any) {
//       console.error("Sign-out error:", err);
//       Alert.alert(
//         "Error",
//         err?.message ?? "Something went wrong while signing out."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.root}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Account</Text>
//         <Text style={styles.subtitle}>
//           You are currently signed in. Tap the button below to sign out safely.
//         </Text>

//         <Pressable
//           style={({ pressed }) => [
//             styles.button,
//             pressed && styles.buttonPressed,
//           ]}
//           onPress={handleSignOut}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator />
//           ) : (
//             <Text style={styles.buttonText}>Sign Out</Text>
//           )}
//         </Pressable>
//       </View>
//     </View>
//   );
// };

// export default SignOutScreen;

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: "#f3f4f6",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 24,
//   },
//   card: {
//     width: "100%",
//     maxWidth: 400,
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     paddingVertical: 24,
//     paddingHorizontal: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 4,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "600",
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#6b7280",
//     textAlign: "center",
//     marginBottom: 24,
//   },
//   button: {
//     backgroundColor: "#38bdf8", // sky blue
//     borderRadius: 999, // pill shape
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   buttonPressed: {
//     opacity: 0.85,
//   },
//   buttonText: {
//     color: "#ffffff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });
