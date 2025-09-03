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
}: ProductCardProps) {
  return (
    <Card className="w-full pb-0 p-4   custom-shadow hover:scale-105 transition-transform duration-200 "  >
      <div className="overflow-hidden aspect-[3/4] w-full">
        <Image
          src={image}
          alt={name}
          width={400}
          height={500}
          className="object-cover w-full h-full"
          priority
        />
      </div>
      <CardContent className="px-0 w-full">
        <div className="flex flex-col items-start gap-0 font-['Roboto']">
          <div className="flex justify-between w-full">
            <h3 className="text-lg font-semibold leading-relaxed">{name}</h3>
            <span className="text-2xl font-semibold leading-9">
              ${price.toFixed(2)}
            </span>
          </div>
          <p className="text-sm font-normal leading-tight text-gray-600">
            {variant}
          </p>
          {showButton && (
            <Button
              className="mt-3 border border-primary-5 rounded-none w-full text-primary-5 text-sm font-medium font-['Inter'] leading-normal"
              variant="outline"
            >
              View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
