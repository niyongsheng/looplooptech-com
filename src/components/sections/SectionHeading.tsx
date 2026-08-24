import Reveal from "@/components/Reveal";

/**
 * Section heading: eyebrow badge + title + optional subtitle (DESIGN.md §8).
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={align === "center" ? "text-center" : ""}>
      <span className="eyebrow">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        {eyebrow}
      </span>
      <h2 className="mt-5 text-balance text-3xl font-bold leading-[1.2] tracking-tight text-fg md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base leading-relaxed text-fg-muted md:text-lg ${
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

export const DEMO_MAILTO = "mailto:hello@looplooptech.com";
