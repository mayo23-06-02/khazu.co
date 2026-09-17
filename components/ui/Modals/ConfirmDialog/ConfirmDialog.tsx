"use client";
import { Modal } from "../Modal/Modal";
import { Button } from "../../Buttons/Button/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: "danger" | "primary";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  variant = "primary",
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={variant} size="sm" loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-muted">{message}</p>
    </Modal>
  );
}
