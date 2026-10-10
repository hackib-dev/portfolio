"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { LithologySwatch } from "@/components/Lithology";
import { formatYearMonth } from "@/components/SourceTag";
import { useSpecimen } from "@/features/seam/useSpecimen";
import type { JourneyEntry } from "@/content/journey";

/* ── Time → depth ───────────────────────────────────────────────────────────── */

function monthIndex(d: string) {
  const [y, m] = d.split("-").map(Number);
  return (y! - 2000) * 12 + ((m ?? 1) - 1);
}

/**
 * Depth is time, to scale: the top of the core is now, the bottom is the oldest sourced month.
 * Returns percentages from the top. A year-only start is drawn soft across that whole year.
 */
function span(e: JourneyEntry, from: string, to: string) {
  const total = monthIndex(to) - monthIndex(from) + 1;
  const startMonth = monthIndex(e.start);
  const yearOnly = !e.start.includes("-");
  const endMonth = e.end === undefined ? (yearOnly ? Math.min(startMonth + 11, monthIndex(to)) : startMonth) : e.end === "present" ? monthIndex(to) : monthIndex(e.end) + (e.end.includes("-") ? 0 : 11);
  const top = ((monthIndex(to) - endMonth) / total) * 100;
  const bottom = ((monthIndex(to) - startMonth + 1) / total) * 100;
  return { top, height: bottom - top, soft: yearOnly ? (12 / (endMonth - startMonth + 1)) * 100 : 0 };
}

export function periodText(e: JourneyEntry) {
  const start = formatYearMonth(e.start);
  if (e.end === undefined || e.end === e.start) return start;
  return `${start} – ${e.end === "present" ? "present" : formatYearMonth(e.end)}`;
}

const DIKES = ["firs", "super", "bitooqoh", "mte"];

/* ── Component ──────────────────────────────────────────────────────────────── */

export function JourneyCore({ entries, from, to, undated }: { entries: JourneyEntry[]; from: string; to: string; undated: { title: string; href: string }[] }) {
  const [active, setActive] = useState<string | null>(null);
  const spec = useSpecimen<HTMLDivElement>("JourneyCore", "S3 Journey", { active });
  const years: number[] = [];
  for (let y = Number(from.slice(0, 4)); y <= Number(to.slice(0, 4)); y++) years.push(y);
  const total = monthIndex(to) - monthIndex(from) + 1;
  /** Distance from the top to the lower edge of a month, in percent. */
  const below = (month: number) => ((monthIndex(to) - month + 1) / total) * 100;
  const unrecorded = below(Math.min(...entries.map((e) => monthIndex(e.start))));

  return (
    <div {...spec} className="jr" data-active={active ?? undefined}>
      <div className="jr-core-wrap" aria-hidden="true">
        <p className="jr-now label">{formatYearMonth(to)} · now</p>
        <div className="jr-core">
          <div className="jr-axis">
            {/* Each year is labelled in the middle of its own span; lines mark where one year ends and the next begins. */}
            {years.map((y) => {
              const bottom = below(monthIndex(`${y}-01`));
              const top = below(Math.min(monthIndex(`${y}-12`), monthIndex(to)) + 1);
              return (
                <span key={y}>
                  <b className="jr-year" style={{ top: `${(top + bottom) / 2}%` }}>
                    {y}
                  </b>
                  {y > years[0]! ? <i className="jr-tick" style={{ top: `${bottom}%` }} /> : null}
                </span>
              );
            })}
          </div>
          <div className="jr-column">
            {entries
              .filter((e) => e.kind === "role" || e.kind === "education")
              .map((e) => {
                const s = span(e, from, to);
                return (
                  <div key={e.id} className="jr-bed" data-kind={e.kind} data-id={e.id} data-on={active === e.id || undefined} style={{ top: `${s.top}%`, height: `${s.height}%` }} onMouseEnter={() => setActive(e.id)} onMouseLeave={() => setActive(null)}>
                    <LithologySwatch type={e.kind === "education" ? "sandstone" : "shale"} />
                    <span className="jr-bed-label">{e.kind === "education" ? e.title.split(",")[0] : e.org}</span>
                  </div>
                );
              })}
            {unrecorded < 99.5 ? (
              <div className="jr-unrecorded" style={{ top: `${unrecorded}%` }}>
                <span>no record</span>
              </div>
            ) : null}
            {entries
              .filter((e) => e.kind === "contract" || e.kind === "project")
              .map((e) => {
                const s = span(e, from, to);
                return (
                  <div
                    key={e.id}
                    className="jr-dike"
                    data-id={e.id}
                    data-on={active === e.id || undefined}
                    data-kind={e.kind}
                    style={{ top: `${s.top}%`, height: `${s.height}%`, ["--lane" as string]: DIKES.indexOf(e.id), ["--soft" as string]: `${s.soft}%` } as CSSProperties}
                    onMouseEnter={() => setActive(e.id)}
                    onMouseLeave={() => setActive(null)}
                  />
                );
              })}
            {entries
              .filter((e) => e.kind === "milestone")
              .map((e) => {
                const s = span(e, from, to);
                return (
                  <div
                    key={e.id}
                    className="jr-mark"
                    data-id={e.id}
                    data-on={active === e.id || undefined}
                    data-soft={!e.start.includes("-") || undefined}
                    style={{ top: `${s.top}%`, height: `${Math.max(s.height, 0.6)}%` }}
                    onMouseEnter={() => setActive(e.id)}
                    onMouseLeave={() => setActive(null)}
                  />
                );
              })}
          </div>
        </div>
        <p className="jr-legend label">
          <span><i className="jr-key jr-key-bed" />Employment</span>
          <span><i className="jr-key jr-key-edu" />Education</span>
          <span><i className="jr-key jr-key-dike" />Projects</span>
          <span><i className="jr-key jr-key-contract" />Contract</span>
          <span><i className="jr-key jr-key-mark" />Milestone</span>
        </p>
      </div>

      <ol className="jr-log">
        {entries.map((e) => (
          <li
            key={e.id}
            data-id={e.id}
            data-kind={e.kind}
            data-on={active === e.id || undefined}
            onMouseEnter={() => setActive(e.id)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(e.id)}
            onBlur={() => setActive(null)}
          >
            <span className="jr-when label">{periodText(e)}</span>
            <div className="flex flex-col gap-1">
              <h2 className="jr-title">
                {e.href ? (
                  <Link href={e.href} className="no-underline hover:underline">
                    {e.title}
                  </Link>
                ) : (
                  e.title
                )}
              </h2>
              <p className="label text-ink-2">{e.org}</p>
              {e.detail ? <p className="jr-detail">{e.detail}</p> : null}
              {e.id === "mid" ? (
                <p className="jr-detail text-ink-2">
                  Also at Payvantage, not yet placed in time:{" "}
                  {undated.map((u, i) => (
                    <span key={u.href}>
                      {i ? ", " : ""}
                      <Link href={u.href} className="underline">
                        {u.title}
                      </Link>
                    </span>
                  ))}
                  .
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
