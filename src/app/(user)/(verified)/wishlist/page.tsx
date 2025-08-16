"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from '@/store/wishlistStore';
import { useUserDetails } from '@/hooks/useUserDetails';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import Loader from '@/components/shared/Loader';
import { EmptyWishlistState } from '@/components/pages/wishlist/EmptyWishlistState';
import { WishlistItem } from '@/components/pages/wishlist/WishlistItem';

export default function WishlistPage() {
  const { user, isAuthenticated } = useUserDetails();
  const { wishlist, loading, error, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated() && user?.id) {
      fetchWishlist(user.id);
    }
  }, [user?.id, fetchWishlist]);

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user?.id) return;
    
    try {
      await removeFromWishlist(user.id, productId);
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleAddToCart = async (item: any) => {
    try {
      // Extract product ID from Shopify format
      const numericProductId = item.productId.replace('gid://shopify/Product/', '');
      
      await addToCart({
        productId: item.productId,
        variantId: numericProductId, // This might need adjustment based on your cart implementation
        quantity: 1,
        price: parseFloat(item.price),
        title: item.title,
      });
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <Loader fullScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Wishlist</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-7xl mx-auto">
        <Card className="backdrop-blur-sm bg-white/90 shadow-none rounded-2xl border-0 w-full">
          <CardHeader className="px-6 mx-16 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Heart className="h-8 w-8 text-red-500 fill-current" />
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    My Wishlist
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
                  </p>
                </div>
              </div>
              <Link href="/">
                <Button variant="outline" className="mt-4 md:mt-0">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="px-6">
            {wishlist.length === 0 ? (
              <EmptyWishlistState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((item) => (
                  <WishlistItem
                    key={item.productId}
                    item={item}
                    onRemove={handleRemoveFromWishlist}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}