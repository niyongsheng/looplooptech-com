import { useTranslations } from "next-intl";
import LogoMark from "@/components/LogoMark";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-subtle">
      <div className="container-x py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="logo-loop flex items-center gap-2.5">
              <LogoMark className="h-7 w-7 text-brand" />
              <span className="text-[17px] font-bold tracking-tight text-fg">
                LoopLoop<span className="text-brand">Tech</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
              {t("tagline")}
            </p>
            <a
              href="mailto:hello@looplooptech.com"
              className="mt-4 inline-block font-mono text-[13px] text-brand transition-colors hover:text-brand-hover"
            >
              hello@looplooptech.com
            </a>
          </div>

          {/* Columns */}
          <FooterCol
            title={t("columns.products.title")}
            links={[
              { label: t("columns.products.wms"), href: "/wms" },
              { label: t("columns.products.lims"), href: "/lims" },
              { label: t("columns.products.icms"), href: "/icms" },
            ]}
          />
          <FooterCol
            title={t("columns.company.title")}
            links={[
              { label: t("columns.company.about"), href: "/about" },
              { label: t("columns.company.careers"), href: "mailto:hello@looplooptech.com" },
              { label: t("columns.company.contact"), href: "mailto:hello@looplooptech.com" },
            ]}
          />
          <FooterCol
            title={t("columns.resources.title")}
            links={[
              { label: t("columns.resources.docs"), href: "#" },
              { label: t("columns.resources.api"), href: "#" },
              { label: t("columns.resources.status"), href: "#" },
            ]}
          />
          <FooterCol
            title={t("columns.legal.title")}
            links={[
              { label: t("columns.legal.privacy"), href: "#" },
              { label: t("columns.legal.terms"), href: "#" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-[13px] text-fg-faint sm:flex-row sm:items-center">
          <span>{t("copyright", { year })}</span>
          <span className="font-mono">www.looplooptech.com</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            {/^https?:|^mailto:/.test(link.href) ? (
              <a
                href={link.href}
                className="text-sm text-fg-muted transition-colors hover:text-brand"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href as any}
                className="text-sm text-fg-muted transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
