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
        className="object-top object-cover"
        priority
      />

      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-30" /> */}
      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-4 md:px-12">
        {/* Left: Text */}
        <div className="bg-black/40 rounded md:rounded-none p-4 md:p-8 max-w-xl text-white">
          {bannerData.topText && (
            <p className="text-sm font-medium mb-2">{bannerData.topText}</p>
          )}
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            {bannerData.title}
          </h1>
          <p className="text-base md:text-lg font-light">
            {bannerData.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner2;
