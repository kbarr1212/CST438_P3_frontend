import React from "react";
import { View, Text, StyleSheet, Pressable, Image, Alert, Platform,} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

type ItemParams = {
  id?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  price?: string;
  category?: string;
};

export default function ItemDetailScreen() {
  const params = useLocalSearchParams<ItemParams>();
  const router = useRouter();

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const idString = params.id ?? "";
  const id = Number(idString) || 0;

  const title = params.title ?? "Item details";
  const description = params.description ?? "";
  const imageUrl = params.imageUrl ?? "";
  const category = params.category ?? "";
  const priceNumber = params.price ? Number(params.price) : 0;

  const favoriteNow = isFavorite(id);

  function handleAddToCart() {
    if (!id) {
      Alert.alert("Error", "Invalid item id.");
      return;
    }

    addToCart({
      id,
      title,
      description,
      imageUrl,
      price: priceNumber,
    });

    const msg = "Added to cart";

    if (Platform.OS === "web") {
      alert(msg);
    } else {
      Alert.alert("Success", msg);
    }

    router.push("/(tabs)/marketplace");
  }

  function handleToggleFavorite() {
    if (!id) {
      Alert.alert("Error", "Invalid item id.");
      return;
    }

    toggleFavorite({
      id,
      title,
      description,
      category,
      imageUrl,
      price: priceNumber,
    });

    const msg = favoriteNow ? "Removed from favorites" : "Added to favorites";

    if (Platform.OS === "web") {
      alert(msg);
    } else {
      Alert.alert("Favorites", msg);
    }
  }

  console.log("🧾 ItemDetail params:", params);

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ title }} />

      <View style={styles.card}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.imageBox}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imageBox}>
            <Text style={styles.imageText}>No Image Available</Text>
          </View>
        )}

        <Text style={styles.title}>{title}</Text>

        {priceNumber > 0 && (
          <Text style={styles.price}>${priceNumber.toFixed(2)}</Text>
        )}

        <Text style={styles.description}>{description}</Text>

        <View style={styles.buttonRow}>
          <Pressable style={styles.cartButton} onPress={handleAddToCart}>
            <Text style={styles.cartButtonText}>Add to Cart</Text>
          </Pressable>

          <Pressable
            style={[
              styles.favoriteButton,
              favoriteNow && styles.favoriteButtonActive,
            ]}
            onPress={handleToggleFavorite}
          >
            <Text
              style={[
                styles.favoriteButtonText,
                favoriteNow && styles.favoriteButtonTextActive,
              ]}
            >
              {favoriteNow ? "♥ Favorited" : "♡ Favorite"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0d1313",
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#151d1d",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  imageBox: {
    width: "100%",
    height: 320,
    backgroundColor: "#202a2a",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  imageText: {
    color: "#8fa4a4",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
    color: "#f5fafa",
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#f0d48a",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: "#cfd7d7",
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  cartButton: {
    flex: 1,
    backgroundColor: "#5b7b7a",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  cartButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  favoriteButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#394545",
    backgroundColor: "#151d1d",
  },
  favoriteButtonActive: {
    borderColor: "#f27f7f",
    backgroundColor: "#2a171b",
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#cfd7d7",
  },
  favoriteButtonTextActive: {
    color: "#f6a0a0",
  },
});