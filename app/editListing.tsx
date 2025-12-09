import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";

export default function EditListingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // ✅ Receive existing values from Profile
  const id = String(params.id);
  const [title, setTitle] = useState(String(params.title ?? ""));
  const [description, setDescription] = useState(String(params.description ?? ""));
  const [price, setPrice] = useState(String(params.price ?? ""));
  const [category, setCategory] = useState(String(params.category ?? ""));
  const imageUrl = String(params.imageUrl ?? "");

  const onSave = async () => {
    if (!title || !price) {
      Alert.alert("Error", "Title and price are required.");
      return;
    }

    try {
      const res = await fetch(
        `https://cst438-project3-backend-ae08bf484454.herokuapp.com/api/items/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            price: Number(price),
            category,
            imageUrl, // ✅ stays the same — NO re-upload needed
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      Alert.alert("Success", "Listing updated.");
      router.back(); // ✅ returns to Profile and refreshes
    } catch (err) {
      console.error("Update error:", err);
      Alert.alert("Error", "Failed to update listing.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Listing</Text>

      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#999"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Category"
        placeholderTextColor="#999"
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        placeholderTextColor="#999"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Pressable style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1313",
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },

  input: {
    backgroundColor: "#1b2424",
    color: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  saveButton: {
    backgroundColor: "#5b7b7a",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  saveText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});