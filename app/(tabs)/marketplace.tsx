import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View, FlatList, ActivityIndicator, Image, } from "react-native";
import { useRouter } from "expo-router";
import { marketplaceStyles as styles } from "../../components/ui/style";
import { useFavorites } from "@/context/FavoritesContext";

type Item = { id: number; title: string; description: string; category?: string; imageUrl?: string; price?: number | string;};

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
                {/* Image section */}
                <View style={styles.imagePlaceholder}>
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={{ width: "100%", height: "100%", borderRadius: 10 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={{ fontSize: 10, color: "#555" }}>Image</Text>
                  )}
                </View>

                {/* Little favorite heart in corner */}
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
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 999,
                    backgroundColor: "rgba(255,255,255,0.9)",
                  }}
                >
                  <Text style={{ fontSize: 14 }}>
                    {fav ? "♥" : "♡"}
                  </Text>
                </Pressable>

                <Text numberOfLines={1} style={styles.cardTitle}>
                  {item.title}
                </Text>

                <Text numberOfLines={2} style={styles.cardDescription}>
                  {item.description}
                </Text>

                {priceNumber > 0 && (
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      marginTop: 4,
                    }}
                  >
                    ${priceNumber.toFixed(2)}
                  </Text>
                )}
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <Text style={{ marginTop: 20 }}>No items yet.</Text>
          }
        />
      )}
    </View>
  );
}