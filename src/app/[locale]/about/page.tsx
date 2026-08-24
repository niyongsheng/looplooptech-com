import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return { title: t("title"), description: t("description") };
}

type Section = { title: string; desc: string };
type Value = { title: string; desc: string; icon?: string };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("about");
  const sections = t.raw("sections") as Section[];
  const values = t.raw("values.items") as Value[];

  return (
    <section className="relative overflow-hidden pb-24 pt-32 md:pt-44">
      <div className="glow-orb -top-24 right-[15%] h-64 w-64 opacity-60" />
      <div className="container-x relative max-w-2xl">
        <Reveal>
          <h1 className="text-balance text-4xl font-bold leading-[1.15] tracking-tight text-fg md:text-5xl">
            {t("title")}
          </h1>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-8 text-lg leading-relaxed text-fg-muted">
            {t("lead")}
          </p>
        </Reveal>

        {sections.map((section, i) => (
          <Reveal key={section.title} delay={i * 100}>
            <div className="mt-12">
              <h2 className="text-xl font-semibold tracking-tight text-fg">
                {section.title}
              </h2>
              <p className="mt-3 leading-relaxed text-fg-muted">
                {section.desc}
              </p>
            </div>
          </Reveal>
        ))}

        {/* Values */}
        <Reveal delay={100}>
          <div className="mt-14">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {t("values.eyebrow")}
            </span>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {values.map((value) => (
                <div key={value.title} className="card p-5">
                  {value.icon && (
                    <span className="icon-box bg-brand-soft text-brand">
                      <Icon name={value.icon} className="h-5 w-5" />
                    </span>
                  )}
                  <h3 className="mt-4 text-base font-semibold text-fg">
                    {value.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-fg-muted">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Contact */}
        <Reveal delay={150}>
          <div className="mt-16 rounded-2xl border border-border bg-bg-subtle p-8 text-center">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {t("contact.eyebrow")}
            </span>
            <h2 className="mt-5 text-2xl font-bold tracking-tight text-fg">
              {t("contact.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-fg-muted">
              {t("contact.desc")}
            </p>
            <a
              href={`mailto:${t("contact.email")}`}
              className="btn-primary mt-7"
            >
              <Mail className="h-4 w-4" />
              {t("contact.email")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
