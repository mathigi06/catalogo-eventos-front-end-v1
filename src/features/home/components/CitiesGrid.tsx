import { useNavigate } from "react-router-dom";
import { Button, Card } from "../../../shared/ui";
import type { CidadeCeleiro } from "../data/cidadesCeleiro";

const FALLBACK_IMG = "https://picsum.photos/800/500?blur=1";

export function CitiesGrid({ cidades }: { cidades: CidadeCeleiro[] }) {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cidades.map((c) => (
        <Card key={c.slug} as="article" className="overflow-hidden">
          <img
            src={c.image}
            alt={`Foto de ${c.nome}`}
            className="h-40 w-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
            }}
          />
          <div className="p-4">
            <h3 className="text-base font-semibold text-slate-900">{c.nome}</h3>
            <p className="mt-1 text-sm text-slate-600">{c.uf}</p>

            <div className="mt-4">
              <Button variant="secondary" onClick={() => navigate(`/cidades/${c.slug}`)}>
                Ver detalhes da cidade
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}