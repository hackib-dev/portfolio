import type { ReactNode } from "react";
import { LithologySwatch } from "@/components/Lithology";
import { strata } from "@/content/strata";

/** The stratum a code belongs to: "S1.02.3" → S1. The surface (S0) and unmapped codes have none. */
function lithologyFor(code: string) {
  const top = code.match(/^S\d/)?.[0];
  return strata.find((s) => s.code === top)?.lithology;
}

/**
 * Codes are shown for sections (S1) and the things in them (S1.02, S5.01). Codes for parts of a
 * page (S1.01.3, S2.0, S6.1) are kept for the lithology lookup but not displayed: they read as noise.
 */
function showCode(code: string) {
  return code === "404" || /^S\d(\.\d{2})?$/.test(code);
}

/**
 * Left column of a plate: the depth gauge. A stratigraphic column runs the full height of the
 * plate, with the stratum's lithology and a depth scale aligned to the document. The head
 * (code, label, reading) rides down it while the plate is on screen, and its top edge is the
 * needle. DepthGauges fills in the reading and the scale's phase; without it the gauge is
 * still a correct, static column.
 */
export function PlateMeta({ code, label, children }: { code: string; label: string; children?: ReactNode }) {
  const lithology = lithologyFor(code);
  return (
    <div className="plate-meta gauge" data-gauge="">
      <div className="gauge-column" aria-hidden="true">
        <span className="gauge-scale" />
        {lithology ? (
          <span className="gauge-litho">
            <LithologySwatch type={lithology} className="litho-vellum" />
            <LithologySwatch type={lithology} film className="litho-film" />
          </span>
        ) : null}
      </div>
      <div className="gauge-head">
        {showCode(code) ? <span className="code-tag">{code}</span> : null}
        <span className="label">{label}</span>
        {children}
        <span className="gauge-read" aria-hidden="true">
          depth <b>—</b>
        </span>
      </div>
    </div>
  );
}
