"use client";
import { MdDeleteOutline } from "react-icons/md";
import { Button } from "../Button/Button";

interface DeleteButtonProps {
  onClick: () => void;
  label?: string;
  loading?: boolean;
  className?: string;
}

export function DeleteButton({ onClick, label = "Delete", loading, className = "" }: DeleteButtonProps) {
  return (
    <Button
      variant="danger"
      size="sm"
      onClick={onClick}
      loading={loading}
      leadingIcon={<MdDeleteOutline className="size-3.5" />}
      className={className}
    >
      {label}
    </Button>
  );
}
