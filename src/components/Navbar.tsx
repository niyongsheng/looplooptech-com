"use client";

import { Building2, ChevronDown, FlaskConical, Menu, Warehouse, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import LocaleSwitch from "@/components/LocaleSwitch";
import LogoMark from "@/components/LogoMark";
import ThemeToggle from "@/components/ThemeToggle";
import { Link, usePathname } from "@/i18n/navigation";

const DEMO_MAILTO = "mailto:hello@looplooptech.com";

export default function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-fg/[0.08] bg-bg/55 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="logo-loop flex items-center gap-2.5">
          <LogoMark className="h-7 w-7 text-brand" />
          <span className="text-[17px] font-bold tracking-tight text-fg">
            LoopLoop<span className="text-brand">Tech</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* Products dropdown */}
          <div className="group relative">
            <button
              type="button"
              className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
            >
              {t("products")}
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 translate-y-2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid gap-2 rounded-2xl border border-border bg-bg p-2 shadow-[var(--shadow-card)]">
                <Link
                  href="/wms"
                  className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-bg-subtle"
                >
                  <span className="icon-box mt-0.5 bg-wms-soft text-wms">
                    <Warehouse className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-fg">
                      {t("wms")}
                    </span>
                    <span className="mt-0.5 block text-xs text-fg-muted">
                      {t("wmsTag")}
                    </span>
                  </span>
                </Link>
                <Link
                  href="/lims"
                  className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-bg-subtle"
                >
                  <span className="icon-box mt-0.5 bg-lims-soft text-lims">
                    <FlaskConical className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-fg">
                      {t("lims")}
                    </span>
                    <span className="mt-0.5 block text-xs text-fg-muted">
                      {t("limsTag")}
                    </span>
                  </span>
                </Link>
                <Link
                  href="/icms"
                  className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-bg-subtle"
                >
                  <span className="icon-box mt-0.5 bg-icms-soft text-icms">
                    <Building2 className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-fg">
                      {t("icms")}
                    </span>
                    <span className="mt-0.5 block text-xs text-fg-muted">
                      {t("icmsTag")}
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/#platform"
            className="flex h-9 items-center rounded-lg px-3 text-sm text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
          >
            {t("solutions")}
          </Link>
          <Link
            href="/about"
            className={`flex h-9 items-center rounded-lg px-3 text-sm transition-colors hover:bg-bg-subtle hover:text-fg ${
              pathname.startsWith("/about") ? "text-fg" : "text-fg-muted"
            }`}
          >
            {t("about")}
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LocaleSwitch />
          </div>
          <ThemeToggle />
          <a href={DEMO_MAILTO} className="btn-primary hidden md:inline-flex">
            {t("cta")}
          </a>
          <button
            type="button"
            aria-label={t("menu")}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-x-0 top-16 bottom-0 z-40 border-t border-border bg-bg transition-all duration-300 md:hidden ${
          mobileOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <nav className="container-x flex flex-col gap-1 py-6">
          <Link
            href="/wms"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-base text-fg transition-colors hover:bg-bg-subtle"
          >
            <span className="icon-box bg-wms-soft text-wms">
              <Warehouse className="h-5 w-5" strokeWidth={1.5} />
            </span>
            {t("wms")} {t("wmsTag")}
          </Link>
          <Link
            href="/lims"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-base text-fg transition-colors hover:bg-bg-subtle"
          >
            <span className="icon-box bg-lims-soft text-lims">
              <FlaskConical className="h-5 w-5" strokeWidth={1.5} />
            </span>
            {t("lims")} {t("limsTag")}
          </Link>
          <Link
            href="/icms"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-base text-fg transition-colors hover:bg-bg-subtle"
          >
            <span className="icon-box bg-icms-soft text-icms">
              <Building2 className="h-5 w-5" strokeWidth={1.5} />
            </span>
            {t("icms")} {t("icmsTag")}
          </Link>
          <Link
            href="/#platform"
            className="rounded-xl px-3 py-3 text-base text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
          >
            {t("solutions")}
          </Link>
          <Link
            href="/about"
            className="rounded-xl px-3 py-3 text-base text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
          >
            {t("about")}
          </Link>
          <div className="mt-4 flex items-center gap-3 px-3">
            <LocaleSwitch />
            <a href={DEMO_MAILTO} className="btn-primary flex-1">
              {t("cta")}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
