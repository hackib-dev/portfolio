import Link from "next/link";
import type { CSSProperties } from "react";
import { LithologySwatch } from "@/components/Lithology";
import type { Lithology, Platform, Project } from "@/content/types";
import { contextLine, platformLabel, visibilityPill } from "@/features/case-study/labels";

/** Platform → lithology. The same mapping is printed in the legend, so the encoding is readable. */
const PLATFORM_ROCK: Record<Platform, Lithology> = { web: "sandstone", mobile: "shale", sdk: "crystalline" };

/**
 * Featured work as a core tray: one drill core per project, laid side by side the way
 * geologists store them. The banding is data, not decoration: pattern = platform,
 * film = confidential, laminae = number of technologies in the stack.
 */
export function CoreTray({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col gap-5">
      <ol className="tray" aria-label="Featured work">
        {projects.map((p) => {
          const film = p.visibility === "confidential";
          const pill = visibilityPill(p.visibility);
          const laminae = p.stack?.items.length ?? 0;
          return (
            <li key={p.slug} className="core-slot">
              <Link
                href={`/work/${p.slug}`}
                className="core"
                data-film={film}
                data-specimen={`Core/${p.slug}`}
                data-specimen-layer="Core tray"
              >
                <span className="core-cap code-tag">
                  {p.lithologyCode}
                </span>
                <span className="core-body">
                  <span className="core-beds" aria-hidden="true">
                    {p.platforms.map((pl) => (
                      <span key={pl} className="core-bed">
                        <LithologySwatch type={PLATFORM_ROCK[pl]} film={film} />
                      </span>
                    ))}
                  </span>
                  <span className="core-laminae" aria-hidden="true" style={{ "--n": Math.max(laminae, 1) } as CSSProperties} />
                  <span className="core-title">{p.title}</span>
                  <span className="core-detail">
                    <span className="label">{contextLine(p)}</span>
                    <span className="core-summary" aria-hidden="true">{p.summary}</span>
                    <span className="flex flex-wrap gap-2">
                      <span className={`pill ${pill.className}`}>{pill.label}</span>
                      {p.replica ? <span className="pill pill-replica">Interactive replica</span> : null}
                      <span className="label">{p.platforms.map(platformLabel).join(" · ")}</span>
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      <dl className="tray-legend" aria-label="How to read the cores">
        <div>
          <dt>
            <span className="legend-swatch">
              <LithologySwatch type="sandstone" />
            </span>
            <span className="legend-swatch">
              <LithologySwatch type="shale" />
            </span>
            <span className="legend-swatch">
              <LithologySwatch type="crystalline" />
            </span>
          </dt>
          <dd>Pattern: web, mobile, SDK</dd>
        </div>
        <div>
          <dt>
            <span className="legend-swatch">
              <LithologySwatch type="sandstone" film />
            </span>
          </dt>
          <dd>Film: confidential system</dd>
        </div>
        <div>
          <dt>
            <span className="legend-swatch legend-laminae" />
          </dt>
          <dd>Laminae: one per technology in the stack</dd>
        </div>
      </dl>
    </div>
  );
}
