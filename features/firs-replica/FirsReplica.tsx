"use client";

import { useEffect, useState } from "react";
import { handoff } from "@/features/descent/handoff";
import { useShallow } from "zustand/react/shallow";
import { useSpecimen } from "@/features/seam/useSpecimen";
import { diffViews, navFor, ROLE_LABEL, ROLES, viewFor, type Role } from "./model";
import { createFirsStore, FirsStoreContext, useFirs } from "./store";
import { DashboardView } from "./views";

function RoleSwitch() {
  const { role, setRole } = useFirs(useShallow((s) => ({ role: s.role, setRole: s.setRole })));
  const spec = useSpecimen<HTMLFieldSetElement>("RoleSwitch", "Replica · FIRS", { role });
  return (
    <fieldset {...spec} className="flex flex-col gap-2">
      <legend className="label mb-2 text-ink-2">Decision switch · signed in as</legend>
      <div className="grid grid-cols-2 gap-0 border border-ink sm:grid-cols-4">
        {ROLES.map((r, i) => (
          <label
            key={r}
            className={`flex cursor-pointer flex-col gap-0.5 px-3 py-2.5 has-[:checked]:bg-ink has-[:checked]:text-vellum has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-4 has-[:focus-visible]:outline-marker ${i > 0 ? "sm:border-l sm:border-ink" : ""} ${i % 2 === 1 ? "border-l border-ink sm:border-l" : ""} ${i > 1 ? "border-t border-ink sm:border-t-0" : ""}`}
          >
            <input type="radio" name="firs-role" value={r} checked={role === r} onChange={() => setRole(r)} className="sr-only" />
            <span className="font-display text-[17px] font-bold [font-variation-settings:'wdth'_100]">{ROLE_LABEL[r]}</span>
            <span className="font-mono text-[10px] break-all opacity-70 [font-variation-settings:'wdth'_87]">{r}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ReplicaNav() {
  const { role, dashboard, open } = useFirs(useShallow((s) => ({ role: s.role, dashboard: s.dashboard, open: s.open })));
  const items = navFor(role);
  const spec = useSpecimen<HTMLElement>("ReplicaSidebar", "Replica · FIRS", {
    role,
    visible: items.filter((i) => i.visible).map((i) => i.id),
  });
  return (
    <nav {...spec} aria-label="Replica navigation" className="border-ink bg-[#2b2f33] p-2 text-vellum max-md:border-b md:border-r">
      <ul className="flex flex-col gap-0.5 max-md:grid max-md:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>
            {item.visible ? (
              <button
                type="button"
                onClick={() => open(item.id)}
                aria-current={dashboard === item.id ? "page" : undefined}
                className="w-full px-2.5 py-2 text-left font-display text-[14px] [font-variation-settings:'wdth'_96] hover:bg-white/10 aria-[current=page]:bg-vellum aria-[current=page]:text-ink"
              >
                {item.label}
              </button>
            ) : (
              <span className="block border border-dashed border-white/40 px-2.5 py-[7px] font-display text-[14px] text-white/65 line-through [font-variation-settings:'wdth'_96]">
                <span aria-hidden="true">{item.label}</span>
                <span className="sr-only">{item.label}, hidden for this role</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

const MARK = { removed: "−", added: "+", changed: "→", same: "=" } as const;

function Ledger() {
  const { role, previousRole } = useFirs(useShallow((s) => ({ role: s.role, previousRole: s.previousRole })));
  const lines = previousRole ? diffViews(viewFor(previousRole), viewFor(role)) : [];
  const spec = useSpecimen<HTMLDivElement>("ConsequenceLedger", "Replica · FIRS", { from: previousRole, to: role, lines: lines.length });
  return (
    <div {...spec} className="flex flex-col gap-2 border-t border-ink bg-vellum p-4">
      <p className="label text-ink-2">Consequence ledger · computed from the two role views</p>
      <div aria-live="polite" aria-atomic="true">
        {previousRole ? (
          <>
            <p className="sr-only">
              Switched from {ROLE_LABEL[previousRole]} to {ROLE_LABEL[role]}.
            </p>
            <ul className="flex flex-col gap-1">
              {lines.map((l) => (
                <li key={l.text} className={`flex gap-3 text-[15px] leading-snug ${l.kind === "same" ? "text-ink-2" : ""}`}>
                  <span aria-hidden="true" className="w-3 shrink-0 font-mono text-marker-ink">
                    {MARK[l.kind]}
                  </span>
                  {l.text}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-[15px] text-ink-2">Switch roles above. Each change is listed here, worked out from the role rules rather than written by hand.</p>
        )}
      </div>
    </div>
  );
}

export function FirsReplica({ initialRole }: { initialRole?: Role }) {
  const [store] = useState(() => createFirsStore(initialRole));
  useEffect(() => {
    handoff.set("firs", store.getState().role);
    return store.subscribe((s) => handoff.set("firs", s.role));
  }, [store]);
  return (
    <FirsStoreContext.Provider value={store}>
      <div className="replica" role="group" aria-labelledby="replica-title">
        <div className="replica-cap">
          <span id="replica-title" className="label">
            Conceptual replica · synthetic data · not production code
          </span>
          <span className="label opacity-80">Role rules: verified in source</span>
        </div>
        <div className="p-4">
          <RoleSwitch />
        </div>
        <div className="grid border-t border-ink md:grid-cols-[200px_minmax(0,1fr)]">
          <ReplicaNav />
          <DashboardView />
        </div>
        <Ledger />
      </div>
    </FirsStoreContext.Provider>
  );
}
