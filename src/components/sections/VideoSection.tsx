"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";
import { productVideos } from "@/data/product-videos";
import type { Accent } from "@/types";
import { SectionHeading } from "./SectionHeading";

const activeBorder: Record<Accent, string> = {
  brand: "border-brand",
  wms: "border-wms",
  lims: "border-lims",
  icms: "border-icms",
};

const activeNumber: Record<Accent, string> = {
  brand: "text-brand",
  wms: "text-wms",
  lims: "text-lims",
  icms: "text-icms",
};

/**
 * 产品页视频演示区（DESIGN.md §6.7）：B 站播放器 + 可切换剧集列表。
 * 宽屏剧集列表固定在播放器右侧、面板高度对齐播放器（absolute inset-0 技巧）；
 * 小屏列表置于播放器下方、限高滚动。剧集数据见 src/data/product-videos.ts。
 */
export default function VideoSection({
  product,
  accent = "brand",
}: {
  product: "wms" | "lims" | "icms";
  accent?: Accent;
}) {
  const t = useTranslations(`${product}.video`);
  const items = productVideos[product];
  const [active, setActive] = useState(0);
  const current = items[active];
  const hasList = items.length > 1;

  const player = (
    <div className="term-panel">
      <div className="aspect-video w-full">
        <iframe
          key={current.bvid}
          src={`https://player.bilibili.com/player.html?bvid=${current.bvid}&page=1&autoplay=0&danmaku=0&high_quality=1`}
          title={current.title}
          loading="lazy"
          scrolling="no"
          allowFullScreen
          data-cookieconsent="marketing"
          className="h-full w-full"
        />
      </div>
    </div>
  );

  const playlist = (
    <ul className="min-h-0 flex-1 overflow-y-auto">
      {items.map((item, i) => (
        <li key={item.bvid}>
          <button
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left transition-colors duration-200 ${
              i === active
                ? `${activeBorder[accent]} bg-bg-subtle`
                : "border-transparent hover:bg-bg-subtle"
            }`}
          >
            <span
              className={`font-mono text-xs ${
                i === active ? activeNumber[accent] : "text-fg-faint"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`text-sm leading-snug ${
                i === active ? "text-fg" : "text-fg-muted"
              }`}
            >
              {item.title}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="section relative overflow-hidden" id="videos">
      <div className="glow-orb -right-24 top-16 h-64 w-64 opacity-40" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("desc")}
        />

        {hasList ? (
          <div className="mt-14 lg:grid lg:grid-cols-[1.6fr_1fr] lg:gap-6">
            <Reveal>{player}</Reveal>
            <Reveal delay={100} className="relative">
              <div className="term-panel mt-6 flex max-h-80 flex-col overflow-hidden lg:absolute lg:inset-0 lg:mt-0 lg:max-h-none">
                {playlist}
              </div>
            </Reveal>
          </div>
        ) : (
          <Reveal className="mx-auto mt-14 max-w-3xl">{player}</Reveal>
        )}

        <Reveal delay={200}>
          <p className="mt-6 text-center font-mono text-[13px] text-fg-faint">
            {t("note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
