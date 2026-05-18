"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { useSession } from "@/lib/auth-client";
import { Product, ProductImage, ProductSize, ProductVariant } from "@/lib/schema";

interface ProductWithRelations extends Product {
  images: ProductImage[];
  sizes: ProductSize[];
  variants: ProductVariant[];
}

interface ProductDetailsProps {
  product: ProductWithRelations;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

  // Image State
  const [selectedImage, setSelectedImage] = useState(
    product.images.find(img => img.isMain)?.url || product.image || ""
  );

  // Size & Price State
  const sortedSizes = product.sizes.sort((a, b) => a.price - b.price);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(
    sortedSizes.length > 0 ? sortedSizes[0] : null
  );
  const currentPrice = selectedSize ? selectedSize.price : product.price;

  // Variant State
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );

  const [quantity, setQuantity] = useState(1);

  // Update selected image if product changes (unlikely in this view but good practice)
  useEffect(() => {
    setSelectedImage(product.images.find(img => img.isMain)?.url || product.image || "");
  }, [product]);

  const handleAddToCart = () => {
    if (isAdmin) {
      addToast({
        type: "error",
        title: "Admins cannot purchase products",
        description: "Use a buyer account to place orders.",
        duration: 3500,
      });
      return;
    }

    // Construct a custom product object for the cart to include selected options
    // Note: You might need to update your CartContext to handle these extra fields if you want to display them in the cart.
    // For now, we'll assume the cart can take the base product and we might append details to the title or similar if the cart is simple.
    // Or better, pass the selected options.

    const cartItem = {
      ...product,
      price: currentPrice,
      title: `${product.title}${selectedSize ? ` - ${selectedSize.size}` : ""}${selectedVariant ? ` - ${selectedVariant.name}` : ""}`,
      image: selectedImage,
    };

    addToCart(cartItem, quantity);

    addToast({
      type: "success",
      title: `${product.title} added to cart`,
      description: `Quantity: ${quantity} | LE ${(currentPrice * quantity).toFixed(2)}`,
      image: selectedImage,
      duration: 3000,
    });

    setQuantity(1);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-24">
        <Link
          href="/shop"
          className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img.url ? "border-primary" : "border-transparent hover:border-gray-300"
                      }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${product.title} view ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                {product.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {product.title}
            </h1>
            <p className="text-3xl font-bold text-primary mb-6">
              LE {currentPrice.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Options */}
            <div className="space-y-8 mb-8">
              {/* Sizes */}
              {sortedSizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {sortedSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border transition-all min-w-[80px] ${selectedSize?.id === size.id
                            ? "border-primary bg-primary text-white shadow-md"
                            : "border-gray-200 text-gray-700 hover:border-primary hover:bg-primary/5"
                          }`}
                      >
                        {size.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants */}
              {product.variants.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Type / Variant
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-lg border transition-all ${selectedVariant?.id === variant.id
                            ? "border-primary bg-primary text-white shadow-md"
                            : "border-gray-200 text-gray-700 hover:border-primary hover:bg-primary/5"
                          }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              {!isAdmin ? (
                <>
                  <div className="flex items-center border border-gray-300 rounded-lg w-fit bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-100 transition-colors rounded-l-lg"
                      disabled={quantity <= 1}
                    >
                      <Minus size={20} className="text-gray-600" />
                    </button>
                    <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-gray-100 transition-colors rounded-r-lg"
                    >
                      <Plus size={20} className="text-gray-600" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                </>
              ) : (
                <div className="w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                  Admin accounts can view products only. Purchase actions are disabled.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
