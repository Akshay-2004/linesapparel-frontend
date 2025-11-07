"use client";
import { ProductCard } from "@/components/cards/ProductCard";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import whiteDress from "@/assets/products/whitefemaledress.jpg";
import blueDress from "@/assets/products/bluefemaledress.png";
import greenTshirt from "@/assets/products/greenTshirt.jpg";
import addidas from "@/assets/products/addidasTshirt.png";
import BannerCard from "@/components/cards/BannerCard";
import { IFashionContent } from "@/types/homepage.interface";
import { useApi } from "@/hooks/useApi";
import { ProductSkeleton } from "@/components/skeletons/ProductSkeleton";
import { BannerCardSkeleton } from "@/components/skeletons/BannerCardSkeleton";
interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  variants: {
    edges: { node: { title: string; price: string; handle?: string } }[];
  };
  images: {
    edges: { node: { url: string } }[];
  };
}
interface FashionProps {
  fashionData: IFashionContent;
}

const Fashion = ({ fashionData }: FashionProps) => {
  const [fetchedProducts, setFetchedProducts] = useState<
    ShopifyProductNode[] | null
  >(null);
  const { fetchData, loading } = useApi<ShopifyProductNode>();
  const getProductsData = async () => {
    try {
      const responses = await Promise.all(
        fashionData.productIds.map((id) =>
          fetchData(`/shopify/products/handle/${id}/`, { method: "GET" })
        )
      );

      setFetchedProducts(responses.filter(Boolean) as ShopifyProductNode[]);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };
  useEffect(() => {
    getProductsData();
  }, []);

  const femaleProducts = [
    {
      image: whiteDress,
      name: "female dress",
      variant: "white",
      price: 40,
      showButton: false,
    },

    {
      image: blueDress,
      name: "female dress",
      variant: "white",
      price: 40,
      showButton: false,
    },
  ];
  const maleProducts = [
    {
      image: greenTshirt,
      name: "Men's T-shirt",
      variant: "Teal",
      price: 20,
      showButton: false,
    },

    {
      image: addidas,
      name: "Adidas T-shirt",
      variant: "white",
      price: 45,
      showButton: false,
    },
  ];

  return (
    <section className="bg-white  pb-6">
      <div className="max-w-11/12 mx-auto p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-6 bg-white">
          <div className="mb-10 sm:mb-16 text-center">
            <h4 className="text-primary-6 text-base font-semibold font-['Roboto'] leading-normal">
              {fashionData.header1}
            </h4>
            <p className="mt-2 text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-primary-8">
              {fashionData.header2}
            </p>
            <p className="py-2 sm:py-4 text-secondary-8 text-base sm:text-lg font-normal font-['Roboto'] leading-relaxed">
              {fashionData.description}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
            {/* Loading state */}
            {loading && (
              <>
                {/* Product skeletons */}
                {[...Array(2)].map((_, index) => (
                  <div
                    key={`product-skeleton-${index}`}
                    className="col-span-1 lg:col-span-3 min-h-[320px] sm:min-h-[360px] lg:min-h-[400px] flex"
                  >
                    <ProductSkeleton />
                  </div>
                ))}
                {/* Banner skeletons */}
                {fashionData.banners.map((_, index) => (
                  <div
                    key={`banner-skeleton-${index}`}
                    className="col-span-1 sm:col-span-2 lg:col-span-6 mt-4 sm:mt-0 min-h-[200px] sm:min-h-[320px] lg:min-h-[400px] flex"
                  >
                    <BannerCardSkeleton />
                  </div>
                ))}
                {/* Additional product skeletons */}
                {[...Array(2)].map((_, index) => (
                  <div
                    key={`product-skeleton-${index + 2}`}
                    className="col-span-1 lg:col-span-3 min-h-[320px] sm:min-h-[360px] lg:min-h-[400px] flex"
                  >
                    <ProductSkeleton />
                  </div>
                ))}
              </>
            )}

            {/* Loaded state */}
            {!loading && fetchedProducts && (
              <>
                {/* Product cards */}
                {fetchedProducts.slice(0, 2).map((product, index) => (
                  <div
                    key={product.id}
                    className="col-span-1 lg:col-span-3 col-start-1 min-h-[320px] sm:min-h-[360px] lg:min-h-[400px]  flex"
                  >
                    <Link href={`/product/${product.handle}`} className="w-full">
                      <ProductCard
                        image={
                          product.images.edges[0]?.node.url || "/placeholder.jpg"
                        }
                        name={product.title}
                        variant={product.variants.edges[0]?.node.title || ""}
                        price={parseFloat(
                          product.variants.edges[0]?.node.price || "0"
                        )}
                        showButton={false}
                      />
                    </Link>
                  </div>
                ))}
                {/* Banner cards using fashionData.banners */}
                {fashionData.banners.map((banner, index) => (
                  <div
                    key={index}
                    className="col-span-1 sm:col-span-2 lg:col-span-6 mt-4 sm:mt-0 min-h-[200px] sm:min-h-[320px] lg:min-h-[400px] flex"
                  >
                    <BannerCard
                      description={banner.description}
                      image={banner.imageUrl}
                      title={banner.title}
                      topText={banner.topText}
                      buttonText={banner.buttonText}
                    />
                  </div>
                ))}
                {fetchedProducts.slice(2).map((product, index) => (
                  <div
                    key={product.id}
                    className="col-span-1 lg:col-span-3 col-start-1 min-h-[320px] sm:min-h-[360px] lg:min-h-[400px] flex"
                  >
                    <Link href={`/product/${product.handle}`} className="w-full">
                      <ProductCard
                        image={
                          product.images.edges[0]?.node.url || "/placeholder.jpg"
                        }
                        name={product.title}
                        variant={product.variants.edges[0]?.node.title || ""}
                        price={parseFloat(
                          product.variants.edges[0]?.node.price || "0"
                        )}
                        showButton={false}
                      />
                    </Link>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fashion;
