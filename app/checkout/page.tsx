"use client";

import { useCheckout } from "@/hooks/useCheckout";
import { useCart } from "@/hooks/useCart";
import {
  egyptianGovernorates,
  getCitiesByGovernorate,
} from "@/lib/egyptianLocations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { formData, errors, isSubmitting, updateField, handleSubmit } =
    useCheckout();
  const { items, getTotalPrice, isHydrated } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cities = getCitiesByGovernorate(formData.governorate);
  const totalPrice = getTotalPrice();

  // Avoid hydration mismatch
  if (!isMounted || !isHydrated) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        </div>
        <Footer />
      </main>
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(() => {
      // TODO: Redirect to order confirmation
      console.log("Order placed successfully");
    });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Page Header */}
      <section className="bg-[#321a12] text-white py-12 relative overflow-hidden pt-24">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/coffee.png')]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/cart"
            className="inline-flex items-center text-gray-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold">Checkout</h1>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleFormSubmit}
                className="bg-white rounded-lg border border-gray-100 p-8"
              >
                <h2 className="text-2xl font-bold mb-8">
                  Delivery Information
                </h2>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                        errors.firstName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-primary"
                      } focus:outline-none focus:ring-2`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                        errors.lastName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-primary"
                      } focus:outline-none focus:ring-2`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => updateField("phoneNumber", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                      errors.phoneNumber
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-primary"
                    } focus:outline-none focus:ring-2`}
                    placeholder="+20 123 456 7890"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Governorate and City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Governorate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Governorate *
                    </label>
                    <select
                      value={formData.governorate}
                      onChange={(e) =>
                        updateField("governorate", Number(e.target.value))
                      }
                      className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                        errors.governorate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-primary"
                      } focus:outline-none focus:ring-2 appearance-none bg-white`}
                    >
                      <option value={0}>Select Governorate</option>
                      {egyptianGovernorates.map((gov) => (
                        <option key={gov.id} value={gov.id}>
                          {gov.name}
                        </option>
                      ))}
                    </select>
                    {errors.governorate && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.governorate}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      disabled={!formData.governorate}
                      className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                        errors.city
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-primary"
                      } focus:outline-none focus:ring-2 appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    >
                      <option value="">
                        {!formData.governorate
                          ? "Select Governorate First"
                          : "Select City"}
                      </option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.city}
                      </p>
                    )}
                  </div>
                </div>

                {/* Detailed Address */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Address *
                  </label>
                  <textarea
                    value={formData.detailedAddress}
                    onChange={(e) =>
                      updateField("detailedAddress", e.target.value)
                    }
                    className={`w-full px-4 py-2 border rounded-lg transition-colors resize-none ${
                      errors.detailedAddress
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-primary"
                    } focus:outline-none focus:ring-2`}
                    placeholder="e.g., Apartment 5B, Building 10, Street Name..."
                    rows={4}
                  />
                  {errors.detailedAddress && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.detailedAddress}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.detailedAddress.length}/200 characters
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Link
                    href="/cart"
                    className="flex-1 bg-gray-100 text-foreground py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                  >
                    Back to Cart
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-100 p-6 sticky top-32">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                {/* Items List */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium text-foreground">
                          {item.title}
                        </p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-primary">
                        LE {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      LE {totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">LE 0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">LE 0.00</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      LE {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Payment Method
                  </p>
                  <p className="text-sm text-blue-800">Cash on Delivery</p>
                  <p className="text-xs text-blue-700 mt-2">
                    Pay when your order arrives at your doorstep
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
