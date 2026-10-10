import type { Lithology } from "@/content/types";

/**
 * Geological lithology patterns (after the USGS/FGDC hatch conventions), one per stratum.
 * Each pattern exists twice: on vellum (surface) and on film (confidential, substrate).
 * The <defs> render once in the root layout; swatches reference them by id.
 */
function Patterns({ suffix, ground, ink }: { suffix: string; ground: string; ink: string }) {
  return (
    <>
      <pattern id={`litho-sandstone${suffix}`} width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill={ground} />
        <circle cx="2" cy="3" r="0.9" fill={ink} />
        <circle cx="8" cy="2" r="0.7" fill={ink} />
        <circle cx="5" cy="8" r="0.9" fill={ink} />
        <circle cx="10.5" cy="9.5" r="0.7" fill={ink} />
      </pattern>
      <pattern id={`litho-limestone${suffix}`} width="20" height="12" patternUnits="userSpaceOnUse">
        <rect width="20" height="12" fill={ground} />
        <path d="M0 0.5H20M0 6.5H20M5 0.5V6.5M15 6.5V12" stroke={ink} strokeWidth="1" fill="none" />
      </pattern>
      <pattern id={`litho-shale${suffix}`} width="18" height="6" patternUnits="userSpaceOnUse">
        <rect width="18" height="6" fill={ground} />
        <path d="M1 3H8M11 3H16" stroke={ink} strokeWidth="1" fill="none" />
      </pattern>
      <pattern id={`litho-conglomerate${suffix}`} width="22" height="18" patternUnits="userSpaceOnUse">
        <rect width="22" height="18" fill={ground} />
        <ellipse cx="5" cy="5" rx="3" ry="2.2" fill="none" stroke={ink} />
        <ellipse cx="15" cy="12" rx="3.6" ry="2.6" fill="none" stroke={ink} />
        <circle cx="17" cy="3" r="1.3" fill="none" stroke={ink} />
        <circle cx="6" cy="14" r="1" fill={ink} />
      </pattern>
      <pattern id={`litho-crystalline${suffix}`} width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill={ground} />
        <path d="M2 3L4 7L6 3M9 9L11 13L13 9" stroke={ink} fill="none" />
      </pattern>
      <pattern id={`litho-granite${suffix}`} width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill={ground} />
        <path d="M4 2V7M1.5 4.5H6.5M12 9V14M9.5 11.5H14.5" stroke={ink} fill="none" />
      </pattern>
    </>
  );
}

export function LithologyDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <Patterns suffix="" ground="#e4e7e2" ink="#14171a" />
        <Patterns suffix="-film" ground="#0d1317" ink="#7fa7b5" />
      </defs>
    </svg>
  );
}

export function LithologySwatch({ type, film = false, className }: { type: Lithology; film?: boolean; className?: string }) {
  return (
    <svg className={`litho ${className ?? ""}`} aria-hidden="true" focusable="false" preserveAspectRatio="none">
      <rect width="100%" height="100%" fill={`url(#litho-${type}${film ? "-film" : ""})`} />
    </svg>
  );
}
