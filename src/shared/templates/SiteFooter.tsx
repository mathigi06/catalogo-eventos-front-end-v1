import React from "react";

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Celeiro do MS</p>
            <p className="mt-2 text-sm text-slate-600">
              Plataforma para divulgação de eventos e pontos turísticos da região.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Navegação</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li><a className="hover:text-slate-900" href="/eventos">Eventos</a></li>
              <li><a className="hover:text-slate-900" href="/pontos-turisticos">Pontos turísticos</a></li>
              <li><a className="hover:text-slate-900" href="/sobre">Sobre</a></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Mídias sociais</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li><a className="hover:text-slate-900" href="#" aria-label="Instagram">Instagram</a></li>
              <li><a className="hover:text-slate-900" href="#" aria-label="Facebook">Facebook</a></li>
              <li><a className="hover:text-slate-900" href="#" aria-label="YouTube">YouTube</a></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Créditos</p>
            <p className="mt-2 text-sm text-slate-600">
              © {new Date().getFullYear()} Celeiro do MS. Todos os direitos reservados.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Desenvolvido para divulgação regional.
            </p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between text-xs text-slate-500">
          <span>Feito com foco em UX e performance.</span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-primary" />
            <span className="h-2 w-2 rounded-full bg-brand-success" />
            <span className="h-2 w-2 rounded-full bg-brand-warning" />
          </span>
        </div>
      </div>
    </footer>
  );
}