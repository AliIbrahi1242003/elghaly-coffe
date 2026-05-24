"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { useSession } from "@/lib/auth-client";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export default function ProductCard({
  id,
  title,
  price,
  image,
  category,
  description,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isAdmin) {
      addToast({
        type: "error",
        title: "Admins cannot purchase products",
        description: "Switch to a buyer account to add items to cart.",
        duration: 3500,
      });
      return;
    }

    const product = { id, title, price, image, category, description };
    addToCart(product, 1);
    addToast({
      type: "success",
      title: `${title} added to cart`,
      description: `LE ${price.toFixed(2)}`,
      image: image,
      duration: 3000,
    });
  };
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100">
      {/* Image Container */}
      <div className="relative h-72 w-full overflow-hidden bg-gray-50">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500" />

        {!isAdmin && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-foreground p-3.5 rounded-full shadow-lg translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
            aria-label={`Add ${title} to cart`}
          >
            <ShoppingCart size={22} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {category && (
          <span className="text-xs text-primary font-semibold uppercase tracking-widest mb-2 block">
            {category}
          </span>
        )}
        <Link href={`/product/${id}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-primary transition-colors mb-2 line-clamp-1">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {description || "Premium coffee blend"}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-extrabold text-gray-900">
            LE {price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
