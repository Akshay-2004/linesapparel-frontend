"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useBuyNowStore } from "@/store/buyNowStore";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Star, X, ChevronLeft, ChevronRight, Link, Heart } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useReviewService, IReviewResponse, IStarDistribution } from "@/services/review.service";
import SingleProductSkeleton from "@/components/skeletons/SingleProductSkeleton";
import { useUserDetails } from "@/hooks/useUserDetails";
import { useWishlistStore } from "@/store/wishlistStore";
interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: string;
        compareAtPrice: string | null;
        availableForSale: boolean;
        inventoryQuantity: number;
      };
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
}

interface CollectionData {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: string | null;
  products: {
    edges: Array<{
      node: Product;
    }>;
  };
}

interface OrderData {
  line_items: {
    variant_id: string;
    quantity: number;
  }[];
  customer: {
    email: string;
  };
  shipping_address: {
    first_name: string;
    last_name: string;
    address1: string;
    city: string;
    province: string;
    country: string;
    zip: string;
  };
  email: string;
}
interface Review {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  imageUrls?: string[];
  verifiedBuyer: boolean;
  foundHelpful: number;
  notHelpful: number;
  createdAt: string;
}

interface ReviewResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface StarDistribution {
  distribution: Record<string, number>;
  percentageDistribution: Record<string, number>;
  breakdown: Array<{
    stars: number;
    count: number;
    percentage: number;
  }>;
}

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const { fetchData, data, loading, error } = useApi<Product | null>();
  const { user, isAuthenticated } = useUserDetails();
  const {
    getProductReviews,
    getProductStarDistribution,
    createReview,
    toggleHelpful,
    loading: reviewLoading,
    error: reviewError,
    uploadProgress
  } = useReviewService();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  // Removed cartQuantity because 'quantity' does not exist on CartState
  const { addToCart } = useCartStore();

  // Review-related state
  const [reviews, setReviews] = useState<IReviewResponse | null>(null);
  const [starDistribution, setStarDistribution] = useState<IStarDistribution | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
    images: null as FileList | null
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Image preview state
  const [imagePreview, setImagePreview] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
    reviewerName: string;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
    reviewerName: ''
  });

  // Extract numeric ID from Shopify product ID
  const extractProductId = (shopifyId: string): string => {
    // Extract number from "gid://shopify/Product/9748044251426"
    const matches = shopifyId.match(/\/Product\/(\d+)/);
    return matches ? matches[1] : shopifyId;
  };
  const { setBuyNow } = useBuyNowStore()

  // Memoize the product fetch function
  const getProduct = useCallback(async () => {
    if (!params.id) return;

    try {
      await fetchData(`/shopify/products/handle/${params.id}/`, {
        method: "GET",
      });
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  }, [params.id]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  // Fetch reviews when product data is available
  useEffect(() => {
    const fetchReviews = async () => {
      if (!data?.id) return;

      const productId = extractProductId(data.id);
      setReviewsLoading(true);

      try {
        // Fetch reviews and star distribution
        const [reviewsData, distributionData] = await Promise.all([
          getProductReviews(productId),
          getProductStarDistribution(productId)
        ]);

        setReviews(reviewsData);
        setStarDistribution(distributionData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error("Failed to load reviews. Please try again.");
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [data?.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data?.id || reviewForm.rating === 0 || !reviewForm.comment.trim()) {
      toast.error("Please provide a rating and comment.");
      return;
    }

    setSubmittingReview(true);

    try {
      const productId = extractProductId(data.id);

      await createReview({
        productId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        images: reviewForm.images
      });

      // Reset form
      setReviewForm({ rating: 0, comment: '', images: null });
      setShowReviewForm(false);

      // Refresh reviews and distribution
      const [reviewsData, distributionData] = await Promise.all([
        getProductReviews(productId),
        getProductStarDistribution(productId)
      ]);

      setReviews(reviewsData);
      setStarDistribution(distributionData);

      toast.success("Your review has been submitted successfully.");
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error?.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleHelpfulClick = async (reviewId: string, helpful: boolean) => {
    try {
      await toggleHelpful(reviewId, helpful);

      // Refresh reviews to show updated counts
      if (data?.id) {
        const productId = extractProductId(data.id);
        const reviewsData = await getProductReviews(productId);
        setReviews(reviewsData);
      }

      toast.success(`Review marked as ${helpful ? 'helpful' : 'not helpful'}.`);
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      toast.error("Failed to update review. Please try again.");
    }
  };

  // Show loading state
  if (loading) {
    return <SingleProductSkeleton />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          {typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : typeof error === "string"
              ? error
              : "Failed to load product"}
        </p>
        <Button onClick={() => (window.location.href = "/")}>
          Return to Home
        </Button>
      </div>
    );
  }

  // Handle no data state
  if (!data) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Product Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => (window.location.href = "/")}>
          Browse Products
        </Button>
      </div>
    );
  }

  // Extract values from API data with null checks
  const productImages = data.images?.edges?.map((edge) => edge.node.url) || [];
  const variants = data.variants?.edges?.map((edge) => edge.node) || [];
  const sizes = [
    ...new Set(data.options?.find((opt) => opt.name === "Size")?.values || []),
  ];
  const colors = [
    ...new Set(data.options?.find((opt) => opt.name === "Color")?.values || []),
  ];
  const price = variants[0]?.price || "0.00";

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast("Please select a size");
      return;
    }
    if (colors.length > 0 && !selectedVariant) {
      toast("Please select a color");
      return;
    }
    if (quantity < 1) {
      toast("Please select a valid quantity");
      return;
    }

    // Find the selected variant ID based on size and color
    const selectedVariantObj = variants.find(
      (variant) =>
        variant.title.includes(selectedSize) &&
        (colors.length === 0 || variant.title.includes(selectedVariant))
    );

    if (!selectedVariantObj) {
      toast("Selected variant not available");
      return;
    }

    // Extract the numeric ID from the Shopify variant ID
    const cleanVariantId = selectedVariantObj.id.replace(
      "gid://shopify/ProductVariant/",
      ""
    );

    try {
      await addToCart({
        productId: data.id,
        variantId: cleanVariantId,
        quantity,
        price: Number(selectedVariantObj.price),
        title: data.title,
      });
      toast("Added to cart!");
    } catch (err) {
      toast("Failed to add to cart");
    }


  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      toast("Please select a size");
      return;
    }
    if (colors.length > 0 && !selectedVariant) {
      toast("Please select a color");
      return;
    }
    if (quantity < 1) {
      toast("Please select a valid quantity");
      return;
    }

    // Find the selected variant ID based on size and color
    const selectedVariantId = variants.find(
      (variant) =>
        variant.title.includes(selectedSize) &&
        (colors.length === 0 || variant.title.includes(selectedVariant))
    )?.id;

    if (!selectedVariantId) {
      toast("Selected variant not available");
      return;
    }

    // Extract the numeric ID from the Shopify variant ID
    const cleanVariantId = selectedVariantId.replace(
      "gid://shopify/ProductVariant/",
      ""
    );

    setBuyNow(cleanVariantId, quantity);
    // Redirect to checkout page

    router.push(`/checkout`);
  };

  const handleWriteReviewClick = () => {
    // Always toggle the form state to show login prompt if not authenticated
    setShowReviewForm(!showReviewForm);
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated()) {
      toast.error("Please log in to add items to your wishlist");
      return;
    }

    if (!user?.id || !data?.id) {
      toast.error("Unable to add to wishlist");
      return;
    }

    try {
      const productId = extractProductId(data.id);
      
      if (isInWishlist(productId)) {
        await removeFromWishlist(user.id, productId);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(user.id, productId);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleImagePreview = (images: string[], index: number, reviewerName: string) => {
    setImagePreview({
      isOpen: true,
      images,
      currentIndex: index,
      reviewerName
    });
  };

  const handleNextImage = () => {
    setImagePreview(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const handlePrevImage = () => {
    setImagePreview(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
    }));
  };

  const closeImagePreview = () => {
    setImagePreview({
      isOpen: false,
      images: [],
      currentIndex: 0,
      reviewerName: ''
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Shop all</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">{data.productType || 'Products'}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="text-gray-500">{data.title}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section - Product Info (previously on right) */}
        <div className="lg:w-2/5">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            {data.title}
          </h1>

          <div className="flex items-center mb-4">
            <div className="text-3xl font-bold text-black">${price}</div>
            <div className="mx-3 h-8 border-l border-gray-300"></div>
            <div className="flex items-center">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${i < Math.floor(reviews?.averageRating || 0) ? "fill-current" : "fill-gray-300"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                ({reviews?.averageRating ? reviews.averageRating.toFixed(1) : '0.0'}) • {reviews?.totalReviews || 0} reviews
              </span>
            </div>
          </div>

          <p className="text-gray-600 mb-6">{data.description}</p>

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium">Select Size</label>
                <button className="text-sm text-gray-600 underline">
                  SIZE CHART &gt;
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "h-10 w-10 flex items-center justify-center rounded-full border",
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="mb-6 flex-1">
                <label className="block font-medium mb-2">Color</label>
                <Select
                  value={selectedVariant}
                  onValueChange={setSelectedVariant}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity selector remains the same */}
            <div className="mb-6">
              <label className="block font-medium mb-2">Qty</label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-16"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <Button onClick={handleAddToCart} className="flex-1">
                Add To Cart
              </Button>
              <Button 
                onClick={handleWishlistToggle}
                variant="outline"
                className={`${isInWishlist(data?.id ? extractProductId(data.id) : '') ? 'bg-red-50 border-red-300 text-red-600' : ''}`}
              >
                <Heart 
                  className={`h-4 w-4 ${isInWishlist(data?.id ? extractProductId(data.id) : '') ? 'fill-current' : ''}`} 
                />
              </Button>
            </div>
            <Button onClick={handleBuyNow} variant="outline" className="w-full">
              Buy Now
            </Button>
          </div>

          {/* Additional details */}
          <Accordion
            type="single"
            collapsible
            className="border-t border-gray-200"
          >
            <AccordionItem value="details" className="border-b border-gray-200">
              <AccordionTrigger className="py-4">Details</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {data.description}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="shipping"
              className="border-b border-gray-200"
            >
              <AccordionTrigger className="py-4">Shipping</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Shipping information will be available soon.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="returns">
              <AccordionTrigger className="py-4">Returns</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Returns information will be available soon.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right Section - Product Gallery and Reviews */}
        <div className="lg:w-3/5">
          {/* Product Gallery - Now on right side, full width */}
          <div className="w-full">
            {/* Main Image */}
            <div className="mb-4 overflow-hidden bg-gray-50 rounded-md">
              <Image
                src={productImages[activeImageIndex]}
                alt={data.title}
                width={600}
                height={800}
                className="w-full h-auto object-contain"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  className={cn(
                    "min-w-[80px] h-20 border rounded overflow-hidden",
                    activeImageIndex === index
                      ? "border-black"
                      : "border-gray-200"
                  )}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={img}
                    alt={`${data.title} view ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Ratings & Reviews Section - below gallery */}
          <div className="w-full mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">Ratings & Reviews</h2>
                <Star className="h-6 w-6" />
              </div>
              <Button
                onClick={handleWriteReviewClick}
                variant="outline"
                size="sm"
              >
                Write a Review
              </Button>
            </div>

            {/* Login Prompt for Unauthenticated Users */}
            {!isAuthenticated() && showReviewForm && (
              <div className="mb-8 p-6 border rounded-lg bg-blue-50 border-blue-200 relative">
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="absolute top-3 right-3 p-1 hover:bg-blue-100 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-blue-600" />
                </button>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Sign in to write a review
                  </h3>
                  <p className="text-blue-700 mb-4">
                    You must be logged in to write a product review.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/auth/signin">
                      <Button variant="default" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button variant="outline" size="sm">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Review Form - Only show if authenticated */}
            {isAuthenticated() && showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="mb-8 p-4 border rounded-lg bg-background">
                <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>

                {/* Rating Selection */}
                <div className="mb-4">
                  <Label htmlFor="rating" className="block mb-2">Rating *</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        className={cn(
                          "h-8 w-8 transition-colors",
                          star <= reviewForm.rating ? "text-amber-400" : "text-gray-300"
                        )}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <Label htmlFor="comment" className="block mb-2">Your Review *</Label>
                  <Textarea
                    id="comment"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your thoughts about this product..."
                    rows={4}
                    className="w-full"
                  />
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                  <Label htmlFor="images" className="block mb-2">Add Photos (Optional)</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setReviewForm(prev => ({ ...prev, images: e.target.files }))}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">You can upload up to 5 images</p>

                  {/* Upload Progress */}
                  {submittingReview && uploadProgress > 0 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={submittingReview || reviewLoading}
                    className="flex-1"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                    disabled={submittingReview}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading reviews...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row gap-8 my-8">
                  {/* Rating Summary */}
                  <div className="md:w-1/4">
                    <div className="text-center mb-4 flex items-end justify-center">
                      <div className="text-6xl font-bold">
                        {reviews?.averageRating ? reviews.averageRating.toFixed(1) : '0.0'}
                      </div>
                      <div className="text-lg text-gray-800">/5</div>
                    </div>

                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-5 w-5",
                            i < Math.floor(reviews?.averageRating || 0) ? "text-amber-400 fill-current" : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>

                    <div className="text-center text-lg text-gray-500 mb-6">
                      Based on {reviews?.totalReviews || 0} reviews
                    </div>
                  </div>

                  {/* Rating Bars */}
                  <div className="md:w-3/4">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center mb-2">
                        <div className="w-12 text-sm text-gray-600">{star} stars</div>
                        <div className="flex-1 mx-4 h-5 overflow-hidden">
                          <Progress
                            value={starDistribution?.percentageDistribution[star] || 0}
                            className="h-full bg-gray-200"
                          />
                        </div>
                        <div className="w-12 text-sm text-gray-600">
                          {starDistribution?.distribution[star] || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Reviews */}
                <div>
                  <h3 className="text-xl font-bold mb-4">
                    Customer Reviews ({reviews?.totalReviews || 0})
                  </h3>

                  <div className="space-y-4">
                    {reviews?.reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-200 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                            {review.userId.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{review.userId.name}</span>
                                <span className="text-gray-500">• {new Date(review.createdAt).toLocaleDateString()}</span>
                                {review.verifiedBuyer && (
                                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Verified Buyer</span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-4 w-4",
                                      i < review.rating ? "text-amber-400 fill-current" : "text-gray-300"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3">{review.comment}</p>

                        <div className="flex justify-between items-end">
                          {/* Review Images */}
                          <div className="flex-1">
                            {review.imageUrls && review.imageUrls.length > 0 && (
                              <div className="flex gap-2 mb-4">
                                {review.imageUrls.map((imageUrl, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleImagePreview(review.imageUrls!, index, review.userId.name)}
                                    className="w-16 h-16 bg-gray-100 rounded overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
                                  >
                                    <Image
                                      src={imageUrl}
                                      alt="Review photo"
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                    />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Helpful Buttons */}
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleHelpfulClick(review._id, true)}
                              className="flex items-center gap-1 text-gray-500 hover:text-green-600 disabled:opacity-50"
                              disabled={reviewLoading}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                              </svg>
                              <span>{review.foundHelpful}</span>
                            </button>
                            <button
                              onClick={() => handleHelpfulClick(review._id, false)}
                              className="flex items-center gap-1 text-gray-500 hover:text-red-600 disabled:opacity-50"
                              disabled={reviewLoading}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01-.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                              </svg>
                              <span>{review.notHelpful}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {reviews && reviews.pagination.totalPages > 1 && (
                    <button className="mt-4 py-2 px-4 border border-gray-300 rounded text-gray-700 font-medium">
                      Load More Reviews
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={imagePreview.isOpen} onOpenChange={closeImagePreview}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>
              Review Photos by {imagePreview.reviewerName}
            </DialogTitle>
          </DialogHeader>

          <div className="relative">
            {imagePreview.images.length > 0 && (
              <>
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview.images[imagePreview.currentIndex]}
                    alt={`Review photo ${imagePreview.currentIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Navigation arrows */}
                {imagePreview.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Image indicator */}
                {imagePreview.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {imagePreview.currentIndex + 1} / {imagePreview.images.length}
                  </div>
                )}

                {/* Thumbnail navigation */}
                {imagePreview.images.length > 1 && (
                  <div className="flex gap-2 mt-4 justify-center overflow-x-auto pb-2">
                    {imagePreview.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setImagePreview(prev => ({ ...prev, currentIndex: index }))
                        }
                        className={cn(
                          "min-w-[60px] h-15 border-2 rounded overflow-hidden transition-all",
                          index === imagePreview.currentIndex
                            ? "border-blue-500 opacity-100"
                            : "border-gray-300 opacity-70 hover:opacity-100"
                        )}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          width={60}
                          height={60}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function setCart(cleanVariantId: string, quantity: number) {
  // Store the cart in localStorage for the checkout page to read
  const cart = [
    {
      variantId: cleanVariantId,
      quantity,
    },
  ];
  if (typeof window !== "undefined") {
    localStorage.setItem("checkout_cart", JSON.stringify(cart));
  }
}

export default ProductPage;

