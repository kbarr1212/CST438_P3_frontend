import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  banner: {
    width: "100%",
    height: 140,
    backgroundColor: "#e5e7eb",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: 16,
  },
  bannerImage: {
    resizeMode: "cover",
  },

  settingsButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  settingsIcon: {
    color: "#fff",
    fontSize: 18,
  },

  profileHeader: {
    alignItems: "center",
    marginTop: -40,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  avatarWrapper: {
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#93c5fd",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d4ed8",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 6,
  },

  biography: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  tabsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 12,
  },

  tabButton: {
    marginHorizontal: 16,
    alignItems: "center",
  },

  tabText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#2563eb",
    fontWeight: "700",
  },
  activeUnderline: {
    marginTop: 4,
    width: 24,
    height: 3,
    backgroundColor: "#2563eb",
    borderRadius: 4,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
  },

  placeholder: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 10,
  },

  addButton: {
    marginTop: 10,
    backgroundColor: "#2563eb",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  addText: {
    color: "#fff",
    fontSize: 26,
    marginTop: -2,
  },

  menuOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  menuContainer: {
    position: "absolute",
    right: 16,
    top: 100,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 6,
    width: 200,
    elevation: 10,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 15,
  },

  // Edit modal overlay
  editOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },

  editCard: {
    width: "85%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },

  editTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },

  editInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },

  editInputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  editButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },

  editButtonPrimary: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  editButtonSecondary: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
  },
  editButtonTextPrimary: {
    color: "#fff",
    fontWeight: "600",
  },
  editButtonTextSecondary: {
    color: "#111827",
    fontWeight: "500",
  },
});
