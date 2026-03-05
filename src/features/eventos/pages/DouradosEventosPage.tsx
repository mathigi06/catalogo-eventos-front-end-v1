import React, { Suspense, useEffect, useMemo, useState } from "react";
import type { Cidade, Evento, PontoTuristico } from "../../../domain";
import { Button, Card } from "../../../shared/ui";
import { CidadeFormModal } from "../componentes/CidadeFormModal";
import { CitiesSection } from "../componentes/CitiesSection";
import { EventList } from "../componentes/EventList";
import { PontoFormModal } from "../componentes/PontoFormModal";
import { TourismSection } from "../componentes/TourismSection";
import { useEventosStore } from "../../../context/eventosStore";
import { useCidadesStore } from "../../../context/cidadesStore";

export type Tab = "eventos" | "turismo" | "cidades";

const formatDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("pt-BR", {
    timeZone: "America/Campo_Grande",
  });

export const DouradosEventosPage: React.FC = () => {

  const { eventos, createOrUpdateEvento, deleteEvento } =
    useEventosStore();
  const { cidades, createOrUpdateCidade, deleteCidade, createOrUpdatePonto, deletePonto } =
    useCidadesStore();
  
  const EventFormModal = React.lazy(
    () => import("../componentes/EventFormModal"),
  );

  const [cidadeSelecionadaId, setCidadeSelecionadaId] = useState<string | null>(
    () => cidades[0]?.id ?? null,
  );
  useEffect(() => {
    if (!cidadeSelecionadaId && cidades.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCidadeSelecionadaId(cidades[0].id);
    }
  }, [cidades, cidadeSelecionadaId]);

  const [tab, setTab] = useState<Tab>("eventos");

  // filtros de eventos
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [search, setSearch] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cat, setCat] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataMin, setDataMin] = useState("");

  // turismo
  const [buscaPonto, setBuscaPonto] = useState("");

  // modais
  const [eventoEdit, setEventoEdit] = useState<Evento | null>(null);
  const [cidadeEdit, setCidadeEdit] = useState<Cidade | null>(null);
  const [pontoEdit, setPontoEdit] = useState<PontoTuristico | null>(null);
  const [pontoCidadeId, setPontoCidadeId] = useState<string | null>(null);

  const eventosFiltrados = useMemo(
    () =>
      eventos
        .slice()
        .sort((a, b) => a.data.localeCompare(b.data))
        .filter((ev) => {
          const okCat = !cat || ev.cat === cat;
          const okData = !dataMin || ev.data >= dataMin;
          const txt = `${ev.titulo} ${ev.local} ${ev.cat}`.toLowerCase();
          const okQ = !search || txt.includes(search.toLowerCase());
          return okCat && okData && okQ;
        }),
    [eventos, cat, dataMin, search],
  );

  const cidadeSelecionada =
    cidades.find((c) => c.id === cidadeSelecionadaId) ?? cidades[0];

  const pontosFiltrados = useMemo(() => {
    if (!cidadeSelecionada) return [];
    const q = buscaPonto.toLowerCase();
    return cidadeSelecionada.pontos.filter((p) =>
      `${p.nome} ${p.tipo}`.toLowerCase().includes(q),
    );
  }, [buscaPonto, cidadeSelecionada]);

  // === callbacks de CRUD usando o context ===

  const handleSalvarEvento = async (
    dados: Omit<Evento, "id"> & { id?: string },
  ) => {
    await createOrUpdateEvento(dados);
    setEventoEdit(null);
  };

  const handleExcluirEvento = (id: string) => {
    if (!window.confirm("Excluir este evento?")) return;
    deleteEvento(id);
  };

  const handleSalvarCidade = (
    dados: Omit<Cidade, "id" | "pontos"> & { id?: string },
  ) => {
    createOrUpdateCidade(dados);
    setCidadeEdit(null);
  };

  const handleExcluirCidade = (id: string) => {
    if (!window.confirm("Excluir esta cidade e todos os seus pontos?")) return;
    deleteCidade(id);
    if (cidadeSelecionadaId === id) {
      const nova = cidades.find((c) => c.id !== id);
      setCidadeSelecionadaId(nova?.id ?? null);
    }
  };

  const handleSalvarPonto = (
    cidadeId: string,
    dados: Omit<PontoTuristico, "id"> & { id?: string },
  ) => {
    createOrUpdatePonto(cidadeId, dados);
    setPontoEdit(null);
    setPontoCidadeId(null);
  };

  const handleExcluirPonto = (cidadeId: string, pontoId: string) => {
    if (!window.confirm("Excluir este ponto turístico?")) return;
    deletePonto(cidadeId, pontoId);
  };

  const handleDetalhesEvento = (ev: Evento) => {
    window.alert(
      `${ev.titulo}
${formatDate(ev.data)} ${ev.hora || ""}
${ev.local}
${ev.preco}

${ev.desc}`,
    );
  };

  // === UI ===

  return (
    <>
      <section className="flex flex-col items-center justify-center text-center mb-8">
        <Card className="w-full max-w-3xl p-6 relative overflow-hidden">
          <p className="text-xs tracking-[0.2em] uppercase text-[#3c203b] font-semibold">
            Agenda &amp; Guia • Dourados/MS
          </p>
          <h1 className="mt-2 mb-3 text-2xl md:text-3xl font-extrabold">
            Descubra o que rola na cidade e explore o melhor do turismo local.
          </h1>
          <p className="text-sm md:text-base text-[#3c203b] leading-relaxed">
            Uma plataforma simples e poderosa para divulgar{" "}
            <strong>eventos</strong>, conhecer{" "}
            <strong>pontos turísticos</strong> e cadastrar informações de{" "}
            <strong>cidades da região</strong>.
          </p>
        </Card>
      </section>

      {/* tabs */}
      <div
        className="mb-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Seções Principais"
      >
        <Button
          role="tab"
          aria-selected={tab === "eventos"}
          aria-controls="painel-eventos"
          variant={tab === "eventos" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setTab("eventos")}
        >
          Eventos
        </Button>
        <Button
          role="tab"
          aria-selected={tab === "turismo"}
          aria-controls="painel-turismo"
          variant={tab === "turismo" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setTab("turismo")}
        >
          Turismo
        </Button>
        <Button
          role="tab"
          aria-selected={tab === "cidades"}
          aria-controls="painel-cidades"
          variant={tab === "cidades" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setTab("cidades")}
        >
          Cidades
        </Button>
      </div>

      {/* painéis */}
      {tab === "eventos" && (
        <section
          id="painel-eventos"
          role="tabpanel"
          aria-labelledby="tab-eventos"
        >
          <EventList
            eventos={eventosFiltrados}
            onNewEvent={() => setEventoEdit({} as Evento)}
            onEditEvent={setEventoEdit}
            onDeleteEvent={handleExcluirEvento}
            onDetails={handleDetalhesEvento}
          />
        </section>
      )}

      {tab === "turismo" && (
        <section
          id="painel-turismo"
          role="tabpanel"
          aria-labelledby="tab-turismo"
        >
          <TourismSection
            cidades={cidades}
            cidadeSelecionada={cidadeSelecionada ?? null}
            cidadeSelecionadaId={cidadeSelecionadaId}
            onCidadeSelecionadaChange={setCidadeSelecionadaId}
            buscaPonto={buscaPonto}
            onBuscaPontoChange={setBuscaPonto}
            pontosFiltrados={pontosFiltrados}
            onNovoPonto={() => {
              if (!cidadeSelecionada) {
                window.alert("Selecione uma cidade primeiro.");
                return;
              }
              setPontoCidadeId(cidadeSelecionada.id);
              setPontoEdit({} as PontoTuristico);
            }}
            onEditarCidade={(cidade) => setCidadeEdit(cidade)}
            onEditarPonto={(ponto) => {
              if (!cidadeSelecionada) return;
              setPontoCidadeId(cidadeSelecionada.id);
              setPontoEdit(ponto);
            }}
            onExcluirPonto={(pontoId) => {
              if (!cidadeSelecionada) return;
              handleExcluirPonto(cidadeSelecionada.id, pontoId);
            }}
            onIrParaCidades={() => setTab("cidades")}
          />
        </section>
      )}

      {tab === "cidades" && (
        <section
          id="painel-cidades"
          role="tabpanel"
          aria-labelledby="tab-cidades"
        >
          <CitiesSection
            cidades={cidades}
            onNovaCidade={() => setCidadeEdit({} as Cidade)}
            onVerPontos={(cidadeId) => {
              setCidadeSelecionadaId(cidadeId);
              setTab("turismo");
            }}
            onEditarCidade={(cidade) => setCidadeEdit(cidade)}
            onExcluirCidade={handleExcluirCidade}
          />
        </section>
      )}
      {/* modais */}
      {eventoEdit && (
        <Suspense fallback={null}>
          <EventFormModal
            open={!!eventoEdit}
            initialValue={eventoEdit}
            onClose={() => setEventoEdit(null)}
            onSave={handleSalvarEvento}
          />
        </Suspense>
      )}

      <CidadeFormModal
        open={!!cidadeEdit}
        initialValue={cidadeEdit}
        onClose={() => setCidadeEdit(null)}
        onSave={handleSalvarCidade}
      />

      <PontoFormModal
        open={!!pontoEdit}
        initialValue={pontoEdit}
        cidadeId={pontoCidadeId}
        cidades={cidades}
        onClose={() => {
          setPontoEdit(null);
          setPontoCidadeId(null);
        }}
        onSave={handleSalvarPonto}
      />
    </>
  );
};
