"use client";

import { Mail, Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const DEMO_EMAIL = "info@looplooptech.com";
export const DEMO_PHONE = "+86 188-5393-6112";
export const DEMO_TEL = "tel:+8618853936112";

/**
 * 「预约演示」右侧抽屉（DESIGN.md §6.5）：邮箱与电话两个联系选项。
 * 由 Navbar 控制开关；关闭方式：X、点击遮罩、Esc。
 */
export default function DemoDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("demo");
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  // 挂载后才渲染 portal（SSR 无 document）；header 的 backdrop-blur 会成为
  // fixed 后代的包含块，故抽屉必须 portal 到 body 之外的位置。
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      restoreRef.current?.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[60] ${open ? "visible" : "invisible"}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-drawer-title"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-border bg-bg p-7 shadow-2xl outline-none transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {t("title")}
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
              {t("desc")}
            </p>
          </div>
          <button
            type="button"
            aria-label={t("close")}
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <a
            href={`mailto:${DEMO_EMAIL}`}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-bg-subtle p-5 transition-all duration-200 hover:-translate-y-px hover:border-brand/40 hover:shadow-[var(--shadow-card)]"
          >
            <span className="icon-box shrink-0 bg-brand-soft text-brand">
              <Mail className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-fg">
                {t("emailLabel")}
              </span>
              <span className="mt-1 block truncate font-mono text-[13px] text-brand">
                {DEMO_EMAIL}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-fg-muted">
                {t("emailDesc")}
              </span>
            </span>
          </a>

          <a
            href={DEMO_TEL}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-bg-subtle p-5 transition-all duration-200 hover:-translate-y-px hover:border-brand/40 hover:shadow-[var(--shadow-card)]"
          >
            <span className="icon-box shrink-0 bg-brand-soft text-brand">
              <Phone className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-fg">
                {t("phoneLabel")}
              </span>
              <span className="mt-1 block truncate font-mono text-[13px] text-brand">
                {DEMO_PHONE}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-fg-muted">
                {t("phoneDesc")}
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
