// src/shared/ui/Card.tsx
import type { ElementType, PropsWithChildren } from "react";
import { cn } from "./cn";

interface CardProps extends PropsWithChildren {
  as?: ElementType;
  className?: string;
  variant?: "elevated" | "outlined" | "subtle";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = ({
  as: Tag = "div",
  className,
  variant = "elevated",
  padding = "md",
  ...rest
}: CardProps) => {
  const base =
    "rounded-2xl transition";

  const variants = {
    elevated:
      "bg-white border border-slate-200 shadow-sm",
    outlined:
      "bg-white border border-slate-300",
    subtle:
      "bg-slate-50 border border-slate-100",
  } as const;

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  } as const;

  return (
    <Tag
      className={cn(base, variants[variant], paddings[padding], className)}
      {...rest}
    />
  );
};