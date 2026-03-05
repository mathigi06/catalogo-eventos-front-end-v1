// src/app/App.tsx
import {
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
} from "react-router-dom";
import { AppRoutes } from "./routes";
import { ConfirmProvider } from "../shared/ui/confirm/ConfirmProvider";

function toRRRoutes(routes: typeof AppRoutes): RouteObject[] {
  return routes.map((r) => ({
    path: r.path,
    element: r.element,
    children: r.children ? toRRRoutes(r.children) : undefined,
  }));
}

const router = createBrowserRouter(toRRRoutes(AppRoutes));

export default function App() {
  return (
    <ConfirmProvider>
          <RouterProvider router={router} />
    </ConfirmProvider>
  );
}
