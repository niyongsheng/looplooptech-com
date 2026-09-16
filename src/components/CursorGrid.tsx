"use client";

/*
 * CursorGrid — 光标响应网格（Canvas 2D，无依赖）
 * 移植自 React Bits (https://reactbits.dev/animations/cursor-grid)，MIT License
 * Copyright (c) 2025 David Haz (DavidHDev/react-bits)
 *
 * 本站适配（DESIGN.md §7.1 动效原则）：
 * - 指针监听挂在 window 上：本组件作背景层铺在内容之下（`absolute inset-0`，
 *   与内容互为兄弟节点），光标压在标题/按钮上时事件冒泡不到容器，挂在容器上会漏掉大半区域。
 *   因此改为监听 window 再按 canvas 的 boundingRect 换算成本地坐标并做区域裁剪。
 * - prefers-reduced-motion：不注册任何指针监听，画布保持空白，只留底层 CSS 网格。
 * - IntersectionObserver：滚出视口后不再响应指针，避免同页多个实例的无效计算。
 * - 只画光标点亮格，静态格线交给底层 CSS `.bg-grid`（保留其 60s 漂移）；
 *   本组件空闲时会 clearRect 自己，CSS 网格自然透出。
 */
import { useEffect, useRef } from "react";

type Falloff = "linear" | "smooth" | "sharp";

export interface CursorGridProps {
  cellSize?: number;
  color?: string;
  radius?: number;
  falloff?: Falloff;
  holdTime?: number;
  fadeDuration?: number;
  lineWidth?: number;
  maxOpacity?: number;
  cellRadius?: number;
  clickPulse?: boolean;
  pulseSpeed?: number;
  /** 与底层 `.bg-grid` 的 grid-drift 动画同步用（CSS 里是 44px / 60s，改那边要一起改） */
  driftDistance?: number;
  driftDuration?: number;
  className?: string;
}

interface GridConfig {
  cellSize: number;
  color: string;
  radius: number;
  falloff: Falloff;
  holdTime: number;
  fadeDuration: number;
  lineWidth: number;
  maxOpacity: number;
  cellRadius: number;
  clickPulse: boolean;
  pulseSpeed: number;
}

interface Pulse {
  x: number;
  y: number;
  t0: number;
}

const FALLOFF_CURVES: Record<Falloff, (t: number) => number> = {
  linear: (t) => t,
  smooth: (t) => t * t * (3 - 2 * t),
  sharp: (t) => t * t * t,
};

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(v.slice(0, 6), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

export default function CursorGrid({
  cellSize = 44,
  color = "#1e80ff",
  radius = 180,
  falloff = "smooth",
  holdTime = 400,
  fadeDuration = 800,
  lineWidth = 0.75,
  maxOpacity = 1,
  cellRadius = 0,
  clickPulse = true,
  pulseSpeed = 600,
  driftDistance = 44,
  driftDuration = 60000,
  className = "",
}: CursorGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef<GridConfig>({} as GridConfig);
  const wakeRef = useRef<(() => void) | null>(null);

  propsRef.current = {
    cellSize,
    color,
    radius,
    falloff,
    holdTime,
    fadeDuration,
    lineWidth,
    maxOpacity,
    cellRadius,
    clickPulse,
    pulseSpeed,
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // 与底层 CSS 网格的 grid-drift 动画对齐：两边都是 44px 格子阵，
    // 但 CSS 那边 background-position 以 44px/60s 匀速平移，画布不跟随就会一路错开到半个格子。
    // 读 Web Animations API 的 currentTime 而非 getComputedStyle，避免每帧触发样式重算。
    const gridEl =
      container.parentElement?.querySelector<HTMLElement>(".bg-grid") ?? null;
    const gridAnim = gridEl?.getAnimations()[0] ?? null;
    let drift = 0;
    const syncDrift = () => {
      if (!gridAnim) return;
      const ct = gridAnim.currentTime;
      const ms = typeof ct === "number" ? ct : 0;
      drift =
        (driftDistance * (((ms % driftDuration) + driftDuration) % driftDuration)) /
        driftDuration;
    };

    // Grid state: one alpha + timestamp pair per cell, indexed row-major.
    let cols = 0;
    let rows = 0;
    let alphas = new Float32Array(0);
    let touched = new Float64Array(0);
    let w = 0;
    let h = 0;
    const pulses: Pulse[] = [];
    let raf = 0;
    let running = false;
    let lastFrame = 0;
    let visible = true;

    const rebuild = () => {
      const p = propsRef.current;
      w = container.offsetWidth;
      h = container.offsetHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / p.cellSize) + 1;
      rows = Math.ceil(h / p.cellSize) + 1;
      alphas = new Float32Array(cols * rows);
      touched = new Float64Array(cols * rows);
    };

    // 格心锚定在 (0,0)（React Bits 原版居中），再叠上 CSS 网格当前的漂移量
    const cellCenter = (i: number): [number, number] => {
      const p = propsRef.current;
      const cx = drift + (i % cols) * p.cellSize + p.cellSize / 2;
      const cy = drift + Math.floor(i / cols) * p.cellSize + p.cellSize / 2;
      return [cx, cy];
    };

    // Light up every cell whose center falls inside the radius, with the
    // configured falloff curve mapping distance to brightness.
    const energize = (x: number, y: number) => {
      const p = propsRef.current;
      const r = Math.max(p.radius, 1);
      const ease = FALLOFF_CURVES[p.falloff] ?? FALLOFF_CURVES.linear;
      const now = performance.now();
      syncDrift();
      const half = p.cellSize / 2;
      const minCol = Math.max(0, Math.floor((x - r - drift - half) / p.cellSize));
      const maxCol = Math.min(cols - 1, Math.floor((x + r - drift - half) / p.cellSize));
      const minRow = Math.max(0, Math.floor((y - r - drift - half) / p.cellSize));
      const maxRow = Math.min(rows - 1, Math.floor((y + r - drift - half) / p.cellSize));
      for (let cRow = minRow; cRow <= maxRow; cRow++) {
        for (let cCol = minCol; cCol <= maxCol; cCol++) {
          const i = cRow * cols + cCol;
          const [cx, cy] = cellCenter(i);
          const dist = Math.hypot(cx - x, cy - y);
          if (dist > r) continue;
          const level = ease(1 - dist / r) * p.maxOpacity;
          if (level > alphas[i]) {
            alphas[i] = level;
            touched[i] = now;
          } else if (level > 0) {
            touched[i] = now;
          }
        }
      }
    };

    const draw = (now: number) => {
      const p = propsRef.current;
      const dt = Math.min(now - lastFrame, 50);
      lastFrame = now;
      ctx.clearRect(0, 0, w, h);
      const [cr, cg, cb] = hexToRgb(p.color);
      syncDrift();
      const half = p.cellSize / 2;

      // Expanding click pulses hand their energy to cells as they pass
      for (let pi = pulses.length - 1; pi >= 0; pi--) {
        const pulse = pulses[pi];
        const age = (now - pulse.t0) / 1000;
        const ringR = age * p.pulseSpeed;
        if (ringR > Math.hypot(w, h)) {
          pulses.splice(pi, 1);
          continue;
        }
        const band = p.cellSize;
        const minCol = Math.max(0, Math.floor((pulse.x - ringR - band - drift - half) / p.cellSize));
        const maxCol = Math.min(cols - 1, Math.floor((pulse.x + ringR + band - drift - half) / p.cellSize));
        const minRow = Math.max(0, Math.floor((pulse.y - ringR - band - drift - half) / p.cellSize));
        const maxRow = Math.min(rows - 1, Math.floor((pulse.y + ringR + band - drift - half) / p.cellSize));
        for (let cRow = minRow; cRow <= maxRow; cRow++) {
          for (let cCol = minCol; cCol <= maxCol; cCol++) {
            const i = cRow * cols + cCol;
            const [cx, cy] = cellCenter(i);
            const dist = Math.hypot(cx - pulse.x, cy - pulse.y);
            if (Math.abs(dist - ringR) < band / 2 && p.maxOpacity > alphas[i]) {
              alphas[i] = p.maxOpacity;
              touched[i] = now;
            }
          }
        }
      }

      let anyVisible = pulses.length > 0;
      const fadeStep = dt / Math.max(p.fadeDuration, 16);

      for (let i = 0; i < alphas.length; i++) {
        let a = alphas[i];
        if (a <= 0) continue;
        if (now - touched[i] > p.holdTime) {
          a = Math.max(0, a - fadeStep);
          alphas[i] = a;
          if (a <= 0) continue;
        }
        anyVisible = true;

        const [cx, cy] = cellCenter(i);
        const gradient = ctx.createRadialGradient(cx, cy, half * 0.1, cx, cy, p.cellSize);
        gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${a})`);
        gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

        const x = cx - half + 0.5;
        const y = cy - half + 0.5;
        const s = p.cellSize - 1;

        ctx.beginPath();
        if (p.cellRadius > 0) {
          ctx.roundRect(x, y, s, s, p.cellRadius);
        } else {
          ctx.rect(x, y, s, s);
        }
        ctx.strokeStyle = gradient;
        ctx.lineWidth = p.lineWidth;
        ctx.stroke();
      }

      if (anyVisible) {
        raf = requestAnimationFrame(draw);
      } else {
        // 无亮格即完全停帧，并清空画布让底层 CSS 网格透出
        running = false;
        ctx.clearRect(0, 0, w, h);
      }
    };

    const wake = () => {
      if (running) return;
      running = true;
      lastFrame = performance.now();
      raf = requestAnimationFrame(draw);
    };
    wakeRef.current = wake;

    const ro = new ResizeObserver(() => {
      rebuild();
      wake();
    });
    ro.observe(container);
    rebuild();

    // 画布是空白初始态，无需主动 wake；仅在有指针交互时才启动

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
      };
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!visible) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      energize(x, y);
      wake();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!visible || !propsRef.current.clickPulse) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      pulses.push({ x, y, t0: performance.now() });
      wake();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        pulses.length = 0;
        alphas.fill(0);
      }
    });
    io.observe(container);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [cellSize, driftDistance, driftDuration]);

  // Repaint when visual props change while idle
  useEffect(() => {
    wakeRef.current?.();
  }, [color, lineWidth, maxOpacity, cellRadius]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none relative h-full w-full overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
