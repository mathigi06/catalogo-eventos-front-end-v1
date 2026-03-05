// src/shared/ui/SectionHeader.tsx
import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "./cn";

interface SectionHeaderProps extends PropsWithChildren {
  kicker?: string;
  align?: "left" | "center";
  description?: ReactNode;
  className?: string;
  tone?: "neutral" | "primary" | "success" | "warning";
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  kicker,
  children,
  align = "left",
  description,
  className,
  tone = "primary",
}) => {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  const kickerTone: Record<NonNullable<SectionHeaderProps["tone"]>, string> = {
    neutral: "text-slate-500",
    primary: "text-brand-primary",
    success: "text-brand-success",
    warning: "text-brand-warning",
  };

  return (
    <header className={cn("flex flex-col gap-2", alignClass, className)}>
      {kicker ? (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.14em]",
            kickerTone[tone]
          )}
        >
          {kicker}
        </p>
      ) : null}

      <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
        {children}
      </h2>

      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      ) : null}
    </header>
  );
};