import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CtaSection from "@/components/sections/CtaSection";
import FeatureGrid from "@/components/sections/FeatureGrid";
import Hero from "@/components/sections/Hero";
import HowSection from "@/components/sections/HowSection";
import ProductsSection from "@/components/sections/ProductsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return { title: t("title"), description: t("description") };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ProductsSection />
      <FeatureGrid ns="home.capabilities" id="platform" />
      <HowSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
