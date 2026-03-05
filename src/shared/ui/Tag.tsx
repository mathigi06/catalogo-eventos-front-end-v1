// src/shared/ui/Tag.tsx
import React from "react";
import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "./cn";

type ChipVariant = "neutral" | "primary" | "success" | "warning" | "outline";
type ChipSize = "sm" | "md";

interface TagProps extends PropsWithChildren {
  variant?: ChipVariant;
  size?: ChipSize;

  /** ícone antes do texto (ex.: <Icon className="h-4 w-4" />) */
  leadingIcon?: ReactNode;

  /** se passar, vira “removable chip” */
  onRemove?: () => void;
  removeLabel?: string;

  /** se passar, vira chip clicável */
  onClick?: () => void;

  disabled?: boolean;
  className?: string;
}

const variants: Record<ChipVariant, string> = {
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
  primary: "bg-brand-primary/15 text-slate-900 border-brand-primary/30",
  success: "bg-brand-success/15 text-slate-900 border-brand-success/30",
  warning: "bg-brand-warning/30 text-slate-900 border-brand-warning/50",
  outline: "bg-transparent text-slate-700 border-slate-300",
};

const sizes: Record<ChipSize, { root: string; icon: string; remove: string }> = {
  sm: {
    root: "h-7 px-2.5 text-xs gap-1.5",
    icon: "h-3.5 w-3.5",
    remove: "h-5 w-5",
  },
  md: {
    root: "h-8 px-3 text-xs gap-2",
    icon: "h-4 w-4",
    remove: "h-6 w-6",
  },
};

export const Tag: React.FC<TagProps> = ({
  variant = "neutral",
  size = "md",
  leadingIcon,
  onRemove,
  removeLabel = "Remover",
  onClick,
  disabled,
  className,
  children,
}) => {
  const clickable = Boolean(onClick);
  const removable = Boolean(onRemove);

  // Se for clicável, renderiza como <button> (semântica + a11y)
  const Root: "button" | "span" = clickable ? "button" : "span";

  return (
    <Root
      type={clickable ? "button" : undefined}
      onClick={disabled ? undefined : onClick}
      disabled={clickable ? disabled : undefined}
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        "select-none whitespace-nowrap",
        "transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        disabled && "opacity-60 cursor-not-allowed",
        clickable && !disabled && "cursor-pointer hover:brightness-95 active:brightness-90",
        sizes[size].root,
        variants[variant],
        className
      )}
    >
      {leadingIcon ? (
        <span className={cn("inline-flex items-center", sizes[size].icon)} aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}

      <span className="leading-none">{children}</span>

      {removable ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onRemove?.();
          }}
          disabled={disabled}
          aria-label={removeLabel}
          className={cn(
            "ml-1 inline-flex items-center justify-center rounded-full",
            "transition",
            "text-slate-600 hover:bg-slate-900/5 active:bg-slate-900/10",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            "disabled:cursor-not-allowed",
            sizes[size].remove
          )}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M4.22 4.22a.75.75 0 011.06 0L10 8.94l4.72-4.72a.75.75 0 111.06 1.06L11.06 10l4.72 4.72a.75.75 0 11-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 11-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      ) : null}
    </Root>
  );
};