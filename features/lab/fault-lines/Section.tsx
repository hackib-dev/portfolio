"use client";

import { flushSync } from "react-dom";
import { memo, useLayoutEffect, useRef, type CSSProperties, type FocusEvent, type KeyboardEvent } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSpecimen } from "@/features/seam/useSpecimen";
import { COVERAGE, COVERAGE_LABEL, ROLE_LABEL, ROLES, type Coverage, type Dashboard, type Role } from "@/features/firs-replica/model";
import { DASHBOARD_LABEL, LANDING_CANDIDATES, NAV_ORDER, sentence, type Boundary, type Edit, type Fault, type RoleView } from "./rules";
import { useAct, useFault, useFaultStore, useTracker } from "./store";

/* ── Geometry ───────────────────────────────────────────────────────────────── */

type Bed = Boundary;
type Cell = { bed: "nav"; id: Dashboard } | { bed: "landing"; id: Dashboard } | { bed: "coverage"; id: Coverage };

/** Every core has the same cells in the same order, so a row index means the same rule in every column. */
const CELLS: Cell[] = [
  ...NAV_ORDER.map((id) => ({ bed: "nav" as const, id })),
  ...LANDING_CANDIDATES.map((id) => ({ bed: "landing" as const, id })),
  ...COVERAGE.map((id) => ({ bed: "coverage" as const, id })),
];
const BEDS: { id: Bed; label: string; reads: string }[] = [
  { id: "nav", label: "Navigation", reads: "can open" },
  { id: "landing", label: "Landing", reads: "signs in to" },
  { id: "coverage", label: "Coverage", reads: "analysis at" },
];
const BED_START = Object.fromEntries(BEDS.map((b) => [b.id, CELLS.findIndex((c) => c.bed === b.id)])) as Record<Bed, number>;
const ROLE_CODE: Record<Role, string> = { NATIONAL_USER: "N", STATE_USER: "S", COORDINATION_OFFICE_USER: "C", TAX_OFFICE_USER: "T" };

/** Throw, in px, of a bed below each kind of fault. Dead rules slip less: nothing breaks, it is just unreachable. */
const THROW = { fault: 22, dead: 14 } as const;

/** How far each bed has slipped: a fault at a boundary displaces that bed and everything beneath it. */
export function throws(faults: Fault[]) {
  const at = (b: Bed) => faults.filter((f) => f.boundary === b).reduce((m, f) => Math.max(m, THROW[f.severity]), 0);
  const nav = at("nav");
  const landing = nav + at("landing");
  const coverage = landing + at("coverage");
  return { nav, landing, coverage } as Record<Bed, number>;
}

const cellKey = (col: number, row: number) => `${col}:${row}`;

/* ── Surface: the interface this role would get ─────────────────────────────── */

/**
 * A live rendering of the role's interface, built from the compiled rules. It is inert: the
 * visitor edits rules, not this. The core's audit measures this DOM after every commit, and the
 * core's text summary carries the same information for assistive technology.
 */
const Surface = memo(function Surface({ view }: { view: RoleView }) {
  const label = ROLE_LABEL[view.role];
  const landingHidden = view.landing !== null && !view.nav.includes(view.landing);
  const analysis = view.nav.includes("analysis");
  return (
    <div className="fl-surface" inert>
      <div className="fl-surface-bar">
        <span>FIRS · replica</span>
        <span>{label}</span>
      </div>
      <div className="fl-surface-body">
        <nav aria-label={`${label} navigation`} className="fl-surface-nav">
          {view.nav.length ? (
            <ul>
              {view.nav.map((d) => (
                <li key={d}>
                  <button type="button" aria-current={view.landing === d ? "page" : undefined}>
                    {DASHBOARD_LABEL[d]}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="fl-void">Nothing to open</p>
          )}
        </nav>
        <div className="fl-surface-main">
          <p className="fl-surface-k">Signed in to</p>
          <p className="fl-surface-v" data-broken={landingHidden || view.landing === null || undefined}>
            {view.landing ? DASHBOARD_LABEL[view.landing] : "Nowhere"}
          </p>
          {landingHidden ? <p className="fl-flag">Not in navigation</p> : null}
          {analysis ? (
            <fieldset className="fl-surface-cov">
              <legend className="fl-surface-k">Coverage</legend>
              {view.coverage.length ? (
                view.coverage.map((c, i) => (
                  <label key={c}>
                    <input type="radio" name={`fl-cov-${view.role}`} defaultChecked={i === 0} />
                    {COVERAGE_LABEL[c]}
                  </label>
                ))
              ) : (
                <p className="fl-flag">No options</p>
              )}
            </fieldset>
          ) : null}
        </div>
      </div>
    </div>
  );
});

function summary(view: RoleView) {
  const label = ROLE_LABEL[view.role];
  const nav = view.nav.length ? view.nav.map((d) => DASHBOARD_LABEL[d]).join(", ") : "nothing";
  const landing = view.landing ? DASHBOARD_LABEL[view.landing] : "nowhere";
  const hidden = view.landing && !view.nav.includes(view.landing) ? ", which is not in their navigation" : "";
  const cov = view.nav.includes("analysis") ? `Analysis coverage: ${view.coverage.length ? view.coverage.map((c) => COVERAGE_LABEL[c]).join(", ") : "none"}.` : "";
  const faults = view.faults.length ? ` ${view.faults.map((f) => `${f.tag}, ${f.title}: ${f.detail}`).join(" ")}` : " No faults.";
  return `${label} interface. Navigation shows ${nav}. Signs in to ${landing}${hidden}. ${cov}${faults}`;
}

/* ── Core: one role, surface over rule beds ─────────────────────────────────── */

const Core = memo(function Core({ role, col }: { role: Role; col: number }) {
  const store = useFaultStore();
  const act = useAct();
  const tracker = useTracker();
  const { view, arch } = useFault(useShallow((s) => ({ view: s.compiled.roles[role], arch: s.arch })));
  const spec = useSpecimen<HTMLElement>(`FaultCore/${ROLE_CODE[role]}`, "Lab · fault lines", { role, faults: view.faults.map((f) => f.tag) });
  const surface = useRef<HTMLDivElement>(null);
  const audit = useRef<Record<string, HTMLElement | null>>({});
  const commits = useRef(0);

  // After every commit: count it, report it, and measure the rendered surface. Results are written
  // to the DOM directly, so measuring never causes a render of its own.
  useLayoutEffect(() => {
    commits.current += 1;
    tracker?.report(ROLE_LABEL[role]);
    const root = surface.current;
    const a = audit.current;
    if (!root) return;
    const buttons = root.querySelectorAll("button").length;
    const radios = root.querySelectorAll('input[type="radio"]').length;
    const current = root.querySelector('[aria-current="page"]')?.textContent;
    const hasSelector = root.querySelector("fieldset") !== null;
    if (a.stops) a.stops.textContent = String(buttons + (radios ? 1 : 0));
    if (a.current) {
      a.current.textContent = current ?? "none announced";
      a.current.dataset.bad = current ? "" : "true";
    }
    if (a.options) {
      a.options.textContent = hasSelector ? String(radios) : "no selector";
      a.options.dataset.bad = hasSelector && radios === 0 ? "true" : "";
    }
    if (a.commits) a.commits.textContent = String(commits.current);
  });

  const y = throws(view.faults);
  const gaps = (bed: Bed) => view.faults.filter((f) => f.boundary === bed);

  const edit = (cell: Cell): Edit => {
    if (cell.bed === "landing") return { kind: "landing", role, dashboard: cell.id };
    if (cell.bed === "nav") return { kind: "nav", role, dashboard: cell.id, allow: !view.nav.includes(cell.id) };
    return { kind: "coverage", role, coverage: cell.id, allow: !view.coverage.includes(cell.id) };
  };
  const press = (cell: Cell) => {
    const e = edit(cell);
    const text = sentence(e);
    act(text, () => store.getState().state(text, [e]));
  };

  const dead = view.faults.some((f) => f.code === "dead-coverage");
  const faultCount = view.faults.filter((f) => f.severity === "fault").length;

  return (
    <section {...spec} className="fl-core" aria-labelledby={`fl-core-${role}`}>
      <header className="fl-cap">
        <span className="flex items-baseline gap-2">
          <span className="code-tag">{ROLE_CODE[role]}</span>
          <h3 id={`fl-core-${role}`} className="fl-cap-title">
            {ROLE_LABEL[role]}
          </h3>
        </span>
        <span className="fl-cap-state" data-faulted={faultCount > 0 || undefined} data-dead={(view.faults.length > 0 && faultCount === 0) || undefined}>
          {view.faults.length === 0 ? "sound" : view.faults.map((f) => f.tag).join(" ")}
        </span>
      </header>
      <p className="sr-only">{summary(view)}</p>
      <div ref={surface}>
        <Surface view={view} />
      </div>
      <div className="fl-beds">
        {BEDS.map((bed) => (
          <div key={bed.id} className="fl-bed" data-bed={bed.id} style={{ ["--y" as string]: y[bed.id] } as CSSProperties}>
            {gaps(bed.id).map((f, i) => (
              <span key={f.code} className="fl-gap" data-sev={f.severity} style={{ ["--gap" as string]: THROW[f.severity], ["--k" as string]: i } as CSSProperties} aria-hidden="true">
                <span>
                  {f.tag} · {f.title}
                </span>
              </span>
            ))}
            <p className="fl-bed-head" aria-hidden="true">
              <span>{bed.label}</span>
              <span>{bed.reads}</span>
            </p>
            <ul role="list">
              {CELLS.map((cell, row) => {
                if (cell.bed !== bed.id) return null;
                const derived = view.derivedCells.includes(`${cell.bed}:${cell.id}`);
                const common = {
                  "data-cell": cellKey(col, row),
                  // Roving tab stop. The section moves it imperatively, so focus never re-renders a core.
                  tabIndex: col === 0 && row === 0 ? 0 : -1,
                  onClick: () => press(cell),
                  className: "fl-cell",
                  type: "button" as const,
                };
                if (cell.bed === "landing") {
                  const asked = view.landingAsked === cell.id;
                  const actual = view.landing === cell.id;
                  const hidden = asked && !view.nav.includes(cell.id);
                  const tag = hidden && arch === "lists" ? "hidden" : actual && !asked ? "resolved" : hidden ? "unmet" : null;
                  return (
                    <li key={cell.id}>
                      <button {...common} aria-pressed={asked} data-on={asked || actual || undefined} aria-label={`${ROLE_LABEL[role]} users land on ${DASHBOARD_LABEL[cell.id]}${tag ? ` (${tag})` : ""}`}>
                        <span className="fl-glyph fl-glyph-radio" data-actual={actual || undefined} aria-hidden="true" />
                        <span className="fl-cell-label">{DASHBOARD_LABEL[cell.id]}</span>
                        {tag ? <span className="fl-tag" data-kind={tag}>{tag}</span> : null}
                      </button>
                    </li>
                  );
                }
                const on = cell.bed === "nav" ? view.nav.includes(cell.id) : view.coverage.includes(cell.id);
                const label = cell.bed === "nav" ? DASHBOARD_LABEL[cell.id] : COVERAGE_LABEL[cell.id];
                const tag = derived ? "derived" : cell.bed === "coverage" && on && dead ? "unreachable" : null;
                const name = cell.bed === "nav" ? `${ROLE_LABEL[role]} users can open ${label}` : `${ROLE_LABEL[role]} users can analyse at ${label.toLowerCase()} coverage`;
                return (
                  <li key={cell.id}>
                    <button {...common} role="switch" aria-checked={on} data-on={on || undefined} aria-label={`${name}${tag ? ` (${tag})` : ""}`}>
                      <span className="fl-glyph" aria-hidden="true" />
                      <span className="fl-cell-label">{label}</span>
                      {tag ? <span className="fl-tag" data-kind={tag}>{tag}</span> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <dl className="fl-audit" aria-label={`${ROLE_LABEL[role]} interface, measured`}>
        <dt>tab stops</dt>
        <dd ref={(el) => void (audit.current.stops = el)}>—</dd>
        <dt>current page</dt>
        <dd ref={(el) => void (audit.current.current = el)}>—</dd>
        <dt>coverage options</dt>
        <dd ref={(el) => void (audit.current.options = el)}>—</dd>
        <dt>commits</dt>
        <dd ref={(el) => void (audit.current.commits = el)}>—</dd>
      </dl>
      <ul className="fl-faults" aria-label={`${ROLE_LABEL[role]} faults`}>
        {view.faults.length ? (
          view.faults.map((f) => (
            <li key={f.code} data-sev={f.severity}>
              <b>{f.tag}</b> {f.detail}
            </li>
          ))
        ) : (
          <li data-sev="none">The three rules agree.</li>
        )}
      </ul>
    </section>
  );
});

/* ── Section: four cores, one keyboard grid ─────────────────────────────────── */

const KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"];

function nextBedStart(row: number, dir: 1 | -1) {
  const starts = BEDS.map((b) => BED_START[b.id]);
  if (dir === 1) return starts.find((s) => s > row) ?? row;
  const current = [...starts].reverse().find((s) => s <= row) ?? 0;
  return current < row ? current : ([...starts].reverse().find((s) => s < row) ?? 0);
}

function parseCell(el: EventTarget | null) {
  const key = el instanceof HTMLElement ? el.dataset.cell : undefined;
  if (!key) return null;
  const [col, row] = key.split(":").map(Number);
  return { col: col!, row: row! };
}

export function Section() {
  const store = useFaultStore();
  const { reserve, focusCol } = useFault(
    useShallow((s) => ({
      reserve: Math.max(...ROLES.map((r) => throws(s.compiled.roles[r].faults).coverage)),
      focusCol: ROLES.indexOf(s.focusRole),
    })),
  );
  const spec = useSpecimen<HTMLDivElement>("FaultSection", "Lab · fault lines", { reserve, focusCol });
  const grid = useRef<HTMLDivElement>(null);
  const stop = useRef<HTMLElement | null>(null);

  /** Moves the single tab stop to whichever cell gained focus, by mouse or keyboard. */
  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    const at = parseCell(e.target);
    if (!at) return;
    const target = e.target as HTMLElement;
    if (stop.current !== target) {
      grid.current?.querySelectorAll<HTMLElement>('[data-cell][tabindex="0"]').forEach((el) => (el.tabIndex = -1));
      target.tabIndex = 0;
      stop.current = target;
    }
    const role = ROLES[at.col];
    if (role && store.getState().focusRole !== role) store.getState().setFocusRole(role);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const at = parseCell(e.target);
    if (!KEYS.includes(e.key) || !at) return;
    e.preventDefault();
    const last = CELLS.length - 1;
    let { col, row } = at;
    if (e.key === "ArrowUp") row = Math.max(0, row - 1);
    else if (e.key === "ArrowDown") row = Math.min(last, row + 1);
    else if (e.key === "ArrowLeft") col = Math.max(0, col - 1);
    else if (e.key === "ArrowRight") col = Math.min(ROLES.length - 1, col + 1);
    else if (e.key === "Home") row = e.ctrlKey || e.metaKey ? 0 : BED_START[CELLS[row]!.bed];
    else if (e.key === "End") row = e.ctrlKey || e.metaKey ? last : (BEDS.map((b) => BED_START[b.id]).find((s) => s > row) ?? CELLS.length) - 1;
    else if (e.key === "PageDown") row = nextBedStart(row, 1);
    else if (e.key === "PageUp") row = nextBedStart(row, -1);
    // On narrow screens only the focused role's core is displayed: commit the switch before focusing.
    const role = ROLES[col]!;
    if (store.getState().focusRole !== role) flushSync(() => store.getState().setFocusRole(role));
    grid.current?.querySelector<HTMLElement>(`[data-cell="${cellKey(col, row)}"]`)?.focus();
  };

  return (
    <div {...spec} className="flex min-w-0 flex-col gap-3">
      <h2 className="sr-only">Rule section: one core per role</h2>
      <RoleTabs />
      <p id="fl-keys" className="label fl-keys">
        Arrows move between rules and roles · Page Up / Down jump beds · Space toggles · A switches architecture · Ctrl or ⌘ Z undoes
      </p>
      <div
        ref={grid}
        role="group"
        aria-label="Rule section: four roles, three beds of rules each"
        aria-describedby="fl-keys"
        className="fl-section"
        data-focus-col={focusCol}
        style={{ ["--reserve" as string]: `${reserve}px` } as CSSProperties}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
      >
        {ROLES.map((role, col) => (
          <Core key={role} role={role} col={col} />
        ))}
      </div>
    </div>
  );
}

/** Narrow screens show one core at a time. The tabs carry each role's fault state. */
function RoleTabs() {
  const store = useFaultStore();
  const { focusRole, states } = useFault(
    useShallow((s) => ({ focusRole: s.focusRole, states: ROLES.map((r) => s.compiled.roles[r].faults.length).join(",") })),
  );
  const counts = states.split(",").map(Number);
  return (
    <fieldset className="fl-roletabs">
      <legend className="sr-only">Role shown</legend>
      {ROLES.map((r, i) => (
        <label key={r}>
          <input type="radio" name="fl-role" className="sr-only" checked={focusRole === r} onChange={() => store.getState().setFocusRole(r)} />
          <span>{ROLE_LABEL[r]}</span>
          {counts[i] ? (
            <span className="fl-dot">
              <span className="sr-only">, {counts[i]} {counts[i]! > 1 ? "issues" : "issue"}</span>
            </span>
          ) : null}
        </label>
      ))}
    </fieldset>
  );
}
