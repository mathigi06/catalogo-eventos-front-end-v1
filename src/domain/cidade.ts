import type { Evento } from "./evento";
import type { PontoTuristico } from "./pontoTuristico";

export interface Cidade {
  id: number;
  nome: string;
  uf: string;
  desc: string;
  slug?: string;
  imagem?: string;
  pontosTuristicos: PontoTuristico[];
  eventos: Evento[];
}


