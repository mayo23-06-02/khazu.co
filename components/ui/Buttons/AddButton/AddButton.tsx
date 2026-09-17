"use client";
import { MdAdd } from "react-icons/md";
import { Button } from "../Button/Button";

interface AddButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function AddButton({ onClick, label = "Add", className = "" }: AddButtonProps) {
  return (
    <Button
      variant="primary"
      size="sm"
      onClick={onClick}
      leadingIcon={<MdAdd className="size-3.5" />}
      className={className}
    >
      {label}
    </Button>
  );
}
