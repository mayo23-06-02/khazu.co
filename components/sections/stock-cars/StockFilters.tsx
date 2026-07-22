"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Heading5,
  Button,
  InputText,
  Small,
  Select,
  FormGroup,
  Checkbox,
  Heading4,
  ButtonGroup,
} from "@/components/ui";
import { FaSearch } from "react-icons/fa";

interface StockFiltersProps {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  onReset: () => void;
  onApplyMobile?: () => void;
}

export function StockFilters({
  filters,
  onFilterChange,
  onReset,
  onApplyMobile,
}: StockFiltersProps) {
  return (
    <Card padding="none" className="sticky top-[10%]">
      <CardHeader className="px-4 pt-2">
        <Flex justify="between" items="center">
          <Heading5>Filters</Heading5>
          <Button variant="primary" size="sm" onClick={onReset}>
            Reset
          </Button>
        </Flex>
      </CardHeader>
      <CardBody className="overflow-y-auto custom-scrollbar h-[80vh]">
        <div className="space-y-4 px-4">
          {/* Search Make */}
          <p className="text-gray-800 font-bold text-lg">Make</p>
          <InputText
            placeholder="Search make..."
            value={filters.make}
            onChange={(e) => onFilterChange("make", e.target.value)}
            icon={<FaSearch size={14} />}
            fullWidth
          />

          {/* Search Model */}
          <p className="text-gray-800 font-bold text-lg">Model</p>
          <InputText
            placeholder="Search model..."
            value={filters.model}
            onChange={(e) => onFilterChange("model", e.target.value)}
            icon={<FaSearch size={14} />}
            fullWidth
          />
          {/* search hint */}
          <p className="text-sm text-gray-800">
            Tip: Filter by make and model to find your perfect car instantly.
          </p>

          {/* Payment type */}
          <p className="text-gray-800 font-bold text-lg">Payment type</p>
          <div className=" bg-gray-100 grid-cols-2 grid rounded-md">
            <Button>Cash</Button>
            <Button variant="ghost">Installments</Button>
          </div>
          <div>
            <Small weight="medium" className="block mb-1">
              Price Range
            </Small>
            <Flex gap="sm">
              <InputText
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => onFilterChange("minPrice", e.target.value)}
                fullWidth
              />
              <InputText
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                fullWidth
              />
            </Flex>
          </div>

          <p className="text-gray-800 font-bold text-lg">Age</p>
          <ButtonGroup className="bg-gray-100 rounded-md">
            <Button>All</Button>
            <Button variant="ghost">Used</Button>
            <Button variant="ghost">New</Button>
          </ButtonGroup>
          {/* Year Range */}
          <div>
            <Small weight="medium" className="block mb-1">
              Year
            </Small>
            <Flex gap="sm">
              <Select
                options={[
                  { value: "", label: "Any" },
                  ...Array.from({ length: 15 }, (_, i) => ({
                    value: String(2026 - i),
                    label: String(2026 - i),
                  })),
                ]}
                value={filters.minYear}
                onChange={(e) => onFilterChange("minYear", e.target.value)}
                fullWidth
              />
            </Flex>
          </div>

          {/* Fuel Type */}
          <p className="text-gray-800 font-bold text-lg">Engine</p>

          <div>
            <Small weight="medium" className="block mb-1">
              Fuel Type
            </Small>
            <Select
              options={[
                { value: "", label: "All" },
                { value: "Diesel", label: "Diesel" },
                { value: "Petrol", label: "Petrol" },
                { value: "Electric", label: "Electric" },
                { value: "Hybrid", label: "Hybrid" },
              ]}
              value={filters.fuel}
              onChange={(e) => onFilterChange("fuel", e.target.value)}
              fullWidth
            />
          </div>

          {/* Transmission */}
          <div>
            <Small weight="medium" className="block mb-1">
              Transmission
            </Small>
            <Select
              options={[
                { value: "", label: "All" },
                { value: "Manual", label: "Manual" },
                { value: "Automatic", label: "Automatic" },
                { value: "CVT", label: "CVT" },
              ]}
              value={filters.transmission}
              onChange={(e) => onFilterChange("transmission", e.target.value)}
              fullWidth
            />
          </div>

          {/* Body Type */}
          <p className="text-gray-800 font-bold text-lg">Body & Milage</p>

          <div>
            <Small weight="medium" className="block mb-1">
              Body Type
            </Small>
            <Select
              options={[
                { value: "", label: "All" },
                { value: "SUV", label: "SUV" },
                { value: "Sedan", label: "Sedan" },
                { value: "Hatchback", label: "Hatchback" },
                { value: "Pickup", label: "Pickup" },
                { value: "Coupe", label: "Coupe" },
                { value: "Convertible", label: "Convertible" },
                { value: "Wagon", label: "Wagon" },
              ]}
              value={filters.bodyType}
              onChange={(e) => onFilterChange("bodyType", e.target.value)}
              fullWidth
            />
          </div>

          {/* Mileage Range */}
          <div>
            <Small weight="medium" className="block mb-1">
              Mileage
            </Small>
            <Select
              options={[
                { value: "", label: "Any" },
                { value: "10000", label: "Under 10,000 km" },
                { value: "30000", label: "Under 30,000 km" },
                { value: "50000", label: "Under 50,000 km" },
                { value: "100000", label: "Under 100,000 km" },
                { value: "150000", label: "Under 150,000 km" },
              ]}
              value={filters.maxMileage}
              onChange={(e) => onFilterChange("maxMileage", e.target.value)}
              fullWidth
            />
          </div>

          {/* Seller Type */}
          <p className="text-gray-800 font-bold text-lg">Dealers</p>

          <div>
            <Small weight="medium" className="block mb-1">
              Dealer Type
            </Small>
            <Select
              options={[
                { value: "", label: "All" },
                { value: "dealer", label: "Dealer" },
                { value: "private", label: "Private" },
              ]}
              value={filters.sellerType}
              onChange={(e) => onFilterChange("sellerType", e.target.value)}
              fullWidth
            />
          </div>

          {/* Toggles */}
          <FormGroup>
            <Checkbox
              label="Verified dealers only"
              checked={filters.verifiedOnly}
              onChange={(e) => onFilterChange("verifiedOnly", e.target.checked)}
            />
            <Checkbox
              label="Featured cars only"
              checked={filters.featuredOnly}
              onChange={(e) => onFilterChange("featuredOnly", e.target.checked)}
            />
          </FormGroup>

          {onApplyMobile && (
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={onApplyMobile}
              className="lg:hidden"
            >
              Apply Filters
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
