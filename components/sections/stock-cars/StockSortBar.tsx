"use client";

import { Card, Flex, Small, Select } from "@/components/ui";

interface StockSortBarProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  resultCount: number;
}

export function StockSortBar({
  sortBy,
  onSortChange,
  resultCount,
}: StockSortBarProps) {
  return (
    <Card padding="none" className="mb-4 px-6 py-2">
      <Flex justify="between" items="center" wrap>
        <Flex gap="sm" items="center">
          <Small muted>Sort by:</Small>
          <Select
            options={[
              { value: "relevance", label: "Relevance" },
              { value: "price_low", label: "Price: Low to High" },
              { value: "price_high", label: "Price: High to Low" },
              { value: "year_new", label: "Year: Newest first" },
              { value: "mileage_low", label: "Mileage: Lowest first" },
            ]}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-40"
          />
        </Flex>
        <Small muted className="text-xs">
          {resultCount} results
        </Small>
      </Flex>
    </Card>
  );
}
