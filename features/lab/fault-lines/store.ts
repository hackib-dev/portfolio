"use client";

import { createContext, useCallback, useContext } from "react";
import { createStore, useStore, type StoreApi } from "zustand";
import type { Role } from "@/features/firs-replica/model";
import type { Tracker } from "@/features/lab/state-propagation/tracker";
import { compile, describeGroup, diff, type Arch, type Compiled, type Edit, type LedgerLine, type Requirement } from "./rules";

export type View = "section" | "table";

export type FaultState = {
  /** Every requirement stated so far. Only the first `cursor` are in force; the rest can be redone. */
  log: Requirement[];
  cursor: number;
  arch: Arch;
  view: View;
  /** The role shown when the section collapses to one column. */
  focusRole: Role;
  compiled: Compiled;
  /** Wall time of the last compile, measured with performance.now(). */
  compileMs: number;
  ledger: { id: number; cause: string; lines: LedgerLine[] } | null;
};

export type FaultActions = {
  state: (text: string, edits: Edit[]) => void;
  undo: () => void;
  redo: () => void;
  rewind: (cursor: number) => void;
  reset: () => void;
  setArch: (arch: Arch) => void;
  setView: (view: View) => void;
  setFocusRole: (role: Role) => void;
  load: (arch: Arch, groups: Edit[][]) => void;
};

export type FaultStore = StoreApi<FaultState & FaultActions>;

const MAX_LOG = 40;

function timed(log: Requirement[], arch: Arch, prev?: Compiled) {
  const t = performance.now();
  const compiled = compile(log, arch, prev);
  return { compiled, compileMs: performance.now() - t };
}

export function createFaultStore(): FaultStore {
  let seq = 0;
  let ledgerSeq = 0;
  return createStore<FaultState & FaultActions>()((set, get) => {
    /** Recompiles against the previous output so unchanged roles keep their identity. */
    const recompile = (cause: string, patch: Partial<FaultState>) => {
      const s = { ...get(), ...patch };
      const { compiled, compileMs } = timed(s.log.slice(0, s.cursor), s.arch, get().compiled);
      set({ ...patch, compiled, compileMs, ledger: { id: ++ledgerSeq, cause, lines: diff(get().compiled, compiled) } });
    };

    return {
      log: [],
      cursor: 0,
      arch: "lists",
      view: "section",
      focusRole: "NATIONAL_USER",
      ...(() => {
        const { compiled } = timed([], "lists");
        return { compiled, compileMs: 0 };
      })(),
      ledger: null,

      state: (text, edits) => {
        const { log, cursor } = get();
        const next = [...log.slice(0, cursor), { id: ++seq, text, edits }].slice(-MAX_LOG);
        recompile(text, { log: next, cursor: next.length });
      },
      undo: () => {
        const { cursor, log } = get();
        if (cursor > 0) recompile(`Undo: ${log[cursor - 1]?.text ?? ""}`, { cursor: cursor - 1 });
      },
      redo: () => {
        const { cursor, log } = get();
        if (cursor < log.length) recompile(`Redo: ${log[cursor]?.text ?? ""}`, { cursor: cursor + 1 });
      },
      rewind: (cursor) => {
        if (cursor !== get().cursor) recompile(cursor === 0 ? "Rewound to the shipped rules" : `Rewound to requirement ${cursor}`, { cursor });
      },
      reset: () => recompile("Reset to the shipped rules", { log: [], cursor: 0 }),
      setArch: (arch) => {
        if (arch !== get().arch) recompile(arch === "derived" ? "Recompiled as one source of truth" : "Recompiled as three lists, as shipped", { arch });
      },
      setView: (view) => set({ view }),
      setFocusRole: (focusRole) => set({ focusRole }),
      load: (arch, groups) => {
        const log = groups.map((edits) => ({ id: ++seq, text: describeGroup(edits), edits }));
        recompile("Loaded from the link", { arch, log, cursor: log.length });
      },
    };
  });
}

export const FaultStoreContext = createContext<FaultStore | null>(null);

export function useFaultStore(): FaultStore {
  const store = useContext(FaultStoreContext);
  if (!store) throw new Error("Fault lines components need a FaultStoreContext provider");
  return store;
}

export function useFault<T>(selector: (s: FaultState & FaultActions) => T): T {
  return useStore(useFaultStore(), selector);
}

/** Commit tracking, shared with the state propagation experiment: which cores an action woke. */
export const TrackerContext = createContext<Tracker | null>(null);

export function useAct() {
  const tracker = useContext(TrackerContext);
  return useCallback(
    (label: string, fn: () => void) => {
      tracker?.begin(label);
      fn();
    },
    [tracker],
  );
}

export function useTracker() {
  return useContext(TrackerContext);
}
