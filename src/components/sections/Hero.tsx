import { useTranslations } from "next-intl";
import CursorGrid from "@/components/CursorGrid";
import HeroWaves from "@/components/HeroWaves";
import Reveal from "@/components/Reveal";
import StarBorder from "@/components/StarBorder";
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
      {/* GradientWaves 波浪底 + Engineering grid（网格叠在波浪上保留工程纹理）
          底部必须用 mask 淡出：着色器里 alpha = fogDepth/dist，近处全不透明，
          容器底边会切出一条硬边。 */}
      <div className="absolute inset-x-0 top-0 h-[600px] [mask-image:linear-gradient(to_bottom,black_58%,transparent_100%)] md:h-[820px]">
        <HeroWaves />
      </div>
      {/* 静态格线（CSS，含 60s 漂移）打底，光标点亮层叠在上面共用同一层 mask */}
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black_35%,transparent_100%)]">
        <div className="bg-grid absolute inset-0" />
        <CursorGrid />
      </div>

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
              <span className="text-shine">{t("titleGradient")}</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-fg-muted">
              {t("subtitle")}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <StarBorder>
                <a href={DEMO_MAILTO} className="btn-primary">
                  {tCta("bookDemo")}
                </a>
              </StarBorder>
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
