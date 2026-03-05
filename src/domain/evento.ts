import type { Cidade } from "./cidade";

export type EventoCategoria =
  | "Show"
  | "Esporte"
  | "Feira"
  | "Teatro"
  | "Gastronomia";

// src/domain/evento.ts
export interface Evento {
  id: number;
  titulo: string;
  cat: string;
  data: string;
  hora: string;
  local: string;
  preco: string;
  img: string;
  desc: string;
  destaque?: boolean;
  cidadeId: number;
  cidade: Cidade;
}

