import { useRouter } from "expo-router";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Pressable, Platform, ScrollView, Text, TextInput, View, ActivityIndicator,  StyleSheet, } from "react-native";
import { useAuth } from "../hooks/useAuth";


const API_BASE =
  "https://cst438-project3-backend-ae08bf484454.herokuapp.com";

export default function AddListing() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("Tops");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      const msg = "We need access to your photos to upload an image.";
      if (Platform.OS === "web") {
        window.alert(msg);
      } else {
        Alert.alert("Permission needed", msg);
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

    if (Platform.OS === "web") {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      fileToUpload = new File([blob], "listing-image.jpg", {
        type: blob.type,
      });
    } else {
      fileToUpload = {
        uri: imageUri,
        name: "listing-image.jpg",
        type: "image/jpeg",
      };
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);

    const response = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async () => {
    if (!name || !description) {
      const msg = "Please fill out name and description at minimum.";
      if (Platform.OS === "web") {
        window.alert(msg);
      } else {
        Alert.alert("Missing fields", msg);
      }
      return;
    }

    if (!user?.id) {
      Alert.alert("Not logged in", "You must be logged in to create a listing.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | null = null;

      if (imageUri) {
        imageUrl = await uploadImageToBackend();
      }

      const itemPayload = {
        title: name,
        description: `${description} · Size: ${size || "N/A"}\n`,
        category,
        imageUrl,
        price,
        user: { id: user.id },
      };

      const res = await fetch(`${API_BASE}/api/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemPayload),
      });

      if (!res.ok) {
        console.log("Create item failed status:", res.status);
        throw new Error("Failed to create listing");
      }

      const created = await res.json();
      console.log("Created item:", created);

      Alert.alert("Success", "Your listing has been created.");
      router.back();
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        "Error",
        err.message || "Something went wrong while creating the listing."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.heading}>Create a listing</Text>

        {/* NAME */}
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Listing name"
            placeholderTextColor="#687676"
            returnKeyType="next"
          />
        </View>

        {/* SIZE */}
        <View style={styles.field}>
          <Text style={styles.label}>Size</Text>
          <TextInput
            style={styles.input}
            value={size}
            onChangeText={setSize}
            placeholder="Enter a size"
            placeholderTextColor="#687676"
          />
        </View>

        {/* PRICE */}
        <View style={styles.field}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            placeholderTextColor="#687676"
            keyboardType="numeric"
          />
        </View>

        {/* DESCRIPTION */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the item"
            placeholderTextColor="#687676"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* CATEGORY BUTTONS */}
        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>

          <View style={styles.categoryRow}>
            {["Tops", "Bottoms", "Shoes", "Accessories"].map((cat) => {
              const active = category === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.categoryChip,
                    active && styles.categoryChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      active && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* IMAGE UPLOAD */}
        <Pressable style={styles.imageUploadBox} onPress={pickImage}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.uploadedImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.imageUploadText}>Tap to upload image</Text>
          )}
        </Pressable>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <Pressable
            onPress={handleSubmit}
            style={[
              styles.createButton,
              isSubmitting && { opacity: 0.7 },
            ]}
            accessibilityLabel="Create listing"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.createButtonText}>Create Listing</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0d1313",
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#151d1d",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#f5fafa",
    textAlign: "center",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    color: "#cfd7d7",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#243131",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#1b2424",
    color: "#f5fafa",
    fontSize: 15,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 5,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#3a4a4a",
    backgroundColor: "#1b2424",
  },
  categoryChipActive: {
    backgroundColor: "#5b7b7a",
    borderColor: "#5b7b7a",
  },
  categoryChipText: {
    color: "#cfd7d7",
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  imageUploadBox: {
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#5b7b7a",
    borderRadius: 14,
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#101818",
    overflow: "hidden",
  },
  imageUploadText: {
    color: "#8fa4a4",
    fontSize: 14,
  },
  uploadedImage: {
    width: "100%",
    height: 220,
  },
  actions: {
    marginTop: 4,
  },
  createButton: {
    backgroundColor: "#5b7b7a",
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});