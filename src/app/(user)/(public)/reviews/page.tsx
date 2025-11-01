"use client";
import React, { useEffect, useState } from 'react';
import TestimonialCard from "@/components/cards/TestimonialCard";
import { useApi } from "@/hooks/useApi";
import { TestimonialsResponse } from "@/types/testimonial.interface";
import { ContentLoader } from "@/components/shared/Loader";
import { Star } from 'lucide-react';

export default function ReviewsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const { fetchData, loading, error } = useApi<TestimonialsResponse>();

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const response = await fetchData("/testimonials/published?limit=20", {
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
      <div className="min-h-screen bg-gray-50 py-12 md:py-20 lg:py-32">
        <div className="container mx-auto px-8 lg:px-4">
          <ContentLoader text="Loading reviews..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 md:py-20 lg:py-32">
        <div className="container mx-auto px-8 lg:px-4">
          <div className="text-center">
            <p className="text-gray-600">
              Unable to load reviews at the moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 lg:py-32">
      <div className="container mx-auto px-8 lg:px-4">
        {/* Page Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-8 mb-4">
            Customer Reviews
          </h1>
          <p className="text-secondary-8 text-lg md:text-xl max-w-3xl mx-auto">
            Real stories from real customers. Discover what our community has to say about their experience with Lines Apparel.
          </p>
        </div>

        {/* Testimonials Grid */}
        {testimonials && testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="h-full">
                <TestimonialCard
                  stars={testimonial.stars}
                  quote={testimonial.quote}
                  image={testimonial.imageUrl}
                  name={testimonial.name}
                  occupation={`${testimonial.occupation}, ${testimonial.location}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No reviews available at the moment.
            </p>
          </div>
        )}

        {/* Stats Section */}
        {testimonials && testimonials.length > 0 && (
          <div className="mt-16 md:mt-20 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl md:text-4xl font-bold text-primary-8 mb-2">
                  {testimonials.length}
                </div>
                <p className="text-secondary-8">Happy Customers</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl md:text-4xl font-bold text-primary-8 mb-2">
                  {Math.round(testimonials.reduce((acc, t) => acc + t.stars, 0) / testimonials.length * 10) / 10} <Star className="inline-block w-6 h-6 fill-yellow-400 text-yellow-400 ml-1 mb-2" />
                </div>
                <p className="text-secondary-8">Average Rating</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl md:text-4xl font-bold text-primary-8 mb-2">
                  100%
                </div>
                <p className="text-secondary-8">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
