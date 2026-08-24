import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";
import StatsBar from "@/components/sections/StatsBar";
import Terminal, { type TermLine } from "@/components/Terminal";
import type { StatItem } from "@/types";
import { DEMO_MAILTO } from "./SectionHeading";

/**
 * Home hero: centered title + terminal demo + stats (DESIGN.md §8).
 */
export default function Hero() {
  const t = useTranslations("home.hero");
  const tCta = useTranslations("common");
  const tStats = useTranslations("home.stats");
  const lines = t.raw("lines") as TermLine[];
  const stats = tStats.raw("items") as StatItem[];

  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-44">
      {/* Engineering grid + glow orbs */}
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black_35%,transparent_100%)]" />
      <div className="glow-orb -top-24 right-[12%] h-72 w-72" />
      <div className="glow-orb glow-orb--lims left-[-60px] top-[240px] h-64 w-64 opacity-70" />

      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
              {t("badge")}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.15] tracking-tight text-fg md:text-6xl">
              {t("titleLead")}
              <span className="text-gradient">{t("titleGradient")}</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-fg-muted">
              {t("subtitle")}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a href={DEMO_MAILTO} className="btn-primary">
                {tCta("bookDemo")}
              </a>
              <a href="#products" className="btn-secondary">
                {tCta("learnMore")}
              </a>
            </div>
          </Reveal>
        </div>

        {/* Terminal demo */}
        <Reveal delay={320} className="relative mx-auto mt-16 max-w-3xl">
          <div className="glow-orb -top-16 left-1/2 h-56 w-[70%] -translate-x-1/2" />
          <div className="float-soft relative">
            <Terminal title={t("terminalTitle")} lines={lines} />
          </div>
        </Reveal>

        {/* Stats */}
        <div className="mt-16 md:mt-20">
          <StatsBar items={stats} />
        </div>
      </div>
    </section>
  );
}
