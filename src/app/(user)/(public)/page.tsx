'use client';

import React, { useState, useEffect } from 'react';
import { useHomepageService } from '@/services/homepage.service';
import { IHomepageData } from '@/types/homepage.interface';
import { HomePageSkeleton } from '@/components/skeletons/HomePageSkeleton';
import { toast } from 'sonner';

import Fashion from "@/components/pages/home/Fashion";
import Hero from "@/components/pages/home/Hero";
import HomeBanner1 from "@/components/pages/home/HomeBanner1";
import HomeBanner2 from "@/components/pages/home/HomeBanner2";
import ProductSection from "@/components/pages/home/ProductSection";
import Testimonials from "@/components/pages/home/Testimonials";

import hero1 from '@/assets/home/hero 1.png'
import hero2 from '@/assets/home/hero 2.png'
import hero3 from '@/assets/home/hero 3.png'
import hero4 from '@/assets/home/hero 4.png'
import { StaticImageData } from 'next/image'

// Define the slide type
type HeroSlide = {
    id: number;
    image: StaticImageData;
    pretitle?: string;
    title: string;
    subtitle: string;
}

// Create array of slides data
const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: hero1,
    pretitle: "Find Your",
    title: "Unique",
    subtitle: "Style"
  },
  {
    id: 2,
    image: hero2,
    title: "Explore",
    subtitle: "our latest arrivals and find the pieces that speak to you."
  },
  {
    id: 3,
    image: hero3,
    title: "Seasonal",
    subtitle: "Collections"
  },
  {
    id: 4,
    image: hero4,
    title: "Premium",
    subtitle: "Quality"
  }
]

// Create fallback hero data
const fallbackHeroData = {
  slides: heroSlides.map(slide => ({
    imageUrl: slide.image.src,
    pretitle: slide.pretitle,
    title: slide.title,
    subtitle: slide.subtitle
  })),
  autoPlay: true,
  interval: 5000
};

export default function Home() {
  const [homepageData, setHomepageData] = useState<IHomepageData | null>(null);
  const { getHomepage, loading, error } = useHomepageService();

  useEffect(() => {
    loadHomepageData();
  }, []);

  const loadHomepageData = async () => {
    try {
      const response = await getHomepage();
      if (response?.data) {
        setHomepageData(response.data);
      } else {
        toast.error('No homepage data received');
      }
    } catch (err) {
      console.error('Failed to load homepage data:', err);
      toast.error('Failed to load homepage content');
    }
  };

  if (loading) {
    return <HomePageSkeleton />;
  }

    if (!homepageData && error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Hero heroData={fallbackHeroData} />
      </div>
    );
  }

  const productSections = homepageData?.productSections || [];
  const banners = homepageData?.banners || [];

  const firstProductSection = productSections[0];
  const remainingProductSections = productSections.slice(1);

  return (
    <>
      {homepageData?.hero && <Hero heroData={homepageData.hero} />}
      {homepageData?.fashion && <Fashion fashionData={homepageData.fashion} />}
      {banners[0] && <HomeBanner1 bannerData={banners[0]} />}
      {firstProductSection && <ProductSection sectionData={firstProductSection} />}
      {banners[1] && <HomeBanner2 bannerData={banners[1]} />}

      {remainingProductSections.length > 0 &&
        remainingProductSections.map((section, index) => (
          <ProductSection key={`product-section-${index + 1}`} sectionData={section} />
        ))}

      <Testimonials />
    </>
  );
}
