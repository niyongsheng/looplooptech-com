import { useTranslations } from "next-intl";
import Counter from "@/components/Counter";
import Reveal from "@/components/Reveal";
import type { StatItem } from "@/types";

/**
 * Count-up metrics bar (DESIGN.md §7.2 数字滚动).
 */
export default function StatsBar({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
      {items.map((item, i) => (
        <Reveal key={item.label} delay={i * 80} className="text-center">
          <div className="font-mono text-3xl font-bold tracking-tight text-fg md:text-4xl">
            <Counter value={item.value} suffix={item.suffix} />
          </div>
          <div className="mt-2 text-sm text-fg-muted">{item.label}</div>
        </Reveal>
      ))}
    </div>
  );
}

export function StatsBarSection({ ns }: { ns: string }) {
  const t = useTranslations(ns);
  const items = t.raw("items") as StatItem[];
  return (
    <section className="section pt-0">
      <div className="container-x">
        <StatsBar items={items} />
      </div>
    </section>
  );
}
