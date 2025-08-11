"use client";

import { StaticImageData } from "next/image";
import { CartItem } from "./CartItem";
import { useCartStore } from "@/store/cartStore";

interface CartItemType {
  productId: string;
  variantId: string;
  name: string;
  price: number;
  color: string;
  size: string;
  image?: string | StaticImageData;
  quantity: number;
}

interface CartItemListProps {
  items: CartItemType[];
  onIncrease?: (productId: string, variantId: string) => void;
  onDecrease?: (productId: string, variantId: string) => void;
  onRemove?: (productId: string, variantId: string) => void;
}

export function CartItemList({
  items,
}: CartItemListProps) {
  const { updateCartItem, removeFromCart } = useCartStore();

  const handleIncrease = (variantId: string, quantity: number) => {
    let newQuantity = quantity + 1
    updateCartItem(variantId, newQuantity);
  };

  const handleDecrease = (variantId: string, quantity: number) => {
    if (quantity > 1) {
      updateCartItem(variantId, quantity - 1);
    }
  };

  return (
    <div className="space-y-8">
      {items.map((item) => (
        <CartItem
          key={item.variantId}
          item={item}
          onIncrease={() => handleIncrease(item.variantId, item.quantity)}
          onDecrease={() => handleDecrease(item.variantId, item.quantity)}
          onRemove={() => removeFromCart(item.variantId)}
        />
      ))}
    </div>
  );
}
