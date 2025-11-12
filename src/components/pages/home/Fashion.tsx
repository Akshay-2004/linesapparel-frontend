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
    edges: { 
      node: { 
        title: string; 
        priceV2: {
          amount: string;
          currencyCode: string;
        };
        handle?: string;
      } 
    }[];
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
      <div className="p-2 sm:p-4 lg:p-8">
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
          <div className="flex flex-col gap-2 sm:gap-4">
            {/* Loading state */}
            {loading && (
              <>
                {/* First Row - 2 Product skeletons + 1 Banner skeleton */}
                <div className="flex flex-col lg:flex-row gap-2 sm:gap-4">
                  {/* Product skeletons in a row on mobile */}
                  <div className="flex gap-2 sm:gap-4 lg:contents">
                    {[...Array(2)].map((_, index) => (
                      <div
                        key={`product-skeleton-${index}`}
                        className="w-[calc(50%-4px)] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] flex"
                      >
                        <ProductSkeleton />
                      </div>
                    ))}
                  </div>
                  {/* Banner skeleton */}
                  {fashionData.banners[0] && (
                    <div className="w-full lg:flex-1 flex">
                      <BannerCardSkeleton />
                    </div>
                  )}
                </div>

                {/* Second Row - 1 Banner skeleton + 2 Product skeletons */}
                <div className="flex flex-col lg:flex-row gap-2 sm:gap-4">
                  {/* Banner skeleton */}
                  {fashionData.banners[1] && (
                    <div className="w-full lg:flex-1 flex">
                      <BannerCardSkeleton />
                    </div>
                  )}
                  {/* Product skeletons in a row on mobile */}
                  <div className="flex gap-2 sm:gap-4 lg:contents">
                    {[...Array(2)].map((_, index) => (
                      <div
                        key={`product-skeleton-${index + 2}`}
                        className="w-[calc(50%-4px)] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] flex"
                      >
                        <ProductSkeleton />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Loaded state */}
            {!loading && fetchedProducts && (
              <>
                {/* First Row - 2 Product cards + 1 Banner */}
                <div className="flex flex-col lg:flex-row gap-2 sm:gap-4">
                  {/* First 2 Product cards in a row on mobile */}
                  <div className="flex gap-2 sm:gap-4 lg:contents">
                    {fetchedProducts.slice(0, 2).map((product, index) => (
                      <div
                        key={product.id}
                        className="w-[calc(50%-4px)] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
                      >
                        <Link href={`/product/${product.handle}`} className="w-full h-full block">
                          <ProductCard
                            image={
                              product.images.edges[0]?.node.url || "/placeholder.jpg"
                            }
                            name={product.title}
                            variant={product.variants.edges[0]?.node.title || ""}
                            price={parseFloat(
                              product.variants.edges[0]?.node.priceV2?.amount || "0"
                            )}
                            showButton={false}
                          />
                        </Link>
                      </div>
                    ))}
                  </div>
                  
                  {/* First Banner */}
                  {fashionData.banners[0] && (
                    <div className="w-full lg:flex-1 flex">
                      <BannerCard
                        description={fashionData.banners[0].description}
                        image={fashionData.banners[0].imageUrl}
                        title={fashionData.banners[0].title}
                        topText={fashionData.banners[0].topText}
                        buttonText={fashionData.banners[0].buttonText}
                      />
                    </div>
                  )}
                </div>

                {/* Second Row - 1 Banner + 2 Product cards */}
                <div className="flex flex-col lg:flex-row gap-2 sm:gap-4">
                  {/* Second Banner */}
                  {fashionData.banners[1] && (
                    <div className="w-full lg:flex-1 flex">
                      <BannerCard
                        description={fashionData.banners[1].description}
                        image={fashionData.banners[1].imageUrl}
                        title={fashionData.banners[1].title}
                        topText={fashionData.banners[1].topText}
                        buttonText={fashionData.banners[1].buttonText}
                      />
                    </div>
                  )}

                  {/* Last 2 Product cards in a row on mobile */}
                  <div className="flex gap-2 sm:gap-4 lg:contents">
                    {fetchedProducts.slice(2).map((product, index) => (
                      <div
                        key={product.id}
                        className="w-[calc(50%-4px)] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
                      >
                        <Link href={`/product/${product.handle}`} className="w-full h-full block">
                          <ProductCard
                            image={
                              product.images.edges[0]?.node.url || "/placeholder.jpg"
                            }
                            name={product.title}
                            variant={product.variants.edges[0]?.node.title || ""}
                            price={parseFloat(
                              product.variants.edges[0]?.node.priceV2?.amount || "0"
                            )}
                            showButton={false}
                          />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fashion;
