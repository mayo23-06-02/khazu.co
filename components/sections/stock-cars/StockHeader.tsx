"use client";

import {
  Container,
  Flex,
  Heading1,
  Body,
  Separator,
  Button,
  Heading2,
} from "@/components/ui";
import { FaFilter, FaThLarge, FaList } from "react-icons/fa";

interface StockHeaderProps {
  count: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onToggleFilters: () => void;
}

export function StockHeader({
  count,
  viewMode,
  onViewModeChange,
  onToggleFilters,
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
          <Flex gap="sm" items="center" className="mt-2 sm:mt-0">
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
