"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * Card with mouse-following brand glow (DESIGN.md §7.2).
 */
export default function SpotlightCard({
  children,
  className = "",
  spotlightColor,
}: {
  children: ReactNode;
  className?: string;
  /** 聚光颜色（CSS 颜色值），缺省用品牌蓝 --brand-soft */
  spotlightColor?: string;
}) {
  return (
    <div
      className={`spotlight-card ${className}`}
      style={
        spotlightColor
          ? ({ "--spotlight-color": spotlightColor } as CSSProperties)
          : undefined
      }
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--y", `${e.clientY - rect.top}px`);
      }}
    >
      {children}
    </div>
  );
}
