import React from 'react';
import { Text, View, FlatList, Pressable, Image, Alert } from 'react-native';
import { cartStyles as styles } from '../../components/ui/style';
import { useCart } from '@/context/CartContext';

const API_BASE_URL = 'https://cst438-project3-backend-ae08bf484454.herokuapp.com';

export default function CartScreen() {
  const { cart, removeFromCart, clearCart } = useCart();

  const safeCart = Array.isArray(cart) ? cart : [];

  console.log('🛒 CartScreen loaded. Raw cart from context:', cart);
  console.log('✅ Using safeCart:', safeCart);

  const total = safeCart.reduce((sum, item) => {
    const priceNum = Number(item.price ?? 0);
    const qty = item.quantity ?? 1;

    if (isNaN(priceNum)) {
      console.warn('⚠️ Price is not a number for cart item:', item);
      return sum;
    }

    return sum + priceNum * qty;
  }, 0);

  console.log('🧮 Cart total (number):', total, 'type:', typeof total);

  async function handleCheckout() {
    if (safeCart.length === 0) return;

    try {
      console.log('💳 Checkout clicked — deleting items from backend…');

      await Promise.all(
        safeCart.map(item =>
          fetch(`${API_BASE_URL}/api/items/${item.id}`, {
            method: 'DELETE',
          })
        )
      );

      console.log('✅ All items deleted from backend');
      clearCart();

      Alert.alert('Success', 'Checkout complete! Enjoy!.');
    } catch (err) {
      console.error('❌ Error during checkout:', err);
      Alert.alert('Error', 'Something went wrong during checkout. Please try again.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>

      {safeCart.length === 0 ? (
        <Text>Cart is currently empty.</Text>
      ) : (
        <>
          <FlatList
            data={safeCart}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', marginBottom: 12, gap: 12 }}>
                {/* Image */}
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 70, height: 70, borderRadius: 8, backgroundColor: '#eee' }}
                  />
                ) : (
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 8,
                      backgroundColor: '#eee',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 10, color: '#666' }}>No Image</Text>
                  </View>
                )}

                {/* Text block */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>
                    {item.title}
                  </Text>

                  <Text style={{ fontSize: 14 }}>
                    Price: ${Number(item.price ?? 0).toFixed(2)}
                  </Text>

                  <Pressable
                    onPress={() => removeFromCart(item.id)}
                    style={{ marginTop: 4 }}
                  >
                    <Text style={{ color: 'red' }}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />

          <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              Total: ${total.toFixed(2)}
            </Text>

            <Pressable
              onPress={handleCheckout}
              style={{
                marginTop: 10,
                backgroundColor: '#1b0a6fff',
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                Checkout
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}