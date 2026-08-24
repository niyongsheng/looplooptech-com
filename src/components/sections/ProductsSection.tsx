import {
  ArrowRight,
  Building2,
  Check,
  FlaskConical,
  Warehouse,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/SpotlightCard";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "./SectionHeading";

const accents = {
  wms: {
    iconBox: "bg-wms-soft text-wms",
    tag: "text-wms",
    check: "text-wms",
    glow: "glow-orb--wms",
  },
  lims: {
    iconBox: "bg-lims-soft text-lims",
    tag: "text-lims",
    check: "text-lims",
    glow: "glow-orb--lims",
  },
  icms: {
    iconBox: "bg-icms-soft text-icms",
    tag: "text-icms",
    check: "text-icms",
    glow: "glow-orb--icms",
  },
} as const;

const icons = {
  wms: Warehouse,
  lims: FlaskConical,
  icms: Building2,
} as const;

function ProductCard({ product }: { product: "wms" | "lims" | "icms" }) {
  const t = useTranslations(`home.products.${product}`);
  const tCommon = useTranslations("common");
  const accent = accents[product];
  const Icon = icons[product];
  const features = t.raw("features") as string[];
  const name = product.toUpperCase();

  return (
    <SpotlightCard className="card group relative h-full p-8">
      <div
        className={`glow-orb ${accent.glow} -top-8 right-[-16px] h-40 w-40`}
      />
      <div className="relative flex items-start justify-between">
        <span className={`icon-box ${accent.iconBox}`}>
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <span className="font-mono text-xs tracking-wide text-fg-faint">
          {name}
        </span>
      </div>

      <h3 className="relative mt-6 text-2xl font-bold tracking-tight text-fg">
        {name}
      </h3>
      <span
        className={`relative mt-1 block text-sm font-medium ${accent.tag}`}
      >
        {t("tag")}
      </span>
      <p className="relative mt-4 leading-relaxed text-fg-muted">
        {t("desc")}
      </p>

      <ul className="relative mt-6 space-y-2.5">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2.5 text-sm text-fg"
          >
            <Check className={`h-4 w-4 shrink-0 ${accent.check}`} />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={`/${product}`}
        className="relative mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-all duration-200 hover:gap-3"
      >
        {tCommon("learnMore")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </SpotlightCard>
  );
}

/**
 * 三款独立产品展示（DESIGN.md §8 首页）。
 */
export default function ProductsSection() {
  const t = useTranslations("home.products");

  return (
    <section id="products" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <Reveal delay={0}>
            <ProductCard product="wms" />
          </Reveal>
          <Reveal delay={120}>
            <ProductCard product="lims" />
          </Reveal>
          <Reveal delay={240}>
            <ProductCard product="icms" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
