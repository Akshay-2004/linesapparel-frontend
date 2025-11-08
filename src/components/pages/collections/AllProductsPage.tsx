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

interface AllProductsData {
  products: Product[];
  totalCount: number;
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

const AllProductsPage = () => {
  const { fetchData, data, loading } = useApi<AllProductsData>();
  const [currentPage, setCurrentPage] = useState(1);
  const [cursor, setCursor] = useState<string | null>(null);

  // Enhanced filter states
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>("RELEVANCE");

  const fetchAllProducts = async (resetPage = false, overrides: Partial<{
    selectedVendors: string[];
    selectedProductTypes: string[];
    priceRange: [number, number];
    showAvailableOnly: boolean;
    sortBy: string;
  }> = {}) => {
    const vendors = overrides.selectedVendors ?? selectedVendors;
    const types = overrides.selectedProductTypes ?? selectedProductTypes;
    const range = overrides.priceRange ?? priceRange;
    const available = overrides.showAvailableOnly ?? showAvailableOnly;
    const sort = overrides.sortBy ?? sortBy;

    const params = new URLSearchParams();

    // Add filters
    if (vendors.length > 0) params.append('vendor', vendors.join(','));
    if (types.length > 0) params.append('productType', types.join(','));
    if (available) params.append('available', 'true');
    if (range[0] > 0) params.append('priceMin', range[0].toString());
    if (range[1] < 1000) params.append('priceMax', range[1].toString());
    if (sort !== 'RELEVANCE') params.append('sortKey', sort);
    if (!resetPage && cursor) params.append('after', cursor);
    params.append('first', ITEMS_PER_PAGE.toString());

    console.log('Fetching products with params:', params.toString());

    const response = await fetchData(`/shopify/products/all?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resetPage) {
      setCurrentPage(1);
      setCursor(null);
    }
  };

  useEffect(() => {
    fetchAllProducts(true);
  }, []);

  // Add useEffect to refetch when sortBy changes
  useEffect(() => {
    console.log('SortBy changed:', sortBy);
    fetchAllProducts(true);
  }, [sortBy]);


  const handleNextPage = () => {
    if (data?.pageInfo?.hasNextPage && data?.pageInfo?.endCursor) {
      setCursor(data.pageInfo.endCursor);
      setCurrentPage(prev => prev + 1);
      fetchAllProducts();
    }
  };

  const handlePrevPage = () => {
    if (data?.pageInfo?.hasPreviousPage && data?.pageInfo?.startCursor) {
      setCursor(data.pageInfo.startCursor);
      setCurrentPage(prev => prev - 1);
      fetchAllProducts();
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <ProductTitleSection
          description="Discover our complete collection of premium products"
          title="All Products"
          topText="Explore Everything"
        />
      </div>

      <div className="my-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <EnhancedProductFilterSheet
            selectedVendors={selectedVendors}
            setSelectedVendors={setSelectedVendors}
            selectedProductTypes={selectedProductTypes}
            setSelectedProductTypes={setSelectedProductTypes}
            currentPriceRange={priceRange}
            setPriceRange={setPriceRange}
            showAvailableOnly={showAvailableOnly}
            setShowAvailableOnly={setShowAvailableOnly}
            availableVendors={data?.filters?.availableVendors || []}
            availableProductTypes={data?.filters?.availableProductTypes || []}
            priceRange={data?.filters?.priceRange || { min: 0, max: 1000 }}
            onApply={() => {
              console.log('Applying filters');
              fetchAllProducts(true);
            }}
          />
          {(selectedVendors.length > 0 || selectedProductTypes.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000 || showAvailableOnly) && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedVendors([]);
                setSelectedProductTypes([]);
                setPriceRange([0, 1000]);
                setShowAvailableOnly(false);
                fetchAllProducts(true, { selectedVendors: [], selectedProductTypes: [], priceRange: [0, 1000], showAvailableOnly: false });
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] shadow-none border-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="shadow-none border-0">
              <SelectItem value="RELEVANCE">Relevance</SelectItem>
              <SelectItem value="TITLE">Name: A-Z</SelectItem>
              <SelectItem value="CREATED_AT">Newest First</SelectItem>
              <SelectItem value="PRICE">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="font-normal text-gray-600">
          {data?.totalCount && data.totalCount > 0
            ? `Showing ${data.products.length} of ${data.totalCount} products`
            : 'No products found'
          }
        </p>
        {data?.products && data.products.length > 0 && (
          <p className="text-sm text-gray-500">
            Page {currentPage}
          </p>
        )}
      </div>

      {data?.products && data.products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.products.map((product: Product) => (
              <Link
                href={`/product/${product.handle}`}
                key={product.id}
                className="block"
              >
                <ProductCard
                  name={product.title}
                  variant={product.variants.edges[0]?.node.title || ""}
                  price={parseFloat(product.variants.edges[0]?.node.priceV2.amount || "0")}
                  compareAtPrice={product.variants.edges[0]?.node.compareAtPriceV2 ? parseFloat(product.variants.edges[0]?.node.compareAtPriceV2.amount) : undefined}
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
              disabled={!data?.pageInfo?.hasPreviousPage}
            >
              Previous
            </Button>

            <span className="text-sm text-gray-600">
              Page {currentPage}
            </span>

            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={!data?.pageInfo?.hasNextPage}
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
              setPriceRange([0, 1000]);
              setShowAvailableOnly(false);
              fetchAllProducts(true, { selectedVendors: [], selectedProductTypes: [], priceRange: [0, 1000], showAvailableOnly: false });
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllProductsPage;