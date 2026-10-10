"use client";

import { createContext, useContext } from "react";
import { createStore, useStore, type StoreApi } from "zustand";
import { canOpen, coverageFor, LANDING, unitOf, type Coverage, type Dashboard, type Period, type Role } from "./model";

export type FirsState = {
  role: Role;
  dashboard: Dashboard;
  period: Period;
  state: string;
  unit: string;
  coverage: Coverage;
  /** Increments each time the analysis preview is run. */
  run: number;
  /** The role before the last switch, so the ledger can diff the two views. */
  previousRole: Role | null;
};

export type FirsActions = {
  setRole: (role: Role) => void;
  open: (dashboard: Dashboard) => void;
  setPeriod: (period: Period) => void;
  setState: (code: string) => void;
  setUnit: (unit: string) => void;
  setCoverage: (coverage: Coverage) => void;
  runAnalysis: () => void;
};

export type FirsStore = StoreApi<FirsState & FirsActions>;

export function initialFirsState(role: Role = "NATIONAL_USER"): FirsState {
  return {
    role,
    dashboard: LANDING[role],
    period: "MONTH",
    state: "LA",
    unit: unitOf("LA"),
    coverage: coverageFor(role)[0] ?? "TAX_OFFICE",
    run: 0,
    previousRole: null,
  };
}

export function createFirsStore(role?: Role): FirsStore {
  return createStore<FirsState & FirsActions>()((set, get) => ({
    ...initialFirsState(role),
    setRole: (next) => {
      const allowed = coverageFor(next);
      const coverage = allowed.includes(get().coverage) ? get().coverage : (allowed[0] ?? "TAX_OFFICE");
      if (next === get().role) return;
      set({ role: next, previousRole: get().role, dashboard: LANDING[next], coverage });
    },
    open: (dashboard) => {
      if (canOpen(get().role, dashboard)) set({ dashboard });
    },
    setPeriod: (period) => set({ period }),
    setState: (code) => set({ state: code, unit: unitOf(code) }),
    setUnit: (unit) => set({ unit }),
    setCoverage: (coverage) => {
      if (coverageFor(get().role).includes(coverage)) set({ coverage });
    },
    runAnalysis: () => set({ run: get().run + 1 }),
  }));
}

export const FirsStoreContext = createContext<FirsStore | null>(null);

export function useFirsStore(): FirsStore {
  const store = useContext(FirsStoreContext);
  if (!store) throw new Error("FIRS replica components need a FirsStoreContext provider");
  return store;
}

export function useFirs<T>(selector: (s: FirsState & FirsActions) => T): T {
  return useStore(useFirsStore(), selector);
}

export function parseSeedRole(seed: string | undefined): Role | undefined {
  if (!seed?.startsWith("firs:")) return undefined;
  const role = seed.slice(5);
  return (["NATIONAL_USER", "STATE_USER", "COORDINATION_OFFICE_USER", "TAX_OFFICE_USER"] as const).find((r) => r === role);
}
