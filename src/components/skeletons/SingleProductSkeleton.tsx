import { Skeleton } from "@/components/ui/skeleton";

const SingleProductSkeleton = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section */}
        <div className="lg:w-2/5">
          <Skeleton className="h-10 w-3/4 mb-6" /> {/* Title */}
          <Skeleton className="h-8 w-24 mb-4" /> {/* Price */}
          <Skeleton className="h-20 w-full mb-6" /> {/* Description */}
          {/* Size Selection */}
          <div className="mb-6">
            <Skeleton className="h-6 w-32 mb-2" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-full" />
              ))}
            </div>
          </div>
          {/* Color and Quantity */}
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-16" />
          </div>
          {/* Buttons */}
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-10 w-full mb-6" />
          {/* Accordion skeleton */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-t border-gray-200 py-4">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div className="lg:w-3/5">
          <Skeleton className="w-full aspect-[3/4] mb-4 rounded-md" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductSkeleton;
