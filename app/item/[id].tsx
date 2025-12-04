import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

type ItemParams = {
  id?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  price?: string;
};

export default function ItemDetailScreen() {
  
  const params = useLocalSearchParams<ItemParams>();
  const router = useRouter();

  const id = params.id ?? '';
  const title = params.title ?? 'Item details';
  const description = params.description ?? '';
  const imageUrl = params.imageUrl ?? '';
  const price = params.price ?? '';

  function handleAddToCart() {
    console.log(`Added item ${id} to cart`);
  }
console.log("ItemDetail params:", params);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title }} />

      {/* Product Image */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.imageBox} resizeMode="cover" />
      ) : (
        <View style={styles.imageBox}>
          <Text style={styles.imageText}>No Image Available</Text>
        </View>
      )}

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>${price}</Text>
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
    width: '50%',
    height: 350,
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
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    marginBottom: 40,
  },
  cartButton: {
    width: 200,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1b0a6fff',
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
