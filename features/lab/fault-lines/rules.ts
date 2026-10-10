/**
 * Fault lines: product requirements compiled into role rules, under two architectures.
 *
 * The baseline is the verified FIRS role model (features/firs-replica/model.ts). A visitor's
 * requirements are an append-only log of edits on top of it. The log never changes when the
 * architecture changes: the same requirements are recompiled, so the difference between the
 * two architectures is exactly the difference in what they make of identical input.
 *
 *   lists   — as shipped: navigation, landing and coverage are three independent lists. Any
 *             edit applies verbatim, and the lists can stop agreeing. Disagreements are faults.
 *   derived — a counterfactual: navigation is the one source of truth. Landing is a preference
 *             resolved against it, and Analysis is offered exactly when a coverage level is.
 *             Faults cannot be expressed; edits that would need one are refused instead.
 *
 * Everything here is pure and synchronous, so it is cheap enough to run on every keystroke.
 */
import { COVERAGE, COVERAGE_LABEL, COVERAGE_ROLES, LANDING, NAV, ROLE_LABEL, ROLES, type Coverage, type Dashboard, type Role } from "@/features/firs-replica/model";

export type Arch = "lists" | "derived";

export type Edit =
  | { kind: "nav"; role: Role; dashboard: Dashboard; allow: boolean }
  | { kind: "landing"; role: Role; dashboard: Dashboard }
  | { kind: "coverage"; role: Role; coverage: Coverage; allow: boolean };

/** One requirement as the visitor stated it. A cell toggle is one edit; a scenario can be several. */
export type Requirement = { id: number; text: string; edits: Edit[] };

export const DASHBOARD_LABEL = Object.fromEntries(NAV.map((n) => [n.id, n.label])) as Record<Dashboard, string>;
export const NAV_ORDER: Dashboard[] = NAV.map((n) => n.id);
/** Settings is never a place to land. */
export const LANDING_CANDIDATES: Dashboard[] = NAV_ORDER.filter((d) => d !== "settings");

/* ── Faults ─────────────────────────────────────────────────────────────────── */

/** Where in the column a fault cuts: the boundary above the bed that slips. */
export type Boundary = "nav" | "landing" | "coverage";

export type FaultCode = "no-dashboard" | "hidden-landing" | "empty-coverage" | "dead-coverage";

export type Fault = { code: FaultCode; tag: string; boundary: Boundary; severity: "fault" | "dead"; title: string; detail: string };

/* ── Compiled output ────────────────────────────────────────────────────────── */

export type RoleView = {
  role: Role;
  /** Visible navigation, in sidebar order. */
  nav: Dashboard[];
  /** The landing the rules ask for (lists) or the visitor prefers (derived). */
  landingAsked: Dashboard;
  /** Where sign-in actually goes. Null only when there is nowhere to go. */
  landing: Dashboard | null;
  coverage: Coverage[];
  faults: Fault[];
  /** Cells whose value is computed rather than stated (derived architecture only). */
  derivedCells: string[];
};

export type Outcome = { status: "applied" | "no-op" | "implicit" | "refused"; notes: string[] };

export type Compiled = { arch: Arch; roles: Record<Role, RoleView>; outcomes: Outcome[] };

/* ── Baseline ───────────────────────────────────────────────────────────────── */

type Working = Record<Role, { nav: Set<Dashboard>; landing: Dashboard; coverage: Set<Coverage> }>;

function baseline(): Working {
  return Object.fromEntries(
    ROLES.map((role) => [
      role,
      {
        nav: new Set(NAV.filter((n) => !n.roles || n.roles.includes(role)).map((n) => n.id)),
        landing: LANDING[role],
        coverage: new Set(COVERAGE.filter((c) => COVERAGE_ROLES[c].includes(role))),
      },
    ]),
  ) as Working;
}

const ordered = <T extends string>(set: Set<T>, order: readonly T[]) => order.filter((x) => set.has(x));

/* ── Lists: as shipped ──────────────────────────────────────────────────────── */

function applyVerbatim(w: Working, e: Edit): boolean {
  const r = w[e.role];
  if (e.kind === "landing") {
    if (r.landing === e.dashboard) return false;
    r.landing = e.dashboard;
    return true;
  }
  const set: Set<string> = e.kind === "nav" ? r.nav : r.coverage;
  const key = e.kind === "nav" ? e.dashboard : e.coverage;
  if (set.has(key) === e.allow) return false;
  if (e.allow) set.add(key);
  else set.delete(key);
  return true;
}

function listsFaults(role: Role, nav: Dashboard[], landing: Dashboard, coverage: Coverage[]): Fault[] {
  const faults: Fault[] = [];
  const who = `${ROLE_LABEL[role]} users`;
  if (!nav.some((d) => d !== "settings")) {
    faults.push({ code: "no-dashboard", tag: "F3", boundary: "nav", severity: "fault", title: "Nowhere to go", detail: `${who} can open nothing but Settings.` });
  }
  if (!nav.includes(landing)) {
    faults.push({
      code: "hidden-landing",
      tag: "F1",
      boundary: "landing",
      severity: "fault",
      title: "Lands on a hidden page",
      detail: `Sign-in opens ${DASHBOARD_LABEL[landing]}, which their navigation does not offer.`,
    });
  }
  const analysis = nav.includes("analysis");
  if (analysis && coverage.length === 0) {
    faults.push({ code: "empty-coverage", tag: "F2", boundary: "coverage", severity: "fault", title: "Empty selector", detail: "Analysis opens with no coverage level to choose." });
  }
  if (!analysis && coverage.length > 0) {
    faults.push({
      code: "dead-coverage",
      tag: "D1",
      boundary: "coverage",
      severity: "dead",
      title: "Dead rule",
      detail: `${coverage.length === 1 ? "A coverage rule exists" : `${coverage.length} coverage rules exist`} for a page ${who} cannot open.`,
    });
  }
  return faults;
}

function compileLists(log: Requirement[]): Omit<Compiled, "arch"> {
  const w = baseline();
  const outcomes = log.map((req) => {
    const changed = req.edits.map((e) => applyVerbatim(w, e)).some(Boolean);
    return { status: changed ? "applied" : "no-op", notes: [] } satisfies Outcome;
  });
  const roles = Object.fromEntries(
    ROLES.map((role) => {
      const r = w[role];
      const nav = ordered(r.nav, NAV_ORDER);
      const coverage = ordered(r.coverage, COVERAGE);
      const view: RoleView = {
        role,
        nav,
        landingAsked: r.landing,
        landing: r.landing,
        coverage,
        faults: listsFaults(role, nav, r.landing, coverage),
        derivedCells: [],
      };
      return [role, view];
    }),
  ) as Record<Role, RoleView>;
  return { roles, outcomes };
}

/* ── Derived: one source of truth (counterfactual) ──────────────────────────── */

type DerivedRole = { grants: Set<Dashboard>; preference: Dashboard; coverage: Set<Coverage> };

/** Analysis is not granted directly: it is offered exactly when a coverage level is. */
function derivedNav(r: DerivedRole): Dashboard[] {
  return NAV_ORDER.filter((d) => (d === "analysis" ? r.coverage.size > 0 : r.grants.has(d)));
}

function resolveLanding(r: DerivedRole): Dashboard | null {
  const nav = derivedNav(r);
  if (nav.includes(r.preference)) return r.preference;
  return LANDING_CANDIDATES.find((d) => nav.includes(d)) ?? null;
}

function cloneRole(r: DerivedRole): DerivedRole {
  return { grants: new Set(r.grants), preference: r.preference, coverage: new Set(r.coverage) };
}

const list = (xs: string[]) => (xs.length <= 1 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

/** Applies one edit to a copy. Returns null when the derived model cannot express the result. */
function applyDerived(r: DerivedRole, e: Edit): { next: DerivedRole; refused?: string } {
  const next = cloneRole(r);
  if (e.kind === "landing") {
    next.preference = e.dashboard;
  } else if (e.kind === "coverage") {
    if (e.allow) next.coverage.add(e.coverage);
    else next.coverage.delete(e.coverage);
  } else if (e.dashboard === "analysis") {
    if (e.allow && next.coverage.size === 0) return { next: r, refused: "Analysis is offered only with a coverage level. Grant one first." };
    if (!e.allow) next.coverage.clear();
  } else if (e.allow) {
    next.grants.add(e.dashboard);
  } else {
    next.grants.delete(e.dashboard);
  }
  if (resolveLanding(next) === null) return { next: r, refused: "Every role keeps one page to land on, so this cannot be expressed." };
  return { next };
}

/** What changed for the role beyond what the edit itself named: the implicit consequences. */
function implicitNotes(before: DerivedRole, after: DerivedRole, e: Edit): string[] {
  const notes: string[] = [];
  const navBefore = derivedNav(before);
  const navAfter = derivedNav(after);
  const landBefore = resolveLanding(before);
  const landAfter = resolveLanding(after);
  if (e.kind === "landing") {
    if (landAfter !== e.dashboard && landAfter) notes.push(`${DASHBOARD_LABEL[e.dashboard]} is not in their navigation, so they land on ${DASHBOARD_LABEL[landAfter]}.`);
  } else if (landBefore !== landAfter && landAfter && landBefore) {
    notes.push(`Landing moves from ${DASHBOARD_LABEL[landBefore]} to ${DASHBOARD_LABEL[landAfter]}.`);
  }
  if (!(e.kind === "nav" && e.dashboard === "analysis")) {
    const had = navBefore.includes("analysis");
    const has = navAfter.includes("analysis");
    if (had && !has) notes.push("Analysis leaves their navigation: no coverage level remains.");
    if (!had && has) notes.push("Analysis joins their navigation: it now has a coverage level.");
  } else if (!e.allow && before.coverage.size > 0) {
    notes.push(`Coverage cleared: ${list(ordered(before.coverage, COVERAGE).map((c) => COVERAGE_LABEL[c]))}.`);
  }
  return notes;
}

function compileDerived(log: Requirement[]): Omit<Compiled, "arch"> {
  const base = baseline();
  const state = Object.fromEntries(
    ROLES.map((role) => {
      const b = base[role];
      return [role, { grants: new Set([...b.nav].filter((d) => d !== "analysis")), preference: b.landing, coverage: b.coverage }];
    }),
  ) as Record<Role, DerivedRole>;

  const outcomes = log.map((req): Outcome => {
    const notes: string[] = [];
    let changed = false;
    let refused = false;
    for (const e of req.edits) {
      const before = state[e.role];
      const { next, refused: why } = applyDerived(before, e);
      if (why) {
        refused = true;
        notes.push(why);
        continue;
      }
      const same =
        next.preference === before.preference &&
        next.grants.size === before.grants.size &&
        [...next.grants].every((d) => before.grants.has(d)) &&
        next.coverage.size === before.coverage.size &&
        [...next.coverage].every((c) => before.coverage.has(c));
      if (!same) changed = true;
      notes.push(...implicitNotes(before, next, e));
      state[e.role] = next;
    }
    if (refused && !changed) return { status: "refused", notes };
    if (notes.length) return { status: refused ? "refused" : "implicit", notes };
    return { status: changed ? "applied" : "no-op", notes };
  });

  const roles = Object.fromEntries(
    ROLES.map((role) => {
      const r = state[role];
      const nav = derivedNav(r);
      const landing = resolveLanding(r);
      const view: RoleView = {
        role,
        nav,
        landingAsked: r.preference,
        landing,
        coverage: ordered(r.coverage, COVERAGE),
        faults: [],
        derivedCells: ["nav:analysis", ...(landing !== r.preference && landing ? [`landing:${landing}`] : [])],
      };
      return [role, view];
    }),
  ) as Record<Role, RoleView>;
  return { roles, outcomes };
}

/* ── Entry point ────────────────────────────────────────────────────────────── */

function sameView(a: RoleView, b: RoleView) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Compiles the log. With `prev`, unchanged role views keep their identity (structural sharing),
 * so a component subscribed to one role re-renders only when that role's output really changed.
 */
export function compile(log: Requirement[], arch: Arch, prev?: Compiled): Compiled {
  const out = arch === "lists" ? compileLists(log) : compileDerived(log);
  if (prev) {
    for (const role of ROLES) {
      if (sameView(prev.roles[role], out.roles[role])) out.roles[role] = prev.roles[role];
    }
  }
  return { arch, ...out };
}

/* ── Reading the result ─────────────────────────────────────────────────────── */

export type LedgerLine = { kind: "removed" | "added" | "changed" | "fault" | "healed"; role: Role; text: string };

export function diff(a: Compiled, b: Compiled): LedgerLine[] {
  const lines: LedgerLine[] = [];
  for (const role of ROLES) {
    const x = a.roles[role];
    const y = b.roles[role];
    if (x === y) continue;
    const lostNav = x.nav.filter((d) => !y.nav.includes(d)).map((d) => DASHBOARD_LABEL[d]);
    const gotNav = y.nav.filter((d) => !x.nav.includes(d)).map((d) => DASHBOARD_LABEL[d]);
    if (lostNav.length) lines.push({ kind: "removed", role, text: `Navigation hides ${list(lostNav)}` });
    if (gotNav.length) lines.push({ kind: "added", role, text: `Navigation shows ${list(gotNav)}` });
    if (x.landing !== y.landing) {
      lines.push({ kind: "changed", role, text: y.landing ? `Signs in to ${DASHBOARD_LABEL[y.landing]}${x.landing ? ` instead of ${DASHBOARD_LABEL[x.landing]}` : ""}` : "Has nowhere to sign in to" });
    }
    const lostCov = x.coverage.filter((c) => !y.coverage.includes(c)).map((c) => COVERAGE_LABEL[c]);
    const gotCov = y.coverage.filter((c) => !x.coverage.includes(c)).map((c) => COVERAGE_LABEL[c]);
    if (lostCov.length) lines.push({ kind: "removed", role, text: `Coverage loses ${list(lostCov)}` });
    if (gotCov.length) lines.push({ kind: "added", role, text: `Coverage gains ${list(gotCov)}` });
    for (const f of y.faults) if (!x.faults.some((g) => g.code === f.code)) lines.push({ kind: "fault", role, text: `${f.tag} opens: ${f.title.toLowerCase()}` });
    for (const f of x.faults) if (!y.faults.some((g) => g.code === f.code)) lines.push({ kind: "healed", role, text: `${f.tag} closes: ${f.title.toLowerCase()}` });
  }
  return lines;
}

export function faultCount(c: Compiled) {
  let faults = 0;
  let dead = 0;
  for (const role of ROLES) {
    for (const f of c.roles[role].faults) {
      if (f.severity === "fault") faults++;
      else dead++;
    }
  }
  return { faults, dead };
}

export function sentence(e: Edit): string {
  const who = `${ROLE_LABEL[e.role]} users`;
  if (e.kind === "landing") return `${who} land on ${DASHBOARD_LABEL[e.dashboard]}`;
  if (e.kind === "nav") return `${who} ${e.allow ? "can" : "cannot"} open ${DASHBOARD_LABEL[e.dashboard]}`;
  return `${who} ${e.allow ? "can" : "cannot"} analyse at ${COVERAGE_LABEL[e.coverage].toLowerCase()} coverage`;
}

/* ── Scenarios: requirements worth trying first ─────────────────────────────── */

export const SCENARIOS: { label: string; text: string; edits: Edit[] }[] = [
  {
    label: "Retire a landing page",
    text: "State officers stop using the State Dashboard",
    edits: [{ kind: "nav", role: "STATE_USER", dashboard: "state", allow: false }],
  },
  {
    label: "Withdraw a page",
    text: "Tax offices no longer use Analysis",
    edits: [{ kind: "nav", role: "TAX_OFFICE_USER", dashboard: "analysis", allow: false }],
  },
  {
    label: "Narrow a scope",
    text: "Coordination offices lose every coverage level",
    edits: (["STATE", "COORDINATION", "TAX_OFFICE"] as const).map((coverage) => ({ kind: "coverage", role: "COORDINATION_OFFICE_USER", coverage, allow: false })),
  },
];

/* ── Shareable encoding: #fl=d:S-s.T@t.C/C ──────────────────────────────────── */

const ROLE_CODE: Record<Role, string> = { NATIONAL_USER: "N", STATE_USER: "S", COORDINATION_OFFICE_USER: "C", TAX_OFFICE_USER: "T" };
const DASH_CODE: Record<Dashboard, string> = { national: "n", regional: "r", state: "s", "tax-office": "t", analysis: "a", settings: "g" };
const COV_CODE: Record<Coverage, string> = { NATIONAL: "N", STATE: "S", COORDINATION: "C", TAX_OFFICE: "T" };
const invert = <K extends string>(m: Record<K, string>) => Object.fromEntries(Object.entries(m).map(([k, v]) => [v, k])) as Record<string, K>;
const ROLE_OF = invert(ROLE_CODE);
const DASH_OF = invert(DASH_CODE);
const COV_OF = invert(COV_CODE);

function encodeEdit(e: Edit) {
  const r = ROLE_CODE[e.role];
  if (e.kind === "nav") return `${r}${e.allow ? "+" : "-"}${DASH_CODE[e.dashboard]}`;
  if (e.kind === "landing") return `${r}@${DASH_CODE[e.dashboard]}`;
  return `${r}${e.allow ? "*" : "/"}${COV_CODE[e.coverage]}`;
}

function decodeEdit(token: string): Edit | null {
  const role = ROLE_OF[token[0] ?? ""];
  const op = token[1];
  const target = token.slice(2);
  if (!role || token.length !== 3) return null;
  if ((op === "+" || op === "-") && DASH_OF[target]) return { kind: "nav", role, dashboard: DASH_OF[target], allow: op === "+" };
  if (op === "@" && DASH_OF[target] && DASH_OF[target] !== "settings") return { kind: "landing", role, dashboard: DASH_OF[target] };
  if ((op === "*" || op === "/") && COV_OF[target]) return { kind: "coverage", role, coverage: COV_OF[target], allow: op === "*" };
  return null;
}

/** Requirements are encoded one group per requirement, edits joined by commas. */
export function encode(log: Requirement[], arch: Arch): string {
  if (!log.length && arch === "lists") return "";
  return `fl=${arch === "derived" ? "d" : "l"}:${log.map((r) => r.edits.map(encodeEdit).join(",")).join(".")}`;
}

export function decode(hash: string): { arch: Arch; groups: Edit[][] } | null {
  const m = /(?:^#?|&)fl=([ld]):([^&]*)/.exec(hash);
  if (!m) return null;
  const groups = (m[2] ?? "")
    .split(".")
    .map((g) => g.split(",").map(decodeEdit).filter((e): e is Edit => e !== null))
    .filter((g) => g.length > 0)
    .slice(0, 40);
  return { arch: m[1] === "d" ? "derived" : "lists", groups };
}

export function describeGroup(edits: Edit[]): string {
  const scenario = SCENARIOS.find((s) => s.edits.length === edits.length && s.edits.every((e, i) => encodeEdit(e) === encodeEdit(edits[i]!)));
  return scenario ? scenario.text : edits.map(sentence).join("; ");
}
