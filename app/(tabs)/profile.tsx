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
  StyleSheet
} from "react-native";
import { profileStyles } from "../../components/ui/style";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "@/context/FavoritesContext";

const API_BASE_URL =
  Platform.OS === "web"
    ? "https://cst438-project3-backend-ae08bf484454.herokuapp.com/api/auth"
    : "https://cst438-project3-backend-ae08bf484454.herokuapp.com/api/auth";

export default function ProfileScreen() {
  const router = useRouter();

  const { user, username, setUsername, logout } = useAuth();
  const { favorites } = useFavorites();

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

  const openSettings = () => setMenuOpen(true);

  const onChangeUsername = () => {
    setMenuOpen(false);
    setEditingUsername(true);
  };

  const onChangeBio = () => {
    setMenuOpen(false);
    setEditingBio(true);
  };

  const onSaveUsername = () => {
    if (!localUsername.trim()) {
      Alert.alert("Username", "Username cannot be empty.");
      return;
    }

    try {
      // TODO: we could call our backend to update username in DB
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
      // TODO: another feature we can do is call our backend to update bio
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
    Alert.alert("Change profile picture", "Add image picker here.");
  };

  const onChangeBanner = () => {
    setMenuOpen(false);
    Alert.alert("Change background image", "Add image picker here.");
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

      await logout();

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

      {/* Avatar + Username */}
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

      {/* Content */}
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
        ) : favorites.length === 0 ? (
          <Text style={styles.placeholder}>
            You haven’t favorited any items yet.
          </Text>
        ) : (
          <View style={{ width: "100%", marginTop: 12 }}>
            {favorites.map((item) => (
              <Pressable
                key={item.id}
                style={styles.favoriteCard}
                onPress={() =>
                  router.push({
                    pathname: "/item/[id]",
                    params: {
                      id: String(item.id),
                      title: item.title,
                      description: item.description ?? "",
                      category: item.category ?? "",
                      imageUrl: item.imageUrl ?? "",
                      price:
                        item.price != null ? String(item.price) : "",
                    },
                  })
                }
              >
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.favoriteImage}
                  />
                ) : (
                  <View style={styles.favoriteImagePlaceholder}>
                    <Text>Img</Text>
                  </View>
                )}

                <View style={{ flex: 1 }}>
                  <Text style={styles.favoriteTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  {item.price != null && (
                    <Text style={styles.favoritePrice}>
                      ${Number(item.price).toFixed(2)}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
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

      {/* Username modal */}
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

      {/* Bio modal */}
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

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1313",
  },

  banner: {
    height: 80,
    backgroundColor: "#182122",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  bannerImage: {
    opacity: 0.4,
  },

  settingsButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
  },

  settingsIcon: {
    fontSize: 28,
    color: "#aabcbc",
  },

  profileHeader: {
    alignItems: "center",
    marginTop: -50,
    paddingHorizontal: 16,
  },

  avatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#5b7b7a",
  },

  avatar: {
    width: "100%",
    height: "100%",
  },

  avatarPlaceholder: {
    flex: 1,
    backgroundColor: "#5b7b7a",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarInitial: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    color: "white",
  },

  biography: {
    fontSize: 14,
    color: "#cfd7d7",
    marginTop: 6,
  },

  tabsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 20,
  },

  tabButton: {
    alignItems: "center",
  },

  tabText: {
    fontSize: 16,
    color: "#cfd7d7",
  },

  tabTextActive: {
    color: "#5b7b7a",
    fontWeight: "bold",
  },

  activeUnderline: {
    marginTop: 3,
    width: 40,
    height: 3,
    backgroundColor: "#5b7b7a",
    borderRadius: 2,
  },

  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },

  placeholder: {
    color: "#9aa7a7",
    textAlign: "center",
    marginTop: 20,
  },

  addButton: {
    marginTop: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#5b7b7a",
    alignItems: "center",
    justifyContent: "center",
  },

  addText: {
    color: "white",
    fontSize: 26,
  },

  /* Favorites cards */
  favoriteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1b2424",
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },

  favoriteImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },

  favoriteImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#333",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  favoriteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },

  favoritePrice: {
    fontSize: 14,
    color: "#9aa7a7",
    marginTop: 2,
  },

  /* Settings menu */
  menuOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  menuContainer: {
    position: "absolute",
    right: 10,
    top: 50,
    backgroundColor: "#1b2424",
    padding: 12,
    borderRadius: 10,
  },

  menuItem: {
    paddingVertical: 8,
  },

  menuItemText: {
    color: "white",
    fontSize: 16,
  },

  /* Edit modals */
  editOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },

  editCard: {
    width: "80%",
    backgroundColor: "#1b2424",
    padding: 20,
    borderRadius: 12,
  },

  editTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
  },

  editInput: {
    backgroundColor: "#2b3434",
    color: "white",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },

  editInputMultiline: {
    height: 80,
  },

  editButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  editButtonSecondary: {
    padding: 10,
  },

  editButtonTextSecondary: {
    color: "#9aa7a7",
    fontSize: 16,
  },

  editButtonPrimary: {
    padding: 10,
    backgroundColor: "#5b7b7a",
    borderRadius: 6,
  },

  editButtonTextPrimary: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});