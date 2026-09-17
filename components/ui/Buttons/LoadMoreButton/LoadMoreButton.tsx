"use client";
import { Button } from "../Button/Button";

interface LoadMoreButtonProps {
  onClick: () => void;
  loading?: boolean;
  label?: string;
  className?: string;
}

export function LoadMoreButton({ onClick, loading = false, label = "Load more", className = "" }: LoadMoreButtonProps) {
  return (
    <Button variant="outline" size="md" onClick={onClick} loading={loading} className={className}>
      {loading ? "Loading\u2026" : label}
    </Button>
  );
}
