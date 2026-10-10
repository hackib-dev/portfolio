import type { Metadata } from "next";
import { PlateMeta } from "@/components/PlateHeader";
import { Specimen } from "@/components/Specimen";
import { SourceTag } from "@/components/SourceTag";
import { publishedSignals } from "@/content/signals";
import { Pressed } from "@/features/shell/Pressed";

export const metadata: Metadata = {
  title: "Signals",
  description: "Evidence of Aqib Akinyele's impact, each claim listed with its source.",
  alternates: { canonical: "/signals" },
};

export default function SignalsPage() {
  return (
    <>
      <Specimen as="header" name="StratumHeader" layer="S2 Signals" className="plate pb-6">
        <div className="plate-grid">
          <PlateMeta code="S2" label="Signals · limestone" />
          <div className="flex flex-col gap-4">
            <h1 id="page-heading" tabIndex={-1} className="display text-[clamp(48px,8vw,120px)] leading-[0.9] outline-none" style={{ ["--wdth" as string]: 118 }}>
              <Pressed text="The assay" />
            </h1>
            <p className="max-w-[58ch] text-[20px] leading-snug">
              An assay reports what a sample contains and how it was measured. Each signal here has a value, its context and its
              source. Figures not yet cleared for publication are left out, not rounded down.
            </p>
          </div>
        </div>
      </Specimen>
      <Specimen as="section" name="AssayTable" layer="S2 Signals" className="plate pt-0" aria-label="Signals">
        <div className="plate-grid">
          <PlateMeta code="S2.0" label={`${publishedSignals.length} samples`} />
          <ol className="flex flex-col">
            {publishedSignals.map((s, i) => (
              <li key={s.id} className="grid gap-2 border-t border-ink py-6 last:border-b md:grid-cols-[60px_minmax(0,240px)_minmax(0,1fr)] md:gap-6">
                <span className="code-tag">S2.{String(i + 1).padStart(2, "0")}</span>
                <span className="flex flex-col gap-1">
                  <span className="label text-ink-2">{s.sample}</span>
                  <span className="display text-[clamp(30px,3.6vw,46px)] leading-none" style={{ ["--wdth" as string]: 96 }}>
                    {s.value}
                  </span>
                </span>
                <span className="flex flex-col gap-2">
                  <span className="max-w-[60ch] text-[18px] leading-snug">{s.context}</span>
                  <SourceTag source={s.source} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Specimen>
    </>
  );
}
