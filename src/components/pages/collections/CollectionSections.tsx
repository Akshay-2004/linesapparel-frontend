"use client";
import { useApi } from "@/hooks/useApi";
import { ProductCard } from "@/components/cards/ProductCard";
import { ProductSkeleton } from "@/components/skeletons/ProductSkeleton";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProductTitleSection from "@/components/shared/ProductTitleSection";
import { ProductFilterSheet } from "@/components/filters/ProductFilterSheet";
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

const ITEMS_PER_PAGE = 12;

const CollectionSections = ({ handle }: { handle: string }) => {
  const { fetchData, data, loading } = useApi<CollectionData>();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOne, setFilterOne] = useState<string[]>([]);
  const [filterTwo, setFilterTwo] = useState<string>("all");
  const [filterFive, setFilterFive] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("default");
  useEffect(() => {
    const fetchCollection = async () => {
      await fetchData(`/shopify/collections/handle/${handle}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    };
    fetchCollection();
  }, [handle, fetchData]);
  console.log("Collection Data:", data);
  // Calculate pagination values
  const totalProducts = data?.products.edges.length || 0;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts =
    data?.products.edges.slice(startIndex, endIndex) || [];

  if (loading) {
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

  if (!data) {
    return <div>No collection found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <ProductTitleSection
          description={data.description}
          title={data.title}
        />
      </div>
      <div className="my-10 flex justify-between">
        <ProductFilterSheet
          filterOne={filterOne}
          setFilterOne={setFilterOne}
          filterTwo={filterTwo}
          setFilterTwo={setFilterTwo}
          filterFive={filterFive}
          setFilterFive={setFilterFive}
        />
        <div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] shadow-none border-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="shadow-none border-0">
              <SelectItem value="default">Sort by</SelectItem>
              <SelectItem value="priceLowHigh">Price: Low to High</SelectItem>
              <SelectItem value="priceHighLow">Price: High to Low</SelectItem>
              <SelectItem value="nameAsc">Name: A-Z</SelectItem>
              <SelectItem value="nameDesc">Name: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end mx-auto">
        <p className="font-normal ">Showing 8 of 100</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProducts.map(({ node: product }) => (
          <Link
            href={`/product/${product.handle}`}
            key={product.id}
            className="block"
          >
            <ProductCard
              name={product.title}
              variant={product.variants.edges[0]?.node.title || ""}
              price={parseFloat(product.variants.edges[0]?.node.price || "0")}
              image={product.images.edges[0]?.node.url || "/placeholder.jpg"}
              showButton={true}
            />
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
              window.scrollTo(0, 0);
            }}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              window.scrollTo(0, 0);
            }}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CollectionSections;
