import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { addListingStyles as styles } from '../components/ui/style';

export default function AddListing() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    Alert.alert('Listing (preview)', `Name: ${name}\nSize: ${size}\nPrice: ${price}\nDescription: ${description}`);
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Create a listing</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Listing name"
          returnKeyType="next"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Size</Text>
        <TextInput
          style={styles.input}
          value={size}
          onChangeText={setSize}
          placeholder="Enter a size"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="0.00"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the item"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.actions}>
        <Pressable onPress={handleSubmit} style={styles.createButton} accessibilityLabel="Create listing">
          <Text style={styles.createButtonText}>Create Listing</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

