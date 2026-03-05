import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Evento } from "../domain";
import { listEventos } from "../bff/appBff";
import { usePaginatedResource } from "../shared/hooks/usePaginatedResource";
import { Card, SectionHeader, Button, TextField, RoundedSelect } from "../shared/ui";

type EmptyQuery = Record<string, never>;

export default function EventosPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const loadPage = useCallback(
    async ({ page, limit }: { page: number; limit: number; query: EmptyQuery }) => {
      const res = await listEventos({ page, limit, sortBy: "data", sortDir: "asc" });
      return { items: res.items, page: res.page, totalPages: res.totalPages, total: res.total };
    },
    []
  );

  const { items: eventos, loading, error, canLoadMore, loadNext, reset } =
    usePaginatedResource<Evento, EmptyQuery>({
      query: {},
      limit: 12,
      loadPage,
    });

  const categoryOptions = useMemo(() => {
    const cats = Array.from(new Set(eventos.map((e) => e.cat).filter(Boolean))).sort();
    return [{ value: "", label: "Todas as categorias" }, ...cats.map((c) => ({ value: c, label: c }))];
  }, [eventos]);

  const filtrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    return eventos.filter((ev) => {
      const okCat = !category || ev.cat === category;
      const okQ = !q || `${ev.titulo} ${ev.local} ${ev.cat}`.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [eventos, search, category]);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader kicker="Eventos" tone="primary" description="Paginação incremental com filtros locais.">
        Agenda de eventos
      </SectionHeader>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <TextField label="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="flex flex-col gap-1 text-sm">
            <label className="font-medium">Categoria</label>
            <RoundedSelect value={category} onChange={setCategory} options={categoryOptions} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearch("");
              setCategory("");
            }}
          >
            Limpar filtros
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset();
              void loadNext();
            }}
          >
            Recarregar
          </Button>

          <div className="ml-auto text-xs text-slate-500">{filtrados.length} exibido(s)</div>
        </div>
      </Card>

      {error ? <Card className="p-6 text-sm text-red-600">{error}</Card> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((ev) => (
          <Card key={ev.id} className="p-4">
            <h3 className="font-semibold">{ev.titulo}</h3>
            <p className="text-sm text-slate-600">{ev.local}</p>
            <div className="mt-3">
              <Button variant="primary" size="sm" onClick={() => navigate(`/eventos/${ev.id}`)}>
                Ver detalhes
              </Button>
            </div>
          </Card>
        ))}
      </div>

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