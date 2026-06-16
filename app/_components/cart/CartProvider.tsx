"use client";

import * as React from "react";

export type CartItem = {
  slug: string;
  name: string;
  priceCOP: number;
  quantity: number;
  image?: string;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotalCOP: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

const STORAGE_KEY = "wayuu_cart_v1";

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

function writeStoredCart(items: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore (storage might be unavailable)
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>(() => readStoredCart());

  React.useEffect(() => {
    writeStoredCart(items);
  }, [items]);

  const subtotalCOP = React.useMemo(
    () => items.reduce((sum, it) => sum + it.priceCOP * it.quantity, 0),
    [items]
  );

  const totalItems = React.useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items]
  );

  const addItem = React.useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const nextQty = Math.max(1, Math.min(99, quantity));
        const existing = prev.find((p) => p.slug === item.slug);
        if (!existing) {
          return [...prev, { ...item, quantity: nextQty }];
        }
        return prev.map((p) =>
          p.slug === item.slug
            ? { ...p, quantity: Math.min(99, p.quantity + nextQty) }
            : p
        );
      });
    },
    []
  );

  const removeItem = React.useCallback((slug: string) => {
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const setQuantity = React.useCallback((slug: string, quantity: number) => {
    setItems((prev) => {
      const q = Math.max(1, Math.min(99, quantity));
      return prev.map((p) => (p.slug === slug ? { ...p, quantity: q } : p));
    });
  }, []);

  const clear = React.useCallback(() => {
    setItems([]);
  }, []);

  const value = React.useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      subtotalCOP,
      addItem,
      removeItem,
      setQuantity,
      clear,
    }),
    [items, totalItems, subtotalCOP, addItem, removeItem, setQuantity, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within <CartProvider>");
  }
  return ctx;
}
