import type { CSSProperties, ReactNode } from "react";

/*
 * Star Border 流光边框 — 移植思路自 React Bits (https://reactbits.dev/animations/star-border)，MIT License
 * 两颗彗星光点沿上下边框反向循环流动（纯 CSS 实现，无需 client 边界）。
 */
export default function StarBorder({
  children,
  className = "",
  color = "rgba(255, 255, 255, 0.85)",
  speed = "4s",
}: {
  children: ReactNode;
  className?: string;
  /** 彗星光点颜色（在纯色按钮上建议半透白） */
  color?: string;
  /** 单侧流动周期 */
  speed?: string;
}) {
  return (
    <span
      className={`star-border ${className}`}
      style={{ "--star-color": color, "--star-speed": speed } as CSSProperties}
    >
      <span className="star-border-inner">{children}</span>
    </span>
  );
}
