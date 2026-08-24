import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";
import type { ChapterItem } from "@/types";
import { SectionHeading } from "./SectionHeading";

/**
 * Numbered chapters 01/02/03, DeepSeek-Harness style (DESIGN.md §7.2).
 */
export default function HowSection() {
  const t = useTranslations("home.how");
  const chapters = t.raw("chapters") as ChapterItem[];

  return (
    <section className="section relative overflow-hidden">
      <div className="glow-orb left-[-100px] top-1/3 h-64 w-64 opacity-60" />
      <div className="container-x relative">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {chapters.map((chapter, i) => (
            <Reveal key={chapter.no} delay={i * 120}>
              <div className="card group h-full">
                <span className="font-mono text-5xl font-bold leading-none tracking-tight text-brand/20 transition-colors duration-300 group-hover:text-brand/40">
                  {chapter.no}
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-fg">
                  {chapter.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  {chapter.desc}
                </p>
                <div className="mt-6 h-px w-full bg-gradient-to-r from-brand/40 via-border to-transparent transition-all duration-500 group-hover:from-brand" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
