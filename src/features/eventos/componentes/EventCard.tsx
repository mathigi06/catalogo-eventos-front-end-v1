import React, { useCallback, useMemo } from "react";
import type { Evento } from "../../../domain";
import { Button, Card, Tag } from "../../../shared/ui";

const FALLBACK_IMG = "https://picsum.photos/800/450?blur=2";

const formatDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("pt-BR", {
    timeZone: "America/Campo_Grande",
  });

interface EventCardProps {
  evento: Evento;
  onEdit: (evento: Evento) => void;
  onDelete: (id: string) => void;
  onDetails: (evento: Evento) => void;
}

export const EventCard = React.memo(function EventCard({
  evento,
  onEdit,
  onDelete,
  onDetails,
}: EventCardProps) {
  const dateLabel = useMemo(
    () => `${formatDate(evento.data)}${evento.hora ? ` • ${evento.hora}` : ""}`,
    [evento.data, evento.hora]
  );

  const handleImgError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = FALLBACK_IMG;
  }, []);

  const handleDetails = useCallback(() => onDetails(evento), [onDetails, evento]);
  const handleEdit = useCallback(() => onEdit(evento), [onEdit, evento]);
  const handleDelete = useCallback(() => onDelete(evento.id), [onDelete, evento.id]);

  return (
    <Card as="article" className="overflow-hidden">
      <img
        src={evento.img || FALLBACK_IMG}
        alt={evento.titulo ? `Imagem do evento: ${evento.titulo}` : "Imagem do evento"}
        className="h-40 w-full object-cover"
        loading="lazy"
        onError={handleImgError}
      />

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Tag variant="primary">{evento.cat}</Tag>
          <span className="text-xs text-slate-500">{dateLabel}</span>
        </div>

        <h3 className="text-base font-semibold text-slate-900 line-clamp-2">
          {evento.titulo}
        </h3>

        <p className="text-sm text-slate-600 line-clamp-1">
          {evento.local} • {evento.preco}
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={handleDetails}>
            Detalhes
          </Button>
          <Button size="sm" variant="secondary" onClick={handleEdit}>
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={handleDelete}>
            Excluir
          </Button>
        </div>
      </div>
    </Card>
  );
});