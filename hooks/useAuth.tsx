// hooks/useAuth.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type User = {
  id: string;
  email: string;
  name?: string;
  // add more fields if you want
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
  login: (token: string) => Promise<void>;  // shape this however you like
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
        // TODO: read token from storage and fetch user if valid
        // const token = await SecureStore.getItemAsync("authToken");
        // if (token) {
        //   const profile = await fetchUserProfile(token);
        //   setUser(profile);
        //   setIsLoggedIn(true);
        // }
      } catch (e) {
        console.warn("Error restoring session", e);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (token: string) => {
    // TODO: save token, fetch user, etc.
    // await SecureStore.setItemAsync("authToken", token);
    // const profile = await fetchUserProfile(token);
    // setUser(profile);
    // For now, a placeholder:
    const fakeUser: User = {
      id: "temp-id",
      email: "example@thriftmarket.com",
      name: username || "Thrift User",
    };

    setUser(fakeUser);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    // TODO: clear token from storage
    // await SecureStore.deleteItemAsync("authToken");
    setUser(null);
    setIsLoggedIn(false);
    setUsername("");
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
