"use client";

import { useCart } from "@/hooks/useCart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartItemComponent from "@/components/CartItem";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, isHydrated } =
    useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!isMounted || !isHydrated) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const isEmpty = items.length === 0;
  const totalPrice = getTotalPrice();

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Page Header */}
      <section className="bg-[#321a12] text-white py-12 relative overflow-hidden pt-24">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/coffee.png')]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-gray-300">{items.length} item(s) in your cart</p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {isEmpty ? (
            <div className="max-w-md mx-auto text-center py-20">
              <div className="mb-6 flex justify-center">
                <div className="bg-gray-100 p-6 rounded-full">
                  <ShoppingCart size={48} className="text-gray-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items yet. Browse our
                collection and find your favorite coffee!
              </p>
              <Link
                href="/shop"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItemComponent
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>

                {/* Continue Shopping Button */}
                <div className="mt-8">
                  <Link
                    href="/shop"
                    className="inline-block text-primary hover:underline font-medium"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-100 p-6 sticky top-24">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                  {/* Items Count */}
                  <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                    <span className="text-gray-600">
                      Items ({items.length})
                    </span>
                    <span className="font-medium">
                      LE {totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">LE 0.00</span>
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between mb-6 pb-6 border-b border-gray-200">
                    <span className="text-gray-600">Tax (0%)</span>
                    <span className="font-medium">LE 0.00</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between mb-6">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      LE {totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    href="/checkout"
                    className="block w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors mb-3 text-center"
                  >
                    Proceed to Checkout
                  </Link>

                  {/* Continue Shopping Button */}
                  <Link
                    href="/shop"
                    className="block w-full text-center bg-gray-100 text-foreground py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
