import React from "react";
import type { ReactNode } from "react";
import { Card } from "./Card";
import { Button } from "./Button";

type Tone = "primary" | "success" | "warning" | "neutral";

type HeroAction = {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
};

export interface HeroSectionProps {
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  tone?: Tone;
  align?: "left" | "center";
  actions?: HeroAction[];
  rightSlot?: ReactNode;
  className?: string;
}

const toneStyles: Record<Tone, { kicker: string; ring: string; glow: string }> = {
  primary: {
    kicker: "text-brand-primary",
    ring: "ring-brand-primary/15",
    glow: "from-brand-primary/15",
  },
  success: {
    kicker: "text-brand-success",
    ring: "ring-brand-success/15",
    glow: "from-brand-success/15",
  },
  warning: {
    kicker: "text-brand-warning",
    ring: "ring-brand-warning/20",
    glow: "from-brand-warning/15",
  },
  neutral: {
    kicker: "text-slate-500",
    ring: "ring-slate-200",
    glow: "from-slate-200/40",
  },
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  kicker,
  title,
  subtitle,
  tone = "primary",
  align = "left",
  actions,
  rightSlot,
  className = "",
}) => {
  const t = toneStyles[tone];
  const isCenter = align === "center";

  return (
    <section className={className} aria-label="Seção principal">
      <Card className={`relative overflow-hidden p-6 sm:p-10 ring-1 ${t.ring}`}>
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl",
            "bg-gradient-to-br",
            t.glow,
            "to-transparent",
          ].join(" ")}
        />

        <div className={`relative flex flex-col gap-5 ${isCenter ? "items-center text-center" : ""}`}>
          <div className="flex w-full items-start justify-between gap-4">
            <div className={isCenter ? "w-full" : "max-w-3xl"}>
              {kicker ? (
                <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${t.kicker}`}>
                  {kicker}
                </p>
              ) : null}

              <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                {title}
              </h1>

              {subtitle ? (
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {subtitle}
                </p>
              ) : null}

              {actions?.length ? (
                <div className={`mt-5 flex flex-wrap gap-2 ${isCenter ? "justify-center" : ""}`}>
                  {actions.map((a) => {
                    const variant = a.variant ?? "secondary";

                    if (a.href) {
                      return (
                        <a key={a.label} href={a.href} className="inline-flex">
                          <Button variant={variant} size="md">
                            {a.label}
                          </Button>
                        </a>
                      );
                    }

                    return (
                      <Button key={a.label} variant={variant} size="md" onClick={a.onClick}>
                        {a.label}
                      </Button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {rightSlot ? <div className="hidden sm:block shrink-0">{rightSlot}</div> : null}
          </div>
        </div>
      </Card>
    </section>
  );
};