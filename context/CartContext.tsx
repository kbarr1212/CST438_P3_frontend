import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
};

type CartContextValue = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    console.log('🛒 addToCart called with:', item);
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (id: number) => {
    console.log('❌ removeFromCart called with id:', id);
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    console.log('🧹 clearCart called');
    setCart([]);
  };

  console.log('📦 CartProvider current cart:', cart);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}