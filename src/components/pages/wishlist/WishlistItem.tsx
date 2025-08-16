import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WishlistItem as WishlistItemType } from '@/store/wishlistStore';

interface WishlistItemProps {
  item: WishlistItemType;
  onRemove: (productId: string) => void;
  onAddToCart: (item: WishlistItemType) => void;
}

export function WishlistItem({ item, onRemove, onAddToCart }: WishlistItemProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200">
      <div className="relative overflow-hidden">
        <Link href={`/product/${item.handle}`}>
          <div className="aspect-square relative bg-gray-50">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        <button
          onClick={() => onRemove(item.productId)}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-sm"
          aria-label="Remove from wishlist"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
      </div>
      
      <CardContent className="p-4">
        <Link href={`/product/${item.handle}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 overflow-hidden" 
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis'
              }}>
            {item.title}
          </h3>
        </Link>
        <p className="text-xl font-bold text-gray-900">
          ${parseFloat(item.price).toFixed(2)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Added {new Date(item.addedAt).toLocaleDateString()}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Link href={`/product/${item.handle}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          <Button
            onClick={() => onAddToCart(item)}
          >
            <ShoppingCart className="mr-1 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
