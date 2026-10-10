"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch { setCart([]); }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, loaded]);

  function addToCart(dish) {
    setCart((current) => {
      const existing = current.find((item) => item.id === dish.id);  // ← id
      if (existing) {
        return current.map((item) =>
          item.id === dish.id                                          // ← id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...dish, quantity: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart((current) => current.filter((item) => item.id !== id));   // ← id
  }

  function clearCart() {
    setCart([]);
  }

  function increaseQuantity(id) {
    setCart((current) =>
      current.map((item) =>
        item.id === id                                                 // ← id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(id) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id                                               // ← id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}