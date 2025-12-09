import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View, FlatList, ActivityIndicator, Image, StyleSheet, } from "react-native";
import { useRouter } from "expo-router";
import { useFavorites } from "@/context/FavoritesContext";

type Item = {
  id: number;
  title: string;
  description: string;
  category?: string;
  imageUrl?: string;
  price?: number | string;
};

export default function MarketplaceScreen() {
  const [selected, setSelected] = useState<string>("Select All");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();

  function toggleFilter(name: string) {
    setSelected((prev) => (prev === name ? "Select All" : name));
  }

  useEffect(() => {
    async function loadItems() {
      try {
        const res = await fetch(
          "https://cst438-project3-backend-ae08bf484454.herokuapp.com/api/items"
        );
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (selected === "Select All") return items;
    return items.filter(
      (item) => item.category && item.category === selected
    );
  }, [items, selected]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marketplace</Text>

      {/* Filter chips */}
      <View style={styles.filtersRow}>
        <Pressable
          style={[
            styles.filterButton,
            selected === "Select All" && styles.filterButtonSelected,
          ]}
          onPress={() => toggleFilter("Select All")}
        >
          <Text
            style={[
              styles.filterText,
              selected === "Select All" && styles.filterTextSelected,
            ]}
          >
            Select All
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            selected === "Tops" && styles.filterButtonSelected,
          ]}
          onPress={() => toggleFilter("Tops")}
        >
          <Text
            style={[
              styles.filterText,
              selected === "Tops" && styles.filterTextSelected,
            ]}
          >
            Tops
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            selected === "Bottoms" && styles.filterButtonSelected,
          ]}
          onPress={() => toggleFilter("Bottoms")}
        >
          <Text
            style={[
              styles.filterText,
              selected === "Bottoms" && styles.filterTextSelected,
            ]}
          >
            Bottoms
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            selected === "Shoes" && styles.filterButtonSelected,
          ]}
          onPress={() => toggleFilter("Shoes")}
        >
          <Text
            style={[
              styles.filterText,
              selected === "Shoes" && styles.filterTextSelected,
            ]}
          >
            Shoes
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            selected === "Accessories" && styles.filterButtonSelected,
          ]}
          onPress={() => toggleFilter("Accessories")}
        >
          <Text
            style={[
              styles.filterText,
              selected === "Accessories" && styles.filterTextSelected,
            ]}
          >
            Accessories
          </Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={{ paddingBottom: 60 }}
          ListEmptyComponent={
            <Text style={{ marginTop: 20, color: "#d8e6e4" }}>
              No items yet.
            </Text>
          }
          renderItem={({ item }) => {
            const fav = isFavorite(item.id);

            const priceNumber =
              typeof item.price === "string"
                ? Number(item.price)
                : item.price ?? 0;

            return (
              <Pressable
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/item/[id]",
                    params: {
                      id: String(item.id),
                      title: item.title,
                      description: item.description,
                      category: item.category ?? "",
                      imageUrl: item.imageUrl ?? "",
                      price:
                        priceNumber && !Number.isNaN(priceNumber)
                          ? String(priceNumber)
                          : "",
                    },
                  })
                }
              >
                {/* Image */}
                <View style={styles.imagePlaceholder}>
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={{ fontSize: 10, color: "#555" }}>Image</Text>
                  )}
                </View>

                {/* Heart badge */}
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite({
                      id: item.id,
                      title: item.title,
                      description: item.description,
                      category: item.category ?? "",
                      imageUrl: item.imageUrl ?? "",
                      price: priceNumber,
                    });
                  }}
                  style={styles.heartBadge}
                >
                  <Text style={styles.heartText}>{fav ? "♥" : "♡"}</Text>
                </Pressable>

                {/* Text */}
                <Text numberOfLines={1} style={styles.cardTitle}>
                  {item.title}
                </Text>

                <Text numberOfLines={2} style={styles.cardDescription}>
                  {item.description}
                </Text>

                {priceNumber > 0 && (
                  <Text style={styles.cardPrice}>
                    ${priceNumber.toFixed(2)}
                  </Text>
                )}
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
    backgroundColor: "#111617",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
    marginTop: 20,
    color: "#f5fbfa",
    textAlign: "center",
  },

  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#5b7b7a",
    backgroundColor: "rgba(91, 123, 122, 0.15)",
  },
  filterButtonSelected: {
    backgroundColor: "#5b7b7a",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#d8e6e4",
  },
  filterTextSelected: {
    color: "#ffffff",
  },

  gridRow: {
    justifyContent: "space-between",
    marginBottom: 10, // tighter rows
  },

  card: {
    width: "31%",
    backgroundColor: "#e8f0ef",
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },

  imagePlaceholder: {
    width: "100%",
    height: 90,
    backgroundColor: "#cfdad8",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },

  heartBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "rgba(17,22,23,0.7)",
  },
  heartText: {
    color: "#ffccd5",
    fontSize: 15,
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 11,
    color: "#555",
    textAlign: "center",
    marginTop: 3,
  },
  cardPrice: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3a5554",
    marginTop: 4,
    textAlign: "center",
  },
});