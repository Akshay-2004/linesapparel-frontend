"use client";
import React, { useEffect, useState } from "react";
import TestimonialCard from "@/components/cards/TestimonialCard";
import Carousel from "@/components/ui/carousel";
import { useApi } from "@/hooks/useApi";
import { TestimonialsResponse } from "@/types/testimonial.interface";
import { ContentLoader } from "@/components/shared/Loader";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const { fetchData, loading, error } = useApi<TestimonialsResponse>();

  // Dynamic content for the section
  const sectionContent = {
    heading: "What Our Customers Are Saying",
    subheading:
      "Real reviews from real people. See why fashion lovers choose us for their everyday style and bold looks.",
  };

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const response = await fetchData("/testimonials/published?limit=12", {
          method: "GET",
          timeout: 30000,
        });

        if (response && response.testimonials) {
          setTestimonials(response.testimonials);
        }
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      }
    };

    loadTestimonials();
  }, [fetchData]);

  if (loading) {
    return (
      <section className="bg-white py-12 md:py-20 lg:py-32">
        <div className="container mx-auto px-8 lg:px-4">
          <ContentLoader text="Loading testimonials..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-12 md:py-20 lg:py-32">
        <div className="container mx-auto px-8 lg:px-4">
          <div className="text-center">
            <p className="text-gray-600">
              Unable to load testimonials at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12 md:py-20 lg:py-32">
      <div className="container mx-auto px-8 lg:px-4">
        {/* Section Header */}
        <div className="mx-auto text-left mb-8 md:mb-12 md:grid md:grid-cols-2">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-8 mb-3 md:mb-6">
              {sectionContent.heading}
            </h2>
            <p className="text-secondary-8 text-base md:text-lg leading-normal">
              {sectionContent.subheading}
            </p>
          </div>
        </div>

        {/* Carousel for all screens */}
        <Carousel cardsPerView={{ base: 1, md: 3, lg: 3 }}>
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial._id}
              stars={testimonial.stars}
              quote={testimonial.quote}
              image={testimonial.imageUrl}
              name={testimonial.name}
              occupation={`${testimonial.occupation}, ${testimonial.location}`}
            />
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
