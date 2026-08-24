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
  const t = await getTranslations({ locale, namespace: "meta.lims" });
  return { title: t("title"), description: t("description") };
}

export default async function LimsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ProductHero product="lims" />
      <FeatureGrid ns="lims.features" accent="lims" id="features" />
      <ArchitectureSection ns="lims.architecture" accent="lims" />
      <CtaSection />
    </>
  );
}
