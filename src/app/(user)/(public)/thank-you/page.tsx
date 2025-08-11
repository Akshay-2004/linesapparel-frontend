"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
// Add type declaration for canvas-confetti

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag } from "lucide-react";

export default function ThankYouPage() {
    useEffect(() => {
        // Trigger confetti animation
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;

        const confettiAnimation = () => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) return;

            const particleCount = 10;

            confetti({
                particleCount,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#4F46E5", "#60A5FA", "#34D399"],
            });

            requestAnimationFrame(confettiAnimation);
        };

        confettiAnimation();

        // Cleanup
        return () => {
            confetti.reset();
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Card className="backdrop-blur-sm bg-white/90 shadow-xl rounded-2xl border-0">
                    <CardHeader className="px-6 py-8 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-green-100 p-3">
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold text-gray-900">
                            Thank you for your order!
                        </CardTitle>
                        <p className="mt-2 text-lg text-gray-600">
                            Your order has been successfully placed.
                        </p>
                    </CardHeader>
                    <CardContent className="px-6 py-4">
                        <div className="text-center space-y-4">
                            <p className="text-gray-600">
                                We&apos;ll send you a confirmation email with your order details
                                shortly.
                            </p>
                            <div className="text-sm text-gray-500">
                                Order ID: #
                                {Math.random().toString(36).substr(2, 9).toUpperCase()}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="px-6 py-8 flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="#">
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto hover:bg-gray-50 transition-colors"
                            >
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                View Orders
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition-colors">
                                Continue Shopping
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}