import type { Cidade } from "./cidade";

export interface PontoTuristico {
  id: number;
  nome: string;
  tipo: string;
  horario: string;
  img: string;
  desc: string;
  cidadeId: number;
  destaque?: boolean;
  cidade: Cidade;
}
