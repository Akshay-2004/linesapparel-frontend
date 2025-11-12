import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IBannerContent } from '@/types/homepage.interface';

interface HomeBanner2Props {
  bannerData: IBannerContent;
}

const HomeBanner2 = ({ bannerData }: HomeBanner2Props) => {
  return (
    <section className="relative w-full h-[350px] md:h-[420px] flex items-center justify-center overflow-hidden">
      <Image
        src={bannerData.imageUrl}
        alt={bannerData.title}
        layout="fill"
        className="object-top rounded-sm object-cover"
        priority
      />

      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-30" /> */}
      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-2 md:px-6">
        {/* Left: Text */}
        <div className="bg-black/40 rounded md:rounded-md p-4 md:p-8 max-w-3xl text-white">
          {bannerData.topText && (
            <p className="text-sm font-medium mb-2">{bannerData.topText}</p>
          )}
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            {bannerData.title}
          </h1>
          <p className="text-base md:text-lg font-light mb-6">
            {bannerData.description}
          </p>
          <a
            href={bannerData.buttonLink}
            className="inline-block bg-primary-6 hover:bg-primary-7 text-white font-semibold px-6 py-3 rounded shadow transition-colors duration-200"
          >
            {bannerData.buttonText}
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner2;
