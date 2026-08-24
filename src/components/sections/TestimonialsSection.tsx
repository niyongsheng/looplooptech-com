import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";
import type { TestimonialItem } from "@/types";
import { SectionHeading } from "./SectionHeading";

const avatarGradients = [
  "from-[#1e80ff] to-[#00b383]",
  "from-[#1e80ff] to-[#8b5cf6]",
  "from-[#8b5cf6] to-[#00b383]",
];

/**
 * Customer testimonials (DESIGN.md §8 首页).
 */
export default function TestimonialsSection() {
  const t = useTranslations("home.testimonials");
  const items = t.raw("items") as TestimonialItem[];

  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.name} delay={i * 120}>
              <figure className="card flex h-full flex-col">
                <Quote className="h-6 w-6 text-brand/40" />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-fg">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white ${avatarGradients[i % 3]}`}
                  >
                    {item.name.slice(0, 1)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-fg">
                      {item.name}
                    </span>
                    <span className="block truncate text-xs text-fg-muted">
                      {item.role} · {item.company}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
