import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { profileStyles as styles } from '../../components/ui/style';

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

