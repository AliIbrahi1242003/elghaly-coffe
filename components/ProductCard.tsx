"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { products } from "@/lib/products";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  category?: string;
}

export default function ProductCard({
  id,
  title,
  price,
  image,
  category,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === id);
    if (product) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-white text-foreground p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
        >
          <ShoppingCart size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {category && (
          <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">
            {category}
          </span>
        )}
        <Link href={`/product/${id}`}>
          <h3 className="text-lg font-medium text-foreground hover:text-primary transition-colors mb-2 line-clamp-1">
            {title}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            LE {price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
