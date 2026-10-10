"use client";

import { useSpecimen } from "@/features/seam/useSpecimen";
import { COVERAGE, COVERAGE_LABEL, ROLE_LABEL, ROLES, type Role } from "@/features/firs-replica/model";
import { DASHBOARD_LABEL, LANDING_CANDIDATES, NAV_ORDER, sentence, type Edit } from "./rules";
import { useAct, useFault, useFaultStore } from "./store";

/**
 * The same rules as a plain data table: native checkboxes and selects, row and column headers,
 * no custom keyboard model. It edits the same store, so switching views never loses state.
 */
export function TableView() {
  const store = useFaultStore();
  const act = useAct();
  const { roles, arch } = useFault((s) => s.compiled);
  const spec = useSpecimen<HTMLDivElement>("FaultTable", "Lab · fault lines", { arch });

  const commit = (e: Edit) => {
    const text = sentence(e);
    act(text, () => store.getState().state(text, [e]));
  };
  const who = (r: Role) => `${ROLE_LABEL[r]} users`;

  return (
    <div {...spec} className="fl-table-wrap">
      <table className="fl-table">
        <caption className="sr-only">Role rules. Each row is one rule, each column one role. Changes apply as soon as a box or menu changes.</caption>
        <thead>
          <tr>
            <td />
            {ROLES.map((r) => (
              <th key={r} scope="col">
                {ROLE_LABEL[r]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="fl-table-group">
            <th scope="rowgroup" colSpan={ROLES.length + 1}>
              Navigation · can open
            </th>
          </tr>
          {NAV_ORDER.map((d) => (
            <tr key={d}>
              <th scope="row">{DASHBOARD_LABEL[d]}</th>
              {ROLES.map((r) => {
                const on = roles[r].nav.includes(d);
                const derived = roles[r].derivedCells.includes(`nav:${d}`);
                return (
                  <td key={r}>
                    <label className="fl-table-check">
                      <input type="checkbox" checked={on} onChange={() => commit({ kind: "nav", role: r, dashboard: d, allow: !on })} />
                      <span className="sr-only">
                        {who(r)} can open {DASHBOARD_LABEL[d]}
                        {derived ? " (derived from coverage)" : ""}
                      </span>
                      {derived ? <span className="fl-tag" data-kind="derived" aria-hidden="true">derived</span> : null}
                    </label>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tbody>
          <tr className="fl-table-group">
            <th scope="rowgroup" colSpan={ROLES.length + 1}>
              Landing · signs in to
            </th>
          </tr>
          <tr>
            <th scope="row">Requested</th>
            {ROLES.map((r) => (
              <td key={r}>
                <select
                  aria-label={`${who(r)} land on`}
                  value={roles[r].landingAsked}
                  onChange={(e) => commit({ kind: "landing", role: r, dashboard: e.target.value as (typeof LANDING_CANDIDATES)[number] })}
                >
                  {LANDING_CANDIDATES.map((d) => (
                    <option key={d} value={d}>
                      {DASHBOARD_LABEL[d]}
                    </option>
                  ))}
                </select>
              </td>
            ))}
          </tr>
          <tr>
            <th scope="row">Actually lands on</th>
            {ROLES.map((r) => {
              const v = roles[r];
              const hidden = v.landing !== null && !v.nav.includes(v.landing);
              return (
                <td key={r} data-bad={hidden || v.landing === null || undefined}>
                  {v.landing ? DASHBOARD_LABEL[v.landing] : "Nowhere"}
                  {hidden ? " (not in navigation)" : v.landing !== v.landingAsked ? " (resolved)" : ""}
                </td>
              );
            })}
          </tr>
        </tbody>
        <tbody>
          <tr className="fl-table-group">
            <th scope="rowgroup" colSpan={ROLES.length + 1}>
              Coverage · analysis at
            </th>
          </tr>
          {COVERAGE.map((c) => (
            <tr key={c}>
              <th scope="row">{COVERAGE_LABEL[c]}</th>
              {ROLES.map((r) => {
                const on = roles[r].coverage.includes(c);
                return (
                  <td key={r}>
                    <label className="fl-table-check">
                      <input type="checkbox" checked={on} onChange={() => commit({ kind: "coverage", role: r, coverage: c, allow: !on })} />
                      <span className="sr-only">
                        {who(r)} can analyse at {COVERAGE_LABEL[c].toLowerCase()} coverage
                      </span>
                    </label>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tbody>
          <tr className="fl-table-group">
            <th scope="rowgroup" colSpan={ROLES.length + 1}>
              Faults
            </th>
          </tr>
          <tr>
            <th scope="row">Found</th>
            {ROLES.map((r) => (
              <td key={r} className="align-top">
                {roles[r].faults.length ? (
                  <ul className="fl-table-faults">
                    {roles[r].faults.map((f) => (
                      <li key={f.code} data-sev={f.severity}>
                        <b>{f.tag}</b> {f.title}. {f.detail}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "None"
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
