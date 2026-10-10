import type { Source } from "@/content/types";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatYearMonth(ym: string): string {
  const [y, m] = ym.split("-");
  if (!m) return y ?? "";
  return `${months[Number(m) - 1] ?? ""} ${y}`;
}

export function sourceLabel(source: Source): string {
  switch (source.kind) {
    case "cv":
      return "CV";
    case "live-site":
      return "Previous portfolio";
    case "public":
      return source.label;
    case "code-review":
      return `Source code review · ${formatYearMonth(source.reviewed)}`;
    case "screenshots":
      return "Production screenshots";
    case "aqib":
      return `Confirmed by Aqib · ${formatYearMonth(source.said)}`;
  }
}

export function SourceTag({ source, className }: { source: Source; className?: string }) {
  // Only public evidence is shown as a visible link. Other sources stay in the content model.
  if (source.kind !== "public") return null;
  const text = sourceLabel(source);
  return (
    <a className={`label text-ink-2 underline ${className ?? ""}`} href={source.url} target="_blank" rel="noopener noreferrer">
      Source: {text} ↗<span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
