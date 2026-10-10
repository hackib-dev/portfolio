import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlateMeta } from "@/components/PlateHeader";
import { Specimen } from "@/components/Specimen";
import { DescentLink } from "@/features/descent/DescentLink";
import { StatePropagation } from "@/features/lab/state-propagation/StatePropagation";
import { FaultLines } from "@/features/lab/fault-lines/FaultLines";
import { experiments } from "@/content/experiments";
import { Pressed } from "@/features/shell/Pressed";

export const dynamicParams = false;

export function generateStaticParams() {
  return experiments.map((e) => ({ experiment: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lab/[experiment]">): Promise<Metadata> {
  const { experiment } = await params;
  const e = experiments.find((x) => x.slug === experiment);
  return e ? { title: `${e.title} · Lab`, description: e.summary, alternates: { canonical: `/lab/${e.slug}` } } : {};
}

export default async function ExperimentPage({ params }: PageProps<"/lab/[experiment]">) {
  const { experiment } = await params;
  const index = experiments.findIndex((x) => x.slug === experiment);
  const e = experiments[index];
  if (!e) notFound();
  const code = `S5.${String(index + 1).padStart(2, "0")}`;

  return (
    <div data-material="film" className="film min-h-svh">
      <Specimen as="header" name="ExperimentHeader" layer="S5 Lab" className="plate pb-8">
        <div className="plate-grid">
          <PlateMeta code={code} label="Lab · crystalline">
            <DescentLink href="/work/firs" word="FIRS" direction="up" className="label underline">
              ↑ Ascend to FIRS
            </DescentLink>
          </PlateMeta>
          <div className="flex flex-col gap-5">
            <h1
              id="page-heading"
              tabIndex={-1}
              className="display trace text-[clamp(44px,7.4vw,112px)] leading-[0.9] outline-none"
              style={{ ["--wdth" as string]: 96 }}
            >
              <Pressed text={e.title} />
            </h1>
            <div className="trace flex max-w-[66ch] flex-col gap-3 font-read text-[19px] leading-[1.5]" style={{ ["--i" as string]: 1 }}>
              {e.intro.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </Specimen>
      <Specimen as="section" name="Experiment" layer="S5 Lab" className="plate pt-0" aria-label={`${e.title} experiment`}>
        {e.slug === "fault-lines" ? <FaultLines /> : <StatePropagation />}
        <noscript>
          <p className="mt-4 font-read text-[16px] text-film-dim">
            {e.slug === "fault-lines"
              ? "The rules compile in your browser, so this experiment needs JavaScript."
              : "The counters need JavaScript: they measure React re-rendering live in your browser."}
          </p>
        </noscript>
      </Specimen>
      <Specimen as="section" name="ExperimentNotes" layer="S5 Lab" className="plate rule-film border-t border-film-3" aria-labelledby="notes-title">
        <div className="plate-grid">
          <PlateMeta code={`${code}.1`} label="Reading it" />
          <div className="flex max-w-[66ch] flex-col gap-4 font-read text-[17px] leading-[1.55]">
            <h2 id="notes-title" className="display text-[clamp(26px,3vw,38px)]" style={{ ["--wdth" as string]: 92 }}>
              <Pressed text={e.notesTitle ?? "What the numbers are"} />
            </h2>
            {e.notes.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </Specimen>
    </div>
  );
}
