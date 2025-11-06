import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function MarketplaceScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  function toggleFilter(name: string) {
    setSelected(prev => (prev === name ? null : name));
  }

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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    marginBottom: 20,
    marginTop: 20,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  filterButtonSelected: {
    backgroundColor: '#1b0a6fff',
  },
  filterText: {
    fontSize: 16,
    fontWeight: '500',
  },
  filterTextSelected: {
    color: '#fff',
  },
});
