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
    <section className="h-full w-full py-2 rounded-md">
      <div className="h-full w-full overflow-hidden bg-white shadow-md rounded-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <div className="order-1 h-full">
            {isStaticImage ? (
              <Image
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={image}
                alt={title}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            )}
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
