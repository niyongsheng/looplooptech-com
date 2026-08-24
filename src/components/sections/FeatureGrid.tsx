import { useTranslations } from "next-intl";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/SpotlightCard";
import type { Accent, FeatureItem } from "@/types";
import { SectionHeading } from "./SectionHeading";

const iconBox: Record<Accent, string> = {
  brand: "bg-brand-soft text-brand",
  wms: "bg-wms-soft text-wms",
  lims: "bg-lims-soft text-lims",
  icms: "bg-icms-soft text-icms",
};

/**
 * Feature grid with spotlight hover (DESIGN.md §6.2 / §7.2).
 */
export default function FeatureGrid({
  ns,
  accent = "brand",
  id,
}: {
  ns: string;
  accent?: Accent;
  id?: string;
}) {
  const t = useTranslations(ns);
  const items = t.raw("items") as FeatureItem[];

  return (
    <section id={id} className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 100}>
              <SpotlightCard className="card h-full">
                <span className={`icon-box ${iconBox[accent]}`}>
                  <Icon name={item.icon} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-fg">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {item.desc}
                </p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
