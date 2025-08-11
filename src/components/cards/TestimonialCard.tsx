import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import UserAvatar from "@/components/shared/UserAvatar";

interface TestimonialCardProps {
  stars: number;
  quote: string;
  image?: string;
  name: string;
  occupation: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  stars,
  quote,
  image,
  name,
  occupation,
}) => {
  const renderStars = () => {
    const fullStars = Math.floor(stars);
    const hasHalfStar = stars % 1 !== 0;
    const emptyStars = 5 - Math.ceil(stars);

    return (
      <div className="flex items-center gap-1">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <div className="relative w-4 h-4">
            <Star className="w-4 h-4 text-gray-300 absolute" />
            <div className="overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <Star key={index} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full h-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0 space-y-4">
        {/* Star Rating */}
        <div className="flex items-center">
          {renderStars()}
        </div>

        {/* Quote */}
        <blockquote className="text-gray-700 text-base leading-relaxed">
          "{quote}"
        </blockquote>

        {/* User Info */}
        <div className="flex items-center gap-3 pt-2">
          <UserAvatar name={name} imageUrl={image} size="md" />
          <div>
            <p className="font-semibold text-gray-900 text-sm">{name}</p>
            <p className="text-gray-600 text-xs">{occupation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;