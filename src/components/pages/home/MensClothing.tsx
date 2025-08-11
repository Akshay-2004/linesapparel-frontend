"use client";
import ProductTitleSection from "@/components/shared/ProductTitleSection";
import React from "react";
import menDress1 from "@/assets/products/addidasTshirt.png";
import menDress2 from "@/assets/products/browserTshirt.jpg";
import menDress3 from "@/assets/products/greenTshirt.jpg";
import menDress4 from "@/assets/products/whiteTshirt.png";
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

const MensClothing = () => {
  const products: Product[] = [
    {
      image: menDress1,
      name: "Dress 1",
      variant: "white",
      price: 40,
      showButton: true,
    },
    {
      image: menDress2,
      name: "White T-shirt",
      variant: "white",
      price: 40,
      showButton: true,
    },
    {
      image: menDress3,
      name: "T-shirt Cream",
      variant: "white",
      price: 40,
      showButton: true,
    },
    {
      image: menDress4,
      name: "Brown T-shirt",
      variant: "white",
      price: 40,
      showButton: true,
    },
  ];

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProductTitleSection
          description="From laid-back fits to sharp silhouettes—your style, your rules."
          title="Men's Clothing"
          topText="Style Meets Substance"
          buttonText="View All"
          buttonLink="/products/men"
        />

        <div className="mt-6">
          <Carousel 
            cardsPerView={{ base: 1, md: 2, lg: 4 }}
            autoPlay={true}
            interval={4000}
          >
            {products.map((product, index) => (
              <div key={index} className="h-full min-h-[400px] flex">
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

export default MensClothing;
