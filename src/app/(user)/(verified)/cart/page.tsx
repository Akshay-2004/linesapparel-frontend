"use client"
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { CartItemList } from "@/components/pages/cart/CartItemList";
import { EmptyCartState } from "@/components/pages/cart/EmptyCartState";
import { ArrowLeft, ShoppingCart, UserX, Mail } from "lucide-react";
import ProductTitleSection from "@/components/shared/ProductTitleSection";
import { useEffect, useCallback } from "react";
import { useCartStore } from "@/store/cartStore";
import { useUserDetails } from "@/hooks/useUserDetails";
import Loader from "@/components/shared/Loader";

export type CartItemType = {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  color: string;
  size: string;
  image?: string;
  price: number;
  quantity: number;
};

export default function CartPage() {
  const { cart, loading: cartLoading, error, fetchCart } = useCartStore();
  const { user, loading: userLoading, isAuthenticated, isVerified } = useUserDetails();

  const handleFetchCart = useCallback(() => {
    if (isAuthenticated()) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    handleFetchCart();
  }, []);

  // Show loading state while checking authentication
  if (userLoading || cartLoading) {
    return <div className="text-center py-16">
      <Loader fullScreen />
    </div>;
  }

  // Show login/register prompt if user is not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl container mx-auto">
          <Card className="backdrop-blur-sm bg-white/90 shadow-xl rounded-2xl border-0">
            <CardHeader className="px-6 py-8 text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-gray-900">
                <UserX className="h-7 w-7 text-red-500" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="max-w-md mx-auto space-y-6">
                <p className="text-gray-600 text-lg">
                  You need to be logged in to view and manage your cart.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/sign-in">
                    <Button className="w-full sm:w-auto">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Create Account
                    </Button>
                  </Link>
                </div>
                <Link href="/" className="inline-block">
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show email verification prompt if user is logged in but not verified
  if (!isVerified()) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl container mx-auto">
          <Card className="backdrop-blur-sm bg-white/90 shadow-xl rounded-2xl border-0">
            <CardHeader className="px-6 py-8 text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-gray-900">
                <Mail className="h-7 w-7 text-orange-500" />
                Email Verification Required
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="max-w-md mx-auto space-y-6">
                <p className="text-gray-600 text-lg">
                  Please verify your email address to access your cart and make purchases.
                </p>
                <p className="text-sm text-gray-500">
                  Logged in as: <span className="font-medium">{user?.email}</span>
                </p>
                <div className="flex flex-col gap-4 justify-center">
                  <Link href="/verify-email">
                    <Button className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      Verify Email
                    </Button>
                  </Link>
                </div>
                <Link href="/" className="inline-block">
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }
  const items: CartItemType[] = (cart?.items || []).map((item: any) => ({
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    name: item.title,
    color: item.color,
    size: item.size,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
  }));

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl container  mx-auto">
          <Card className="backdrop-blur-sm bg-white/90 shadow-xl rounded-2xl border-0">
            <CardHeader className="px-6 py-8">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                <ShoppingCart className="h-7 w-7 text-blue-600" />
                Shopping Cart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyCartState />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-7xl mx-auto flex flex-col gap-8">
        <Card className="backdrop-blur-sm bg-white/90 shadow-none rounded-2xl border-0 w-full">
          <CardHeader className="px-6 mx-16 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:gap-8">
              <ProductTitleSection
                title="Your Cart"
                description="Ready to check out in style? Review your picks and complete your look."
              />
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <div className="w-full">
              <CartItemList items={items} />
            </div>
          </CardContent>
          <CardFooter className="px-6 py-8 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-xl font-semibold text-gray-900">
              Total: CAD {cart?.totalPrice?.toLocaleString() ?? 0}
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <Link href="/" className="w-full md:w-auto">
                <Button
                  variant="outline"
                  className="w-full md:w-auto hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/checkout" className="w-full md:w-auto">
                <Button
                  variant="default"
                  className="w-full md:w-auto  text-white  transition-colors"
                >
                  Checkout
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
