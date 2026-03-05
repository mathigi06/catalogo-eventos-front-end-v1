import React from "react";
import { Outlet } from "react-router-dom";
import { TopNav } from "./TopNav";
import { SiteFooter } from "./SiteFooter";

export default function DefaultTemplate() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}