"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export function OrderSummary({
  subtotal,
  shipping,
  total,
  itemCount,
}: OrderSummaryProps) {
  return (
    <Card className="backdrop-blur-sm bg-white/90 shadow-xl rounded-2xl border-0 lg:w-1/3 h-fit sticky top-8">
      <CardHeader className="px-6 py-8 border-b border-gray-100">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal ({itemCount} items)</span>
          <span className="text-lg font-semibold text-gray-900">
            ₹{subtotal}
          </span>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Shipping Method
          </label>
          <Select defaultValue="standard">
            <SelectTrigger className="w-full bg-gray-50 border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">
                Standard shipping - ₹{shipping}.00
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Promo Code
          </label>
          <div className="flex gap-3">
            <Input
              placeholder="Enter your code"
              className="bg-gray-50 border-gray-200"
            />
            <Button className="px-6 hover:bg-blue-700 transition-colors">
              Apply
            </Button>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            Total Cost
          </span>
          <span className="text-2xl font-bold text-blue-600">₹{total}</span>
        </div>
      </CardContent>
      <CardFooter className="p-6">
        <Button
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-lg font-semibold py-6"
        >
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
