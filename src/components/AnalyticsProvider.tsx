"use client";

import { AptabaseProvider, useAptabase } from "@aptabase/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

// Aptabase App Key：A-US 前缀表示美国区数据节点。
// 该 Key 会随静态站点公开，只能用于写入匿名事件，不能当作密钥使用。
const APTABASE_APP_KEY = "A-US-9291316627";

/**
 * 上报页面访问。首屏与客户端路由切换都会触发；
 * StrictMode 双执行、Provider 初始化完成后 trackEvent 换新引用导致的重复执行，用 ref 去重。
 */
function PageViewTracker() {
  const pathname = usePathname();
  const { trackEvent } = useAptabase();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    // 根路径只做语言跳转，不计入页面访问。
    if (!pathname || pathname === "/") return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackEvent("page_view", { path: pathname });
  }, [pathname, trackEvent]);

  return null;
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  return (
    <AptabaseProvider appKey={APTABASE_APP_KEY}>
      <PageViewTracker />
      {children}
    </AptabaseProvider>
  );
}
