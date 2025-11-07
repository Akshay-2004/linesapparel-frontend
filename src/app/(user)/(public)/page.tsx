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
import ProductSectionNew from "@/components/pages/home/ProductSectionNew";
import AllProductSection from "@/components/pages/home/AllProductSection";

import hero1 from '@/assets/home/hero 1.png'
import hero2 from '@/assets/home/hero 2.png'
import hero3 from '@/assets/home/hero 3.png'
import hero4 from '@/assets/home/hero 4.png'
import { StaticImageData } from 'next/image'
import InstagramFeed from '@/components/pages/home/InstagramFeed';
import { InterestPopup } from '@/components/modals/InterestPopup';

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

// Helper functions to check if sections have meaningful content
const hasValidHeroContent = (hero: any) => {
  return hero && hero.slides && Array.isArray(hero.slides) && hero.slides.length > 0 &&
    hero.slides.some((slide: any) => slide.imageUrl && (slide.title || slide.subtitle));
};

const hasValidFashionContent = (fashion: any) => {
  return fashion && 
    (fashion.header1 || fashion.header2 || fashion.description) &&
    fashion.banners && Array.isArray(fashion.banners) && fashion.banners.length > 0 &&
    fashion.banners.some((banner: any) => banner.imageUrl && banner.title);
};

const hasValidBannerContent = (banner: any) => {
  return banner && banner.imageUrl && banner.title && banner.buttonText && banner.buttonLink;
};

const hasValidProductSectionContent = (section: any) => {
  return section && section.title && section.tag && section.buttonText && section.buttonLink;
};

export default function Home() {
  const [homepageData, setHomepageData] = useState<IHomepageData | null>(null);
  const [showInterestPopup, setShowInterestPopup] = useState(false);
  const { getHomepage, loading, error } = useHomepageService();

  useEffect(() => {
    loadHomepageData();
  }, []);

  useEffect(() => {
    // Check if user has already submitted interest
    const hasSubmitted = localStorage.getItem('interest_submitted');

    if (!hasSubmitted) {
      // Show popup after 10 seconds
      const timer = setTimeout(() => {
        setShowInterestPopup(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
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

  const handleCloseInterestPopup = () => {
    setShowInterestPopup(false);
  };

  if (loading) {
    return <HomePageSkeleton />;
  }

  if (!homepageData && error) {
    return (
      <div className="min-h-screen">
        <Hero heroData={fallbackHeroData} />
      </div>
    );
  }

  // Only get sections if homepage data exists
  const productSections = homepageData?.productSections || [];
  const banners = homepageData?.banners || [];

  // Filter product sections to only those with valid content
  const validProductSections = productSections.filter(hasValidProductSectionContent);
  const firstValidProductSection = validProductSections[0];
  const remainingValidProductSections = validProductSections.slice(1);

  // Filter banners to only those with valid content
  const validBanners = banners.filter(hasValidBannerContent);

  return (
    <>
      {homepageData && hasValidHeroContent(homepageData.hero) && <Hero heroData={homepageData.hero} />}
      {homepageData && hasValidFashionContent(homepageData.fashion) && <Fashion fashionData={homepageData.fashion} />}
      {validBanners[0] && <HomeBanner1 bannerData={validBanners[0]} />}
      {firstValidProductSection && <ProductSection sectionData={firstValidProductSection} />}
      {validBanners[1] && <HomeBanner2 bannerData={validBanners[1]} />}
      <AllProductSection />

      {remainingValidProductSections.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 container mx-auto">
          {remainingValidProductSections.map((section, index) => (
            <div key={`product-section-new-${index}`} className="col-span-1">
              <ProductSectionNew sectionData={section} />
            </div>
          ))}
        </div>
      )}
        <InstagramFeed />

      {/* Interest Popup */}
      <InterestPopup
        isOpen={showInterestPopup}
        onClose={handleCloseInterestPopup}
      />
    </>
  );
}
