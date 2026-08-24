"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LocaleSwitch({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  const options = [
    { code: "zh", label: "中" },
    { code: "en", label: "EN" },
  ];

  return (
    <div
      className={`flex items-center rounded-lg border border-border bg-bg-subtle p-0.5 ${
        isPending ? "opacity-60" : ""
      }`}
      aria-label={t("language")}
    >
      {options.map((opt) => (
        <button
          key={opt.code}
          type="button"
          onClick={() => opt.code !== locale && switchTo(opt.code)}
          aria-pressed={locale === opt.code}
          className={`rounded-md px-2 py-1 font-mono text-xs transition-colors duration-200 ${
            locale === opt.code
              ? "bg-brand text-white"
              : "text-fg-muted hover:text-fg"
          } ${compact ? "min-w-8" : "min-w-9"}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
