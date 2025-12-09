import React from "react";
import {Text, View, FlatList, Pressable, Image, Alert, StyleSheet,} from "react-native";
import { useCart } from "@/context/CartContext";

const API_BASE_URL =
  "https://cst438-project3-backend-ae08bf484454.herokuapp.com";

export default function CartScreen() {
  const { cart, removeFromCart, clearCart } = useCart();

  const safeCart = Array.isArray(cart) ? cart : [];

  console.log("🛒 CartScreen loaded. Raw cart from context:", cart);
  console.log("✅ Using safeCart:", safeCart);

  const total = safeCart.reduce((sum, item) => {
    const priceNum = Number(item.price ?? 0);
    const qty = item.quantity ?? 1;

    if (isNaN(priceNum)) {
      console.warn("⚠️ Price is not a number for cart item:", item);
      return sum;
    }

    return sum + priceNum * qty;
  }, 0);

  console.log("🧮 Cart total (number):", total, "type:", typeof total);

  async function handleCheckout() {
    if (safeCart.length === 0) return;

    try {
      console.log("💳 Checkout clicked — deleting items from backend…");

      await Promise.all(
        safeCart.map((item) =>
          fetch(`${API_BASE_URL}/api/items/${item.id}`, {
            method: "DELETE",
          })
        )
      );

      console.log("✅ All items deleted from backend");
      clearCart();

      Alert.alert("Success", "Checkout complete! Enjoy!.");
    } catch (err) {
      console.error("❌ Error during checkout:", err);
      Alert.alert(
        "Error",
        "Something went wrong during checkout. Please try again."
      );
    }
  }

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.title}>Your Cart</Text>

        {safeCart.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Cart is currently empty.</Text>
            <Text style={styles.emptySub}>
              Add some pieces from the marketplace to see them here.
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={safeCart}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              contentContainerStyle={{ paddingBottom: 16 }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => (
                <View style={styles.lineItem}>
                  {/* Image */}
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.thumbnail}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                      <Text style={styles.thumbnailText}>No Image</Text>
                    </View>
                  )}

                  {/* Text block */}
                  <View style={styles.lineTextBlock}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {item.title}
                    </Text>

                    <Text style={styles.itemPrice}>
                      ${Number(item.price ?? 0).toFixed(2)}
                    </Text>

                    <Pressable
                      onPress={() => removeFromCart(item.id)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            />

            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryLabel}>Total</Text>
                <Text style={styles.summaryTotal}>
                  ${total.toFixed(2)}
                </Text>
              </View>

              <Pressable
                onPress={handleCheckout}
                style={styles.checkoutButton}
              >
                <Text style={styles.checkoutText}>Checkout</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0d1313",
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#151d1d",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#f5fafa",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#cfd7d7",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptySub: {
    color: "#8fa4a4",
    fontSize: 14,
    textAlign: "center",
    maxWidth: 260,
  },
  lineItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#202a2a",
  },
  thumbnailPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailText: {
    fontSize: 11,
    color: "#889999",
  },
  lineTextBlock: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f5fafa",
  },
  itemPrice: {
    fontSize: 14,
    color: "#cfd7d7",
    marginTop: 2,
  },
  removeButton: {
    marginTop: 6,
  },
  removeText: {
    color: "#f27f7f",
    fontSize: 13,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#202a2a",
    marginVertical: 10,
  },
  summaryRow: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#202a2a",
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#8fa4a4",
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f5fafa",
    marginTop: 2,
  },
  checkoutButton: {
    backgroundColor: "#5b7b7a",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});