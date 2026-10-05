"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

/**
 * 联系方式芯片（QQ / 微信等账号）：点击复制到剪贴板。
 * 复制文案沿用 `common.copy` / `common.copied`。
 */
export default function CopyValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // 剪贴板不可用（非 HTTPS 或权限被拒）时静默降级，用户仍可手动选中文本
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`${t("copy")} ${label}: ${value}`}
      className="group inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 font-mono text-[13px] transition-colors duration-200 hover:border-brand/40 hover:bg-bg-subtle"
    >
      <span className="text-fg-faint">{label}</span>
      <span className="text-fg-muted transition-colors group-hover:text-fg">
        {value}
      </span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-brand" aria-hidden />
      ) : (
        <Copy
          className="h-3.5 w-3.5 text-fg-faint opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? t("copied") : ""}
      </span>
    </button>
  );
}
