"use client";
import { ReactNode } from "react";
import { Grid } from "@/components/ui/Layout/Grid/Grid";

interface CarCardGridProps {
  children: ReactNode;
  className?: string;
}

export function CarCardGrid({ children, className = "" }: CarCardGridProps) {
  return (
    <Grid cols={4} gap="md" className={className}>
      {children}
    </Grid>
  );
}
