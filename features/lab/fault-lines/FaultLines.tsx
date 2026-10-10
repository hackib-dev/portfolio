"use client";

import { useEffect, useLayoutEffect, useState, type KeyboardEvent, type ReactNode } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { useSpecimen } from "@/features/seam/useSpecimen";
import { COVERAGE, COVERAGE_LABEL, ROLE_LABEL, ROLES, type Coverage, type Dashboard, type Role } from "@/features/firs-replica/model";
import { createTracker } from "@/features/lab/state-propagation/tracker";
import { DASHBOARD_LABEL, decode, encode, faultCount, LANDING_CANDIDATES, NAV_ORDER, SCENARIOS, sentence, type Arch, type Edit } from "./rules";
import { createFaultStore, FaultStoreContext, TrackerContext, useAct, useFault, useFaultStore, useTracker, type View } from "./store";
import { Section } from "./Section";
import { TableView } from "./TableView";

/* ── Small controls ─────────────────────────────────────────────────────────── */

function Seg<T extends string>({ name, legend, options, value, onChange }: { name: string; legend: string; options: { id: T; label: string; sub?: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset className="fl-seg">
      <legend className="label">{legend}</legend>
      <div>
        {options.map((o) => (
          <label key={o.id}>
            <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} className="sr-only" />
            <b>{o.label}</b>
            {o.sub ? <span>{o.sub}</span> : null}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const ARCHS: { id: Arch; label: string; sub: string }[] = [
  { id: "lists", label: "Three lists", sub: "as shipped · verified in source" },
  { id: "derived", label: "One source", sub: "counterfactual · not shipped" },
];

const VIEWS: { id: View; label: string; sub: string }[] = [
  { id: "section", label: "Section", sub: "drawn" },
  { id: "table", label: "Table", sub: "plain" },
];

function Controls() {
  const store = useFaultStore();
  const act = useAct();
  const { arch, view, cursor, size } = useFault(useShallow((s) => ({ arch: s.arch, view: s.view, cursor: s.cursor, size: s.log.length })));
  const [copied, setCopied] = useState(false);
  const s = store.getState();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="fl-controls">
      <Seg name="fl-arch" legend="Architecture · A" options={ARCHS} value={arch} onChange={(a) => act(`architecture: ${a}`, () => s.setArch(a))} />
      <Seg name="fl-view" legend="View" options={VIEWS} value={view} onChange={(v) => s.setView(v)} />
      <div className="fl-history" role="group" aria-label="History">
        <button type="button" className="fl-btn" disabled={cursor === 0} onClick={() => act("undo", s.undo)} aria-keyshortcuts="Control+Z Meta+Z">
          Undo
        </button>
        <button type="button" className="fl-btn" disabled={cursor === size} onClick={() => act("redo", s.redo)} aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z">
          Redo
        </button>
        <button type="button" className="fl-btn" disabled={size === 0} onClick={() => act("reset", s.reset)}>
          Reset
        </button>
        <button type="button" className="fl-btn" onClick={copy}>
          {copied ? "Link copied" : "Copy link"}
        </button>
        <span className="sr-only" role="status">
          {copied ? "Link to this configuration copied" : ""}
        </span>
      </div>
    </div>
  );
}

/* ── Requirement composer ───────────────────────────────────────────────────── */

type Verb = "open" | "close" | "land" | "grant" | "revoke";
const VERBS: { id: Verb; label: string }[] = [
  { id: "open", label: "can open" },
  { id: "close", label: "cannot open" },
  { id: "land", label: "land on" },
  { id: "grant", label: "can analyse at" },
  { id: "revoke", label: "cannot analyse at" },
];

function targetsFor(verb: Verb): { id: string; label: string }[] {
  if (verb === "grant" || verb === "revoke") return COVERAGE.map((c) => ({ id: c, label: `${COVERAGE_LABEL[c].toLowerCase()} coverage` }));
  const list = verb === "land" ? LANDING_CANDIDATES : NAV_ORDER;
  return list.map((d) => ({ id: d, label: DASHBOARD_LABEL[d] }));
}

function toEdit(role: Role, verb: Verb, target: string): Edit {
  if (verb === "land") return { kind: "landing", role, dashboard: target as Dashboard };
  if (verb === "grant" || verb === "revoke") return { kind: "coverage", role, coverage: target as Coverage, allow: verb === "grant" };
  return { kind: "nav", role, dashboard: target as Dashboard, allow: verb === "open" };
}

function Composer() {
  const store = useFaultStore();
  const act = useAct();
  const [role, setRole] = useState<Role>("STATE_USER");
  const [verb, setVerb] = useState<Verb>("close");
  const [target, setTarget] = useState<string>("state");
  const targets = targetsFor(verb);
  const safeTarget = targets.some((t) => t.id === target) ? target : targets[0]!.id;
  const spec = useSpecimen<HTMLFormElement>("RequirementComposer", "Lab · fault lines", { role, verb, target: safeTarget });

  const submit = (text: string, edits: Edit[]) => act(text, () => store.getState().state(text, edits));

  return (
    <div className="fl-composer">
      <form
        {...spec}
        className="fl-sentence"
        aria-label="State a requirement"
        onSubmit={(e) => {
          e.preventDefault();
          const edit = toEdit(role, verb, safeTarget);
          submit(sentence(edit), [edit]);
        }}
      >
        <span className="fl-sentence-k label">Requirement</span>
        <label>
          <span className="sr-only">Role</span>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]} users
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Rule</span>
          <select value={verb} onChange={(e) => setVerb(e.target.value as Verb)}>
            {VERBS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Target</span>
          <select value={safeTarget} onChange={(e) => setTarget(e.target.value)}>
            {targets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="fl-btn fl-btn-primary">
          State it
        </button>
      </form>
      <div className="fl-scenarios" role="group" aria-label="Try a requirement">
        <span className="label">Try</span>
        {SCENARIOS.map((sc) => (
          <button key={sc.label} type="button" className="fl-scenario" onClick={() => submit(sc.text, sc.edits)}>
            <span className="label">{sc.label}</span>
            <span>{sc.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Readings ───────────────────────────────────────────────────────────────── */

function Reading({ k, children, tone }: { k: string; children: ReactNode; tone?: "bad" | "warn" }) {
  return (
    <div className="fl-reading" data-tone={tone}>
      <dt>{k}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Readings() {
  const tracker = useTracker()!;
  const { compiled, cursor, compileMs, arch } = useFault(
    useShallow((s) => ({ compiled: s.compiled, cursor: s.cursor, compileMs: s.compileMs, arch: s.arch })),
  );
  const latest = useStore(tracker.log, (s) => s.entries[0]);
  const { faults, dead } = faultCount(compiled);
  return (
    <dl className="fl-readings" aria-label="Readings">
      <Reading k="Faults" tone={faults ? "bad" : undefined}>
        {faults}
      </Reading>
      <Reading k="Dead rules" tone={dead ? "warn" : undefined}>
        {dead}
      </Reading>
      <Reading k="Requirements in force">{cursor}</Reading>
      <Reading k="Compile, 4 roles">{compileMs < 0.01 ? "<0.01" : compileMs.toFixed(2)} ms</Reading>
      <Reading k="Cores re-rendered">{latest ? `${latest.rendered.length} of ${ROLES.length}` : "—"}</Reading>
      <Reading k="Compiler">{arch === "lists" ? "three lists" : "one source"}</Reading>
    </dl>
  );
}

/* ── Ledger and log ─────────────────────────────────────────────────────────── */

const MARK = { removed: "−", added: "+", changed: "→", fault: "✕", healed: "✓" } as const;

function Ledger() {
  const { ledger, outcome } = useFault(
    useShallow((s) => ({ ledger: s.ledger, outcome: s.ledger && s.cursor > 0 && s.ledger.cause === s.log[s.cursor - 1]?.text ? s.compiled.outcomes[s.cursor - 1] : undefined })),
  );
  const counts = useFault(useShallow((s) => faultCount(s.compiled)));
  const spec = useSpecimen<HTMLDivElement>("ConsequenceLedger", "Lab · fault lines", { lines: ledger?.lines.length ?? 0 });
  const announce = ledger
    ? `${ledger.cause}. ${ledger.lines.length ? ledger.lines.map((l) => `${ROLE_LABEL[l.role]}: ${l.text}`).join(". ") : "Nothing changed"}.${outcome?.notes.length ? ` ${outcome.notes.join(" ")}` : ""} ${counts.faults} faults, ${counts.dead} dead rules.`
    : "";
  return (
    <div {...spec} className="fl-panel">
      <p className="label fl-panel-k">Consequences · computed</p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </p>
      {ledger ? (
        <div key={ledger.id} className="fl-ledger">
          <p className="fl-ledger-cause">{ledger.cause}</p>
          {outcome && outcome.status !== "applied" ? (
            <p className="fl-outcome" data-status={outcome.status}>
              <span className="label">{outcome.status === "no-op" ? "already true" : outcome.status}</span> {outcome.notes.join(" ")}
            </p>
          ) : null}
          {ledger.lines.length ? (
            <ul>
              {ledger.lines.map((l, i) => (
                <li key={`${l.role}${l.text}`} data-kind={l.kind} style={{ ["--i" as string]: i }}>
                  <span aria-hidden="true">{MARK[l.kind]}</span>
                  <span>
                    <b>{ROLE_LABEL[l.role]}</b> {l.text}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="fl-muted">No role&apos;s interface changed.</p>
          )}
        </div>
      ) : (
        <p className="fl-muted">State a requirement, toggle a rule, or switch the architecture. Every consequence is worked out from the rules and listed here.</p>
      )}
    </div>
  );
}

const STATUS_LABEL = { applied: "applied", "no-op": "already true", implicit: "implicit", refused: "refused" } as const;

function RequirementLog() {
  const store = useFaultStore();
  const act = useAct();
  const { log, cursor, outcomes } = useFault(useShallow((s) => ({ log: s.log, cursor: s.cursor, outcomes: s.compiled.outcomes })));
  return (
    <div className="fl-panel">
      <p className="label fl-panel-k">Requirement log · select one to rewind</p>
      <ol className="fl-log">
        <li>
          <button type="button" aria-current={cursor === 0 ? "step" : undefined} onClick={() => act("rewind", () => store.getState().rewind(0))}>
            <span className="code-tag">R0</span>
            <span>Shipped rules, from the FIRS source</span>
          </button>
        </li>
        {log.map((r, i) => {
          const o = i < cursor ? outcomes[i] : undefined;
          return (
            <li key={r.id} data-future={i >= cursor || undefined}>
              <button type="button" aria-current={cursor === i + 1 ? "step" : undefined} onClick={() => act("rewind", () => store.getState().rewind(i + 1))}>
                <span className="code-tag">R{i + 1}</span>
                <span>
                  {r.text}
                  {o ? <span className="fl-status" data-status={o.status}>{STATUS_LABEL[o.status]}</span> : <span className="fl-status">undone</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ── Root ───────────────────────────────────────────────────────────────────── */

function Stage() {
  const view = useFault((s) => s.view);
  return (
    <div className="fl-stage">
      {view === "section" ? <Section /> : <TableView />}
      <div className="fl-side">
        <h2 className="sr-only">Consequences and history</h2>
        <Ledger />
        <RequirementLog />
      </div>
    </div>
  );
}

/** Keeps the URL hash in step with the requirements in force, so any configuration is a link. */
function useHashSync(store: ReturnType<typeof createFaultStore>) {
  useLayoutEffect(() => {
    const parsed = decode(window.location.hash);
    if (parsed && (parsed.groups.length || parsed.arch === "derived")) store.getState().load(parsed.arch, parsed.groups);
  }, [store]);
  useEffect(
    () =>
      store.subscribe((s, p) => {
        if (s.log === p.log && s.cursor === p.cursor && s.arch === p.arch) return;
        const hash = encode(s.log.slice(0, s.cursor), s.arch);
        const url = `${window.location.pathname}${window.location.search}${hash ? `#${hash}` : ""}`;
        window.history.replaceState(window.history.state, "", url);
      }),
    [store],
  );
}

export function FaultLines() {
  const [store] = useState(createFaultStore);
  const [tracker] = useState(createTracker);
  const spec = useSpecimen<HTMLDivElement>("FaultLines", "Lab · fault lines");
  useHashSync(store);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const s = store.getState();
    if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "z") {
      e.preventDefault();
      tracker.begin(e.shiftKey ? "redo" : "undo");
      if (e.shiftKey) s.redo();
      else s.undo();
    } else if (!e.metaKey && !e.ctrlKey && !e.altKey && (e.key === "a" || e.key === "A") && (e.target as HTMLElement).tagName !== "SELECT") {
      e.preventDefault();
      tracker.begin("architecture");
      s.setArch(s.arch === "lists" ? "derived" : "lists");
    }
  };

  return (
    <FaultStoreContext.Provider value={store}>
      <TrackerContext.Provider value={tracker}>
        <div {...spec} className="fl" onKeyDown={onKeyDown}>
          <Controls />
          <Composer />
          <Readings />
          <Stage />
        </div>
      </TrackerContext.Provider>
    </FaultStoreContext.Provider>
  );
}
