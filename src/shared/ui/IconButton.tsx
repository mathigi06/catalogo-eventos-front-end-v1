// src/shared/ui/IconButton.tsx
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { forwardRef } from "react";
import { cn } from "./cn";

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    PropsWithChildren {
  size?: "sm" | "md";
  variant?: "ghost" | "filled";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      size = "md",
      variant = "ghost",
      className,
      type = "button",
      children,
      disabled,
      ...rest
    },
    ref
  ) => {
    const sizeClasses = size === "sm" ? "h-9 w-9" : "h-10 w-10"; // 36/40px

    const base =
      "inline-flex items-center justify-center " +
      "rounded-full " +
      "transition select-none outline-none " +
      "focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
      "disabled:opacity-60 disabled:cursor-not-allowed";

    const variants = {
      ghost:
        "bg-transparent text-slate-700 " +
        "hover:bg-slate-900/5 active:bg-slate-900/10",
      filled:
        "border border-slate-200 bg-white text-slate-800 shadow-sm " +
        "hover:bg-slate-50 active:bg-slate-100",
    } as const;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(base, sizeClasses, variants[variant], className)}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";