"use client";

/*
 * GradientWaves — 雾中波浪（raymarch 正弦波场景）
 * 移植自 React Bits (https://reactbits.dev/backgrounds/gradient-waves)，MIT License
 * Copyright (c) 2025 David Haz (DavidHDev/react-bits)
 *
 * 本站适配（DESIGN.md §7.1 动效原则）：
 * - prefers-reduced-motion：只渲染一帧固定相位的静态波浪，不进入 rAF 循环
 * - 指针监听挂在 window 上：本组件作背景层铺在内容之下（与内容互为兄弟节点），
 *   挂在 canvas 上的话光标压在标题/按钮上时事件到不了（同 CursorGrid 的坑）
 * - maxDpr 可调：全屏 raymarch 的 fragment 成本按 dpr² 增长，
 *   视网膜屏上默认的 dpr=2 会让像素量翻 4 倍，必须能压下来
 * - 原版自带的 IntersectionObserver + visibilitychange 停帧保留
 */
import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

export type GradientWavesDetail = "low" | "medium" | "high";

export interface GradientWavesProps {
  horizonColor?: string;
  waveColor?: string;
  crestColor?: string;
  speed?: number;
  amplitude?: number;
  waveScale?: number;
  waveRatio?: number;
  swell?: number;
  turbulence?: number;
  tilt?: number;
  zoom?: number;
  height?: number;
  fogDepth?: number;
  detail?: GradientWavesDetail;
  brightness?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  parallaxStrength?: number;
  grain?: boolean;
  grainIntensity?: number;
  /** 渲染分辨率上限（默认 1.5）。raymarch 成本随 dpr² 增长，视网膜屏上别开到 2 */
  maxDpr?: number;
  className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

const detailToSteps = (detail: GradientWavesDetail): number => {
  if (detail === "low") return 40.0;
  if (detail === "high") return 110.0;
  return 70.0;
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec2 uMouse;
uniform float uParallax;
uniform bool uEnableMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;

const float MAX_DIST = 20000.0;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float plasma(vec3 r, vec2 freq, vec4 tc) {
  float mx = r.x + tc.x;
  mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);
  float my = r.y - tc.z;
  my += uTurbulence * cos(r.x / 23.0 + tc.w);
  return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight);
}

float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
  float dist = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float dscene = plasma(pos + dist * dir, freq, tc);
    if (abs(dscene) < 0.1) break;
    dist += 0.9 * dscene;
    if (!(abs(dist) < MAX_DIST)) return MAX_DIST;
  }
  return dist;
}

void main() {
  float T = iTime * uSpeed;
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
  float c, s;
  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot); s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  c = nuv.x; s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt); s = sin(uTilt);
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

  if (uEnableMouse) {
    float yaw = (uMouse.x - 0.5) * uParallax * 0.4;
    float pitch = (uMouse.y - 0.5) * uParallax * 0.4;
    c = cos(yaw); s = sin(yaw);
    dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;
    c = cos(pitch); s = sin(pitch);
    dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  }

  float dist = raymarch(cam, dir, freq, tc);
  vec3 pos = cam + dist * dir;

  float t = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0);
  vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 col = mix(uHorizonColor, body, t);
  col *= uBrightness;
  col = clamp(col, 0.0, 1.0);

  float alpha = clamp(t, 0.0, 1.0) * uOpacity;
  if (uGrain > 0.5) {
    float g = hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 11.0);
    alpha += (g - 0.5) * uGrainIntensity;
  }
  alpha = clamp(alpha, 0.0, 1.0);
  fragColor = vec4(col * alpha, alpha);
}
`;

interface GradientWavesCtx {
  renderer: InstanceType<typeof Renderer>;
  program: InstanceType<typeof Program>;
  mesh: InstanceType<typeof Mesh>;
  /** 静止态（reduced-motion / props 变更后）手动补一帧 */
  renderOnce: () => void;
}
const ctxMap = new WeakMap<HTMLDivElement, GradientWavesCtx>();

/** reduced-motion 下渲染的固定相位（挑一个波形展开得比较好看的时刻） */
const STATIC_TIME = 3.2;

export default function GradientWaves({
  horizonColor = "#5227FF",
  waveColor = "#FF9FFC",
  crestColor = "#FFFFFF",
  speed = 0.4,
  amplitude = 2.5,
  waveScale = 0.6,
  waveRatio = 0.9,
  swell = 35,
  turbulence = 20,
  tilt = 1.11,
  zoom = 1.0,
  height = 5.5,
  fogDepth = 15,
  detail = "medium",
  brightness = 1.0,
  opacity = 1.0,
  mouseInteraction = true,
  parallaxStrength = 0.5,
  grain = true,
  grainIntensity = 0.05,
  maxDpr = 1.5,
  className = "",
}: GradientWavesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    reducedRef.current = reduced;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, maxDpr),
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: reduced ? STATIC_TIME : 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uSpeed: { value: speed },
        uAmplitude: { value: amplitude },
        uWaveScale: { value: waveScale },
        uWaveRatio: { value: waveRatio },
        uSwell: { value: swell },
        uTurbulence: { value: turbulence },
        uTilt: { value: tilt },
        uZoom: { value: zoom },
        uHeight: { value: height },
        uFogDepth: { value: fogDepth },
        uSteps: { value: detailToSteps(detail) },
        uBrightness: { value: brightness },
        uOpacity: { value: opacity },
        uGrain: { value: grain ? 1.0 : 0.0 },
        uGrainIntensity: { value: grainIntensity },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uParallax: { value: parallaxStrength },
        uEnableMouse: { value: mouseInteraction },
        uHorizonColor: { value: new Float32Array([1, 1, 1]) },
        uWaveColor: { value: new Float32Array([1, 1, 1]) },
        uCrestColor: { value: new Float32Array([1, 1, 1]) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h);
      const res = (program.uniforms.iResolution as { value: Float32Array })
        .value;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
      renderer.render({ scene: mesh });
    };

    const renderOnce = () => renderer.render({ scene: mesh });
    ctxMap.set(container, { renderer, program, mesh, renderOnce });

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    const cleanupFns: Array<() => void> = [
      () => ro.disconnect(),
      () => {
        ctxMap.delete(container);
        try {
          container.removeChild(canvas);
        } catch {
          /* canvas 可能已被移除 */
        }
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      },
    ];

    if (reduced) {
      // 不进入 rAF，也不注册指针监听；由 uniforms effect 补最终一帧
      return () => cleanupFns.forEach((fn) => fn());
    }

    const currentMouse: [number, number] = [0.5, 0.5];
    const targetMouse: [number, number] = [0.5, 0.5];

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        targetMouse[0] = 0.5;
        targetMouse[1] = 0.5;
        return;
      }
      targetMouse[0] = x / rect.width;
      targetMouse[1] = 1 - y / rect.height;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    cleanupFns.push(() =>
      window.removeEventListener("pointermove", onPointerMove)
    );

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const t0 = performance.now();

    const loop = (t: number) => {
      (program.uniforms.iTime as { value: number }).value =
        (t - t0) * 0.001;
      const tx = mouseInteraction ? targetMouse[0] : 0.5;
      const ty = mouseInteraction ? targetMouse[1] : 0.5;
      currentMouse[0] += 0.05 * (tx - currentMouse[0]);
      currentMouse[1] += 0.05 * (ty - currentMouse[1]);
      const m = (program.uniforms.uMouse as { value: Float32Array }).value;
      m[0] = currentMouse[0];
      m[1] = currentMouse[1];
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && raf === 0)
        raf = requestAnimationFrame(loop);
    };
    const tryStop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        isVisible ? tryStart() : tryStop();
      },
      { threshold: 0 }
    );
    io.observe(container);
    cleanupFns.push(() => io.disconnect());

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    cleanupFns.push(() => {
      document.removeEventListener("visibilitychange", onVisibility);
      tryStop();
    });

    tryStart();

    return () => cleanupFns.forEach((fn) => fn());
  }, [maxDpr]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ctx = ctxMap.get(container);
    if (!ctx) return;
    const { program } = ctx;
    const u = program.uniforms as Record<string, { value: number | Float32Array | boolean }>;

    u.uSpeed.value = speed;
    u.uAmplitude.value = amplitude;
    u.uWaveScale.value = waveScale;
    u.uWaveRatio.value = waveRatio;
    u.uSwell.value = swell;
    u.uTurbulence.value = turbulence;
    u.uTilt.value = tilt;
    u.uZoom.value = zoom;
    u.uHeight.value = height;
    u.uFogDepth.value = fogDepth;
    u.uSteps.value = detailToSteps(detail);
    u.uBrightness.value = brightness;
    u.uOpacity.value = opacity;
    u.uGrain.value = grain ? 1.0 : 0.0;
    u.uGrainIntensity.value = grainIntensity;
    u.uParallax.value = parallaxStrength;
    u.uEnableMouse.value = mouseInteraction;
    const hc = u.uHorizonColor.value as Float32Array;
    const wc = u.uWaveColor.value as Float32Array;
    const cc = u.uCrestColor.value as Float32Array;
    const h = hexToRgb(horizonColor);
    const w = hexToRgb(waveColor);
    const cr = hexToRgb(crestColor);
    hc[0] = h[0]; hc[1] = h[1]; hc[2] = h[2];
    wc[0] = w[0]; wc[1] = w[1]; wc[2] = w[2];
    cc[0] = cr[0]; cc[1] = cr[1]; cc[2] = cr[2];

    // 静止态：uniforms 落定后补一帧（rAF 没有在跑）
    if (reducedRef.current) ctx.renderOnce();
  }, [
    horizonColor,
    waveColor,
    crestColor,
    speed,
    amplitude,
    waveScale,
    waveRatio,
    swell,
    turbulence,
    tilt,
    zoom,
    height,
    fogDepth,
    detail,
    brightness,
    opacity,
    grain,
    grainIntensity,
    mouseInteraction,
    parallaxStrength,
  ]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none relative h-full w-full overflow-hidden ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
