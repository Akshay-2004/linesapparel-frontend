import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyCartState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-gray-100 rounded-full p-6 mb-6">
        <ShoppingCart className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
        Your cart is empty
      </h3>
      <p className="text-gray-500 text-center mb-8">
        Looks like you haven&apos;t added any items to your cart yet.
      </p>
      <Link href="/">
        <Button className="bg-blue-600 hover:bg-blue-700 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Start Shopping
        </Button>
      </Link>
    </div>
  );
}
