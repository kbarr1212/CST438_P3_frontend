import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, FlatList, ActivityIndicator,} from 'react-native';
import { marketplaceStyles as styles } from '../../components/ui/style';

type Item = { id: number; title: string; description: string;};

export default function MarketplaceScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  function toggleFilter(name: string) {
    setSelected(prev => (prev === name ? null : name));
  }

  useEffect(() => {
    async function loadItems() {
      try {
        const res = await fetch(
          'https://cst438-project3-backend-ae08bf484454.herokuapp.com/api/items'
        );
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marketplace</Text>

      <View style={styles.filtersRow}>
        <Pressable
          style={[
            styles.filterButton,
            selected === 'Select All' && styles.filterButtonSelected,
          ]}
          onPress={() => toggleFilter('Select All')}>
          <Text style={[styles.filterText, selected === 'Select All' && styles.filterTextSelected]}>
            Select All
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterButton, selected === 'Tops' && styles.filterButtonSelected]}
          onPress={() => toggleFilter('Tops')}>
          <Text style={[styles.filterText, selected === 'Tops' && styles.filterTextSelected]}>Tops</Text>
        </Pressable>

        <Pressable
          style={[styles.filterButton, selected === 'Bottoms' && styles.filterButtonSelected]}
          onPress={() => toggleFilter('Bottoms')}>
          <Text style={[styles.filterText, selected === 'Bottoms' && styles.filterTextSelected]}>Bottoms</Text>
        </Pressable>

        <Pressable
          style={[styles.filterButton, selected === 'Shoes' && styles.filterButtonSelected]}
          onPress={() => toggleFilter('Shoes')}>
          <Text style={[styles.filterText, selected === 'Shoes' && styles.filterTextSelected]}>Shoes</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={{ paddingBottom: 60 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.imagePlaceholder}>
                <Text style={{ fontSize: 10, color: '#555' }}>Image</Text>
              </View>

              <Text numberOfLines={1} style={styles.cardTitle}>
                {item.title}
              </Text>

              <Text numberOfLines={2} style={styles.cardDescription}>
                {item.description}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ marginTop: 20 }}>No items yet.</Text>
          }
        />
      )}
    </View>
  );
}

