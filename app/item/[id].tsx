import React from "react";
import { View, Text, StyleSheet, Pressable, Image, Alert, Platform,
} from "react-native";
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

    if (Platform.OS === "web") {
      alert("Added to cart");
    } else {
      Alert.alert("Success", "Added to cart");
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
    <View style={styles.container}>
      <Stack.Screen options={{ title }} />

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 90,
    backgroundColor: "#fff",
  },
  imageBox: {
    width: "100%",
    height: 350,
    backgroundColor: "#e5e5e5",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  imageText: {
    color: "#555",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#444",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
    marginBottom: 40,
  },
  buttonRow: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cartButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#1b0a6fff",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  cartButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  favoriteButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  favoriteButtonActive: {
    borderColor: "#e0245e",
    backgroundColor: "#ffe6ee",
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  favoriteButtonTextActive: {
    color: "#e0245e",
  },
});