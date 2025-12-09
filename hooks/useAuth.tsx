// hooks/useAuth.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Platform } from "react-native";

const API_BASE =
  "https://cst438-project3-backend-ae08bf484454.herokuapp.com";

type User = {
  id: number;
  email: string;
  name?: string;
  username: string;
  provider: string;
};

export type AuthContextType = {
  // core auth state
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;

  // extra UI state you’ve referenced
  username: string;

  // setters
  setUser: (user: User | null) => void;
  setIsLoading: (value: boolean) => void;
  setIsLoggedIn: (value: boolean) => void;
  setUsername: (name: string) => void;

  // actions
  login: (oauthUser: User) => Promise<void>;  // shape this however you like
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Example: restore session on app start
  useEffect(() => {
    const restoreSession = async () => {
      try {
        let saved: string | null = null;

        if (Platform.OS === "web") {
          saved = localStorage.getItem("authUser");
        } else {
          const SecureStore = await import("expo-secure-store");
          saved = await SecureStore.getItemAsync("authUser");
        }

        if (saved) {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          setUsername(parsed.username);
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.warn("Error restoring session", e);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (oauthUser: User) => {
    setUser(oauthUser);
    setUsername(oauthUser.username);
    setIsLoggedIn(true);

    if (Platform.OS === "web") {
      localStorage.setItem("authUser", JSON.stringify(oauthUser));
    } else {
      const SecureStore = await import("expo-secure-store");
      await SecureStore.setItemAsync("authUser", JSON.stringify(oauthUser));
    }
  };

  const logout = async () => {
    setUser(null);
    setIsLoggedIn(false);
    setUsername("");

    if (Platform.OS === "web") {
      localStorage.removeItem("authUser");
    } else {
      const SecureStore = await import("expo-secure-store");
      await SecureStore.deleteItemAsync("authUser");
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn,
    username,
    setUser,
    setIsLoading,
    setIsLoggedIn,
    setUsername,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
