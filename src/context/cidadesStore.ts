import { createContext, useContext } from "react";
import type { Cidade } from "../domain";
import type { CidadesQuery } from "./cidadesContext";

export type CidadesState = {
  items: Cidade[];
  loading: boolean;
  error: string | null;
};

export const initialCidadesState: CidadesState = {
  items: [],
  loading: false,
  error: null,
};

export type CidadesContextValue = {
  state: CidadesState;
  fetchAll: (query?: CidadesQuery) => Promise<void>;
};

export const CidadesContext = createContext<CidadesContextValue | null>(null);

export function useCidadesPublic() {
  const ctx = useContext(CidadesContext);
  if (!ctx) throw new Error("useCidadesPublic deve ser usado dentro de CidadesProvider");
  return ctx;
}