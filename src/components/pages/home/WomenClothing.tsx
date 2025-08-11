"use client";
import ProductTitleSection from "@/components/shared/ProductTitleSection";
import React from "react";
import womenDress1 from "@/assets/products/StrapiMidiDress.png";
import womenDress2 from "@/assets/products/womenTop.png";
import womenDress3 from "@/assets/products/womenTopCream.png";
import womenDress4 from "@/assets/products/whitefemaledress.jpg";
import womenDress5 from "@/assets/products/bluefemaledress.png";
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

const WomenClothing = () => {
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
          description="Browse our latest collection of must-haves—from timeless staples to trendsetting pieces"
          title="Women's Clothing"
          topText="Handpick for you"
          buttonText="View All"
          buttonLink="products/women"
        />

        <div className="mt-6">
          <Carousel 
            cardsPerView={{ base: 1, md: 2, lg: 4 }}
            autoPlay={true}
            interval={4000}
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

export default WomenClothing;
