import React from 'react';

export const HomePageSkeleton = () => {
    return (
        <div className="animate-pulse">
            {/* Hero Section Skeleton */}
            <div className="w-full h-[600px] bg-gray-200 mb-8" />

            {/* Fashion Section Skeleton */}
            <div className="container mx-auto px-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-[200px] bg-gray-200 rounded-lg" />
                    ))}
                </div>
            </div>

            {/* Banner Skeleton */}
            <div className="w-full h-[300px] bg-gray-200 mb-8" />

            {/* Product Section Skeleton */}
            <div className="container mx-auto px-4 mb-8">
                <div className="h-8 bg-gray-200 w-48 mb-4 rounded" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="h-[200px] bg-gray-200 rounded-lg" />
                            <div className="h-4 bg-gray-200 w-3/4 rounded" />
                            <div className="h-4 bg-gray-200 w-1/2 rounded" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials Skeleton */}
            <div className="container mx-auto px-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-4 border rounded-lg space-y-3">
                            <div className="h-4 bg-gray-200 w-3/4 rounded" />
                            <div className="h-4 bg-gray-200 w-full rounded" />
                            <div className="h-4 bg-gray-200 w-1/2 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};