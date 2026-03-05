import { createContext, useContext } from "react";
import type { PontosQuery, PontosState } from "./pontosContext";

export type PontosContextValue = {
  state: PontosState;
  query: PontosQuery;

  fetchFirstPage: (query?: PontosQuery) => Promise<void>;
  loadMore: () => Promise<void>;
  setQuery: (query: PontosQuery) => void;
};

export const PontosContext = createContext<PontosContextValue | null>(null);

export function usePontosPublic() {
  const ctx = useContext(PontosContext);
  if (!ctx) throw new Error("usePontosPublic deve ser usado dentro de PontosProvider");
  return ctx;
}