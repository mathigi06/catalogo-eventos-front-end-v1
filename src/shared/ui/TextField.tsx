// src/shared/ui/TextField.tsx
import React, { useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  hint,
  error,
  containerClassName,
  className,
  disabled,
  ...rest
}) => {
  const reactId = useId();
  const inputId = id ?? (rest.name ? `field-${rest.name}` : `field-${reactId}`);

  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const isError = Boolean(error);

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        id={inputId}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={isError}
        className={cn(
          "w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm",
          "placeholder:text-slate-400",
          "outline-none transition",
          "focus:ring-2 focus:ring-slate-900/10",
          isError
            ? "border-red-400 focus:border-red-400 focus:ring-red-500/20"
            : "border-slate-300 focus:border-brand-primary focus:ring-brand-primary/20",
          "disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-slate-50",
          className
        )}
        {...rest}
      />

      {hint && !error ? (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
};