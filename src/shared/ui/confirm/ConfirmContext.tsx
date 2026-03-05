import { createContext } from "react";

export type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

export type ConfirmContextType = (
  options: ConfirmOptions
) => Promise<boolean>;

export const ConfirmContext = createContext<ConfirmContextType | null>(null);