import type { Metadata } from "next";
import Link from "next/link";
import { PlateMeta } from "@/components/PlateHeader";
import { Specimen } from "@/components/Specimen";
import { experiments } from "@/content/experiments";
import { Pressed } from "@/features/shell/Pressed";

export const metadata: Metadata = {
  title: "Lab",
  description: "Working frontend experiments, each built from a real case study.",
  alternates: { canonical: "/lab" },
};

export default function LabIndex() {
  return (
    <div data-material="film" className="film min-h-svh">
      <Specimen as="header" name="StratumHeader" layer="S5 Lab" className="plate">
        <div className="plate-grid">
          <PlateMeta code="S5" label="Lab · crystalline" />
          <div className="flex flex-col gap-5">
            <h1 id="page-heading" tabIndex={-1} className="display text-[clamp(48px,8vw,120px)] leading-[0.9] outline-none" style={{ ["--wdth" as string]: 96 }}>
              <Pressed text="Lab" />
            </h1>
            <p className="max-w-[58ch] font-read text-[20px] leading-snug">
              Working experiments. Each one starts from a case study and lets you handle the engineering concept behind it.
            </p>
          </div>
        </div>
      </Specimen>
      <section className="plate pt-0" aria-label="Experiments">
        <div className="plate-grid">
          <PlateMeta code="S5.0" label="Open" />
          <ul className="flex flex-col">
            {experiments.map((e, i) => (
              <li key={e.slug} className="border-t border-film-3 last:border-b">
                <Link href={`/lab/${e.slug}`} className="grid gap-2 py-6 no-underline hover:bg-film-2 sm:grid-cols-[90px_minmax(0,1fr)]">
                  <span className="code-tag">S5.{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex flex-col gap-2">
                    <span className="display text-[clamp(28px,4vw,52px)] leading-none" style={{ ["--wdth" as string]: 96 }}>
                      {e.title}
                    </span>
                    <span className="max-w-[60ch] font-read text-[17px] leading-snug">{e.summary}</span>
                    <span className="label text-film-dim">From: {e.from.project}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
