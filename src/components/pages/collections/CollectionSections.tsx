"use client";
import { useApi } from "@/hooks/useApi";
import { ProductCard } from "@/components/cards/ProductCard";
import { ProductSkeleton } from "@/components/skeletons/ProductSkeleton";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProductTitleSection from "@/components/shared/ProductTitleSection";
import { EnhancedProductFilterSheet } from "@/components/filters/EnhancedProductFilterSheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  vendor: string;
  availableForSale: boolean;
  images: {
    edges: Array<{
      node: {
        id: string;
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
        priceV2: {
          amount: string;
          currencyCode: string;
        };
        compareAtPriceV2?: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
      };
    }>;
  };
}

interface CollectionData {
  collection: {
    id: string;
    handle: string;
    title: string;
    description: string;
    image?: string;
  };
  products: Product[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  filters: {
    availableVendors: string[];
    availableProductTypes: string[];
    priceRange: { min: number; max: number };
  };
}

const ITEMS_PER_PAGE = 20;

const CollectionSections = ({ handle }: { handle: string }) => {
  const { fetchData, data, loading } = useApi<CollectionData>();
  const [currentPage, setCurrentPage] = useState(1);
  const [cursor, setCursor] = useState<string | null>(null);
  
  // Enhanced filter states
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>("COLLECTION_DEFAULT");

  const fetchCollectionData = async (resetPage = false) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters
      if (selectedVendors.length > 0) params.append('vendor', selectedVendors[0]);
      if (selectedProductTypes.length > 0) params.append('productType', selectedProductTypes[0]);
      if (showAvailableOnly) params.append('available', 'true');
      if (priceRange[0] > 0) params.append('priceMin', priceRange[0].toString());
      if (priceRange[1] < 1000) params.append('priceMax', priceRange[1].toString());
      if (sortBy !== 'COLLECTION_DEFAULT') params.append('sortKey', sortBy);
      if (!resetPage && cursor) params.append('after', cursor);
      params.append('limit', ITEMS_PER_PAGE.toString());

      const response = await fetchData(`/shopify/collections/handle/${handle}/products?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resetPage) {
        setCurrentPage(1);
        setCursor(null);
      }
    } catch (error) {
      console.error('Error fetching collection data:', error);
    }
  };

  useEffect(() => {
    fetchCollectionData(true);
  }, [handle]);

  useEffect(() => {
    // Refetch when filters change
    fetchCollectionData(true);
  }, [selectedVendors, selectedProductTypes, priceRange, showAvailableOnly, sortBy]);

  const handleNextPage = () => {
    if (data?.pageInfo.hasNextPage && data.pageInfo.endCursor) {
      setCursor(data.pageInfo.endCursor);
      setCurrentPage(prev => prev + 1);
      fetchCollectionData();
    }
  };

  const handlePrevPage = () => {
    // For previous page, reset to first page for simplicity
    setCursor(null);
    setCurrentPage(1);
    fetchCollectionData(true);
  };

  console.log("Collection Data:", data);

  if (loading && !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!data || !data.collection) {
    return <div>No collection found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <ProductTitleSection
          description={data.collection.description}
          title={data.collection.title}
        />
      </div>
      
      <div className="my-10 flex justify-between items-center">
        <EnhancedProductFilterSheet
          availableVendors={data.filters?.availableVendors || []}
          availableProductTypes={data.filters?.availableProductTypes || []}
          priceRange={data.filters?.priceRange || { min: 0, max: 1000 }}
          selectedVendors={selectedVendors}
          setSelectedVendors={setSelectedVendors}
          selectedProductTypes={selectedProductTypes}
          setSelectedProductTypes={setSelectedProductTypes}
          currentPriceRange={priceRange}
          setPriceRange={setPriceRange}
          showAvailableOnly={showAvailableOnly}
          setShowAvailableOnly={setShowAvailableOnly}
        />
        
        <div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] shadow-none border-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="shadow-none border-0">
              <SelectItem value="COLLECTION_DEFAULT">Collection Default</SelectItem>
              <SelectItem value="PRICE">Price: Low to High</SelectItem>
              <SelectItem value="TITLE">Name: A-Z</SelectItem>
              <SelectItem value="CREATED">Newest First</SelectItem>
              <SelectItem value="BEST_SELLING">Best Selling</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <p className="font-normal text-gray-600">
          {data.products.length > 0 
            ? `Showing ${data.products.length} products`
            : 'No products found'
          }
        </p>
        {data.products.length > 0 && (
          <p className="text-sm text-gray-500">
            Page {currentPage}
          </p>
        )}
      </div>
      
      {data.products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.products.map((product) => (
              <Link
                href={`/product/${product.handle}`}
                key={product.id}
                className="block"
              >
                <ProductCard
                  name={product.title}
                  variant={product.variants.edges[0]?.node.title || ""}
                  price={parseFloat(product.variants.edges[0]?.node.priceV2.amount || "0")}
                  originalPrice={
                    product.variants.edges[0]?.node.compareAtPriceV2 
                      ? parseFloat(product.variants.edges[0].node.compareAtPriceV2.amount)
                      : undefined
                  }
                  image={product.images.edges[0]?.node.url || "/placeholder.jpg"}
                  showButton={true}
                />
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <span className="text-sm text-gray-600">
              Page {currentPage}
            </span>

            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={!data.pageInfo.hasNextPage}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters to see more products.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedVendors([]);
              setSelectedProductTypes([]);
              setPriceRange([data.filters?.priceRange?.min || 0, data.filters?.priceRange?.max || 1000]);
              setShowAvailableOnly(false);
              setSortBy('COLLECTION_DEFAULT');
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default CollectionSections;
