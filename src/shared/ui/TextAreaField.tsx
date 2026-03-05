// src/shared/ui/TextAreaField.tsx
import React, { useId } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

interface TextAreaFieldProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
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
  const textAreaId = id ?? (rest.name ? `field-${rest.name}` : `field-${reactId}`);

  const hintId = hint ? `${textAreaId}-hint` : undefined;
  const errorId = error ? `${textAreaId}-error` : undefined;

  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const isError = Boolean(error);

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      <label htmlFor={textAreaId} className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <textarea
        id={textAreaId}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={isError}
        className={cn(
          "w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm",
          "placeholder:text-slate-400",
          "outline-none transition",
          "focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          isError
            ? "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-500/20"
            : "border-slate-300 focus-visible:border-brand-primary focus-visible:ring-brand-primary/20",
          "disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-slate-50",
          // padrão mais MUI: permitir resize vertical
          "resize-y",
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