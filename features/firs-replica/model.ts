/**
 * FIRS role model for the conceptual replica.
 *
 * VERIFIED: role identifiers, navigation visibility, landing dashboards and analysis coverage
 * rules below were read from the FIRS frontend source (code review, Oct 2026). The replica
 * re-implements them in this portfolio's own code; no FIRS code is copied or shipped.
 *
 * NOT MODELLED: any data-level scoping. It is outside the frontend code reviewed.
 * SYNTHETIC: every number, office and coordinating unit below is generated.
 *
 * To update when Aqib confirms more rules, edit the tables in this file only.
 */

export const ROLES = ["NATIONAL_USER", "STATE_USER", "COORDINATION_OFFICE_USER", "TAX_OFFICE_USER"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  NATIONAL_USER: "National",
  STATE_USER: "State",
  COORDINATION_OFFICE_USER: "Coordination office",
  TAX_OFFICE_USER: "Tax office",
};

export const DASHBOARDS = ["national", "regional", "state", "tax-office", "analysis", "settings"] as const;
export type Dashboard = (typeof DASHBOARDS)[number];

type NavEntry = { id: Dashboard; label: string; roles?: Role[] };

/** Verified. An entry without roles is visible to every role. */
export const NAV: NavEntry[] = [
  { id: "national", label: "National Dashboard", roles: ["NATIONAL_USER"] },
  { id: "regional", label: "Regional Dashboard", roles: ["NATIONAL_USER", "COORDINATION_OFFICE_USER"] },
  { id: "state", label: "State Dashboard", roles: ["NATIONAL_USER", "STATE_USER", "COORDINATION_OFFICE_USER"] },
  { id: "tax-office", label: "Tax Office", roles: ["NATIONAL_USER", "STATE_USER", "TAX_OFFICE_USER"] },
  { id: "analysis", label: "Analysis" },
  { id: "settings", label: "Settings" },
];

/** Verified. */
export const LANDING: Record<Role, Dashboard> = {
  NATIONAL_USER: "national",
  STATE_USER: "state",
  TAX_OFFICE_USER: "tax-office",
  COORDINATION_OFFICE_USER: "regional",
};

export const COVERAGE = ["NATIONAL", "STATE", "COORDINATION", "TAX_OFFICE"] as const;
export type Coverage = (typeof COVERAGE)[number];

export const COVERAGE_LABEL: Record<Coverage, string> = {
  NATIONAL: "National",
  STATE: "State",
  COORDINATION: "Coordination",
  TAX_OFFICE: "Tax office",
};

/** Verified. */
export const COVERAGE_ROLES: Record<Coverage, Role[]> = {
  NATIONAL: ["NATIONAL_USER"],
  STATE: ["NATIONAL_USER", "STATE_USER", "COORDINATION_OFFICE_USER"],
  COORDINATION: ["NATIONAL_USER", "COORDINATION_OFFICE_USER"],
  TAX_OFFICE: ["NATIONAL_USER", "STATE_USER", "TAX_OFFICE_USER", "COORDINATION_OFFICE_USER"],
};

export const PERIODS = ["MONTH", "QUARTER", "YEAR"] as const;
export type Period = (typeof PERIODS)[number];
export const PERIOD_LABEL: Record<Period, string> = { MONTH: "Month", QUARTER: "Quarter", YEAR: "Year" };

export function navFor(role: Role) {
  return NAV.map((n) => ({ ...n, visible: !n.roles || n.roles.includes(role) }));
}

export function coverageFor(role: Role): Coverage[] {
  return COVERAGE.filter((c) => COVERAGE_ROLES[c].includes(role));
}

export function canOpen(role: Role, dashboard: Dashboard) {
  return navFor(role).some((n) => n.id === dashboard && n.visible);
}

/** The view a role produces, as plain data. The ledger diffs two of these. */
export type RoleView = { nav: string[]; landing: string; coverage: string[] };

export function viewFor(role: Role): RoleView {
  return {
    nav: navFor(role)
      .filter((n) => n.visible)
      .map((n) => n.label),
    landing: NAV.find((n) => n.id === LANDING[role])?.label ?? "",
    coverage: coverageFor(role).map((c) => COVERAGE_LABEL[c]),
  };
}

export type LedgerLine = { kind: "removed" | "added" | "changed" | "same"; text: string };

export function diffViews(prev: RoleView, next: RoleView): LedgerLine[] {
  const lines: LedgerLine[] = [];
  const removedNav = prev.nav.filter((n) => !next.nav.includes(n));
  const addedNav = next.nav.filter((n) => !prev.nav.includes(n));
  if (removedNav.length) lines.push({ kind: "removed", text: `Navigation hides ${removedNav.join(", ")}` });
  if (addedNav.length) lines.push({ kind: "added", text: `Navigation shows ${addedNav.join(", ")}` });
  if (prev.landing !== next.landing) lines.push({ kind: "changed", text: `Lands on ${next.landing} instead of ${prev.landing}` });
  const removedCov = prev.coverage.filter((c) => !next.coverage.includes(c));
  const addedCov = next.coverage.filter((c) => !prev.coverage.includes(c));
  if (removedCov.length) lines.push({ kind: "removed", text: `Analysis coverage loses ${removedCov.join(", ")}` });
  if (addedCov.length) lines.push({ kind: "added", text: `Analysis coverage gains ${addedCov.join(", ")}` });
  const sameNav = next.nav.filter((n) => prev.nav.includes(n));
  if (sameNav.length) lines.push({ kind: "same", text: `Unchanged: ${sameNav.join(", ")}` });
  return lines;
}

/* ── Synthetic geography and data ───────────────────────────────────────────── */

export type StateTile = { code: string; name: string; col: number; row: number };

/** Tile cartogram: approximate relative positions of the 36 states and the FCT. */
export const STATES: StateTile[] = [
  { code: "SO", name: "Sokoto", col: 1, row: 0 }, { code: "KT", name: "Katsina", col: 3, row: 0 }, { code: "KN", name: "Kano", col: 4, row: 0 },
  { code: "JI", name: "Jigawa", col: 5, row: 0 }, { code: "YO", name: "Yobe", col: 6, row: 0 }, { code: "BO", name: "Borno", col: 7, row: 0 },
  { code: "KE", name: "Kebbi", col: 0, row: 1 }, { code: "ZA", name: "Zamfara", col: 2, row: 1 }, { code: "KD", name: "Kaduna", col: 3, row: 1 },
  { code: "BA", name: "Bauchi", col: 5, row: 1 }, { code: "GO", name: "Gombe", col: 6, row: 1 }, { code: "AD", name: "Adamawa", col: 7, row: 1 },
  { code: "NI", name: "Niger", col: 1, row: 2 }, { code: "FC", name: "FCT", col: 3, row: 2 }, { code: "NA", name: "Nasarawa", col: 4, row: 2 },
  { code: "PL", name: "Plateau", col: 5, row: 2 }, { code: "TA", name: "Taraba", col: 6, row: 2 },
  { code: "KW", name: "Kwara", col: 1, row: 3 }, { code: "KO", name: "Kogi", col: 3, row: 3 }, { code: "BE", name: "Benue", col: 4, row: 3 },
  { code: "OY", name: "Oyo", col: 0, row: 4 }, { code: "OS", name: "Osun", col: 1, row: 4 }, { code: "EK", name: "Ekiti", col: 2, row: 4 },
  { code: "EN", name: "Enugu", col: 4, row: 4 }, { code: "EB", name: "Ebonyi", col: 5, row: 4 }, { code: "CR", name: "Cross River", col: 6, row: 4 },
  { code: "OG", name: "Ogun", col: 0, row: 5 }, { code: "ON", name: "Ondo", col: 1, row: 5 }, { code: "ED", name: "Edo", col: 2, row: 5 },
  { code: "AN", name: "Anambra", col: 3, row: 5 },
  { code: "LA", name: "Lagos", col: 0, row: 6 }, { code: "DE", name: "Delta", col: 2, row: 6 }, { code: "IM", name: "Imo", col: 3, row: 6 },
  { code: "AB", name: "Abia", col: 4, row: 6 },
  { code: "BY", name: "Bayelsa", col: 2, row: 7 }, { code: "RI", name: "Rivers", col: 3, row: 7 }, { code: "AK", name: "Akwa Ibom", col: 4, row: 7 },
];

/** Synthetic coordinating units. Real unit boundaries are not represented. */
export const UNITS: { id: string; states: string[] }[] = [
  { id: "U1", states: ["SO", "KE", "ZA"] },
  { id: "U2", states: ["KT", "KN", "JI"] },
  { id: "U3", states: ["YO", "BO", "BA", "GO"] },
  { id: "U4", states: ["AD", "TA", "PL", "NA"] },
  { id: "U5", states: ["NI", "FC", "KD", "KW"] },
  { id: "U6", states: ["KO", "BE", "EN", "EB", "CR"] },
  { id: "U7", states: ["OY", "OS", "EK", "OG", "LA", "ON"] },
  { id: "U8", states: ["ED", "AN", "IM", "AB", "DE", "BY", "RI", "AK"] },
];

export function unitOf(stateCode: string) {
  return UNITS.find((u) => u.states.includes(stateCode))?.id ?? "U1";
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Deterministic pseudo-random in [0, 1) for a key. */
export function synth(key: string) {
  let t = hash(key) + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Synthetic performance against target, in percent, between −25 and +25. */
export function performanceOf(stateCode: string, period: Period) {
  return Math.round((synth(`${stateCode}:${period}`) * 50 - 25) * 10) / 10;
}

export function seriesFor(key: string, period: Period) {
  const n = period === "MONTH" ? 12 : period === "QUARTER" ? 4 : 3;
  return Array.from({ length: n }, (_, i) => 40 + Math.round(synth(`${key}:${period}:${i}`) * 60));
}

export const PERIOD_AXIS: Record<Period, string[]> = {
  MONTH: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  QUARTER: ["Q1", "Q2", "Q3", "Q4"],
  YEAR: ["Y1", "Y2", "Y3"],
};

export function offices(stateCode: string) {
  return [1, 2, 3, 4].map((n) => ({ id: `${stateCode}-0${n}`, name: `Office ${stateCode}-0${n}` }));
}

/** Banded scale like the production legend: eleven bands from below −20% to above +20%. */
export function bandColour(pct: number) {
  if (pct > 20) return "#1f4b35";
  if (pct > 15) return "#2e6b4b";
  if (pct > 10) return "#3f8a62";
  if (pct > 5) return "#62a882";
  if (pct > 0) return "#9ccdb1";
  if (pct === 0) return "#c8cdc6";
  if (pct > -2) return "#e7b3a8";
  if (pct > -5) return "#de8c7c";
  if (pct > -10) return "#cf6553";
  if (pct > -15) return "#b4402f";
  return "#8a2a1e";
}

/** The parameter object every widget reads, as the production filter providers derive it. */
export function apiParams(period: Period, stateCode: string, unit: string) {
  return {
    groupingType: period,
    state: stateCode,
    coordinatingUnit: unit,
    range: period === "MONTH" ? "1–12" : period === "QUARTER" ? "Q1–Q4" : "3 years",
  };
}
