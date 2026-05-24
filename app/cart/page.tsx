"use client";

import { useCart } from "@/hooks/useCart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartItemComponent from "@/components/CartItem";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, isHydrated } =
    useCart();
  const [isMounted, setIsMounted] = useState(false);
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

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
      <section className="bg-gradient-to-b from-[#321a12] to-black text-white py-16 relative overflow-hidden pt-32">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/coffee.png')]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">Shopping Cart</h1>
          <p className="text-gray-300 text-lg font-light">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {isEmpty ? (
            <div className="max-w-lg mx-auto text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="mb-8 flex justify-center">
                <div className="bg-gray-50 p-8 rounded-full shadow-inner border border-gray-100">
                  <ShoppingCart size={56} className="text-gray-300" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Your cart is empty</h2>
              <p className="text-gray-500 mb-10 max-w-sm mx-auto">
                Looks like you haven't added any items yet. Browse our
                collection and find your favorite coffee!
              </p>
              <Link
                href="/shop"
                className="inline-block bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-green-600 transition-all shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1"
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
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-32">
                  <h2 className="text-2xl font-extrabold mb-8 text-gray-900">Order Summary</h2>

                  {/* Items Count */}
                  <div className="flex justify-between mb-4 pb-4 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">
                      Subtotal ({items.length} items)
                    </span>
                    <span className="font-bold text-gray-900">
                      LE {totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between mb-4 pb-4 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Shipping</span>
                    <span className="font-bold text-primary">Free</span>
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between mb-8 pb-8 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Tax</span>
                    <span className="font-bold text-gray-900">Calculated at checkout</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between mb-8">
                    <span className="text-xl font-extrabold text-gray-900">Total</span>
                    <span className="text-2xl font-extrabold text-primary">
                      LE {totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    href={isAdmin ? "/admin" : "/checkout"}
                    className={`block w-full py-4 rounded-full font-bold transition-all mb-4 text-center shadow-lg transform hover:-translate-y-1 ${
                      isAdmin
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none hover:translate-y-0"
                        : "bg-primary text-white hover:bg-green-600 hover:shadow-primary/30"
                    }`}
                    aria-disabled={isAdmin}
                  >
                    {isAdmin ? "Admins cannot checkout" : "Proceed to Checkout"}
                  </Link>

                  {isAdmin && (
                    <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                      Admin accounts can browse the catalog, but they cannot place orders.
                    </p>
                  )}

                  {/* Continue Shopping Button */}
                  <Link
                    href="/shop"
                    className="block w-full text-center bg-gray-50 text-gray-700 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors border border-gray-200"
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
