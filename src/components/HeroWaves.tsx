"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// ogl 体积与 WebGL 上下文不进首屏 SSR，水合后按需加载
const GradientWaves = dynamic(() => import("@/components/GradientWaves"), {
  ssr: false,
});

// 色值关系对齐 React Bits 默认的「远处雾色 / 波体 / 浪尖」三级。
// 三级都必须是高亮度色：horizonColor 是远处雾气，t→0 时 alpha 很低，
// 用暗色叠在暗底上什么都看不见（React Bits 默认的 #5227FF 就是亮紫）。
const DARK = { horizon: "#1e80ff", wave: "#8b5cf6", crest: "#e9d5ff" };
// 浅色模式反过来：近处波浪画的是 crestColor，压在近白底上必须是中低明度才成形，
// 用接近白的色值会直接消失。想再清晰就继续加深 crest（它决定波面对白底的对比）
const LIGHT = { horizon: "#60a5fa", wave: "#6366f1", crest: "#8b5cf6" };

/**
 * Hero 波浪背景：按当前主题切换色带（DESIGN.md §7.2 Hero 背景）。
 *
 * raymarch 是全屏逐像素的，比噪声贵得多：detail 用 low（40 步），
 * maxDpr 压到 1.5 —— 视网膜屏上按默认 dpr=2 会让 fragment 量翻 4 倍。
 */
export default function HeroWaves() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 未挂载前不渲染，避免主题闪烁
  if (!mounted) return null;

  const dark = resolvedTheme === "dark";
  const c = dark ? DARK : LIGHT;

  return (
    <GradientWaves
      horizonColor={c.horizon}
      waveColor={c.wave}
      crestColor={c.crest}
      detail="low"
      maxDpr={1.5}
      speed={dark ? 0.35 : 0.3}
      brightness={dark ? 1 : 0.95}
      opacity={dark ? 1 : 1}
      grainIntensity={dark ? 0.05 : 0.035}
    />
  );
}
