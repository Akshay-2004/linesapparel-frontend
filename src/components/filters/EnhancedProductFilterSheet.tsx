import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Filter } from "lucide-react";
import { Separator } from "../ui/separator";

type EnhancedProductFilterSheetProps = {
  availableVendors: string[];
  availableProductTypes: string[];
  priceRange: { min: number; max: number };
  selectedVendors: string[];
  setSelectedVendors: (vendors: string[]) => void;
  selectedProductTypes: string[];
  setSelectedProductTypes: (types: string[]) => void;
  currentPriceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  showAvailableOnly: boolean;
  setShowAvailableOnly: (show: boolean) => void;
};

export function EnhancedProductFilterSheet({
  availableVendors,
  availableProductTypes,
  priceRange,
  selectedVendors,
  setSelectedVendors,
  selectedProductTypes,
  setSelectedProductTypes,
  currentPriceRange,
  setPriceRange,
  showAvailableOnly,
  setShowAvailableOnly,
}: EnhancedProductFilterSheetProps) {
  const handleVendorChange = (vendor: string, checked: boolean) => {
    if (checked) {
      setSelectedVendors([...selectedVendors, vendor]);
    } else {
      setSelectedVendors(selectedVendors.filter(v => v !== vendor));
    }
  };

  const handleProductTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedProductTypes([...selectedProductTypes, type]);
    } else {
      setSelectedProductTypes(selectedProductTypes.filter(t => t !== type));
    }
  };

  const clearAllFilters = () => {
    setSelectedVendors([]);
    setSelectedProductTypes([]);
    setPriceRange([priceRange.min, priceRange.max]);
    setShowAvailableOnly(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'CAD',
    }).format(price);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {(selectedVendors.length > 0 || selectedProductTypes.length > 0 || showAvailableOnly) && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {selectedVendors.length + selectedProductTypes.length + (showAvailableOnly ? 1 : 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full overflow-auto p-6">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
        </SheetHeader>

        {/* Availability Filter */}
        <Separator className="bg-gray-200 my-4" />
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold">Availability</span>
          </div>
          <label className="flex items-center gap-3">
            <Switch
              checked={showAvailableOnly}
              onCheckedChange={setShowAvailableOnly}
            />
            <span>In Stock Only</span>
          </label>
        </div>

        {/* Product Type Filter */}
        {availableProductTypes.length > 0 && (
          <>
            <Separator className="bg-gray-200 my-4" />
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">Product Type</span>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-xs text-gray-500"
                  onClick={() => setSelectedProductTypes([])}
                >
                  Clear
                </Button>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {availableProductTypes.map((type) => (
                  <label key={type} className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedProductTypes.includes(type)}
                      onCheckedChange={(checked) => handleProductTypeChange(type, checked as boolean)}
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Vendor/Brand Filter */}
        {availableVendors.length > 0 && (
          <>
            <Separator className="bg-gray-200 my-4" />
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">Brand</span>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-xs text-gray-500"
                  onClick={() => setSelectedVendors([])}
                >
                  Clear
                </Button>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {availableVendors.map((vendor) => (
                  <label key={vendor} className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedVendors.includes(vendor)}
                      onCheckedChange={(checked) => handleVendorChange(vendor, checked as boolean)}
                    />
                    <span className="text-sm">{vendor}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Price Range Filter */}
        {priceRange.max > priceRange.min && (
          <>
            <Separator className="bg-gray-200 my-4" />
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">Price Range</span>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-xs text-gray-500"
                  onClick={() => setPriceRange([priceRange.min, priceRange.max])}
                >
                  Reset
                </Button>
              </div>
              <div className="px-2">
                <Slider
                  value={currentPriceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={priceRange.max}
                  min={priceRange.min}
                  step={Math.max(1, Math.floor((priceRange.max - priceRange.min) / 100))}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatPrice(currentPriceRange[0])}</span>
                  <span>{formatPrice(currentPriceRange[1])}</span>
                </div>
              </div>
            </div>
          </>
        )}

        <SheetFooter className="flex flex-col space-y-2 mt-6">
          <SheetClose asChild>
            <Button variant="outline" onClick={clearAllFilters} className="w-full">
              Clear All Filters
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button className="w-full">
              Apply Filters
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
