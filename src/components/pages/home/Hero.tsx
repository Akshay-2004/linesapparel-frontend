"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IHeroContent } from '@/types/homepage.interface'

interface HeroProps {
  heroData: IHeroContent;
}

const Hero = ({ heroData }: HeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Auto-advance slides
  useEffect(() => {
    if (!heroData.autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.slides.length)
    }, heroData.interval)
    
    return () => clearInterval(timer)
  }, [heroData.autoPlay, heroData.interval, heroData.slides.length])

  // Handle indicator click
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <style jsx>{`
        .button-89 {
          --b: 3px;
          --s: .45em;
          --color: #ffffff;
          
          padding: calc(.5em + var(--s)) calc(.9em + var(--s));
          color: var(--color);
          --_p: var(--s);
          background:
            conic-gradient(from 90deg at var(--b) var(--b),#0000 90deg,var(--color) 0)
            var(--_p) var(--_p)/calc(100% - var(--b) - 2*var(--_p)) calc(100% - var(--b) - 2*var(--_p));
          transition: .3s linear, color 0s, background-color 0s;
          outline: var(--b) solid #0000;
          outline-offset: .6em;
          font-size: 18px;
          font-weight: 600;
          border: 0;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
          cursor: pointer;
        }

        .button-89:hover,
        .button-89:focus-visible {
          --_p: 0px;
          outline-color: var(--color);
          outline-offset: .05em;
        }

        .button-89:active {
          background: var(--color);
          color: #000;
        }
      `}</style>
      
      {heroData.slides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-black/30 z-10" />
          <div className="absolute inset-0">
            <Image 
              src={slide.imageUrl} 
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
          
          {/* Content */}
          <div className="relative z-20 text-center text-white w-full flex flex-col items-center">
            <div className="bg-black/50 backdrop-blur-sm px-12 py-10 rounded-xs max-w-[1024px] mx-auto w-full sm:w-4/5 md:w-3/4 lg:w-1/2">
              {slide.pretitle && (
                <p className="text-4xl font-semibold mb-2">{slide.pretitle}</p>
              )}
              <h1 className="text-7xl font-bold mb-4 text-secondary-2">{slide.title}</h1>
              <p className="text-4xl font-semibold">{slide.subtitle}</p>
            </div>
            
            {/* Button - positioned below text area */}
            {slide.link && (
              <div className="mt-8">
                <Link href={slide.link}>
                  <button className="button-89" role="button">
                    Shop Now
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Indicator dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-30">
        {heroData.slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero