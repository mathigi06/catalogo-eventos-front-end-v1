import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { findPontoById } from "../bff/appBff";
import type { Cidade, PontoTuristico } from "../domain";
import { Button, Card, SectionHeader, Tag } from "../shared/ui";
import { useCidadesPublic } from "../context/cidadesStore";
import { getCidadeSlugByNome } from "../features/home/utils/cidadeSlug";

const FALLBACK_IMG = "https://picsum.photos/1200/600?blur=1";

const DetailsPontoPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { state: cidadesState } = useCidadesPublic();
  const cidades = cidadesState.items;

  const [pontoTuristico, setPontoTuristico] = useState<PontoTuristico | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPontoTuristico = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const data = await findPontoById(Number(id));
      setPontoTuristico(data);
    } catch (e) {
      console.error(e);
      setError("Não foi possível carregar os detalhes do ponto turístico.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPontoTuristico();
  }, [fetchPontoTuristico]);

  const cidadeDoPonto = useMemo<Cidade | null>(() => {
    if (!id) return null;
    for (const c of cidades ?? []) {
      if ((c.pontosTuristicos ?? []).some((p:PontoTuristico) => p.id === Number(id))) return c;
    }
    return null;
  }, [cidades, id]);

  return (
    <div className="flex flex-col gap-6">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
        <button className="hover:text-slate-900" onClick={() => navigate("/")}>
          Home
        </button>
        <span className="mx-2">/</span>
        <button
          className="hover:text-slate-900"
          onClick={() => navigate("/pontos-turisticos")}
        >
          Pontos turísticos
        </button>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Detalhes</span>
      </nav>

      <SectionHeader
        kicker="Turismo"
        tone="success"
        description="Informações completas do ponto turístico."
      >
        Detalhes do ponto turístico
      </SectionHeader>

      {loading ? (
        <Card className="p-6 text-sm text-slate-600">Carregando...</Card>
      ) : null}

      {error ? (
        <Card className="p-6">
          <p className="text-sm text-red-600">{error}</p>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button variant="primary" onClick={fetchPontoTuristico}>
              Tentar novamente
            </Button>
          </div>
        </Card>
      ) : null}

      {!loading && !error && pontoTuristico ? (
        <Card className="overflow-hidden">
          <img
            src={pontoTuristico.img || FALLBACK_IMG}
            alt={
              pontoTuristico.nome
                ? `Imagem do ponto: ${pontoTuristico.nome}`
                : "Imagem do ponto turístico"
            }
            className="h-64 w-full object-cover"
            loading="lazy"
            onError={(e) =>
              ((e.currentTarget as HTMLImageElement).src = FALLBACK_IMG)
            }
          />

          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                  {pontoTuristico.nome}
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                  {[
                    cidadeDoPonto
                      ? `${cidadeDoPonto.nome} / ${cidadeDoPonto.uf || "MS"}`
                      : null,
                    pontoTuristico.horario,
                  ]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Tag variant="success">{pontoTuristico.tipo}</Tag>
                {pontoTuristico.destaque ? (
                  <Tag variant="warning">Destaque</Tag>
                ) : null}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {pontoTuristico.desc}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Voltar
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate("/pontos-turisticos")}
              >
                Ver lista de pontos
              </Button>
              {cidadeDoPonto ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    const slug = getCidadeSlugByNome(cidadeDoPonto.nome);
                    if (slug) navigate(`/cidades/${slug}`);
                  }}
                >
                  Ver cidade
                </Button>
              ) : null}
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
};

export default DetailsPontoPage;
