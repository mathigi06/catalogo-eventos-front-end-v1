import React, { useEffect, useMemo, useRef, useState, useId } from "react";
import { cn } from "./cn";

type Option = { value: string; label: string; disabled?: boolean };

type RoundedSelectProps = {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
  className?: string;
};

export function RoundedSelect({
  id,
  label,
  placeholder = "Selecione...",
  value,
  onChange,
  options,
  disabled,
  className,
}: RoundedSelectProps) {
  const reactId = useId();
  const buttonId = id ?? `select-${reactId}`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  useEffect(() => {
    function onDocKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onDocKeyDown);
    return () => document.removeEventListener("keydown", onDocKeyDown);
  }, [open]);

  function openMenu() {
    if (disabled) return;
    setOpen(true);

    const idx = options.findIndex((o) => o.value === value && !o.disabled);
    setActiveIndex(idx >= 0 ? idx : options.findIndex((o) => !o.disabled));

    setTimeout(() => listRef.current?.focus(), 0);
  }

  function closeMenu() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function commit(val: string) {
    onChange(val);
    closeMenu();
    buttonRef.current?.focus();
  }

  function onButtonKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      open ? closeMenu() : openMenu();
    }
  }

  function onListKeyDown(e: React.KeyboardEvent) {
    if (!open) return;

    const nextEnabledFrom = (start: number, dir: 1 | -1) => {
      let i = start;
      for (let step = 0; step < options.length; step++) {
        i = (i + dir + options.length) % options.length;
        if (!options[i].disabled) return i;
      }
      return -1;
    };

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => nextEnabledFrom(prev < 0 ? 0 : prev, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => nextEnabledFrom(prev < 0 ? 0 : prev, -1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(options.findIndex((o) => !o.disabled));
    } else if (e.key === "End") {
      e.preventDefault();
      for (let i = options.length - 1; i >= 0; i--) {
        if (!options[i].disabled) {
          setActiveIndex(i);
          break;
        }
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const opt = options[activeIndex];
      if (opt && !opt.disabled) commit(opt.value);
    }
  }

  return (
    <div ref={rootRef} className={cn("w-full", className)}>
      {label ? (
        <label htmlFor={buttonId} className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}

      <div className="relative">
        <button
          id={buttonId}
          ref={buttonRef}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => (open ? closeMenu() : openMenu())}
          onKeyDown={onButtonKeyDown}
          className={cn(
            "flex w-full items-center justify-between gap-3",
            "rounded-xl border bg-white px-3 py-2 text-left text-sm text-slate-900 shadow-sm",
            "transition outline-none",
            "focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            "border-slate-300 focus-visible:border-brand-primary",
            disabled ? "cursor-not-allowed opacity-60 bg-slate-50" : "cursor-pointer hover:bg-slate-50"
          )}
        >
          <span className={selected ? "text-slate-900" : "text-slate-400"}>
            {selected ? selected.label : placeholder}
          </span>

          <svg
            className={cn("h-4 w-4 text-slate-500 transition", open && "rotate-180")}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {open ? (
          <ul
            ref={listRef}
            tabIndex={-1}
            role="listbox"
            aria-activedescendant={activeIndex >= 0 ? `opt-${buttonId}-${activeIndex}` : undefined}
            onKeyDown={onListKeyDown}
            className={cn(
              "absolute z-50 mt-2 w-full",
              "rounded-2xl border border-slate-200 bg-white p-1 shadow-lg",
              "outline-none",
              "max-h-64 overflow-auto"
            )}
          >
            {options.length === 0 ? (
              <li className="rounded-xl px-3 py-2 text-sm text-slate-500">Sem opções</li>
            ) : (
              options.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isActive = idx === activeIndex;

                return (
                  <li
                    id={`opt-${buttonId}-${idx}`}
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => !opt.disabled && commit(opt.value)}
                    className={cn(
                      "flex items-center justify-between gap-3",
                      "rounded-xl px-3 py-2 text-sm",
                      opt.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                      isActive ? "bg-slate-900/5" : "bg-transparent",
                      !opt.disabled && !isActive && "hover:bg-slate-900/5"
                    )}
                  >
                    <span className={cn(isSelected ? "font-medium text-slate-900" : "text-slate-700")}>
                      {opt.label}
                    </span>

                    {isSelected ? (
                      <span className="text-slate-500" aria-hidden="true">
                        ✓
                      </span>
                    ) : null}
                  </li>
                );
              })
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}