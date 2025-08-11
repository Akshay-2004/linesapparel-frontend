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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { HiOutlineMenuAlt1 } from "react-icons/hi";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "../ui/separator";

type ProductFilterSheetProps = {
  filterOne: string[];
  setFilterOne: (v: string[] | ((prev: string[]) => string[])) => void;
  filterTwo: string;
  setFilterTwo: (v: string) => void;
  filterFive: string;
  setFilterFive: (v: string) => void;
};

export function ProductFilterSheet({
  filterOne,
  setFilterOne,
  filterTwo,
  setFilterTwo,
  filterFive,
  setFilterFive,
}: ProductFilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <HiOutlineMenuAlt1 />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full overflow-auto p-6">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        {/* Category: Checkbox group */}
        <Separator className="bg-black my-4" />

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Category</span>
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-xs"
              onClick={() => setFilterOne([])}
            >
              Clear
            </Button>
          </div>
          <div className="space-y-2">
            {["T-Shirts", "Jeans", "Dresses", "Jackets", "Shoes"].map(
              (option) => (
                <label key={option} className="flex items-center gap-2">
                  <Checkbox
                    checked={filterOne.includes(option)}
                    onCheckedChange={(checked) => {
                      setFilterOne((prev: string[]) =>
                        checked
                          ? [...prev, option]
                          : prev.filter((item: string) => item !== option)
                      );
                    }}
                  />
                  <span>{option}</span>
                </label>
              )
            )}
          </div>
        </div>
        <Separator className="bg-black my-4" />

        {/* Brand: Radio group */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Brand</span>
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-xs"
              onClick={() => setFilterTwo("all")}
            >
              Clear
            </Button>
          </div>
          <RadioGroup value={filterTwo} onValueChange={setFilterTwo}>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="all" />
              <span>All</span>
            </label>
            {["Nike", "Adidas", "Levi's", "Zara", "H&M"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <RadioGroupItem value={option} />
                <span>{option}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
        <Separator className="bg-black my-4" />

        {/* Search by Keyword */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Search</span>
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-xs"
              onClick={() => setFilterFive("")}
            >
              Clear
            </Button>
          </div>
          <Input
            placeholder="Search for clothing"
            value={filterFive}
            onChange={(e) => setFilterFive(e.target.value)}
          />
        </div>
        <Separator className="bg-black my-4" />

        {/* In Stock: Switch */}
        <div className="mb-4">
          <div className="font-semibold mb-2">In Stock Only</div>
          <Switch />
        </div>
        <Separator className="bg-black my-4" />

        {/* Sort By: Select */}
        <div className="mb-4">
          <div className="font-semibold mb-2">Sort By</div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_low_high">Price: Low to High</SelectItem>
              <SelectItem value="price_high_low">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className="bg-black my-4" />

        {/* Price Range: Slider */}
        <div className="mb-4">
          <div className="font-semibold mb-2">Price Range</div>
          <Slider defaultValue={[0]} max={100} step={1} />
        </div>
        <Separator className="bg-black my-4" />

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary">Clear all</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>Apply</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
