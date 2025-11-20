import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

type ItemParams = {
  id?: string;
  title?: string;
  description?: string;
};

export default function ItemDetailScreen() {
  const params = useLocalSearchParams<ItemParams>();
  const router = useRouter();

  const id = typeof params.id === 'string' ? params.id : '';
  const title = typeof params.title === 'string' ? params.title : 'Item details';
  const description =
    typeof params.description === 'string' ? params.description : '';

  function handleAddToCart() {
    console.log(`Added item ${id} to cart`);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title }} />

      <View style={styles.imageBox}>
        <Text style={styles.imageText}>Image</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <Pressable style={styles.cartButton} onPress={handleAddToCart}>
        <Text style={styles.cartButtonText}>Add to Cart</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 90,
    backgroundColor: '#fff',
  },
  imageBox: {
    width: '100%',
    height: 250,
    backgroundColor: '#e5e5e5',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  imageText: {
    color: '#555',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    marginBottom: 40,
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#00FF00',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  cartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
