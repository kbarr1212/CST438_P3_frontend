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

  gridRow: {
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 18,
  },
  card: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#e2e2e2',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginTop: 4,
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
    alignItems: 'center',
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
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#1b0a6fff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 3,
  },
  addText: {
    color: '#eee',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 26,
    textAlign: 'center',
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

export const addListingStyles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fafafa',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#1b0a6fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    marginTop: 8,
  },
  imageUploadBox: {
  width: 200,
  height: 200,
  backgroundColor: '#eee',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 12,
  marginBottom: 16,
  alignSelf: 'center',
  borderWidth: 1,
  borderColor: '#ccc',
},
});
