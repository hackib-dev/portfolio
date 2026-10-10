import type { CSSProperties } from "react";
import { site } from "@/config/site";
import { Specimen } from "@/components/Specimen";
import { ArrivalDirector } from "./ArrivalDirector";

const roles = ["Frontend Engineer", "Creative Technologist", "Builder of production software"];

/**
 * The name, faulted. Each line is its own stratum: "Aqib" sits at the surface at full width,
 * "Akinyele" lies deeper and is compressed. A fault cuts through the middle of each word and
 * throws the lower half sideways. The letters are displaced, never distorted, so the name
 * stays legible while the composition carries the strain.
 */
type Bed = { line: 0 | 1; wdth: number; throw: number; top: number; bottom: number };
const BEDS: Bed[] = [
  { line: 0, wdth: 140, throw: 0, top: 0, bottom: 27 },
  { line: 0, wdth: 140, throw: -1.1, top: 27, bottom: 62 },
  { line: 1, wdth: 100, throw: 0, top: 40, bottom: 72 },
  { line: 1, wdth: 100, throw: 0.9, top: 72, bottom: 100 },
];
const PLANES = [
  { at: 27, label: "fault · throw −1.1" },
  { at: 46, label: "bedding plane · wdth 140 → 100" },
  { at: 72, label: "fault · throw +0.9" },
];

function FaultedName() {
  return (
    <div className="fault" aria-hidden="true">
      {BEDS.map((bed, i) => (
        <div
          key={i}
          className="fault-bed"
          data-line={bed.line}
          style={
            {
              "--i": i,
              "--w": bed.wdth,
              "--x": `${bed.throw}cqw`,
              "--t": `${bed.top}%`,
              "--b": `${100 - bed.bottom}%`,
            } as CSSProperties
          }
        >
          <span>Aqib</span>
          <span>Akinyele</span>
        </div>
      ))}
      {PLANES.map((plane) => (
        <span key={plane.at} className="fault-line" style={{ top: `${plane.at}%` }}>
          <i>{plane.label}</i>
        </span>
      ))}
    </div>
  );
}

export function Arrival() {
  return (
    <Specimen as="header" name="Arrival" layer="S0 Surface" id="arrival" className="arrival">
      <div className="arrival-layer surface">
        <div className="arrival-meta label">
          <span>AQ/OS</span>
          <span>
            {site.location} · {site.coordinates}
          </span>
          <span>S0 · Surface</span>
        </div>
        <h1 id="page-heading" tabIndex={-1} className="sr-only">
          Aqib Akinyele
        </h1>
        <FaultedName />
        <div className="arrival-foot">
          <div className="flex flex-col gap-5">
            <p className="arrival-tag">{site.tagline}</p>
            <div className="flex items-center gap-5">
              <a href="#index" className="label underline">
                Enter ↓
              </a>
              <a href="#index" className="arrival-skip label">
                Skip intro · Esc
              </a>
            </div>
          </div>
          <ul className="arrival-roles" aria-label="Roles">
            {roles.map((r, i) => (
              <li key={r}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ArrivalDirector targetId="arrival" />
    </Specimen>
  );
}
