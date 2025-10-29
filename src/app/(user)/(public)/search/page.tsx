'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { ProductCard } from '@/components/cards/ProductCard';
import { ProductSkeleton } from '@/components/skeletons/ProductSkeleton';
import { EnhancedProductFilterSheet } from '@/components/filters/EnhancedProductFilterSheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

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

interface SearchResponse {
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

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchData, loading } = useApi<SearchResponse>();
  
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [tempSearchQuery, setTempSearchQuery] = useState(searchQuery);
  
  // Filter states
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('RELEVANCE');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cursor, setCursor] = useState<string | null>(null);

  const performSearch = useCallback(async (newQuery?: string, resetPage = false) => {
    try {
      const query = newQuery !== undefined ? newQuery : searchQuery;
      
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (selectedVendors.length > 0) params.append('vendor', selectedVendors[0]); // API takes single vendor
      if (selectedProductTypes.length > 0) params.append('productType', selectedProductTypes[0]); // API takes single type
      if (showAvailableOnly) params.append('available', 'true');
      if (priceRange[0] > 0) params.append('priceMin', priceRange[0].toString());
      if (priceRange[1] < 1000) params.append('priceMax', priceRange[1].toString());
      if (sortBy !== 'RELEVANCE') params.append('sortKey', sortBy);
      if (!resetPage && cursor) params.append('after', cursor);
      params.append('limit', '20');

      const response = await fetchData(`/shopify/products/search?${params.toString()}`, {
        method: 'GET'
      });

      if (response) {
        setSearchResults(response);
        if (resetPage) {
          setCurrentPage(1);
          setCursor(null);
        }
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error('Failed to search products');
    }
  }, [searchQuery, selectedVendors, selectedProductTypes, showAvailableOnly, priceRange, sortBy, cursor, fetchData]);

  const handleSearch = () => {
    setSearchQuery(tempSearchQuery);
    const params = new URLSearchParams();
    if (tempSearchQuery) params.append('q', tempSearchQuery);
    router.push(`/search?${params.toString()}`);
    performSearch(tempSearchQuery, true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = useCallback(() => {
    performSearch(undefined, true);
  }, [performSearch]);

  const handleNextPage = () => {
    if (searchResults?.pageInfo.hasNextPage && searchResults.pageInfo.endCursor) {
      setCursor(searchResults.pageInfo.endCursor);
      setCurrentPage(prev => prev + 1);
      performSearch();
    }
  };

  const handlePrevPage = () => {
    // For previous page, we'd need to implement reverse pagination
    // For now, just reset to first page
    setCursor(null);
    setCurrentPage(1);
    performSearch(undefined, true);
  };

  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      setSearchQuery(initialQuery);
      setTempSearchQuery(initialQuery);
      performSearch(initialQuery, true);
    } else {
      // Load popular products or recent products if no search query
      performSearch('', true);
    }
  }, [searchParams, performSearch]); // Add performSearch as dependency

  useEffect(() => {
    handleFilterChange();
  }, [selectedVendors, selectedProductTypes, priceRange, sortBy, showAvailableOnly]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.back()}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-3xl font-bold">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex space-x-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search for products..."
            value={tempSearchQuery}
            onChange={(e) => setTempSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          Search
        </Button>
      </div>

      {/* Filters and Sort */}
      <div className="flex justify-between items-center mb-6">
        <EnhancedProductFilterSheet
          availableVendors={searchResults?.filters.availableVendors || []}
          availableProductTypes={searchResults?.filters.availableProductTypes || []}
          priceRange={searchResults?.filters.priceRange || { min: 0, max: 1000 }}
          selectedVendors={selectedVendors}
          setSelectedVendors={setSelectedVendors}
          selectedProductTypes={selectedProductTypes}
          setSelectedProductTypes={setSelectedProductTypes}
          currentPriceRange={priceRange}
          setPriceRange={setPriceRange}
          showAvailableOnly={showAvailableOnly}
          setShowAvailableOnly={setShowAvailableOnly}
        />
        
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RELEVANCE">Relevance</SelectItem>
              <SelectItem value="PRICE">Price: Low to High</SelectItem>
              <SelectItem value="TITLE">Name: A-Z</SelectItem>
              <SelectItem value="CREATED_AT">Newest First</SelectItem>
              <SelectItem value="BEST_SELLING">Best Selling</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      {searchResults && (
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {searchResults.products.length > 0 
              ? `Showing ${searchResults.products.length} products`
              : 'No products found'
            }
          </p>
          {searchResults.products.length > 0 && (
            <p className="text-sm text-gray-500">
              Page {currentPage}
            </p>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Search Results */}
      {!loading && searchResults && (
        <>
          {searchResults.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {searchResults.products.map((product) => (
                <Link
                  href={`/product/${product.handle}`}
                  key={product.id}
                  className="block"
                >
                  <ProductCard
                    name={product.title}
                    variant={product.variants.edges[0]?.node.title || ''}
                    price={parseFloat(product.variants.edges[0]?.node.priceV2.amount || '0')}
                    originalPrice={
                      product.variants.edges[0]?.node.compareAtPriceV2 
                        ? parseFloat(product.variants.edges[0].node.compareAtPriceV2.amount)
                        : undefined
                    }
                    image={product.images.edges[0]?.node.url || '/placeholder.jpg'}
                    showButton={true}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `We couldn't find any products matching "${searchQuery}". Try adjusting your search or filters.`
                    : 'No products are currently available.'
                  }
                </p>
              </div>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setTempSearchQuery('');
                    setSelectedVendors([]);
                    setSelectedProductTypes([]);
                    setPriceRange([0, 1000]);
                    setShowAvailableOnly(false);
                    router.push('/search');
                    performSearch('', true);
                  }}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {searchResults.products.length > 0 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
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
                disabled={!searchResults.pageInfo.hasNextPage}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6" />
          <div className="h-12 bg-gray-200 rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
