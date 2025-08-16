import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyWishlistState() {
  return (
    <div className="text-center py-16">
      <div className="bg-gray-100 rounded-full p-6 mb-6 w-24 h-24 mx-auto flex items-center justify-center">
        <Heart className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
        Your wishlist is empty
      </h3>
      <p className="text-gray-500 text-center mb-8 max-w-md mx-auto">
        Start building your wishlist by adding items you love. 
        You can save items for later and easily add them to your cart when you're ready.
      </p>
      <Link href="/">
        <Button>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Start Shopping
        </Button>
      </Link>
    </div>
  );
}
