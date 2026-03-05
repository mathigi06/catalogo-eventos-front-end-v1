export type CidadeCeleiro = {
  slug: string;
  nome: string;
  uf: string;
  image: string; // caminho (recomendo /public/cidades/*.jpg)
  descricao?: string;
};