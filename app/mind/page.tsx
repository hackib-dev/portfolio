import type { Metadata } from "next";
import Link from "next/link";
import { PlateMeta } from "@/components/PlateHeader";
import { Specimen } from "@/components/Specimen";
import { decisions, getProject } from "@/content/projects";
import { CrossSection, type MindCore } from "@/features/mind/CrossSection";
import { CONCERNS } from "@/features/mind/concerns";
import { Pressed } from "@/features/shell/Pressed";

export const metadata: Metadata = {
  title: "Mind",
  description: "Engineering decisions by Aqib Akinyele, cut through the concerns each one touched.",
  alternates: { canonical: "/mind" },
};

export default function MindPage() {
  const cores: MindCore[] = decisions.map((d, i) => {
    const project = getProject(d.project);
    return {
      id: d.id,
      code: `D${i + 1}`,
      title: d.title,
      project: project?.title ?? d.project,
      href: `/work/${d.project}#d-${d.id}`,
      concerns: d.concerns,
      problem: d.problem,
      approach: d.approach.text,
      tradeoffs: d.tradeoffs.text,
      outcome: d.outcome.text,
    };
  });
  const label = (c: string) => CONCERNS.find((x) => x.id === c)?.label ?? c;

  return (
    <div data-material="film" className="film min-h-svh">
      <Specimen as="header" name="StratumHeader" layer="S4 Mind" className="plate pb-6">
        <div className="plate-grid">
          <PlateMeta code="S4" label="Mind · conglomerate" />
          <div className="flex flex-col gap-4">
            <h1 id="page-heading" tabIndex={-1} className="display text-[clamp(48px,8vw,120px)] leading-[0.9] outline-none" style={{ ["--wdth" as string]: 100 }}>
              <Pressed text="Cross-section" />
            </h1>
            <p className="max-w-[60ch] text-[20px] leading-snug">
              The layers are the concerns a frontend decision can touch. Each core is one real decision, drilled only through the
              layers it crossed. Pick a core to read it, or pick a layer to see which decisions cut through it.
            </p>
            <p className="max-w-[60ch] text-[16px] leading-snug text-film-dim">
              A decision appears here only once its approach is verified and its trade-offs are confirmed. Today that is the six
              from FIRS; empty layers stay visible rather than being filled in.
            </p>
          </div>
        </div>
      </Specimen>
      <Specimen as="section" name="CrossSection" layer="S4 Mind" className="plate pt-0" aria-label="Decisions by concern">
        <CrossSection cores={cores} />
      </Specimen>
      <Specimen as="section" name="DecisionIndex" layer="S4 Mind" className="plate rule-film border-t border-film-3" aria-labelledby="index-title">
        <div className="plate-grid">
          <PlateMeta code="S4.1" label="Every decision" />
          <div className="flex min-w-0 flex-col gap-4">
            <h2 id="index-title" className="display text-[clamp(26px,3vw,38px)]" style={{ ["--wdth" as string]: 92 }}>
              <Pressed text="All decisions, as a list" />
            </h2>
            <ul className="flex flex-col">
              {cores.map((c) => (
                <li key={c.id} className="grid gap-1 border-t border-film-3 py-3 sm:grid-cols-[48px_minmax(0,1fr)_minmax(0,0.9fr)] sm:gap-4">
                  <span className="code-tag">{c.code}</span>
                  <Link href={c.href} className="font-display text-[18px] font-bold [font-variation-settings:'wdth'_96]">
                    {c.title}
                  </Link>
                  <span className="label text-film-dim">
                    {c.project} · {c.concerns.map(label).join(", ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Specimen>
    </div>
  );
}
