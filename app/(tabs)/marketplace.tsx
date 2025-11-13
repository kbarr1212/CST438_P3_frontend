import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { marketplaceStyles as styles } from '../../components/ui/style';

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

