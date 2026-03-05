// src/shared/ui/ChipGroup.tsx
import React, { useMemo, useState } from "react";
import type { PropsWithChildren, ReactNode } from "react";

export interface ChipGroupProps extends PropsWithChildren {
  className?: string;

  /** quantos chips mostrar antes de colapsar (ex.: 6). Se não passar, não colapsa. */
  maxVisible?: number;

  /** rótulo do chip de expand */
  expandLabel?: (hiddenCount: number) => ReactNode;

  /** rótulo do chip de collapse */
  collapseLabel?: ReactNode;

  /** começa expandido */
  defaultExpanded?: boolean;

  /** espaçamento entre chips */
  gapClassName?: string;
}

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * ChipGroup não “cria chips”; ele organiza children (Tag/ChipToggle/etc).
 * Use junto com <Tag/> e <ChipToggle/>.
 */
export const ChipGroup: React.FC<ChipGroupProps> = ({
  className,
  maxVisible,
  expandLabel = (n) => `+${n}`,
  collapseLabel = "Menos",
  defaultExpanded = false,
  gapClassName,
  children,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const items = useMemo(() => React.Children.toArray(children), [children]);

  const shouldCollapse = typeof maxVisible === "number" && maxVisible >= 0;
  const hiddenCount = shouldCollapse && !expanded ? Math.max(0, items.length - maxVisible) : 0;

  const visibleItems =
    shouldCollapse && !expanded ? items.slice(0, maxVisible) : items;

  return (
    <div className={cn("flex flex-wrap items-center", gapClassName ?? "gap-2", className)}>
      {visibleItems}

      {shouldCollapse && hiddenCount > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
            "bg-slate-100 text-slate-700 border-slate-200",
            "transition hover:bg-slate-200/60 active:bg-slate-200",
            "outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          )}
        >
          {expandLabel(hiddenCount)}
        </button>
      ) : null}

      {shouldCollapse && expanded && items.length > (maxVisible ?? 0) ? (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
            "bg-transparent text-slate-700 border-slate-300",
            "transition hover:bg-slate-900/5 active:bg-slate-900/10",
            "outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          )}
        >
          {collapseLabel}
        </button>
      ) : null}
    </div>
  );
};