"use client";
import ProductTitleSection from "@/components/shared/ProductTitleSection";
import React from "react";
import womenDress1 from "@/assets/products/addidasTshirt.png";
import womenDress2 from "@/assets/products/womenTop.png";
import womenDress3 from "@/assets/products/browserTshirt.jpg";
import womenDress4 from "@/assets/products/whitefemaledress.jpg";
import womenDress5 from "@/assets/products/whiteTshirt.png";
import womenDress6 from "@/assets/products/femaleWhiteDress.png";
import { ProductCard } from "@/components/cards/ProductCard";
import { StaticImageData } from "next/image";
import Carousel from "@/components/ui/carousel";

type Product = {
  image: string | StaticImageData;
  name: string;
  variant: string;
  price: number;
  showButton: boolean;
};

const TrendingNow = () => {
  const products: Product[] = [
    {
      image: womenDress1,
      name: "Midi Dress",
      variant: "white",
      price: 40,
      showButton: true,
    },
    {
      image: womenDress2,
      name: "Top",
      variant: "white",
      price: 40,
      showButton: true,
    },
    {
      image: womenDress3,
      name: "Top Cream",
      variant: "white",
      price: 40,
      showButton: true,
    },
    {
      image: womenDress4,
      name: "Dress",
      variant: "white",
      price: 40,
      showButton: true,
    },
    {
      image: womenDress5,
      name: "Dress",
      variant: "white",
      price: 40,
      showButton: true,
    },
    {
      image: womenDress6,
      name: "Dress",
      variant: "white",
      price: 40,
      showButton: true,
    },
  ];

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProductTitleSection
          description="From street style to socials—these pieces are making waves. Stay ahead of the curve with styles that are turning heads everywhere."
          title="Trending Now"
          topText="What Everyone's Wearing"
          buttonText="View All"
          buttonLink="products/trending-now"
        />

        <div className="mt-6">
          <Carousel 
            cardsPerView={{ base: 1, md: 2, lg: 4 }}
            autoPlay={true}
            interval={5000}
          >
            {products.map((product, index) => (
              <div key={index} className="h-full min-h-96 flex">
                <ProductCard
                  image={product.image}
                  name={product.name}
                  variant={product.variant}
                  price={product.price}
                  showButton={product.showButton}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;
