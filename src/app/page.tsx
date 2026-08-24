"use client";

import { useEffect } from "react";
import { routing } from "@/i18n/routing";

// GitHub Pages 静态托管不执行服务端重定向，
// 这里用一次客户端跳转把根路径送回到默认语言首页（/zh/）。
export default function RootRedirect() {
  useEffect(() => {
    window.location.replace(`/${routing.defaultLocale}/`);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-fg-muted">跳转中…</p>
    </div>
  );
}