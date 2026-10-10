"use client";

import { useSpecimen } from "@/features/seam/useSpecimen";
import { bandColour, PERIOD_AXIS, STATES, type Period } from "./model";

const TILE = 44;

/** Tile cartogram of Nigeria. Decorative structure; the label carries the summary. */
export function TileMap({
  fill,
  dim,
  label,
}: {
  fill: (code: string) => string;
  dim?: (code: string) => boolean;
  label: string;
}) {
  return (
    <svg viewBox={`0 0 ${8 * TILE} ${8 * TILE}`} className="block h-auto w-full max-w-[360px]" role="img" aria-label={label}>
      {STATES.map((s) => {
        const faded = dim?.(s.code) ?? false;
        return (
          <g key={s.code} transform={`translate(${s.col * TILE + 2} ${s.row * TILE + 2})`} opacity={faded ? 0.22 : 1}>
            <rect width={TILE - 4} height={TILE - 4} fill={fill(s.code)} stroke="#14171a" strokeWidth={faded ? 0.5 : 1} />
            <text x={(TILE - 4) / 2} y={(TILE - 4) / 2 + 4} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill="#f3f4f1" style={{ paintOrder: "stroke" }} stroke="#14171a" strokeWidth="2.4">
              {s.code}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Legend() {
  const bands = [25, 18, 12, 7, 2, 0, -1, -4, -8, -12, -22];
  const labels = [">+20", ">+15", ">+10", ">+5", ">0", "0", "<−2", "<−5", "<−10", "<−15", "<−20"];
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1" aria-label="Performance against target, synthetic">
      {bands.map((b, i) => (
        <li key={labels[i]} className="flex items-center gap-1 font-mono text-[10px] [font-variation-settings:'wdth'_87]">
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 border border-ink" style={{ background: bandColour(b) }} />
          {labels[i]}%
        </li>
      ))}
    </ul>
  );
}

export function Bars({ values, period, label }: { values: number[]; period: Period; label: string }) {
  const axis = PERIOD_AXIS[period];
  const w = 300;
  const h = 96;
  const gap = 4;
  const bw = (w - gap * (values.length - 1)) / values.length;
  return (
    <svg viewBox={`0 0 ${w} ${h + 16}`} className="block h-auto w-full max-w-[420px]" role="img" aria-label={label}>
      <line x1="0" x2={w} y1={h} y2={h} stroke="#14171a" />
      {values.map((v, i) => (
        <g key={i}>
          <rect x={i * (bw + gap)} y={h - (v / 100) * h} width={bw} height={(v / 100) * h} fill={i === values.length - 1 ? "#14171a" : "#7a8580"} />
          <text x={i * (bw + gap) + bw / 2} y={h + 12} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="#474e54">
            {axis[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border border-ink bg-vellum px-3 py-2">
      <span className="label text-ink-2">{label}</span>
      <span className="font-display text-2xl font-extrabold [font-variation-settings:'wdth'_92] tabular-nums">{value}</span>
    </div>
  );
}

export function naira(n: number) {
  return n >= 1e12 ? `₦${(n / 1e12).toFixed(2)}tn` : `₦${(n / 1e9).toFixed(1)}bn`;
}

/** A labelled panel inside the replica that reports its commits to the seam. */
export function Widget({ name, state, children, className }: { name: string; state?: unknown; children: React.ReactNode; className?: string }) {
  const spec = useSpecimen<HTMLDivElement>(name, "Replica · FIRS", state);
  return (
    <div {...spec} className={`flex min-w-0 flex-col gap-3 ${className ?? ""}`}>
      {children}
    </div>
  );
}
