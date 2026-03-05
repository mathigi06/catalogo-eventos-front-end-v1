// src/shared/ui/ChipToggle.tsx
import React from "react";
import type { PropsWithChildren, ReactNode } from "react";

type ChipVariant = "neutral" | "primary" | "success" | "warning" | "outline";
type ChipSize = "sm" | "md";

export interface ChipToggleProps extends PropsWithChildren {
  pressed: boolean;
  onPressedChange: (next: boolean) => void;

  variant?: ChipVariant;
  size?: ChipSize;

  leadingIcon?: ReactNode;
  disabled?: boolean;
  className?: string;

  /** opcional: label melhor pra leitores de tela */
  ariaLabel?: string;
}

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center rounded-full border font-medium " +
  "select-none whitespace-nowrap transition outline-none " +
  "focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

const sizes: Record<ChipSize, { root: string; icon: string }> = {
  sm: { root: "h-7 px-2.5 text-xs gap-1.5", icon: "h-3.5 w-3.5" },
  md: { root: "h-8 px-3 text-xs gap-2", icon: "h-4 w-4" },
};

const unpressedStyles: Record<ChipVariant, string> = {
  neutral: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/60",
  primary: "bg-brand-primary/15 text-slate-900 border-brand-primary/30 hover:bg-brand-primary/20",
  success: "bg-brand-success/15 text-slate-900 border-brand-success/30 hover:bg-brand-success/20",
  warning: "bg-brand-warning/30 text-slate-900 border-brand-warning/50 hover:bg-brand-warning/35",
  outline: "bg-transparent text-slate-700 border-slate-300 hover:bg-slate-900/5",
};

const pressedStyles: Record<ChipVariant, string> = {
  neutral: "bg-slate-900 text-white border-slate-900 hover:brightness-95",
  primary: "bg-brand-primary text-white border-brand-primary hover:brightness-95",
  success: "bg-brand-success text-white border-brand-success hover:brightness-95",
  warning: "bg-brand-warning text-slate-900 border-brand-warning hover:brightness-98",
  outline: "bg-slate-900 text-white border-slate-900 hover:brightness-95",
};

export const ChipToggle: React.FC<ChipToggleProps> = ({
  pressed,
  onPressedChange,
  variant = "neutral",
  size = "md",
  leadingIcon,
  disabled,
  className,
  ariaLabel,
  children,
}) => {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onPressedChange(!pressed)}
      className={cn(
        base,
        sizes[size].root,
        pressed ? pressedStyles[variant] : unpressedStyles[variant],
        !disabled && "active:brightness-95",
        className
      )}
    >
      {leadingIcon ? (
        <span className={cn("inline-flex items-center", sizes[size].icon)} aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      <span className="leading-none">{children}</span>
    </button>
  );
};