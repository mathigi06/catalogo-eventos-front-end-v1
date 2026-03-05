import React, { lazy, Suspense } from "react";
import DefaultTemplate from "../shared/templates/DefaultTemplate";
import { PageLoader } from "./PageLoader";

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{node}</Suspense>
);

const HomePage = lazy(() => import("../features/home/pages/HomePage"));
const CityDetailsPage = lazy(() => import("../pages/CityDetailsPage"));

const EventosPage = lazy(() => import("../pages/EventosPage"));
const DetailsEventsPage = lazy(() => import("../pages/DetailsEventsPage"));

const PontosTuristicosPage = lazy(() => import("../pages/PontosTuristicosPage"));
const DetailsPontoPage = lazy(() => import("../pages/DetailsPontoPage"));

const AboutPage = lazy(() => import("../pages/AboutPage"));

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

export const AppRoutes: RouteConfig[] = [
  {
    path: "",
    element: <DefaultTemplate />,
    children: [
      // Home
      { path: "/", element: withSuspense(<HomePage />) },

      // Cidades (institucional)
      { path: "/cidades/:slug", element: withSuspense(<CityDetailsPage />) },

      // Eventos
      { path: "/eventos", element: withSuspense(<EventosPage />) },
      { path: "/eventos/:id", element: withSuspense(<DetailsEventsPage />) },

      // Pontos turísticos
      { path: "/pontos-turisticos", element: withSuspense(<PontosTuristicosPage />) },
      { path: "/pontos-turisticos/:id", element: withSuspense(<DetailsPontoPage />) },

      // Sobre
      { path: "/sobre", element: withSuspense(<AboutPage />) },

      // 404
      {
        path: "*",
        element: (
          <div className="p-4 text-center text-sm text-slate-500">
            Página não encontrada
          </div>
        ),
      },
    ],
  },
];