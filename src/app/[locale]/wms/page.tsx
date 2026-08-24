import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ArchitectureSection from "@/components/sections/ArchitectureSection";
import CtaSection from "@/components/sections/CtaSection";
import FeatureGrid from "@/components/sections/FeatureGrid";
import ProductHero from "@/components/sections/ProductHero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.wms" });
  return { title: t("title"), description: t("description") };
}

export default async function WmsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ProductHero product="wms" />
      <FeatureGrid ns="wms.features" accent="wms" id="features" />
      <ArchitectureSection ns="wms.architecture" accent="wms" />
      <CtaSection />
    </>
  );
}
