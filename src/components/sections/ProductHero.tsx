import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";
import StatsBar from "@/components/sections/StatsBar";
import Terminal, { type TermLine } from "@/components/Terminal";
import type { StatItem } from "@/types";
import { DEMO_MAILTO } from "./SectionHeading";

const accentStyles = {
  wms: {
    badge:
      "border-wms/30 bg-wms-soft text-wms",
    gradient: "text-gradient-wms",
    glow: "glow-orb--wms",
  },
  lims: {
    badge:
      "border-lims/30 bg-lims-soft text-lims",
    gradient: "text-gradient-lims",
    glow: "glow-orb--lims",
  },
  icms: {
    badge:
      "border-icms/30 bg-icms-soft text-icms",
    gradient: "text-gradient-icms",
    glow: "glow-orb--icms",
  },
} as const;

/**
 * Product page hero: split layout with terminal demo + metrics (DESIGN.md §8).
 */
export default function ProductHero({
  product,
}: {
  product: "wms" | "lims" | "icms";
}) {
  const t = useTranslations(`${product}.hero`);
  const tCommon = useTranslations("common");
  const tStats = useTranslations(`${product}.metrics`);
  const lines = t.raw("lines") as TermLine[];
  const stats = tStats.raw("items") as StatItem[];
  const accent = accentStyles[product];

  return (
    <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-44">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_35%,transparent_100%)]" />
      <div className={`glow-orb ${accent.glow} -top-20 right-[8%] h-72 w-72`} />
      <div className="glow-orb -left-20 top-[300px] h-56 w-56 opacity-60" />

      <div className="container-x relative">
        <div className="grid items-center gap-12 lg:grid-cols-[5fr_7fr]">
          {/* Copy */}
          <div>
            <Reveal>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[13px] tracking-wide ${accent.badge}`}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                {t("badge")}
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.15] tracking-tight text-fg md:text-5xl">
                {t("titleLead")}
                <span className={accent.gradient}>
                  {t("titleGradient")}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-fg-muted">
                {t("subtitle")}
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href={DEMO_MAILTO} className="btn-primary">
                  {tCommon("bookDemo")}
                </a>
                <a href="#features" className="btn-secondary">
                  {tCommon("learnMore")}
                </a>
              </div>
            </Reveal>
          </div>

          {/* Terminal demo */}
          <Reveal delay={200}>
            <div className="relative">
              <div
                className={`glow-orb ${accent.glow} -right-10 -top-10 h-48 w-48`}
              />
              <div className="float-soft relative">
                <Terminal title={t("terminalTitle")} lines={lines} />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Metrics */}
        <div className="mt-16 border-t border-border pt-12 md:mt-20">
          <StatsBar items={stats} />
        </div>
      </div>
    </section>
  );
}
