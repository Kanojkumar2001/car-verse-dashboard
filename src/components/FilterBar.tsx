
import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

interface FilterBarProps {
  onFilterChange?: (filters: any) => void;
  showPriceRange?: boolean;
  showFuelType?: boolean;
  showSearch?: boolean;
}

const FilterBar = ({ 
  onFilterChange,
  showPriceRange = true,
  showFuelType = true,
  showSearch = true
}: FilterBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000000]); // 0 to 1 crore in rupees
  const [fuelType, setFuelType] = useState<string>("all");
  const [transmission, setTransmission] = useState<string>("all");
  const [carType, setCarType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    applyFilters();
  };
  
  const handleFuelTypeChange = (value: string) => {
    setFuelType(value);
    applyFilters();
  };
  
  const handleTransmissionChange = (value: string) => {
    setTransmission(value);
    applyFilters();
  };
  
  const handleCarTypeChange = (value: string) => {
    setCarType(value);
    applyFilters();
  };
  
  const handleSearch = () => {
    applyFilters();
  };
  
  const resetFilters = () => {
    setPriceRange([0, 10000000]);
    setFuelType("all");
    setTransmission("all");
    setCarType("all");
    setSearchQuery("");
    applyFilters();
  };
  
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        priceRange,
        fuelType,
        transmission,
        carType,
        searchQuery
      });
    }
  };
  
  // Format price label (in lakhs and crores)
  const formatPriceLabel = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString('en-IN')}`;
    }
  };
  
  return (
    <div className="filter-container p-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        {showSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cars, brands or models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9"
            />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <X /> : <SlidersHorizontal />}
          </Button>
          
          <Button 
            variant="secondary"
            size="sm"
            onClick={resetFilters}
            className="hidden sm:flex"
          >
            Reset
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          {showPriceRange && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Price Range: {formatPriceLabel(priceRange[0])} - {formatPriceLabel(priceRange[1])}
              </label>
              <Slider
                defaultValue={priceRange}
                min={0}
                max={10000000}
                step={100000}
                value={priceRange}
                onValueChange={handlePriceChange}
                className="mt-6"
              />
            </div>
          )}
          
          {showFuelType && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Fuel Type</label>
              <ToggleGroup 
                type="single" 
                value={fuelType}
                onValueChange={(value) => value && handleFuelTypeChange(value)}
                className="justify-start"
              >
                <ToggleGroupItem value="all" aria-label="All Fuel Types">
                  All
                </ToggleGroupItem>
                <ToggleGroupItem value="electric" aria-label="Electric">
                  🔌 Electric
                </ToggleGroupItem>
                <ToggleGroupItem value="hybrid" aria-label="Hybrid">
                  ⚡ Hybrid
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Transmission</label>
            <Select 
              value={transmission}
              onValueChange={handleTransmissionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Transmissions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transmissions</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="automatic">Automatic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Car Type</label>
            <Select 
              value={carType}
              onValueChange={handleCarTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="hatchback">Hatchback</SelectItem>
                <SelectItem value="coupe">Coupe</SelectItem>
                <SelectItem value="convertible">Convertible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
