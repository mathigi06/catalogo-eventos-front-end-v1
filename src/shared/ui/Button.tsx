// src/shared/ui/Button.tsx
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "success" | "warning" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    PropsWithChildren {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;

  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 " +
  "select-none whitespace-nowrap " +
  "rounded-xl border font-medium " +
  "transition outline-none " +
  "focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "border-brand-primary/40 bg-brand-primary text-white shadow-sm hover:brightness-95 active:brightness-90",
  secondary:
    "border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 active:bg-slate-100",
  success:
    "border-brand-success/40 bg-brand-success text-white shadow-sm hover:brightness-95 active:brightness-90",
  warning:
    "border-brand-warning/50 bg-brand-warning text-slate-900 shadow-sm hover:brightness-98 active:brightness-95",
  danger:
    "border-red-500/30 bg-red-500 text-white shadow-sm hover:brightness-95 active:brightness-90",
  ghost:
    "border-transparent bg-transparent text-slate-900 hover:bg-slate-900/5 active:bg-slate-900/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      fullWidth,
      className,
      type = "button",
      loading,
      startIcon,
      endIcon,
      disabled,
      children,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
        {...rest}
      >
        {loading ? <Spinner /> : startIcon ? <span aria-hidden="true">{startIcon}</span> : null}
        <span>{children}</span>
        {endIcon ? <span aria-hidden="true">{endIcon}</span> : null}
      </button>
    );
  }
);

Button.displayName = "Button";