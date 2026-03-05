import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { findCidadeBySlug } from "../bff/appBff";
import type { CidadeCeleiro } from "../features/home/data/cidadesCeleiro";
import { Button, Card, HeroSection } from "../shared/ui";

const FALLBACK_IMG = "https://picsum.photos/1200/600?blur=1";

export default function CityDetailsPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const [cidade, setCidade] = useState<CidadeCeleiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCidade = useCallback(async (slugValue: string) => {
    setLoading(true);
    setError(null);

    try {
      // slug pode vir URL-encoded
      const item = await findCidadeBySlug(slugValue);
      const cidadeCeleiro: CidadeCeleiro = {
          nome: item.nome,
          uf: item.uf.toString(),
          slug: item.slug ?? item.nome.toLowerCase().replace(/\s+/g, "-"),
          image: item.imagem ?? "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1200&auto=format&fit=crop",
          descricao: item.desc,
        }
      setCidade(cidadeCeleiro);
    } catch (e) {
      console.error(e);
      setCidade(null);
      setError("Não foi possível carregar a cidade.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!slug) {
      setCidade(null);
      setLoading(false);
      setError("Slug inválido.");
      return;
    }
    void fetchCidade(slug);
  }, [slug, fetchCidade]);

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-sm text-slate-600">Carregando cidade...</p>
      </Card>
    );
  }

  if (error || !cidade) {
    return (
      <Card className="p-6">
        <p className="text-sm text-slate-600">
          {error ?? "Cidade não encontrada."}
        </p>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" onClick={() => navigate("/")}>
            Ir para Home
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <HeroSection
        kicker="Cidade"
        title={`${cidade.nome} / ${cidade.uf}`}
        subtitle="Detalhes e informações gerais. Em breve: agenda local, pontos em destaque e conteúdo institucional."
        tone="primary"
        align="left"
        actions={[
          { label: "Ver eventos", href: "/eventos", variant: "primary" },
          {
            label: "Ver pontos turísticos",
            href: "/pontos-turisticos",
            variant: "secondary",
          },
          { label: "Voltar", onClick: () => navigate(-1), variant: "ghost" },
        ]}
      />

      <Card className="overflow-hidden">
        <img
          src={cidade.image || FALLBACK_IMG}
          alt={`Foto de ${cidade.nome}`}
          className="h-64 w-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
          }}
        />

        <div className="p-6">
          <p className="text-sm text-slate-600">
            {cidade.descricao
              ? cidade.descricao
              : "Aqui você pode colocar conteúdo institucional da cidade, pontos em destaque, agenda local e informações úteis."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}