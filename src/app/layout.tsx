import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

// 静态导出下 GitHub Pages 无服务端重定向，根路径 "/" 由 src/app/page.tsx 做客户端跳转，
// 因此需要一个根 layout 承载 <html>/<body>；语言相关的渲染仍在 [locale]/layout 中。
export const metadata: Metadata = {
  // 兜底 metadataBase，保证 og:image / canonical 等 URL 指向正式域名
  metadataBase: new URL("https://www.looplooptech.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        {/* Cookiebot 同意管理：auto 模式需在首屏第三方脚本之前于 <head> 加载 */}
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="3d19d30c-c3ab-4ea4-a453-0996e2044dea"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}