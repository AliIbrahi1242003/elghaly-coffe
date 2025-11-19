"use client";

import { useState, useEffect } from "react";
import { CartItem, cartUtils, CART_STORAGE_KEY } from "@/lib/cart";
import { Product } from "@/lib/products";

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        setItems([]);
      }
    }
    setIsHydrated(true);
  }, []);

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => cartUtils.addToCart(prevItems, product, quantity));
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => cartUtils.removeFromCart(prevItems, productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prevItems) =>
      cartUtils.updateQuantity(prevItems, productId, quantity),
    );
  };

  const clearCart = () => {
    setItems(cartUtils.clearCart());
  };

  const getTotalItems = () => {
    return cartUtils.getTotalItems(items);
  };

  const getTotalPrice = () => {
    return cartUtils.getTotalPrice(items);
  };

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isHydrated,
  };
};
