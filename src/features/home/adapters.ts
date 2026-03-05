import type { Cidade, Evento, PontoTuristico } from "../../domain";
import type { FeaturedCardVM } from "./viewmodels";

const FALLBACK = "https://picsum.photos/1200/420?blur=2";

export function toFeaturedFromEvento(ev: Evento): FeaturedCardVM {
  return {
    kind: "evento",
    id: ev.id,
    title: ev.titulo,
    subtitle: [ev.local, ev.data, ev.hora].filter(Boolean).join(" • "),
    image: ev.img || FALLBACK,
    href: `/eventos/${ev.id}`,
    badge: ev.cat,
  };
}

export function toFeaturedFromPonto(
  p: PontoTuristico,
  cidade?: Cidade
): FeaturedCardVM {
  const cityLabel = cidade ? `${cidade.nome} / ${cidade.uf}` : "";
  return {
    kind: "ponto",
    id: p.id,
    title: p.nome,
    subtitle: [cityLabel, p.tipo, p.horario].filter(Boolean).join(" • "),
    image: p.img || FALLBACK,
    href: `/pontos-turisticos/${p.id}`,
    badge: p.tipo,
  };
}