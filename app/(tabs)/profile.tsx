import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import { profileStyles as styles } from "../../components/ui/style";
import { useAuth } from "../../hooks/useAuth";

const API_BASE_URL =
  Platform.OS === "web"
    ? "https://cst438-project3-backend-ae08bf484454.herokuapp.com/api/auth"
    : "https://cst438-project3-backend-ae08bf484454.herokuapp.com/api/auth";

export default function ProfileScreen() {
  const router = useRouter();

  const { user, username, setUsername, logout } = useAuth();

  const [active, setActive] = useState<"Listings" | "Favorites">("Listings");
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingBio, setEditingBio] = useState(false);

  const [localUsername, setLocalUsername] = useState(
    username ?? "Unnamed user"
  );
  const [bio, setBio] = useState("Tap settings to add a short bio.");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [bannerUri, setBannerUri] = useState<string | null>(null);

  const displayName = username ?? localUsername;

  const openSettings = () => {
    setMenuOpen(true);
  };

  const onChangeUsername = () => {
    setMenuOpen(false);
    setEditingUsername(true);
  };

  const onChangeBio = () => {
    setMenuOpen(false);
    setEditingBio(true);
  };

  const onSaveUsername = async () => {
    if (!localUsername.trim()) {
      Alert.alert("Username", "Username cannot be empty.");
      return;
    }

    try {
      // TODO: call your backend to update username in DB
      setUsername(localUsername.trim());
      Alert.alert("Success", "Username updated.");
    } catch (e) {
      console.error("Update username error:", e);
      Alert.alert("Error", "Failed to update username.");
    } finally {
      setEditingUsername(false);
    }
  };

  const onSaveBio = async () => {
    try {
      // TODO: call your backend to update bio
      Alert.alert("Success", "Bio updated.");
    } catch (e) {
      console.error("Update bio error:", e);
      Alert.alert("Error", "Failed to update bio.");
    } finally {
      setEditingBio(false);
    }
  };

  const onChangeAvatar = () => {
    setMenuOpen(false);
    Alert.alert(
      "Change profile picture",
      "Here you can integrate an image picker (e.g. expo-image-picker) to upload an avatar."
    );
  };

  const onChangeBanner = () => {
    setMenuOpen(false);
    Alert.alert(
      "Change background image",
      "Here you can integrate an image picker to upload a header/background image."
    );
  };

const onDeleteAccount = () => {
  console.log("[Profile] Delete account pressed");
  setMenuOpen(false);

  const doDelete = async () => {
    try {
      console.log("[Profile] Confirmed delete, current user:", user);

      if (!user?.id) {
        Alert.alert(
          "Error",
          "Unable to determine your user id. Please log in again."
        );
        return;
      }

      const url = `${API_BASE_URL}/users/${user.id}`;
      console.log("[Profile] Sending DELETE to:", url);

      const res = await fetch(url, { method: "DELETE" });

      console.log("[Profile] Delete response status:", res.status);

      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        console.error("Delete account error:", res.status, text);
        Alert.alert(
          "Error",
          text || "Failed to delete account. Please try again."
        );
        return;
      }

      // ✅ Clear auth state
      await logout();

      // ✅ Navigate back to login
      if (Platform.OS === "web") {
        alert("Account deleted. Redirecting to login.");
        router.replace("/(auth)/login");
      } else {
        Alert.alert("Account deleted", "Your account has been removed.", [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]);
      }
    } catch (e) {
      console.error("Delete account error:", e);
      Alert.alert("Error", "Failed to delete account. Please try again.");
    }
  };

  if (Platform.OS === "web") {
    console.log("[Profile] Using browser confirm()");
    // eslint-disable-next-line no-restricted-globals
    const confirmed = confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (confirmed) {
      void doDelete();
    }
  } else {
    Alert.alert(
      "Delete account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void doDelete();
          },
        },
      ]
    );
  }
};


  return (
    <View style={styles.container}>
      {/* Banner */}
      <ImageBackground
        source={bannerUri ? { uri: bannerUri } : undefined}
        style={styles.banner}
        imageStyle={styles.bannerImage}
      >
        <Pressable
          onPress={openSettings}
          style={styles.settingsButton}
          accessibilityLabel="Open profile settings"
        >
          <Text style={styles.settingsIcon}>⚙︎</Text>
        </Pressable>
      </ImageBackground>

      {/* Avatar + username + bio */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{displayName}</Text>
        <Text style={styles.biography}>{bio}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <Pressable
          onPress={() => setActive("Listings")}
          style={styles.tabButton}
          accessibilityState={{ selected: active === "Listings" }}
        >
          <Text
            style={[
              styles.tabText,
              active === "Listings" && styles.tabTextActive,
            ]}
          >
            Listings
          </Text>
          {active === "Listings" && <View style={styles.activeUnderline} />}
        </Pressable>

        <Pressable
          onPress={() => setActive("Favorites")}
          style={styles.tabButton}
          accessibilityState={{ selected: active === "Favorites" }}
        >
          <Text
            style={[
              styles.tabText,
              active === "Favorites" && styles.tabTextActive,
            ]}
          >
            Favorites
          </Text>
          {active === "Favorites" && <View style={styles.activeUnderline} />}
        </Pressable>
      </View>

      {/* Tab content */}
      <View style={styles.content}>
        {active === "Listings" ? (
          <View style={styles.content}>
            <Text style={styles.placeholder}>
              Listings content will appear here.
            </Text>
            <Pressable
              style={styles.addButton}
              onPress={() => router.push("/addListing")}
            >
              <Text style={styles.addText}>+</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={styles.placeholder}>
            Favorites content will appear here.
          </Text>
        )}
      </View>

      {/* Settings menu */}
      {menuOpen && (
        <View style={styles.menuOverlay} pointerEvents="box-none">
          <Pressable
            style={styles.backdrop}
            onPress={() => setMenuOpen(false)}
          />
          <View style={styles.menuContainer}>
            <Pressable style={styles.menuItem} onPress={onChangeUsername}>
              <Text style={styles.menuItemText}>Change username</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={onChangeBio}>
              <Text style={styles.menuItemText}>Change bio</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={onChangeAvatar}>
              <Text style={styles.menuItemText}>Change profile picture</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={onChangeBanner}>
              <Text style={styles.menuItemText}>Change background image</Text>
            </Pressable>

            {/* Delete option in red */}
            <Pressable style={styles.menuItem} onPress={onDeleteAccount}>
              <Text style={[styles.menuItemText, { color: "red" }]}>
                Delete account
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Username editor */}
      {editingUsername && (
        <View style={styles.editOverlay}>
          <View style={styles.editCard}>
            <Text style={styles.editTitle}>Edit username</Text>
            <TextInput
              style={styles.editInput}
              value={localUsername}
              onChangeText={setLocalUsername}
              autoCapitalize="none"
            />
            <View style={styles.editButtonsRow}>
              <Pressable
                style={styles.editButtonSecondary}
                onPress={() => setEditingUsername(false)}
              >
                <Text style={styles.editButtonTextSecondary}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.editButtonPrimary}
                onPress={onSaveUsername}
              >
                <Text style={styles.editButtonTextPrimary}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Bio editor */}
      {editingBio && (
        <View style={styles.editOverlay}>
          <View style={styles.editCard}>
            <Text style={styles.editTitle}>Edit bio</Text>
            <TextInput
              style={[styles.editInput, styles.editInputMultiline]}
              value={bio}
              onChangeText={setBio}
              multiline
            />
            <View style={styles.editButtonsRow}>
              <Pressable
                style={styles.editButtonSecondary}
                onPress={() => setEditingBio(false)}
              >
                <Text style={styles.editButtonTextSecondary}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.editButtonPrimary} onPress={onSaveBio}>
                <Text style={styles.editButtonTextPrimary}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
