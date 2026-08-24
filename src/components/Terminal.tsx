"use client";

import { useEffect, useRef, useState } from "react";

export type TermLine = {
  kind: "cmd" | "ok" | "info";
  text: string;
};

type Pos = { li: number; ch: number };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function CmdText({ text }: { text: string }) {
  // Highlight: first token = program (brand), --flags (purple), rest plain.
  const tokens = text.split(" ");
  return (
    <>
      {tokens.map((tok, i) => (
        <span key={i}>
          {i > 0 && " "}
          {i === 0 ? (
            <span className="text-brand">{tok}</span>
          ) : tok.startsWith("--") ? (
            <span className="text-lims">{tok}</span>
          ) : (
            <span className="text-fg">{tok}</span>
          )}
        </span>
      ))}
    </>
  );
}

function Line({ line, partial }: { line: TermLine; partial?: string }) {
  const text = partial ?? line.text;
  if (line.kind === "cmd") {
    return (
      <div className="whitespace-pre-wrap break-words">
        <span className="mr-2 text-fg-faint">$</span>
        <CmdText text={text} />
      </div>
    );
  }
  if (line.kind === "ok") {
    return (
      <div className="whitespace-pre-wrap break-words text-success">
        <span className="mr-2 text-fg-faint">✓</span>
        {text}
      </div>
    );
  }
  return (
    <div className="whitespace-pre-wrap break-words text-fg-muted">
      <span className="mr-2 text-fg-faint">·</span>
      {text}
    </div>
  );
}

/**
 * Terminal demo panel with typewriter streaming (DESIGN.md §6.4 / §7.2).
 * Starts when scrolled into view, loops with a pause after completion.
 */
export default function Terminal({
  title,
  lines,
  className = "",
}: {
  title: string;
  lines: TermLine[];
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [pos, setPos] = useState<Pos>({ li: 0, ch: 0 });
  const linesKey = JSON.stringify(lines);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let cancelled = false;
    const parsed: TermLine[] = JSON.parse(linesKey);

    const run = async () => {
      while (!cancelled) {
        setPos({ li: 0, ch: 0 });
        for (let li = 0; li < parsed.length; li++) {
          const line = parsed[li];
          const speed = line.kind === "cmd" ? 26 : 12;
          for (let ch = 0; ch <= line.text.length; ch++) {
            if (cancelled) return;
            setPos({ li, ch });
            await sleep(line.text.length > 0 ? speed : 180);
          }
          await sleep(line.kind === "cmd" ? 280 : 200);
        }
        // Completed — hold with idle cursor, then loop.
        setPos({ li: parsed.length, ch: 0 });
        await sleep(5200);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [started, linesKey]);

  const done = pos.li >= lines.length;

  return (
    <div ref={rootRef} className={`term-panel ${className}`}>
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate font-mono text-xs text-fg-faint">
          {title}
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-fg-faint">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          live
        </span>
      </div>
      {/* Body */}
      <div className="min-h-[220px] p-4 font-mono text-[13px] leading-[1.9] md:p-5">
        {lines.slice(0, done ? lines.length : pos.li + 1).map((line, i) => {
          const isTyping = !done && i === pos.li;
          const partial = isTyping ? line.text.slice(0, pos.ch) : undefined;
          const showCursor = isTyping || (done && i === lines.length - 1);
          return (
            <div key={i} className="flex items-baseline">
              <Line line={line} partial={partial} />
              {showCursor && <span className="term-cursor" />}
            </div>
          );
        })}
        {lines.length === 0 && <span className="term-cursor" />}
      </div>
    </div>
  );
}
