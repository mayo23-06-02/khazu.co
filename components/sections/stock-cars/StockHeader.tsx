"use client";

import {
  Container,
  Flex,
  Body,
  Button,
  Heading2,
  InputText,
} from "@/components/ui";
import { FaFilter, FaThLarge, FaList, FaSearch } from "react-icons/fa";

interface StockHeaderProps {
  count: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onToggleFilters: () => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function StockHeader({
  count,
  viewMode,
  onViewModeChange,
  onToggleFilters,
  search,
  onSearchChange,
}: StockHeaderProps) {
  return (
    <section className="py-6 ">
      <Container>
        <Flex justify="between" items="center" wrap>
          <div>
            <Heading2 className="">
              {count}{" "}
              <span className="text-2xl text-gray-500">cars available</span>
            </Heading2>
            <Flex items="center" className="mt-1">
              <Body muted size="sm">
                Eswatini
              </Body>
            </Flex>
          </div>
          <Flex gap="sm" items="center" className="mt-2 sm:mt-0 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
              <InputText
                placeholder="Search make or model..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
                fullWidth
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFilters}
              className="lg:hidden"
            >
              <FaFilter /> Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className={viewMode === "grid" ? "bg-dark/5" : ""}
            >
              <FaThLarge />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewModeChange("list")}
              className={viewMode === "list" ? "bg-dark/5" : ""}
            >
              <FaList />
            </Button>
          </Flex>
        </Flex>
      </Container>
    </section>
  );
}
