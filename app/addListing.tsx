import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View, ActivityIndicator} from 'react-native';
import { addListingStyles as styles } from '../components/ui/style';

const API_BASE = 'https://cst438-project3-backend-ae08bf484454.herokuapp.com'

export default function AddListing() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your photos to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImageToBackend = async (): Promise<string | null> => {
    if (!imageUri) return null;

    const formData = new FormData();

    // React Native file object
    formData.append('file', {
      uri: imageUri,
      name: 'listing-image.jpg',
      type: 'image/jpeg',
    } as any);

    const response = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData,
      // NOTE: do NOT set Content-Type manually for FormData in RN,
      // fetch will set the correct multipart boundary.
    });

    if (!response.ok) {
      console.log('Upload failed status:', response.status);
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url as string; // { url: "..." }
  };

  const handleSubmit = async () => {
    if (!name || !description) {
      Alert.alert('Missing fields', 'Please fill out name and description at minimum.');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | null = null;

      // 1. Upload image if user selected one
      if (imageUri) {
        imageUrl = await uploadImageToBackend();
      }

      // 2. Build the Item payload
      // Item.java has: title, description, category, imageUrl
      const itemPayload = {
        title: name,
        description: `${description}\n\nSize: ${size || 'N/A'}\nPrice: ${price || 'N/A'}`,
        category: size || 'general', // you can change this mapping later
        imageUrl: imageUrl,
      };

      const res = await fetch(`${API_BASE}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemPayload),
      });

      if (!res.ok) {
        console.log('Create item failed status:', res.status);
        throw new Error('Failed to create listing');
      }

      const created = await res.json();
      console.log('Created item:', created);

      Alert.alert('Success', 'Your listing has been created.');
      router.back();
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message || 'Something went wrong while creating the listing.');
    } finally {
      setIsSubmitting(false);
    }
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

       {/* Image upload box */}
      <Pressable style={styles.imageUploadBox} onPress={pickImage}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', height: 200, borderRadius: 8 }}
            resizeMode="cover"
          />
        ) : (
          <Text style={{ color: '#888' }}>Tap to upload image</Text>
        )}
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          onPress={handleSubmit}
          style={styles.createButton}
          accessibilityLabel="Create listing"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.createButtonText}>Create Listing</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

