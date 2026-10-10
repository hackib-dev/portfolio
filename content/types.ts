import type { StaticImageData } from "next/image";

/**
 * Every outcome, metric, role statement and decision on the site carries a source.
 * The types make an unsourced claim a compile error, so `next build` fails on it.
 */
export type Source =
  | { kind: "cv"; note?: string }
  | { kind: "live-site"; url: string }
  | { kind: "public"; url: string; label: string }
  | { kind: "code-review"; project: string; reviewed: YearMonth }
  | { kind: "screenshots"; project: string }
  /** Stated directly by Aqib while briefing this rebuild. */
  | { kind: "aqib"; said: YearMonth };

export type YearMonth = `${number}-${"01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12"}`;

/** A year alone, for dates Aqib gave without a month. */
export type Year = `${number}`;

export type Claim = { text: string; source: Source };

export type Lithology = "sandstone" | "limestone" | "shale" | "conglomerate" | "crystalline" | "granite";

export type Platform = "web" | "mobile" | "sdk";

export type Ownership = "architected" | "engineered" | "built" | "co-built" | "contributed";

export type Visibility = "public" | "public-demo" | "confidential";

export type MediaKind = "production-screenshot" | "public-demo" | "replica";

export type Media = {
  src: StaticImageData;
  alt: string;
  caption: string;
  kind: MediaKind;
  /** What was removed before publishing, if anything. */
  redaction?: string;
};

export type ProjectContext =
  | { kind: "employment"; org: "Payvantage"; client?: string }
  | { kind: "contract"; org: string }
  /** A standalone product or client outside Payvantage. */
  | { kind: "independent"; client?: string; label?: string }
  | { kind: "unconfirmed" };

export type Project = {
  slug: string;
  title: string;
  tier: "featured" | "archive";
  summary: string;
  context: ProjectContext;
  period?: { start: YearMonth | Year; end: YearMonth | Year | "present"; source: Source };
  role?: Claim;
  ownership?: Ownership;
  platforms: Platform[];
  stack?: { items: string[]; source: Source };
  visibility: Visibility;
  links?: { live?: string; demo?: string };
  lithologyCode: string;
  responsibilities: Claim[];
  outcomes: Claim[];
  media: Media[];
  /** Ids of decision records (only projects whose decisions have evidence). */
  decisions?: string[];
  replica?: "firs-roles";
  experiment?: { slug: string; title: string; pitch: string };
};

export type DecisionStatus = "verified-in-code" | "confirmed";

export type DecisionRecord = {
  id: string;
  project: string;
  title: string;
  /** Concerns this decision cuts across, used later by Mind. */
  concerns: Concern[];
  problem: string;
  approach: Claim;
  /** Left out unless the alternatives considered are actually recorded. */
  alternatives?: { text: string; status: DecisionStatus };
  tradeoffs: { text: string; basis: "analysis-of-code" | "confirmed" };
  outcome: Claim;
  /** Separate reasoning, when it says more than the trade-offs. */
  reasoning?: { text: string; status: DecisionStatus };
};

export type Concern =
  | "product"
  | "ux"
  | "architecture"
  | "state"
  | "performance"
  | "accessibility"
  | "security"
  | "scale"
  | "business";

export type Signal = {
  id: string;
  sample: string;
  value: string;
  context: string;
  source: Source;
  /** Signals awaiting publication approval are never rendered. */
  publish: boolean;
};
