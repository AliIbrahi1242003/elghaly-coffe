"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products, Product } from "@/lib/products";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState("250g");
  const [roast, setRoast] = useState("Medium");
  const [addition, setAddition] = useState("Plain");

  useEffect(() => {
    if (params.id) {
      const foundProduct = products.find((p) => p.id === params.id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;

    // Add product to cart with selected quantity
    addToCart(product, quantity);

    // Show toast notification
    addToast({
      type: "success",
      title: `${product.title} added to cart`,
      description: `Quantity: ${quantity} | LE ${(product.price * quantity).toFixed(2)}`,
      image: product.image,
      duration: 3000,
    });

    // Reset quantity after adding
    setQuantity(1);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 bg-primary rounded-full mb-4"></div>
            <p className="text-gray-500">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Price Calculation Logic
  const getWeightMultiplier = (w: string) => {
    switch (w) {
      case "500g":
        return 2;
      case "1kg":
        return 4;
      default:
        return 1; // 250g
    }
  };

  const getAdditionPrice = () => {
    const multiplier = getWeightMultiplier(weight);
    switch (addition) {
      case "Cardamom":
        return 20 * multiplier;
      case "Special Blend":
        return 35 * multiplier;
      default:
        return 0; // Plain
    }
  };

  const basePrice = product.price * getWeightMultiplier(weight);
  const totalPrice = (basePrice + getAdditionPrice()) * quantity;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12 pt-24">
        <Link
          href="/shop"
          className="inline-flex items-center text-gray-500 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square lg:aspect-auto lg:h-[600px] shadow-lg">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {product.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="h-px bg-gray-200 w-full"></div>

            {/* Customization Options */}
            <div className="space-y-6">
              {/* Weight Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Weight
                </label>
                <div className="flex flex-wrap gap-2">
                  {["250g", "500g", "1kg"].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeight(w)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-200 text-sm ${
                        weight === w
                          ? "border-primary bg-primary/5 text-primary font-semibold shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Roast Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Roast Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Light", "Medium", "Dark"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRoast(r)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-200 text-sm ${
                        roast === r
                          ? "border-primary bg-primary/5 text-primary font-semibold shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Additions
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Plain", price: 0 },
                    { name: "Cardamom", price: 20 },
                    { name: "Special Blend", price: 35 },
                  ].map((add) => (
                    <button
                      key={add.name}
                      onClick={() => setAddition(add.name)}
                      className={`px-4 py-2 rounded-lg border flex items-center space-x-2 transition-all duration-200 text-sm ${
                        addition === add.name
                          ? "border-primary bg-primary/5 text-primary font-semibold shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span>{add.name}</span>
                      {add.price > 0 && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                          +{add.price} LE
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-200 w-full"></div>

            {/* Purchase Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-gray-500 hover:text-primary transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center font-medium text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-gray-500 hover:text-primary transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="flex-1 w-full flex items-center justify-between sm:justify-end gap-6">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="text-3xl font-bold text-primary">
                    LE {totalPrice.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="bg-primary text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-primary/90 transition-all duration-300 flex items-center space-x-2 transform hover:-translate-y-1"
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
