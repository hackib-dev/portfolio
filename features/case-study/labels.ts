import type { Ownership, Platform, Project, Visibility } from "@/content/types";
import { formatYearMonth } from "@/components/SourceTag";

export function platformLabel(p: Platform): string {
  return { web: "Web", mobile: "Mobile", sdk: "SDK" }[p];
}

export function ownershipVerb(o: Ownership): string {
  return { architected: "Architected", engineered: "Engineered", built: "Built", "co-built": "Co-built", contributed: "Contributed to" }[o];
}

export function visibilityPill(v: Visibility): { label: string; className: string } {
  switch (v) {
    case "public":
      return { label: "Public", className: "pill-public" };
    case "public-demo":
      return { label: "Public demo", className: "pill-demo" };
    case "confidential":
      return { label: "Confidential", className: "pill-confidential" };
  }
}

export function contextLine(p: Project): string {
  const verb = p.ownership ? `${ownershipVerb(p.ownership)} · ` : "";
  switch (p.context.kind) {
    case "employment":
      return `${verb}Payvantage${p.context.client ? ` for ${p.context.client}` : ""}`;
    case "contract":
      return `${verb}Contract for ${p.context.org}`;
    case "independent":
      return `${verb}${p.context.label ?? (p.context.client ? `For ${p.context.client}` : "Independent project")}`;
    case "unconfirmed":
      return p.summary.split(". ")[0] + ".";
  }
}

export function periodLabel(p: Project): string | null {
  if (!p.period) return null;
  const end = p.period.end === "present" ? "present" : formatYearMonth(p.period.end);
  return `${formatYearMonth(p.period.start)} – ${end}`;
}
