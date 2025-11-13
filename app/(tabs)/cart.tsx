import React from 'react';
import { Text, View } from 'react-native';
import { cartStyles as styles } from '../../components/ui/style';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <Text>Cart is currently empty.</Text>
    </View>
  );
}

