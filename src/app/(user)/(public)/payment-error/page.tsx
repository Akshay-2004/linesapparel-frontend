"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function PaymentErrorPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <Card className="shadow-lg border-0">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-gray-900">
                            Payment Failed
                        </CardTitle>
                        <p className="text-gray-600 mt-2">
                            We couldn't process your payment
                        </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Common Issues:</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• Insufficient funds in your account</p>
                                <p>• Incorrect card details</p>
                                <p>• Card expired or blocked</p>
                                <p>• Network connection issues</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/cart" className="flex-1">
                                <Button variant="outline" className="w-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Cart
                                </Button>
                            </Link>
                            <Link href="/checkout" className="flex-1">
                                <Button className="w-full">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Try Again
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
