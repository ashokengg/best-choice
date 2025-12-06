'use client';
import { createContext, useContext, useState } from 'react';

type CartItem = {
  slug: string;
  title: string;
  price: number;
  img?: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  increaseQty: (slug: string) => void;
  decreaseQty: (slug: string) => void;
  removeItem: (slug: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === item.slug ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const increaseQty = (slug: string) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.slug === slug ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decreaseQty = (slug: string) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.slug === slug && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
    );
  };

  const removeItem = (slug: string) => {
    setCartItems((prev) => prev.filter((i) => i.slug !== slug));
  };

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, addToCart, increaseQty, decreaseQty, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
