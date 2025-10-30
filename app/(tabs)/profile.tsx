import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const [active, setActive] = useState<'Listings' | 'Favorites'>('Listings');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, --username--!</Text>

      <View style={styles.tabsRow}>
        <Pressable
          onPress={() => setActive('Listings')}
          style={styles.tabButton}
          accessibilityState={{ selected: active === 'Listings' }}>
          <Text style={[styles.tabText, active === 'Listings' && styles.tabTextActive]}>Listings</Text>
          {active === 'Listings' && <View style={styles.activeUnderline} />}
        </Pressable>

        <Pressable
          onPress={() => setActive('Favorites')}
          style={styles.tabButton}
          accessibilityState={{ selected: active === 'Favorites' }}>
          <Text style={[styles.tabText, active === 'Favorites' && styles.tabTextActive]}>Favorites</Text>
          {active === 'Favorites' && <View style={styles.activeUnderline} />}
        </Pressable>
      </View>

      <View style={styles.content}>
        {active === 'Listings' ? (
          <Text style={styles.placeholder}>Listings content will appear here.</Text>
        ) : (
          <Text style={styles.placeholder}>Favorites content will appear here.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    marginBottom: 20,
    marginTop: 20,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -1,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  activeUnderline: {
    height: 3,
    backgroundColor: '#000',
    width: '100%',
    marginTop: 8,
    borderRadius: 2,
  },
  content: {
    paddingTop: 20,
  },
  placeholder: {
    color: '#444',
    fontSize: 16,
  },
});
