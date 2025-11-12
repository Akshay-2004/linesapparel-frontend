import Image, { StaticImageData } from "next/image";
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
interface BannerCardProps {
  image: string | StaticImageData;
  topText: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}
const BannerCard = ({
  topText,
  buttonLink,
  buttonText,
  description,
  image,
  title,
}: BannerCardProps) => {
  const isStaticImage = typeof image !== "string";

  return (
    <section className="w-full h-full py-2 rounded-md">
      <div className="w-full h-full overflow-hidden bg-white shadow-md rounded-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
          <div className="order-1 overflow-hidden h-full relative min-h-[200px] md:min-h-0">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
          <div className="order-2 flex flex-col justify-center p-6">
            <span className="text-secondary-7 text-base font-semibold leading-normal mb-2">
              {topText}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-700 self-stretch justify-start text-base font-normal text-Color-Scheme-1-Text mb-4">
              {description}
            </p>
            <Link
              href={buttonLink || "#"}
              className="flex items-center text-primary-6 font-semibold hover:underline"
            >
              <span className="my-auto">{buttonText || "Shop Now"}</span>
              <ChevronRight className="my-auto" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerCard;
