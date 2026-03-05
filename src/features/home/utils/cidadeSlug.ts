import { cidadesCeleiro } from "../data/cidadesCeleiro";
import { slugify } from "../../../shared/utils/slugify";

/**
 * Retorna o slug oficial da cidade baseado no nome.
 * Se não encontrar na lista institucional,
 * gera via slugify como fallback.
 */
export function getCidadeSlugByNome(nome?: string): string | null {
  if (!nome) return null;

  const normalized = nome.trim().toLowerCase();

  const found = cidadesCeleiro.find(
    (c) => c.nome.trim().toLowerCase() === normalized
  );

  if (found) return found.slug;

  // fallback seguro
  return slugify(nome);
}