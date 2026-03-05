import { useEffect, useMemo, useState } from "react";
import { Button, Card } from "../../shared/ui";
import { useNavigate } from "react-router-dom";
import type { Cidade, Evento } from "../../domain";
import type { PontoTuristico } from "../../domain";

type FeaturedItem =
  | { type: "evento"; id: string; title: string; subtitle?: string; image?: string; href: string }
  | { type: "ponto"; id: string; title: string; subtitle?: string; image?: string; href: string };

export function FeaturedCarousel({
  eventos,
  cidades,
}: {
  eventos: Evento[];
  cidades: Cidade[];
}) {
  const navigate = useNavigate();
  const items = useMemo<FeaturedItem[]>(() => {
    const featuredEventos = eventos
      .filter((e: Evento) => e.destaque)
      .map((e) => ({
        type: "evento" as const,
        id: e.id,
        title: e.titulo,
        subtitle: `${e.local ?? ""}`.trim(),
        image: e.img,
        href: `/eventos/${e.id}`,
      }));

    const featuredPontos = cidades
      .flatMap((c) => c.pontos.map((p) => ({ cidade: c, ponto: p })))
      .filter(({ ponto }: { cidade: Cidade; ponto: PontoTuristico }) => ponto.destaque)
      .map(({ cidade, ponto }) => ({
        type: "ponto" as const,
        id: ponto.id,
        title: ponto.nome,
        subtitle: `${cidade.nome} • ${ponto.tipo ?? ""}`.trim(),
        image: ponto.img,
        href: `/pontos-turisticos/${ponto.id}`,
      }));

    return [...featuredEventos, ...featuredPontos];
  }, [eventos, cidades]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % items.length), 4500);
    return () => window.clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;

  const current = items[index];

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img
          src={current.image || "https://picsum.photos/1200/420?blur=2"}
          alt={current.title}
          className="h-56 w-full object-cover sm:h-72"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <p className="text-xs font-semibold text-white/80">
            {current.type === "evento" ? "Evento em destaque" : "Ponto turístico em destaque"}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">{current.title}</h2>
          {current.subtitle ? <p className="mt-1 text-sm text-white/80">{current.subtitle}</p> : null}

          <div className="mt-4 flex gap-2">
            <Button variant="primary" onClick={() => navigate(current.href)}>
              Ver detalhes
            </Button>
            <Button variant="secondary" onClick={() => setIndex((i) => (i + 1) % items.length)}>
              Próximo
            </Button>
          </div>

          <div className="mt-4 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir para item ${i + 1}`}
                onClick={() => setIndex(i)}
                className={[
                  "h-2 w-2 rounded-full transition",
                  i === index ? "bg-brand-warning" : "bg-white/40 hover:bg-white/70",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}