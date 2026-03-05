// src/shared/ui/Modal.tsx
import React, { useEffect, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PropsWithChildren, ReactNode } from "react";
import { cn } from "./cn";

type ModalSize = "sm" | "md" | "lg" | "xl";

interface ModalProps extends PropsWithChildren {
  onClose: () => void;
  className?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  size?: ModalSize;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

export const Modal: React.FC<ModalProps> = ({
  onClose,
  className,
  children,
  ariaLabelledBy,
  ariaDescribedBy,
  size = "lg",
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    lastActiveElementRef.current = document.activeElement as HTMLElement | null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    setTimeout(() => dialogRef.current?.focus(), 0);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      lastActiveElementRef.current?.focus?.();
    };
  }, [onClose]);

  const trapFocus = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;

    const root = dialogRef.current;
    if (!root) return;

    const focusable = root.querySelectorAll<HTMLElement>(
      [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(",")
    );

    if (!focusable.length) {
      e.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (e.shiftKey) {
      if (!active || active === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition-opacity"
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              onClose();
              return;
            }
            trapFocus(e);
          }}
          className={cn(
            "w-full",
            sizeClasses[size],
            "rounded-2xl border border-slate-200 bg-white shadow-xl outline-none",
            "animate-[modalIn_180ms_ease-out]",
            className
          )}
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

// Helpers (MUI-like)
export function ModalHeader({
  title,
  description,
  right,
  className,
  id,
}: {
  title: ReactNode;
  description?: ReactNode;
  right?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 border-b border-slate-200 p-6", className)}>
      <div className="min-w-0">
        <h2 id={id} className="text-lg font-semibold text-slate-900">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export function ModalBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function ModalFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-end gap-2 border-t border-slate-200 p-6", className)}
      {...props}
    />
  );
}