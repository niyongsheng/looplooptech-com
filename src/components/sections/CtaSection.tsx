import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";
import { DEMO_MAILTO } from "./SectionHeading";

/**
 * Final CTA with engineering grid + glow (DESIGN.md §8).
 */
export default function CtaSection() {
  const t = useTranslations("home.cta");

  return (
    <section className="section relative overflow-hidden">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_55%_65%_at_50%_50%,black_30%,transparent_100%)]" />
      <div className="glow-orb -top-24 left-1/2 h-80 w-[480px] max-w-full -translate-x-1/2" />
      <div className="container-x relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold leading-[1.2] tracking-tight text-fg md:text-4xl">
            {t("title")}
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-4 max-w-xl text-balance leading-relaxed text-fg-muted">
            {t("subtitle")}
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href={DEMO_MAILTO} className="btn-primary">
              {t("primary")}
            </a>
            <a href={DEMO_MAILTO} className="btn-secondary">
              {t("secondary")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
