import { NavLink } from "react-router-dom";
import Logo from "../../assets/celeiro_ms_logo.jpg";

export function TopNav() {
  const linkBase = "text-sm font-medium transition px-3 py-2 rounded-xl";
  const linkActive = "bg-slate-900/5 text-slate-900";
  const linkIdle = "text-slate-600 hover:text-slate-900 hover:bg-slate-900/5";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-brand-primary/15 flex items-center justify-center">
              <img
                src={Logo}
                alt="Logo do Celeiro do MS"
                className="w-8 h-8 object-cover rounded-full"
              />
            </div>
          </NavLink>

          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">
              Celeiro do MS
            </p>
            <p className="text-xs text-slate-500">Turismo & Eventos</p>
          </div>
        </div>

        <nav
          className="flex items-center gap-1"
          aria-label="Navegação principal"
        >
          <NavLink
            to="/pontos-turisticos"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            Pontos turísticos
          </NavLink>
          <NavLink
            to="/eventos"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            Eventos
          </NavLink>
          <NavLink
            to="/sobre"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            Sobre
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
