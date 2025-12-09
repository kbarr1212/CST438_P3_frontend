import React, { createContext, useContext, useEffect, useState, ReactNode, } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type CartItem = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  price?: number;
  quantity?: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function loadCart() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCart(parsed);
          }
        }
      } catch (e) {
        console.warn("Failed to load cart from storage:", e);
      } finally {
        setHydrated(true);
      }
    }

    loadCart();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    async function saveCart() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      } catch (e) {
        console.warn("Failed to save cart to storage:", e);
      }
    }
    saveCart();
  }, [cart, hydrated]);

  function addToCart(item: CartItem) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: (i.quantity ?? 1) + (item.quantity ?? 1) }
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity ?? 1 }];
    });
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return ctx;
}