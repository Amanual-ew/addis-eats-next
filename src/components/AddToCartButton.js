"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function AddToCartButton({ dish }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addToCart(dish);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`rounded-full px-6 py-3 font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg active:scale-95 ${
        added
          ? "bg-green-500 shadow-green-200"
          : "bg-gradient-to-r from-[#ff6f61] to-orange-400 shadow-orange-200"
      }`}
    >
      {added ? "Added ✓" : "Add to Cart 🛒"}
    </button>
  );
}