"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { useSpecimen } from "@/features/seam/useSpecimen";
import type { Concern } from "@/content/types";
import { CONCERNS } from "./concerns";

export type MindCore = {
  id: string;
  code: string;
  title: string;
  project: string;
  href: string;
  concerns: Concern[];
  problem: string;
  approach: string;
  tradeoffs: string;
  outcome: string;
};


/** Arrow keys move along a row of buttons; the group keeps a single tab stop. */
function useRoving(count: number, current: number, select: (i: number) => void, axis: "x" | "y") {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: KeyboardEvent) => {
    const prev = axis === "x" ? "ArrowLeft" : "ArrowUp";
    const next = axis === "x" ? "ArrowRight" : "ArrowDown";
    let i = current;
    if (e.key === prev) i = Math.max(0, current - 1);
    else if (e.key === next) i = Math.min(count - 1, current + 1);
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = count - 1;
    else return;
    e.preventDefault();
    select(i);
    refs.current[i]?.focus();
  };
  return { refs, onKeyDown };
}

export function CrossSection({ cores }: { cores: MindCore[] }) {
  const [selected, setSelected] = useState(0);
  const [concern, setConcern] = useState<Concern | null>(null);
  const [concernFocus, setConcernFocus] = useState(0);
  const spec = useSpecimen<HTMLDivElement>("CrossSection", "S4 Mind", { selected: cores[selected]?.id, concern });
  const coreKeys = useRoving(cores.length, selected, setSelected, "x");
  const rowKeys = useRoving(CONCERNS.length, concernFocus, setConcernFocus, "y");
  const core = cores[selected]!;
  const crossing = (c: Concern) => cores.filter((d) => d.concerns.includes(c)).length;

  return (
    <div {...spec} className="mind">
      <div className="mind-section" style={{ ["--cores" as string]: cores.length }} data-filter={concern ?? undefined}>
        {/* Concerns: the horizontal layers. Selecting one shows which decisions cut through it. */}
        <div className="mind-layers" role="group" aria-label="Filter by concern" onKeyDown={rowKeys.onKeyDown}>
          {CONCERNS.map((c, i) => {
            const n = crossing(c.id);
            return (
              <button
                key={c.id}
                ref={(el) => void (rowKeys.refs.current[i] = el)}
                type="button"
                className="mind-layer"
                tabIndex={i === concernFocus ? 0 : -1}
                aria-pressed={concern === c.id}
                data-empty={n === 0 || undefined}
                onFocus={() => setConcernFocus(i)}
                onClick={() => setConcern(concern === c.id ? null : c.id)}
              >
                <span>{c.label}</span>
                <span className="mind-count">{n}</span>
              </button>
            );
          })}
        </div>
        {/* Decisions: the vertical cores, drilled only through the concerns they touched. */}
        <div className="mind-cores" role="radiogroup" aria-label="Decisions" onKeyDown={coreKeys.onKeyDown}>
          {cores.map((d, i) => {
            const dim = concern !== null && !d.concerns.includes(concern);
            return (
              <button
                key={d.id}
                ref={(el) => void (coreKeys.refs.current[i] = el)}
                type="button"
                role="radio"
                aria-checked={i === selected}
                tabIndex={i === selected ? 0 : -1}
                className="mind-core"
                data-dim={dim || undefined}
                onClick={() => setSelected(i)}
                aria-label={`${d.code}: ${d.title}. Crosses ${d.concerns.map((c) => CONCERNS.find((x) => x.id === c)?.label).join(", ")}.`}
              >
                <span className="mind-core-cap">{d.code}</span>
                {CONCERNS.map((c) => (
                  <span key={c.id} className="mind-cell" data-hit={d.concerns.includes(c.id) || undefined} data-lit={concern === c.id || undefined} />
                ))}
              </button>
            );
          })}
        </div>
      </div>

      <article className="mind-record" aria-labelledby="mind-record-title">
        <p className="label">
          <span className="code-tag">{core.code}</span> · {core.project}
        </p>
        <h2 id="mind-record-title" className="mind-record-title">
          {core.title}
        </h2>
        <ul className="mind-tags" aria-label="Concerns">
          {core.concerns.map((c) => (
            <li key={c} className="pill">
              {CONCERNS.find((x) => x.id === c)?.label}
            </li>
          ))}
        </ul>
        <dl className="record">
          <dt>Problem</dt>
          <dd>{core.problem}</dd>
          <dt>Approach</dt>
          <dd>{core.approach}</dd>
          <dt>Trade-offs</dt>
          <dd>{core.tradeoffs}</dd>
          <dt>Outcome</dt>
          <dd>{core.outcome}</dd>
        </dl>
        <Link href={core.href} className="label underline">
          Read it in the {core.project} case study →
        </Link>
      </article>
    </div>
  );
}
