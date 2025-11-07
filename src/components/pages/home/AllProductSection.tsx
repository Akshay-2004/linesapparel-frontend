'use client';

import React, { useEffect } from 'react';
import { ProductCard } from '@/components/cards/ProductCard';
import ProductTitleSection from "@/components/shared/ProductTitleSection";
import { useApi } from '@/hooks/useApi';
import Link from 'next/link';
import { ProductSkeleton } from '@/components/skeletons/ProductSkeleton';

export default function AllProductSection() {

  interface ShopifyProductsData {
    products?: any[];
  }

  const { fetchData, data, loading } = useApi<ShopifyProductsData>()

  const getAllProducts = async () => {
    try {
      const response = await fetchData(`/shopify/products?limit=8`)
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  useEffect(() => {
    getAllProducts()
  }, [])

  // Transform Shopify products data into our format
  const shopifyProducts = data?.products?.map((product: any) => ({
    id: product.id,
    handle: product.handle,
    name: product.title,
    variant: product.variants?.[0]?.title || '',
    price: parseFloat(product.variants?.[0]?.price || '0'),
    compareAtPrice: product.variants?.[0]?.compare_at_price ? parseFloat(product.variants?.[0]?.compare_at_price) : undefined,
    image: product.images?.[0]?.src || '',
    showButton: true
  })) || [];

  // Use shopifyProducts if available, otherwise fall back to empty array
  const displayProducts = shopifyProducts.length > 0 ? shopifyProducts : [];

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProductTitleSection
          description="Discover our complete collection of premium products"
          title="All Products"
          topText="Explore Everything"
          buttonText="View All"
          buttonLink="/products"
        />

        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="h-full min-h-[300px] flex"
                >
                  <ProductSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {displayProducts.slice(0, displayProducts.length >= 8 ? 8 : Math.min(4, displayProducts.length)).map((product: {
                id: string;
                name: string;
                variant: string;
                price: number;
                compareAtPrice?: number;
                image: string;
                showButton: boolean;
                handle: string;
              }) => (
                <Link
                  href={`/product/${product.handle}`}
                  key={product.id}
                  className="h-full min-h-[300px] flex"
                >
                  <ProductCard
                    name={product.name}
                    variant={product.variant}
                    price={product.price}
                    compareAtPrice={product.compareAtPrice}
                    image={product.image || "/placeholder.jpg"}
                    showButton={product.showButton}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}