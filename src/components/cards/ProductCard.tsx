import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";

type ProductCardProps = {
  name: string;
  variant: string;
  price: number;
  image: string | StaticImageData;
  showButton?: boolean;
  // Optional props for backward compatibility
  originalPrice?: number;
  compareAtPrice?: number;
  rating?: number;
  isNew?: boolean;
  discount?: number;
};

export function ProductCard({
  name,
  variant,
  price,
  image,
  showButton = true,
  compareAtPrice,
}: ProductCardProps) {
  return (
    <Card className="w-full rounded-sm pb-0 py-0 border-0 shadow-none hover:scale-105 transition-transform duration-200 "  >
      <CardContent className="px-0 w-full">
      <div className="overflow-hidden aspect-square w-full shadow-lg rounded-md mb-2">
        <Image
          src={image}
          alt={name}
          width={400}
          height={500}
          className="object-cover w-full rounded-md h-full"
          priority
        />
      </div>
        <div className="flex flex-col items-start gap-0 font-['Roboto']">
          <div className="flex flex-col w-full">
            <h3 
              className="text-sm font-medium leading-relaxed truncate" 
              title={name}
            >
              {name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium leading-9">
                ${price.toFixed(2)}
              </span>
              {compareAtPrice && compareAtPrice > price && (
                <span className="text-base text-gray-500 line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          {/* {variant && variant !== "Default Title" && (
            <p className="text-sm font-normal leading-tight text-gray-600">
              {variant}
            </p>
          )} */}
          {/* {showButton && (
            <Button
              className="mt-3 rounded-none w-full text-primary-7 text-base font-medium leading-normal"
              variant="outline"
            >
              View
            </Button>
          )} */}
        </div>
      </CardContent>
    </Card>
  );
}
