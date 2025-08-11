'use client';

import React, { useEffect } from 'react';
import { IProductSectionContent } from '@/types/homepage.interface';
import { ProductCard } from '@/components/cards/ProductCard';
import ProductTitleSection from "@/components/shared/ProductTitleSection";
import Carousel from "@/components/ui/carousel";
import { useApi } from '@/hooks/useApi';
import Link from 'next/link';

// Dummy product data (we'll use this until the real product API is connected)


interface ProductSectionProps {
  sectionData: IProductSectionContent;
}

export default function ProductSection({ sectionData }: ProductSectionProps) {
  const {
    title,
    description,
    topText,
    buttonText,
    buttonLink,
    tag,
    carouselSettings
  } = sectionData;
  interface ShopifyProductNode {
    id: string;
    handle: string; // <-- add this line
    title: string;
    variants: {
      edges: { node: { title: string; price: string; handle?: string } }[];
    };
    images: {
      edges: { node: { url: string } }[];
    };
  }

  interface ShopifyProductsData {
    products?: {
      edges: { node: ShopifyProductNode }[];
    };
  }

  const { fetchData, data, loading } = useApi<ShopifyProductsData>()

  const getProductByTag = async () => {
    try {
      const response = await fetchData(`/shopify/collections/handle/${tag}?limit=6`)
      console.log(tag, response)
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  useEffect(() => {
    getProductByTag()
  }, [tag])

  // Transform Shopify products data into our format
  const shopifyProducts = data?.products?.edges?.map(({ node }) => ({
    id: node.id,
    handle: node.handle, // <-- add this line
    name: node.title,
    variant: node.variants.edges[0]?.node.title || '',
    price: parseFloat(node.variants.edges[0]?.node.price || '0'),
    image: node.images.edges[0]?.node.url || '',
    showButton: true
  })) || [];

  // Use shopifyProducts if available, otherwise fall back to dummy data
  const displayProducts = shopifyProducts.length > 0 ? shopifyProducts : [];

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProductTitleSection
          description={description || "Discover our curated collection of premium products"}
          title={title}
          topText={topText || "Featured Collection"}
          buttonText={buttonText || "View All"}
          buttonLink={buttonLink || "/products"}
        />

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <p>Loading products...</p>
            </div>
          ) : (
            <Carousel
              cardsPerView={{ base: 1, md: 2, lg: 4 }}
              autoPlay={true}
              interval={4000}
            >
              {displayProducts.map((product: {
                id: string;
                name: string;
                variant: string;
                price: number;
                image: string;
                showButton: boolean;
                handle: string;
              }) => (
                <Link
                  href={`/product/${product.handle}`}
                  key={product.id}
                  className="h-full min-h-[400px] flex"
                >
                  <ProductCard
                    name={product.name}
                    variant={product.variant}
                    price={product.price}
                    image={product.image || "/placeholder.jpg"}
                    showButton={product.showButton}
                  />
                </Link>
              ))}
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
}
