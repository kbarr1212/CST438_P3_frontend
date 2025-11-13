import { StyleSheet } from 'react-native';

export const marketplaceStyles = StyleSheet.create({
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
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  filterButtonSelected: {
    backgroundColor: '#1b0a6fff',
  },
  filterText: {
    fontSize: 16,
    fontWeight: '500',
  },
  filterTextSelected: {
    color: '#fff',
  },
  itemsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  itemContainer: {
    backgroundColor: 'rgba(229, 229, 232, 1)',
    width: 120,
    height: 150,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1b0a6fff',
    marginVertical: 10,
    alignItems: 'center',
  },
});

export const profileStyles = StyleSheet.create({
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

export const cartStyles = StyleSheet.create({
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
});
