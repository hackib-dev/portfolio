"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  apiParams,
  bandColour,
  COVERAGE_LABEL,
  coverageFor,
  offices,
  performanceOf,
  PERIOD_LABEL,
  PERIODS,
  seriesFor,
  STATES,
  synth,
  UNITS,
  type Period,
} from "./model";
import { useFirs } from "./store";
import { Bars, Kpi, Legend, naira, TileMap, Widget } from "./parts";

const stateName = (code: string) => STATES.find((s) => s.code === code)?.name ?? code;

function PeriodFilter() {
  const { period, setPeriod, state, unit } = useFirs(
    useShallow((s) => ({ period: s.period, setPeriod: s.setPeriod, state: s.state, unit: s.unit })),
  );
  return (
    <Widget name="PeriodFilter" state={apiParams(period, state, unit)} className="!flex-row items-center gap-3">
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="label mb-1 text-ink-2">Period type</legend>
        {PERIODS.map((p) => (
          <label key={p} className="cursor-pointer border border-ink px-2.5 py-1 font-mono text-[11px] uppercase has-[:checked]:bg-ink has-[:checked]:text-vellum has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-marker">
            <input type="radio" name="firs-period" value={p} checked={period === p} onChange={() => setPeriod(p)} className="sr-only" />
            {PERIOD_LABEL[p]}
          </label>
        ))}
      </fieldset>
    </Widget>
  );
}

function StateSelect({ id }: { id: string }) {
  const { state, setState } = useFirs(useShallow((s) => ({ state: s.state, setState: s.setState })));
  return (
    <label htmlFor={id} className="flex flex-col gap-1">
      <span className="label text-ink-2">State</span>
      <select id={id} value={state} onChange={(e) => setState(e.target.value)} className="border border-ink bg-vellum px-2 py-1.5 font-display text-[15px]">
        {[...STATES].sort((a, b) => a.name.localeCompare(b.name)).map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function NationalView() {
  const period = useFirs((s) => s.period);
  const totals = useMemo(() => {
    const target = STATES.reduce((sum, s) => sum + 20e9 + synth(`t:${s.code}`) * 80e9, 0);
    const above = STATES.filter((s) => performanceOf(s.code, period) > 0).length;
    return { target, collected: target * (1 + (synth(`n:${period}`) - 0.45) * 0.2), above };
  }, [period]);
  return (
    <Widget name="NationalOverview" state={{ period, statesAboveTarget: totals.above }}>
      <div className="grid grid-cols-2 gap-2">
        <Kpi label="Collected · synthetic" value={naira(totals.collected)} />
        <Kpi label="Target · synthetic" value={naira(totals.target)} />
      </div>
      <TileMap
        fill={(c) => bandColour(performanceOf(c, period))}
        label={`Nigeria tile map. ${totals.above} of 37 states above target this ${PERIOD_LABEL[period].toLowerCase()}, synthetic data.`}
      />
      <Legend />
    </Widget>
  );
}

function RegionalView() {
  const { period, unit, setUnit } = useFirs(useShallow((s) => ({ period: s.period, unit: s.unit, setUnit: s.setUnit })));
  const members = UNITS.find((u) => u.id === unit)?.states ?? [];
  return (
    <Widget name="RegionalView" state={{ period, unit, states: members.length }}>
      <fieldset className="flex flex-wrap gap-1.5">
        <legend className="label mb-1 text-ink-2">Coordinating unit · synthetic grouping</legend>
        {UNITS.map((u) => (
          <label key={u.id} className="cursor-pointer border border-ink px-2 py-1 font-mono text-[11px] has-[:checked]:bg-ink has-[:checked]:text-vellum has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-marker">
            <input type="radio" name="firs-unit" value={u.id} checked={unit === u.id} onChange={() => setUnit(u.id)} className="sr-only" />
            {u.id}
          </label>
        ))}
      </fieldset>
      <TileMap
        fill={(c) => bandColour(performanceOf(c, period))}
        dim={(c) => !members.includes(c)}
        label={`Tile map highlighting ${members.length} states in synthetic unit ${unit}.`}
      />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
        {members.map((c) => {
          const pct = performanceOf(c, period);
          return (
            <li key={c} className="flex justify-between gap-2 border-b border-vellum-3 py-0.5 font-mono text-[11px] [font-variation-settings:'wdth'_87]">
              <span>{stateName(c)}</span>
              <span className="tabular-nums">{pct > 0 ? "+" : ""}{pct}%</span>
            </li>
          );
        })}
      </ul>
    </Widget>
  );
}

function StateView() {
  const { period, state } = useFirs(useShallow((s) => ({ period: s.period, state: s.state })));
  const target = 20e9 + synth(`t:${state}`) * 80e9;
  const pct = performanceOf(state, period);
  return (
    <Widget name="StateView" state={{ period, state }}>
      <StateSelect id="firs-state" />
      <div className="grid grid-cols-2 gap-2">
        <Kpi label="Collected · synthetic" value={naira(target * (1 + pct / 100))} />
        <Kpi label="Against target" value={`${pct > 0 ? "+" : ""}${pct}%`} />
      </div>
      <Bars values={seriesFor(state, period)} period={period} label={`${stateName(state)} collection by ${PERIOD_LABEL[period].toLowerCase()}, synthetic.`} />
    </Widget>
  );
}

function TaxOfficeView() {
  const { period, state } = useFirs(useShallow((s) => ({ period: s.period, state: s.state })));
  return (
    <Widget name="TaxOfficeTable" state={{ period, state }}>
      <StateSelect id="firs-office-state" />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <caption className="label pb-2 text-left text-ink-2">Tax offices in {stateName(state)} · synthetic</caption>
          <thead>
            <tr className="border-b border-ink">
              <th scope="col" className="label py-1.5 pr-3 font-normal">Office</th>
              <th scope="col" className="label py-1.5 pr-3 font-normal">Trend</th>
              <th scope="col" className="label py-1.5 font-normal">Latest</th>
            </tr>
          </thead>
          <tbody>
            {offices(state).map((o) => {
              const s = seriesFor(o.id, period);
              return (
                <tr key={o.id} className="border-b border-vellum-3">
                  <td className="py-1.5 pr-3 font-display">{o.name}</td>
                  <td className="py-1.5 pr-3">
                    <span className="flex h-5 items-end gap-[2px]" aria-hidden="true">
                      {s.map((v, i) => (
                        <span key={i} className="w-1.5 bg-ink-2" style={{ height: `${v}%` }} />
                      ))}
                    </span>
                  </td>
                  <td className="py-1.5 font-mono tabular-nums">{s.at(-1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Widget>
  );
}

function toCsv(rows: string[][]) {
  return rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
}

function AnalysisView() {
  const { role, coverage, setCoverage, period, run, runAnalysis } = useFirs(
    useShallow((s) => ({ role: s.role, coverage: s.coverage, setCoverage: s.setCoverage, period: s.period, run: s.run, runAnalysis: s.runAnalysis })),
  );
  const allowed = coverageFor(role);
  const rows = useMemo<[string, string][]>(
    () =>
      run === 0
        ? []
        : Array.from({ length: 5 }, (_, i) => [
            `${COVERAGE_LABEL[coverage]} ${i + 1}`,
            `${40 + Math.round(synth(`${coverage}:${period}:${run}:${i}`) * 60)}`,
          ]),
    [coverage, period, run],
  );
  const download = () => {
    const blob = new Blob([toCsv([["Area (synthetic)", "Index (synthetic)"], ...rows])], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aqos-firs-replica-synthetic.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Widget name="AnalysisCoverage" state={{ role, coverageOptions: allowed, selected: coverage }}>
      <label htmlFor="firs-coverage" className="flex flex-col gap-1">
        <span className="label text-ink-2">Coverage area · options depend on role</span>
        <select id="firs-coverage" value={coverage} onChange={(e) => setCoverage(e.target.value as typeof coverage)} className="border border-ink bg-vellum px-2 py-1.5 font-display text-[15px]">
          {allowed.map((c) => (
            <option key={c} value={c}>
              {COVERAGE_LABEL[c]}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn !px-3 !py-2 !text-[14px]" onClick={runAnalysis}>
          Preview result
        </button>
        {rows.length > 0 ? (
          <button type="button" className="btn btn-ghost !px-3 !py-2 !text-[14px]" onClick={download}>
            Download CSV (synthetic)
          </button>
        ) : null}
      </div>
      {rows.length > 0 ? (
        <table className="w-full border-collapse text-left text-[13px]">
          <caption className="label pb-2 text-left text-ink-2">Preview · {COVERAGE_LABEL[coverage]} · {PERIOD_LABEL[period]} · synthetic</caption>
          <tbody>
            {rows.map(([area, v]) => (
              <tr key={area} className="border-b border-vellum-3">
                <th scope="row" className="py-1 pr-3 text-left font-display font-normal">{area}</th>
                <td className="py-1 font-mono tabular-nums">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-[14px] text-ink-2">Production exported PDF and Excel. The replica exports CSV of its synthetic rows.</p>
      )}
    </Widget>
  );
}

function SettingsView() {
  return (
    <Widget name="SettingsView">
      <p className="label text-ink-2">Data upload types in production</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {["Tax collection data", "Tax target data", "GDP growth data", "Sectoral growth data"].map((t) => (
          <li key={t} className="border border-ink bg-vellum px-3 py-2 font-display text-[15px]">
            {t}
          </li>
        ))}
      </ul>
      <p className="text-[14px] text-ink-2">Uploading is not part of the replica.</p>
    </Widget>
  );
}

const TITLES = {
  national: "National Dashboard",
  regional: "Regional Dashboard",
  state: "State Dashboard",
  "tax-office": "Tax Office",
  analysis: "Analysis",
  settings: "Settings",
} as const;

export function DashboardView() {
  const dashboard = useFirs((s) => s.dashboard);
  const usesPeriod = dashboard !== "settings";
  return (
    <section className="flex min-w-0 flex-col gap-4 p-4" aria-labelledby="firs-dash-title">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink pb-3">
        <h3 id="firs-dash-title" className="font-display text-[22px] font-extrabold [font-variation-settings:'wdth'_100]">
          {TITLES[dashboard]}
        </h3>
        {usesPeriod ? <PeriodFilter /> : null}
      </div>
      {dashboard === "national" ? <NationalView /> : null}
      {dashboard === "regional" ? <RegionalView /> : null}
      {dashboard === "state" ? <StateView /> : null}
      {dashboard === "tax-office" ? <TaxOfficeView /> : null}
      {dashboard === "analysis" ? <AnalysisView /> : null}
      {dashboard === "settings" ? <SettingsView /> : null}
    </section>
  );
}

export type { Period };
