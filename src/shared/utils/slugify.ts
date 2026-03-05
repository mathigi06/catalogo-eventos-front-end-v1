/**
 * Converte string para slug seguro de URL.
 * - Remove acentos
 * - Remove caracteres especiais
 * - Converte espaços para "-"
 * - Lowercase
 */
export function slugify(value: string): string {
  return value
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-zA-Z0-9\s-]/g, "") // remove caracteres especiais
    .trim()
    .replace(/\s+/g, "-") // espaços -> -
    .replace(/-+/g, "-") // remove duplicados
    .toLowerCase();
}