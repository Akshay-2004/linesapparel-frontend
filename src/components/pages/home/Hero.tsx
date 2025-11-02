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
    <div className="relative h-[98vh] w-full overflow-hidden">
      <style jsx>{`
        .cssbuttons-io {
          position: relative;          
          font-size: 18px;
          letter-spacing: 0.05em;
          font-weight: 600;
          border-radius: 0.4em;
          cursor: pointer;
          border: none;
          background: black;
          color: black;
          overflow: hidden;
        }

        .cssbuttons-io span {
          position: relative;
          z-index: 10;
          transition: color 0.4s;
          display: inline-flex;
          align-items: center;
          padding: 0.8em 1.2em 0.8em 1.05em;
        }

        .cssbuttons-io:hover span {
          color: white;
        }

        .cssbuttons-io::before,
        .cssbuttons-io::after {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .cssbuttons-io::before {
          content: "";
          background: #fff;
          width: 120%;
          left: -10%;
          transform: skew(30deg);
          transition: transform 0.4s cubic-bezier(0.3, 1, 0.8, 1);
        }

        .cssbuttons-io:hover::before {
          transform: translate3d(100%, 0, 0);
        }

        .cssbuttons-io:active {
          transform: scale(0.95);
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
            <div className="bg-black/50 backdrop-blur-sm px-6 md:px-12 py-6 md:py-10 rounded-xs max-w-[1024px] mx-auto w-full sm:w-4/5 md:w-3/4 lg:w-1/2">
              {slide.pretitle && (
                <p className="text-xl md:text-4xl font-semibold mb-1">{slide.pretitle}</p>
              )}
              <h1 className="text-4xl md:text-7xl font-bold mb-2 text-secondary-2">{slide.title}</h1>
              <p className="text-xl md:text-4xl font-semibold">{slide.subtitle}</p>
            </div>
          </div>
          
          {/* Button - positioned above indicator dots */}
          {slide.link && (
            <div className="absolute bottom-20 md:bottom-36 left-0 right-0 flex justify-center z-30">
              <Link href={slide.link}>
                <button className="cssbuttons-io" role="button">
                  <span>SHOP NOW</span>
                </button>
              </Link>
            </div>
          )}
        </div>
      ))}
      
      {/* Indicator dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-30">
        {heroData.slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`size-3 md:size-4 rounded-full transition-all duration-300 cursor-pointer ${
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