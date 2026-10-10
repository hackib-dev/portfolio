"use client";

import { createContext, memo, useContext, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { useSpecimen } from "@/features/seam/useSpecimen";
import { createFirsStore, parseSeedRole, type FirsState, type FirsStore } from "@/features/firs-replica/store";
import { COVERAGE_LABEL, coverageFor, PERIOD_LABEL, PERIODS, ROLE_LABEL, ROLES, STATES, UNITS, type Role } from "@/features/firs-replica/model";
import { createTracker, type Tracker } from "./tracker";

type Key = keyof FirsState;
type Mode = "selectors" | "whole-store" | "context";

const NODES: { id: string; reads: Key[] }[] = [
  { id: "Sidebar", reads: ["role", "dashboard"] },
  { id: "PeriodFilter", reads: ["period"] },
  { id: "KpiStrip", reads: ["state", "period"] },
  { id: "TaxMap", reads: ["unit", "period"] },
  { id: "ReportScope", reads: ["role", "coverage"] },
  { id: "OfficeTable", reads: ["state"] },
];

const MODES: { id: Mode; label: string; code: string; note: string }[] = [
  {
    id: "selectors",
    label: "Fine-grained selectors",
    code: "useStore(store, useShallow(s => ({ period: s.period })))",
    note: "Each component subscribes to the fields it reads. A change wakes only the components that read the changed field.",
  },
  {
    id: "whole-store",
    label: "Whole-store subscription",
    code: "useStore(store)",
    note: "Each component subscribes to the entire state object. Any change, to any field, re-renders every subscriber.",
  },
  {
    id: "context",
    label: "One React Context",
    code: "<Ctx.Provider value={state}> … useContext(Ctx)",
    note: "One provider passes the whole state down. This is the shape of the filter providers on the FIRS dashboards: simple to wire, and every consumer re-renders when the value changes.",
  },
];

const LabStore = createContext<{ store: FirsStore; tracker: Tracker } | null>(null);
const ValueContext = createContext<FirsState | null>(null);

function useLab() {
  const v = useContext(LabStore);
  if (!v) throw new Error("Lab components need the LabStore provider");
  return v;
}

function pick(s: FirsState, keys: Key[]) {
  return Object.fromEntries(keys.map((k) => [k, s[k]])) as Partial<FirsState>;
}

function NodeCard({ id, reads, values, selector }: { id: string; reads: Key[]; values: Partial<FirsState>; selector: string }) {
  const { tracker } = useLab();
  const count = useRef<HTMLSpanElement>(null);
  const commits = useRef(0);
  const spec = useSpecimen<HTMLDivElement>(`Lab/${id}`, "Lab · state propagation", values);

  // Runs after every commit of this node. Updates the DOM directly so that showing the
  // count never causes an extra render of its own.
  useLayoutEffect(() => {
    commits.current += 1;
    if (count.current) count.current.textContent = String(commits.current);
    tracker.report(id);
    const box = spec.ref;
    if (commits.current > 1 && box.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      box.current.animate(
        [
          { backgroundColor: "#ff512f", color: "#0d1317" },
          { backgroundColor: "#16212a", color: "#cfdce0" },
        ],
        { duration: 650, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
      );
    }
  });

  return (
    <div {...spec} className="node trace" style={{ ["--i" as string]: NODES.findIndex((n) => n.id === id) }}>
        <div className="flex items-start justify-between gap-2">
          <span className="font-display text-[17px] font-bold [font-variation-settings:'wdth'_92]">{id}</span>
          <span className="flex flex-col items-end">
            <span ref={count} className="node-count">
              0
            </span>
            <span className="label">commits</span>
          </span>
        </div>
        <span className="node-sel">reads: {reads.join(", ")}</span>
        <span className="node-sel opacity-80">{selector}</span>
        <span className="font-mono text-[11px] text-film-text [font-variation-settings:'wdth'_87]">
          {reads.map((k) => `${k}=${String(values[k])}`).join(" · ")}
        </span>
    </div>
  );
}

const SelectorNode = memo(function SelectorNode({ id, reads }: { id: string; reads: Key[] }) {
  const { store } = useLab();
  const values = useStore(store, useShallow((s) => pick(s, reads)));
  return <NodeCard id={id} reads={reads} values={values} selector="selector + shallow compare" />;
});

const WholeStoreNode = memo(function WholeStoreNode({ id, reads }: { id: string; reads: Key[] }) {
  const { store } = useLab();
  const state = useStore(store);
  return <NodeCard id={id} reads={reads} values={pick(state, reads)} selector="whole store" />;
});

const ContextNode = memo(function ContextNode({ id, reads }: { id: string; reads: Key[] }) {
  const state = useContext(ValueContext);
  return <NodeCard id={id} reads={reads} values={state ? pick(state, reads) : {}} selector="useContext" />;
});

function ContextBridge({ children }: { children: ReactNode }) {
  const { store } = useLab();
  const state = useStore(store);
  return <ValueContext.Provider value={state}>{children}</ValueContext.Provider>;
}

function Tree({ mode }: { mode: Mode }) {
  const Node = mode === "selectors" ? SelectorNode : mode === "whole-store" ? WholeStoreNode : ContextNode;
  const nodes = (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
      {NODES.map((n) => (
        <Node key={n.id} id={n.id} reads={n.reads} />
      ))}
    </div>
  );
  return mode === "context" ? <ContextBridge>{nodes}</ContextBridge> : nodes;
}

function Seg<T extends string>({ name, legend, options, value, onChange }: { name: string; legend: string; options: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="label mb-1.5 text-film-dim">{legend}</legend>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <label key={o.id} className="cursor-pointer border border-film-3 px-2.5 py-1.5 font-mono text-[11px] [font-variation-settings:'wdth'_87] has-[:checked]:border-film-text has-[:checked]:bg-film-text has-[:checked]:text-film has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-marker">
            <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Controls() {
  const { store, tracker } = useLab();
  const s = useStore(store, useShallow((x) => ({ role: x.role, period: x.period, state: x.state, unit: x.unit, coverage: x.coverage })));
  const act = (label: string, fn: () => void) => {
    tracker.begin(label);
    fn();
  };
  const st = store.getState();
  return (
    <div className="flex flex-col gap-4">
      <Seg name="lab-role" legend="role" value={s.role} options={ROLES.map((r) => ({ id: r, label: ROLE_LABEL[r] }))} onChange={(r) => act(`setRole("${r}")`, () => st.setRole(r))} />
      <Seg name="lab-period" legend="period" value={s.period} options={PERIODS.map((p) => ({ id: p, label: PERIOD_LABEL[p] }))} onChange={(p) => act(`setPeriod("${p}")`, () => st.setPeriod(p))} />
      <Seg name="lab-coverage" legend="coverage (filtered by role)" value={s.coverage} options={coverageFor(s.role).map((c) => ({ id: c, label: COVERAGE_LABEL[c] }))} onChange={(c) => act(`setCoverage("${c}")`, () => st.setCoverage(c))} />
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5" htmlFor="lab-state">
          <span className="label text-film-dim">state</span>
          <select id="lab-state" value={s.state} onChange={(e) => act(`setState("${e.target.value}")`, () => st.setState(e.target.value))} className="border border-film-3 bg-film-2 px-2 py-1.5 font-mono text-[12px] text-film-text">
            {[...STATES].sort((a, b) => a.name.localeCompare(b.name)).map((x) => (
              <option key={x.code} value={x.code}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5" htmlFor="lab-unit">
          <span className="label text-film-dim">unit (synthetic)</span>
          <select id="lab-unit" value={s.unit} onChange={(e) => act(`setUnit("${e.target.value}")`, () => st.setUnit(e.target.value))} className="border border-film-3 bg-film-2 px-2 py-1.5 font-mono text-[12px] text-film-text">
            {UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.id}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="font-read text-[14px] leading-snug text-film-dim">
        Changing the state also changes its unit, so that one action touches two fields. Watch which nodes wake up.
      </p>
    </div>
  );
}

function Log() {
  const { tracker } = useLab();
  const entries = useStore(tracker.log, (s) => s.entries);
  const latest = entries[0];
  return (
    <div className="flex flex-col gap-3">
      <p className="label text-film-dim">Commit log · measured</p>
      <p className="sr-only" aria-live="polite">
        {latest ? `${latest.action}: ${latest.rendered.length} of ${NODES.length} components re-rendered.` : ""}
      </p>
      {entries.length === 0 ? (
        <p className="font-read text-[15px] leading-snug text-film-dim">Make a change on the left. Each action is listed with the components that actually committed.</p>
      ) : (
        <ol className="flex flex-col">
          {entries.map((e) => (
            <li key={e.id} className="flex flex-col gap-1 border-t border-film-3 py-2">
              <span className="flex justify-between gap-3 font-mono text-[11.5px] [font-variation-settings:'wdth'_87]">
                <span className="text-film-text">{e.action}</span>
                <span className={e.rendered.length === NODES.length ? "text-marker" : "text-film-line"}>
                  {e.rendered.length}/{NODES.length}
                </span>
              </span>
              <span className="font-mono text-[10.5px] text-film-dim [font-variation-settings:'wdth'_87]">{e.rendered.length ? e.rendered.join(" · ") : "nothing re-rendered"}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Inspector() {
  const { store } = useLab();
  const s = useStore(store, useShallow((x) => ({ role: x.role, dashboard: x.dashboard, period: x.period, state: x.state, unit: x.unit, coverage: x.coverage })));
  return (
    <pre className="whitespace-pre-wrap break-all bg-film-2 px-3 py-2 font-mono text-[11px] leading-relaxed text-film-text [font-variation-settings:'wdth'_87]" aria-label="Current store state">
      {JSON.stringify(s, null, 0).replace(/,/g, ", ")}
    </pre>
  );
}

const noopSubscribe = () => () => {};
function readSeed(): Role | null {
  return parseSeedRole(new URLSearchParams(window.location.search).get("seed") ?? undefined) ?? null;
}

export function StatePropagation() {
  // The page is static. The seed comes from the URL after hydration: null on the server,
  // the seeded role in the browser. A seeded store starts fresh, so its counters start at 1.
  const seedRole = useSyncExternalStore(noopSubscribe, readSeed, () => null);
  const [tracker] = useState(createTracker);
  const lab = useMemo(() => ({ store: createFirsStore(seedRole ?? undefined), tracker }), [seedRole, tracker]);
  const [mode, setMode] = useState<Mode>("selectors");
  const current = useMemo(() => MODES.find((m) => m.id === mode) ?? MODES[0]!, [mode]);
  const spec = useSpecimen<HTMLDivElement>("StatePropagation", "Lab · state propagation", { mode, seededFrom: seedRole });

  return (
    <LabStore.Provider value={lab}>
      <div {...spec} className="flex flex-col gap-6">
        <p className="min-h-[3em] border-l-2 border-marker pl-3 font-read text-[16px] leading-snug">
          {seedRole ? (
            <>
              Seeded from the FIRS case study: signed in as <b>{ROLE_LABEL[seedRole]}</b>, the role you left the replica on.
            </>
          ) : (
            <>Starting as a National user. Arrive from the FIRS case study to carry over the role you picked there.</>
          )}
        </p>
        <Seg
          name="lab-mode"
          legend="subscription strategy"
          value={mode}
          options={MODES.map((m) => ({ id: m.id, label: m.label }))}
          onChange={(m) => {
            tracker.reset();
            setMode(m);
          }}
        />
        <div className="flex flex-col gap-1">
          <code className="font-mono text-[12px] text-film-line [font-variation-settings:'wdth'_87]">{current.code}</code>
          <p className="max-w-[70ch] font-read text-[16px] leading-snug">{current.note}</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
          <Controls />
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex items-center justify-between gap-3 border border-film-3 px-3 py-2">
              <span className="font-display text-[15px] font-bold [font-variation-settings:'wdth'_92]">Store · createFirsStore()</span>
              <span className="label text-film-dim">the replica&apos;s own store</span>
            </div>
            <Inspector />
            <div aria-hidden="true" className="mx-auto h-4 w-px bg-film-3" />
            <Tree key={`${mode}:${seedRole ?? "none"}`} mode={mode} />
          </div>
          <Log />
        </div>
      </div>
    </LabStore.Provider>
  );
}
