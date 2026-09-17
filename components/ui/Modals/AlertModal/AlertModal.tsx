"use client";
import { Modal } from "../Modal/Modal";
import { Button } from "@/components/ui";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "warning",
}: AlertModalProps) {
  const footer = (
    <div className="flex gap-2 justify-end">
      <Button variant="ghost" size="sm" onClick={onClose}>
        {cancelLabel}
      </Button>
      <Button
        variant={variant === "danger" ? "danger" : "secondary"}
        size="sm"
        onClick={() => {
          onConfirm();
          onClose();
        }}
      >
        {confirmLabel}
      </Button>
    </div>
  );
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="sm"
    >
      <p className="text-gray-800/70">{message}</p>
    </Modal>
  );
}
