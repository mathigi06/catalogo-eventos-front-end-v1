import { createContext, useContext } from "react";
import type { Evento } from "../domain";
import type { EventosQuery } from "./eventosContext";

export type EventosState = {
  items: Evento[];
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  error: string | null;
};

export const initialEventosState: EventosState = {
  items: [],
  page: 0,
  totalPages: 1,
  total: 0,
  loading: false,
  error: null,
};

export type EventosContextValue = {
  state: EventosState;
  query: EventosQuery;
  setQuery: (query: EventosQuery) => void;

  fetchFirstPage: (query?: Omit<EventosQuery, "page">) => Promise<void>;
  loadMore: () => Promise<void>;
};

export const EventosContext = createContext<EventosContextValue | null>(null);

export function useEventosPublic() {
  const ctx = useContext(EventosContext);
  if (!ctx) throw new Error("useEventosPublic deve ser usado dentro de EventosProvider");
  return ctx;
}