import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";
import type { Accent, ArchItem } from "@/types";
import { SectionHeading } from "./SectionHeading";

const tagStyles: Record<Accent, string> = {
  brand: "border-brand/30 bg-brand-soft text-brand",
  wms: "border-wms/30 bg-wms-soft text-wms",
  lims: "border-lims/30 bg-lims-soft text-lims",
  icms: "border-icms/30 bg-icms-soft text-icms",
};

/**
 * Architecture cards with mono tags (DESIGN.md §6.3).
 */
export default function ArchitectureSection({
  ns,
  accent = "brand",
}: {
  ns: string;
  accent?: Accent;
}) {
  const t = useTranslations(ns);
  const items = t.raw("items") as ArchItem[];

  return (
    <section className="section relative overflow-hidden">
      <div className="glow-orb -left-24 bottom-0 h-64 w-64 opacity-50" />
      <div className="container-x relative">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.tag} delay={i * 120}>
              <div className="card h-full">
                <span
                  className={`inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-xs tracking-wide ${tagStyles[accent]}`}
                >
                  {item.tag}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-fg">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
