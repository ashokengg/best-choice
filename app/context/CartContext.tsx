'use client';
import { createContext, useContext, useState } from 'react';

type CartItem = {
  slug: string;
  title: string;
  price: number;
  img?: string;
  quantity: number;
};

export const MAX_ITEM_QUANTITY = 100;
export const MAX_CART_TOTAL = 100_000;

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  increaseQty: (slug: string) => void;
  decreaseQty: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      const nextQuantity = (existing?.quantity ?? 0) + 1;
      const nextTotal = prev.reduce(
        (total, cartItem) =>
          total + cartItem.price * (cartItem.slug === item.slug ? nextQuantity : cartItem.quantity),
        existing ? 0 : item.price
      );
      if (nextQuantity > MAX_ITEM_QUANTITY || nextTotal > MAX_CART_TOTAL) return prev;

      if (existing) {
        return prev.map((i) =>
          i.slug === item.slug ? { ...i, quantity: nextQuantity } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const increaseQty = (slug: string) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.slug !== slug) return i;
        const nextQuantity = i.quantity + 1;
        const nextTotal =
          prev.reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0) +
          i.price;
        return nextQuantity <= MAX_ITEM_QUANTITY && nextTotal <= MAX_CART_TOTAL
          ? { ...i, quantity: nextQuantity }
          : i;
      })
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

  const setQuantity = (slug: string, quantity: number) => {
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_ITEM_QUANTITY
    ) return;
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.slug !== slug) return i;
        const currentTotal = prev.reduce(
          (total, cartItem) => total + cartItem.price * cartItem.quantity,
          0
        );
        const nextTotal = currentTotal + i.price * (quantity - i.quantity);
        return nextTotal <= MAX_CART_TOTAL ? { ...i, quantity } : i;
      })
    );
  };

  const removeItem = (slug: string) => {
    setCartItems((prev) => prev.filter((i) => i.slug !== slug));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, addToCart, increaseQty, decreaseQty, setQuantity, removeItem, clearCart }}
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
