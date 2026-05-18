"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "@/lib/cart";

interface CartItemComponentProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemComponentProps) {
  const itemTotal = item.price * item.quantity;

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <div className="flex gap-4 bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-medium text-foreground mb-1">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600">{item.category}</p>
        </div>
        <p className="text-sm font-medium text-primary">
          LE {item.price.toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-center justify-between">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
          <button
            onClick={handleDecrement}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={handleIncrement}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 p-1 transition-colors"
          aria-label="Remove from cart"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Item Total */}
      <div className="flex flex-col items-end justify-between min-w-max">
        <span className="text-lg font-bold text-foreground">
          LE {itemTotal.toFixed(2)}
        </span>
        <span className="text-xs text-gray-500">Total</span>
      </div>
    </div>
  );
}
