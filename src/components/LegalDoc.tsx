import Reveal from "@/components/Reveal";
import type { LegalSectionItem } from "@/types";

/**
 * Shared single-column layout for legal documents (privacy policy / terms of
 * service). All copy comes from the `legal.*` i18n namespaces (DESIGN.md §8).
 */
export default function LegalDoc({
  title,
  updated,
  lead,
  sections,
}: {
  title: string;
  updated: string;
  lead: string;
  sections: LegalSectionItem[];
}) {
  return (
    <section className="relative overflow-hidden pb-24 pt-32 md:pt-44">
      <div className="glow-orb -top-24 right-[15%] h-64 w-64 opacity-60" />
      <div className="container-x relative max-w-2xl">
        <Reveal>
          <h1 className="text-balance text-4xl font-bold leading-[1.15] tracking-tight text-fg md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 font-mono text-[13px] text-fg-faint">{updated}</p>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-8 text-lg leading-relaxed text-fg-muted">{lead}</p>
        </Reveal>

        {sections.map((section, i) => (
          <Reveal key={section.title}>
            <div className="mt-12">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[13px] text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-xl font-semibold tracking-tight text-fg">
                  {section.title}
                </h2>
              </div>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-relaxed text-fg-muted">
                  {paragraph}
                </p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 leading-relaxed text-fg-muted"
                    >
                      <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-brand" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
