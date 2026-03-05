import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Cidade, PontoTuristico } from "../domain";
import {
  listCidades,
  listPontosByCidadeId,
  listPontosTuristicos,
} from "../bff/appBff";
import { usePaginatedResource } from "../shared/hooks/usePaginatedResource";
import {
  Button,
  Card,
  SectionHeader,
  Tag,
  TextField,
  RoundedSelect,
} from "../shared/ui";

const FALLBACK_IMG = "https://picsum.photos/900/520?blur=1";

type Query = {
  cidadeId?: number;
};

type PontoView = {
  ponto: PontoTuristico;
  cidadeLabel: string;
};

function PontoCard({
  item,
  onOpen,
}: {
  item: PontoView;
  onOpen: (id: number) => void;
}) {
  const { ponto, cidadeLabel } = item;

  return (
    <Card as="article" className="overflow-hidden">
      <img
        src={ponto.img || FALLBACK_IMG}
        alt={
          ponto.nome
            ? `Imagem do ponto: ${ponto.nome}`
            : "Imagem do ponto turístico"
        }
        className="h-44 w-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
        }}
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900 line-clamp-2">
              {ponto.nome}
            </h3>

            <p className="mt-1 text-sm text-slate-600 line-clamp-1">
              {[cidadeLabel, ponto.horario].filter(Boolean).join(" • ")}
            </p>

            <p className="mt-1 text-xs text-slate-500 line-clamp-2">
              {ponto.desc}
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <Tag variant={ponto.destaque ? "warning" : "success"}>
              {ponto.tipo}
            </Tag>
            {ponto.destaque ? <Tag variant="warning">Destaque</Tag> : null}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="primary" size="sm" onClick={() => onOpen(ponto.id)}>
            Ver detalhes
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function PontosTuristicosPage() {
  const navigate = useNavigate();

  // ====== filtros (locais) ======
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");

  // ====== filtro de cidade (server-side) ======
  const [cidadeId, setCidadeId] = useState<number | undefined>(undefined);

  // ====== cidades (para dropdown) ======
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(true);

  useEffect(() => {
    (async () => {
      setLoadingCidades(true);
      try {
        const res = await listCidades({
          page: 1,
          limit: 500,
          sortBy: "nome",
          sortDir: "asc",
        });
        setCidades(res.items);
      } finally {
        setLoadingCidades(false);
      }
    })();
  }, []);

  const cidadesMap = useMemo(() => {
    return new Map<number, Cidade>(cidades.map((c) => [c.id, c]));
  }, [cidades]);

  const cidadeOptions = useMemo(() => {
    return [
      { value: "", label: "Todas as cidades" },
      ...cidades.map((c) => ({
        value: String(c.id),
        label: `${c.nome} / ${c.uf}`,
      })),
    ];
  }, [cidades]);

  // ====== paginação (server-side) ======
  const loadPage = useCallback(
    async ({
      page,
      limit,
      query,
    }: {
      page: number;
      limit: number;
      query: Query;
    }) => {
      const base = { page, limit, sortBy: "nome", sortDir: "asc" as const };

      const res = query.cidadeId
        ? await listPontosByCidadeId(query.cidadeId, base)
        : await listPontosTuristicos(base);

      return {
        items: res.items,
        page: res.page,
        totalPages: res.totalPages,
        total: res.total,
      };
    },
    [],
  );

  const query = useMemo<Query>(() => ({ cidadeId }), [cidadeId]);

  const {
    items: pontos,
    loading,
    error,
    canLoadMore,
    loadNext,
    reset,
  } = usePaginatedResource<PontoTuristico, Query>({
    query,
    limit: 12,
    loadPage,
    auto: true,
    resetOnQueryChange: true, // <- aqui é o "mágico": troca cidade => reset + reload
  });

  // ====== ViewModels (para UI) ======
  const pontosView = useMemo<PontoView[]>(() => {
    return (pontos ?? []).map((p) => {
      const c = cidadesMap.get(p.cidadeId);
      const cidadeLabel = c ? `${c.nome} / ${c.uf}` : "";
      return { ponto: p, cidadeLabel };
    });
  }, [pontos, cidadesMap]);

  const tipoOptions = useMemo(() => {
    const types = Array.from(
      new Set(pontosView.map((x) => x.ponto.tipo).filter(Boolean)),
    ).sort();
    return [
      { value: "", label: "Todos os tipos" },
      ...types.map((t) => ({ value: t, label: t })),
    ];
  }, [pontosView]);

  // ====== filtros locais (não re-bate na API) ======
  const filtrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pontosView.filter(({ ponto, cidadeLabel }) => {
      const okTipo = !tipo || ponto.tipo === tipo;
      const txt = `${ponto.nome} ${ponto.tipo} ${cidadeLabel}`.toLowerCase();
      const okSearch = !q || txt.includes(q);
      return okTipo && okSearch;
    });
  }, [pontosView, search, tipo]);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        kicker="Turismo"
        tone="success"
        description="Paginação incremental (load more) + filtro por cidade no backend."
      >
        Pontos turísticos
      </SectionHeader>

      {/* filtros */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <TextField
            label="Buscar"
            placeholder="Ex: parque, museu, praça..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-col gap-1 text-sm">
            <label className="font-medium">Cidade</label>
            <RoundedSelect
              value={cidadeId ? String(cidadeId) : ""}
              onChange={(v) => setCidadeId(v ? Number(v) : undefined)}
              options={cidadeOptions}
              placeholder={loadingCidades ? "Carregando..." : "Todas"}
              disabled={loadingCidades}
            />
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <label className="font-medium">Tipo</label>
            <RoundedSelect
              value={tipo}
              onChange={setTipo}
              options={tipoOptions}
              placeholder="Todos"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearch("");
              setTipo("");
              setCidadeId(undefined);
            }}
          >
            Limpar filtros
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset();
              loadNext();
            }}
          >
            Recarregar
          </Button>

          <div className="ml-auto text-xs text-slate-500">
            {filtrados.length} exibido(s)
          </div>
        </div>
      </Card>

      {/* erros/empty */}
      {error ? <Card className="p-6 text-sm text-red-600">{error}</Card> : null}

      {filtrados.length === 0 && !loading ? (
        <Card className="p-6 text-sm text-slate-600">
          Nenhum ponto turístico encontrado.
        </Card>
      ) : null}

      {/* grid */}
      {filtrados.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((item) => (
            <PontoCard
              key={item.ponto.id}
              item={item}
              onOpen={(id) => navigate(`/pontos-turisticos/${id}`)}
            />
          ))}
        </div>
      ) : null}

      {/* load more */}
      <div className="flex justify-center">
        {canLoadMore ? (
          <Button variant="primary" onClick={loadNext} disabled={loading}>
            {loading ? "Carregando..." : "Carregar mais"}
          </Button>
        ) : (
          <p className="text-xs text-slate-500">Você chegou ao final.</p>
        )}
      </div>
    </div>
  );
}
