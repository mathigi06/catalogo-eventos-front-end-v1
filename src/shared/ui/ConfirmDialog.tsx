import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "./Modal";
import { Button } from "./Button";

type ConfirmTone = "primary" | "success" | "warning" | "danger";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: React.ReactNode;

  confirmText?: string;
  cancelText?: string;

  tone?: ConfirmTone;
  loading?: boolean;

  onConfirm: () => void | Promise<void>;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  tone = "primary",
  loading,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmVariant =
    tone === "danger"
      ? "danger"
      : tone === "success"
        ? "success"
        : tone === "warning"
          ? "warning"
          : "primary";

  return (
    <Modal onClose={onClose} ariaLabelledBy="confirm-title" ariaDescribedBy="confirm-desc" size="sm">
      <ModalHeader
        id="confirm-title"
        title={title}
        description={description ? <span id="confirm-desc">{description}</span> : undefined}
      />
      <ModalBody>
        {/* Se quiser conteúdo extra no futuro, já tem o corpo */}
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={confirmVariant as ConfirmTone} onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}