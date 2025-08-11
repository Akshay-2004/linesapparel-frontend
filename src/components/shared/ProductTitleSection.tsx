import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface ProductTitleSectionProps {
  topText?: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}

const ProductTitleSection: React.FC<ProductTitleSectionProps> = ({
  topText,
  title,
  description,
  buttonText,
  buttonLink = "#",
}) => {
  return (
    <div className="lg:text-start">
      {topText && (
        <h2 className="text-lg font-semibold leading-normal text-primary-6">
          {topText}
        </h2>
      )}
      <p className="my-2 text-3xl font-extrabold tracking-tight text-primary-8 leading-8 sm:text-4xl">
        {title}
      </p>
      <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-lg font-normal text-wrap max-w-3xl leading-relaxed text-secondary-8">
          {description}
        </p>
        {buttonText && (
          <div className="flex md:justify-end">
            <Button
              variant="outline"
              className="font-semibold text-primary hover:text-primary-7"
            >
              <Link href={buttonLink}>{buttonText}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTitleSection;
