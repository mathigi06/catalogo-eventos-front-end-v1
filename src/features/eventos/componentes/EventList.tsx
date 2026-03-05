import React from "react";
import type { Evento } from "../../../domain";
import { Button, Card } from "../../../shared/ui";
import { EventCard } from "./EventCard";

interface EventListProps {
  eventos: Evento[];
  onNewEvent: () => void;
  onEditEvent: (evento: Evento) => void;
  onDeleteEvent: (id: string) => void;
  onDetails: (evento: Evento) => void;
}

export const EventList = React.memo(function EventList({
  eventos,
  onNewEvent,
  onEditEvent,
  onDeleteEvent,
  onDetails,
}: EventListProps) {
  if (eventos.length === 0) {
    return (
      <Card className="p-5">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-slate-600">
            Nenhum evento encontrado com os filtros atuais.
          </p>
          <div>
            <Button variant="primary" size="sm" onClick={onNewEvent}>
              + Cadastrar primeiro evento
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button variant="primary" size="sm" onClick={onNewEvent}>
          + Novo evento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {eventos.map((ev) => (
          <EventCard
            key={ev.id}
            evento={ev}
            onEdit={onEditEvent}
            onDelete={onDeleteEvent}
            onDetails={onDetails}
          />
        ))}
      </div>
    </div>
  );
});