import { useEffect, useState } from "react";
import { Card, HeroSection, SectionHeader } from "../../../shared/ui";
import { CitiesGrid } from "../components/CitiesGrid";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
// import { cidadesCeleiro } from "../data/cidadesCeleiro";

import { listCidades, listDestaques } from "../../../bff/appBff";
import type { Cidade } from "../../../domain";
import { toFeaturedFromEvento, toFeaturedFromPonto } from "../adapters";
import type { CidadeCeleiro } from "../data/cidadesCeleiro";
import type { FeaturedCardVM } from "../viewmodels";

export default function HomePage() {
  const [featured, setFeatured] = useState<FeaturedCardVM[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [cidadesCeleiro, setCidadesCeleiro] = useState<CidadeCeleiro[]>([]);

  useEffect(() => {
    (async () => {
      setLoadingFeatured(true);
      try {
        const [destaques, cidadesRes] = await Promise.all([
          listDestaques({ page: 1, limit: 10 }),
          listCidades({ page: 1, limit: 500, sortBy: "nome", sortDir: "asc" }),
        ]);

        const cidadeMap = new Map<number, Cidade>(
          cidadesRes.items.map((c) => [c.id, c]),
        );

        const listCidadeCeleiro = cidadesRes.items.map<CidadeCeleiro>((c) => ({
          id: c.id,
          nome: c.nome,
          uf: c.uf.toString(),
          slug: c.slug ?? c.nome.toLowerCase().replace(/\s+/g, "-"),
          image: c.imagem ?? "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1200&auto=format&fit=crop",
          descricao: c.desc,
        }));

        setCidadesCeleiro(listCidadeCeleiro);

        const evItems = destaques.eventos.items.map(toFeaturedFromEvento);
        const ptItems = destaques.pontos.items.map((p) =>
          toFeaturedFromPonto(p, cidadeMap.get(p.cidadeId)),
        );

        setFeatured([...evItems, ...ptItems]);
      } finally {
        setLoadingFeatured(false);
      }
    })();
  }, []);

  const highlightsCount = featured.length;
  const hasHighlights = highlightsCount > 0;

  return (
    <div className="flex flex-col gap-10">
      <HeroSection
        kicker="Celeiro do MS"
        title="Descubra eventos e pontos turísticos da nossa região"
        subtitle="Uma vitrine digital para promover cultura, lazer e turismo nas cidades que compõem a área de atuação do Celeiro do MS."
        tone="primary"
        align="center"
        actions={[
          { label: "Ver eventos", href: "/eventos", variant: "primary" },
          {
            label: "Ver pontos turísticos",
            href: "/pontos-turisticos",
            variant: "secondary",
          },
        ]}
        rightSlot={
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-700">Destaques</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {highlightsCount}
            </p>
            <p className="mt-1 text-xs text-slate-500">itens em evidência</p>
          </div>
        }
      />

      {/* Carousel destaques */}
      <section>
        <SectionHeader
          kicker="Destaques"
          tone="warning"
          description="Eventos e pontos turísticos marcados como destaque."
        >
          Em evidência agora
        </SectionHeader>

        <div className="mt-4">
          {loadingFeatured ? (
            <Card className="p-6 text-sm text-slate-600">
              Carregando destaques...
            </Card>
          ) : hasHighlights ? (
            <FeaturedCarousel items={featured} />
          ) : (
            <Card className="p-6 text-sm text-slate-600">
              Ainda não há itens em destaque. Marque <strong>destaque</strong>{" "}
              como <strong>true</strong> em um evento ou ponto turístico.
            </Card>
          )}
        </div>
      </section>

      {/* Sobre */}
      <section>
        <SectionHeader
          kicker="Quem somos"
          tone="success"
          description="Conheça o propósito do Celeiro do MS e como apoiamos a divulgação regional."
        >
          Sobre o Celeiro do MS
        </SectionHeader>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-900">Missão</p>
            <p className="mt-2 text-sm text-slate-600">
              Divulgar eventos e atrativos turísticos, fortalecendo a economia
              local e o acesso à informação.
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-900">Visão</p>
            <p className="mt-2 text-sm text-slate-600">
              Ser a principal referência digital de turismo e agenda cultural da
              região.
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-slate-900">Valores</p>
            <p className="mt-2 text-sm text-slate-600">
              Transparência, valorização regional e experiência simples para
              usuários e gestores.
            </p>
          </Card>
        </div>
      </section>

      {/* Cidades */}
      <section>
        <SectionHeader
          kicker="Área de atuação"
          tone="primary"
          description="Cidades que compõem a região atendida pelo Celeiro do MS."
        >
          Cidades do Celeiro do MS
        </SectionHeader>

        <div className="mt-4">
          <CitiesGrid cidades={cidadesCeleiro} />
        </div>
      </section>
    </div>
  );
}