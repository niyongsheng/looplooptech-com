import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 部署到 GitHub Pages：静态导出 + 目录路由需要 trailing slash
  output: "export",
  trailingSlash: true,
};

export default withNextIntl(nextConfig);
