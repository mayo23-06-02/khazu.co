"use client";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IconButton } from "../../Buttons/IconButton/IconButton";

interface RowActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  className?: string;
}

export function RowActions({ onEdit, onDelete, onView, className = "" }: RowActionsProps) {
  return (
    <div className={twMerge(clsx("flex items-center gap-0.5", className))}>
      {onView && (
        <IconButton label="View" variant="ghost" size="sm" onClick={onView}>
          <MdVisibility className="size-4" />
        </IconButton>
      )}
      {onEdit && (
        <IconButton label="Edit" variant="ghost" size="sm" onClick={onEdit}>
          <MdEdit className="size-4" />
        </IconButton>
      )}
      {onDelete && (
        <IconButton
          label="Delete"
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-danger hover:bg-danger-light"
        >
          <MdDelete className="size-4" />
        </IconButton>
      )}
    </div>
  );
}
