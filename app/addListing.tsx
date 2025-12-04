import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, Platform,ScrollView, Text, TextInput, View, ActivityIndicator} from 'react-native';
import { addListingStyles as styles } from '../components/ui/style';

const API_BASE = 'https://cst438-project3-backend-ae08bf484454.herokuapp.com'

export default function AddListing() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('Tops');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      if (Platform.OS === 'web') {
        window.alert('We need access to your photos to upload an image.');
      } else {
        Alert.alert('Permission needed', 'We need access to your photos to upload an image.');
      }
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

    let fileToUpload: any = null;

    if (Platform.OS === 'web') {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      fileToUpload = new File([blob], 'listing-image.jpg', { type: blob.type });
    } else {
      fileToUpload = {
        uri: imageUri,
        name: 'listing-image.jpg',
        type: 'image/jpeg',
      };
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);

    const response = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async () => {
    if (!name || !description) {
      if (Platform.OS === 'web') {
        window.alert('Please fill out name and description.');
      } else {
        Alert.alert('Missing fields', 'Please fill out name and description at minimum.');
      }
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
        description: `${description} · Size: ${size || 'N/A'}\n`,
        category: category,
        imageUrl: imageUrl,
        price: price,
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

      {/* CATEGORY BUTTONS */}
      <View style={styles.field}>
        <Text style={styles.label}>Category</Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 5,
          }}
        >
          {['Tops', 'Bottoms', 'Shoes', 'Accessories'].map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: category === cat ? '#000' : '#ccc',
                backgroundColor: category === cat ? '#000' : '#fff',
              }}
            >
              <Text
                style={{
                  color: category === cat ? '#fff' : '#000',
                  fontWeight: '600',
                }}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>
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
          onPress={() => {
            console.log("Create listing pressed!");
            handleSubmit();
          }}
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