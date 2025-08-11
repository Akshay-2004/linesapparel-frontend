import React from "react";
import Image from "next/image";
import { IBannerContent } from '@/types/homepage.interface';

interface HomeBanner1Props {
  bannerData: IBannerContent;
}

const HomeBanner1 = ({ bannerData }: HomeBanner1Props) => {
  return (
    <section className="relative w-full h-[340px] sm:h-[420px] md:h-[520px] flex items-center justify-center">
      <Image
        src={bannerData.imageUrl}
        alt={bannerData.title}
        fill
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0  " />
      <div className="bg-black/50 backdrop-blur-sm px-12 py-10 rounded-xs max-w-[1280px] mx-auto w-full sm:w-4/5 md:w-3/4  flex flex-col items-center text-center">
        {bannerData.topText && (
          <p className="text-white text-base sm:text-lg font-semibold mb-2">
            {bannerData.topText}
          </p>
        )}
        <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight drop-shadow">
          {bannerData.title}
        </h1>
        <p className="text-white text-sm sm:text-lg font-normal mb-6 max-w-xl mx-auto">
          {bannerData.description}
        </p>
        <a
          href={bannerData.buttonLink}
          className="bg-primary-6 hover:bg-primary-7 text-white font-semibold px-6 py-3 rounded shadow transition-colors duration-200"
        >
          {bannerData.buttonText}
        </a>
      </div>
    </section>
  );
};

export default HomeBanner1;
