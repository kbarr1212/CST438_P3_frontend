import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const [active, setActive] = useState<'Listings' | 'Favorites'>('Listings');
  const [menuOpen, setMenuOpen] = useState(false);

  const onChangeUsername = () => {
    // skeleton: later this will open a screen/modal to change username and update DB
    setMenuOpen(false);
    Alert.alert('Change username', 'This will open a username editor (skeleton).');
    // TODO: navigate to edit screen or open inline editor
  };

  const onChangeBio = () => {
    // skeleton: later this will open a screen/modal to change bio and update DB
    setMenuOpen(false);
    Alert.alert('Change bio', 'This will open a bio editor (skeleton).');
    // TODO: navigate to edit screen or open inline editor
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Username</Text>
        <Pressable
          onPress={() => setMenuOpen(true)}
          style={styles.menuButton}
          accessibilityLabel="Open profile options"
        >
          <Text style={styles.menuDots}>⋯</Text>
        </Pressable>
      </View>

      <Text style={styles.biography}>User bio</Text>

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

      {menuOpen && (
        <View style={styles.menuOverlay} pointerEvents="box-none">
          <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} />
          <View style={styles.menuContainer}>
            <Pressable style={styles.menuItem} onPress={onChangeUsername}>
              <Text style={styles.menuItemText}>Change username</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={onChangeBio}>
              <Text style={styles.menuItemText}>Change bio</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
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
    color: '#1b0a6fff',
    fontWeight: '600',
  },
  activeUnderline: {
    height: 3,
    backgroundColor: '#1b0a6fff',
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
  biography: {
    fontSize: 20,
    fontWeight: '300',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  menuDots: {
    fontSize: 24,
    lineHeight: 24,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menuContainer: {
    position: 'absolute',
    right: 16,
    top: 70,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 170,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 16,
  },
});
