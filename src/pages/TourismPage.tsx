import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, TextField } from "../shared/ui";
import { RoundedSelect } from "../shared/ui/RoundedSelect";
import { useCidadesStore } from "../context/cidadesStore";

const TourismPage: React.FC = () => {

  const { cidades } = useCidadesStore()
 
  const navigate = useNavigate();

  const [buscaPonto, setBuscaPonto] = useState("");

  const [cidadeSelecionadaId, setCidadeSelecionadaId] = useState<string | null>(
    () => cidades[0]?.id ?? null,
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

  return (
    <section
      aria-label="Pontos turísticos"
      className="container mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* esquerda: filtros + lista */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <h1 className="text-3xl font-bold mb-4">{`Pontos turísticos em ${cidadeSelecionada?.nome}`}</h1>
        <Card className="w-full p-4">
          <div className="w-full flex flex-col md:flex-row gap-3 items-start md:items-center">
            <RoundedSelect
              value={cidadeSelecionadaId ?? ""}
              onChange={(value) => setCidadeSelecionadaId(value)}
              label={"Cidade"}
              options={cidades.map((c) => ({
                value: c.id,
                label: `${c.nome} - ${c.uf}`,
              }))}
            />
            <TextField
              label="Buscar ponto turístico"
              containerClassName="w-full"
              className="rounded-xl border border-blue-400 bg-white/10 px-3 py-2 text-sm outline-none"
              placeholder="Ex.: Parque, Museu…"
              value={buscaPonto}
              onChange={(e) => setBuscaPonto(e.target.value)}
            />
          </div>
        </Card>

        {/* lista de pontos */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
          {pontosFiltrados.length === 0 ? (
            <Card className="p-4 text-sm text-[#9fb0c8] md:col-span-2">
              Nenhum ponto encontrado para esta cidade.
            </Card>
          ) : (
            pontosFiltrados.map((p) => (
              <Card key={p.id} className="overflow-hidden flex flex-col">
                <img
                  src={p.img || ""}
                  alt="Imagem do ponto turístico"
                  className="h-40 w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://picsum.photos/800/450?blur=2";
                  }}
                />
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 font-semibold">
                      {p.tipo || "Ponto"}
                    </span>
                    {cidadeSelecionada && (
                      <span className="text-[#9fb0c8]">
                        {cidadeSelecionada.nome}/{cidadeSelecionada.uf}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold">{p.nome}</h3>
                  <p className="text-xs text-[#9fb0c8]">
                    Horário: {p.horario || "—"}
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate(`/ponto-turistico/${p.id}`)}
                  >
                    Ver detalhes
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TourismPage;
