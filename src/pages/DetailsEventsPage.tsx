import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findEventById } from "../bff/appBff";
import type { Evento } from "../domain";
import { Card } from "../shared/ui";

export default function DetailsEventsPage() {
  const { id } = useParams<{ id: string }>();

  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvento = useCallback(async () => {
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) {
      setError("ID inválido.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const item = await findEventById(numericId);
      setEvento(item);
    } catch (e) {
      console.error(e);
      setError("Não foi possível carregar o evento.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchEvento();
  }, [fetchEvento]);

  return (
    <section
      aria-label="Detalhes do evento"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {loading ? (
        <Card className="p-6 text-sm text-slate-600">Carregando...</Card>
      ) : error ? (
        <Card className="p-6 text-sm text-red-600">{error}</Card>
      ) : evento ? (
        <>
          <h1 className="text-2xl font-extrabold mb-4">{evento.titulo}</h1>

          <img
            src={evento.img || "https://picsum.photos/800/450?blur=2"}
            alt={`Imagem do evento: ${evento.titulo}`}
            className="w-full h-64 object-cover rounded-2xl mb-4"
          />

          <div className="flex flex-wrap gap-3 mb-4">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold">
              {evento.cat}
            </span>
            <span className="text-sm text-slate-600">{evento.local}</span>
          </div>

          <p className="text-sm text-slate-600 mb-4">
            {`Data: ${evento.data} • Horário: ${evento.hora} • Local: ${evento.local}`}
          </p>

          <p className="text-base text-slate-800">{evento.desc}</p>
        </>
      ) : (
        <Card className="p-6 text-sm text-slate-600">Evento não encontrado.</Card>
      )}
    </section>
  );
}