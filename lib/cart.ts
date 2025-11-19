import { Product } from "./products";

export interface CartItem extends Product {
  quantity: number;
}

// Cart utility functions
export const cartUtils = {
  // Add item to cart or increase quantity if exists
  addToCart: (
    items: CartItem[],
    product: Product,
    quantity: number = 1,
  ): CartItem[] => {
    const existingItem = items.find((item) => item.id === product.id);

    if (existingItem) {
      return items.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    }

    return [...items, { ...product, quantity }];
  },

  // Remove item from cart
  removeFromCart: (items: CartItem[], productId: string): CartItem[] => {
    return items.filter((item) => item.id !== productId);
  },

  // Update item quantity
  updateQuantity: (
    items: CartItem[],
    productId: string,
    quantity: number,
  ): CartItem[] => {
    if (quantity <= 0) {
      return cartUtils.removeFromCart(items, productId);
    }

    return items.map((item) =>
      item.id === productId ? { ...item, quantity } : item,
    );
  },

  // Clear entire cart
  clearCart: (): CartItem[] => {
    return [];
  },

  // Get total number of items in cart
  getTotalItems: (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  // Get total price of cart
  getTotalPrice: (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  // Get individual item total
  getItemTotal: (item: CartItem): number => {
    return item.price * item.quantity;
  },
};

// localStorage keys
export const CART_STORAGE_KEY = "ghaly_cart_items";
