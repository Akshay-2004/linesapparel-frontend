"use client";
import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CartItemProps {
  item: {
    productId: string;
    variantId: string;
    name: string;
    price: number;
    color: string;
    size: string;
    image?: string | StaticImageData; // <-- allow undefined
    quantity: number;
  };
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
}

export function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 py-6 border-b border-gray-100 last:border-0">
      <div className="md:w-1/4">
        <div className="relative rounded-xl overflow-hidden  hover:shadow-lg transition-shadow">
          <Image
            src={item.image || "/placeholder.png"} // fallback image
            alt={item.name}
            width={500}
            height={500}
            className="object-contain w-full h-[200px] md:h-[180px] transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
      <div className="md:w-3/4 space-y-4">
        <div className="flex flex-col   justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-gray-900  transition-colors">
              {item.name}
            </h3>
            <p className="text-xl font-semibold text-gray-800">
              CAD {(item.price * item.quantity).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 font-mono">
              Color
              <br /> {item.color}
            </p>
          </div>
          <div className="flex justify-between  ">
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="text-secondary-7 bg-transparent border  border-secondary-7"
              >
                Size: {item.size}
              </Button>
              <div className="flex items-center border text-secondary-7 border-secondary-7">
                <Button
                  variant="link"
                  size="icon"
                  className=" rounded-md py-2 px-4 mr-2 text-secondary-7"
                  onClick={onDecrease}
                >
                  -
                </Button>
                <span className="text-center w-8">{item.quantity}</span>
                <Button
                  variant="link"
                  size="icon"
                  className=" rounded-md py-2 px-4 ml-2 text-secondary-7"
                  onClick={onIncrease}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="mx-7">
              <Button
                variant="ghost"
                className="group text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                onClick={onRemove}
              >
                <Trash2 className="h-5 w-5" />
                <span className="text-gray-700 group-hover:text-red-500 transition-colors">
                  Remove Item
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
