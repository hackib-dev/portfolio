import type { Metadata } from "next";
import { PlateMeta } from "@/components/PlateHeader";
import { Specimen } from "@/components/Specimen";
import { journey, JOURNEY_FROM, JOURNEY_TO, undatedAtPayvantage } from "@/content/journey";
import { JourneyCore } from "@/features/journey/JourneyCore";
import { Pressed } from "@/features/shell/Pressed";

export const metadata: Metadata = {
  title: "Journey",
  description: "Aqib Akinyele's career as a core sample, drawn to scale: roles at Payvantage, contracts and client projects.",
  alternates: { canonical: "/journey" },
};

export default function JourneyPage() {
  return (
    <>
      <Specimen as="header" name="StratumHeader" layer="S3 Journey" className="plate pb-6">
        <div className="plate-grid">
          <PlateMeta code="S3" label="Journey · shale" />
          <div className="flex flex-col gap-4">
            <h1 id="page-heading" tabIndex={-1} className="display text-[clamp(48px,8vw,120px)] leading-[0.9] outline-none" style={{ ["--wdth" as string]: 110 }}>
              <Pressed text="The core" />
            </h1>
            <p className="max-w-[58ch] text-[20px] leading-snug">
              A career drawn the way a drill core is: to scale, oldest at the bottom. Employment forms the beds. Contracts and client
              work cut through them like dikes, alongside the day job.
            </p>
            <p className="max-w-[58ch] text-[16px] leading-snug text-ink-2">
              Dates given as a year alone are drawn with a soft edge across that year.
            </p>
          </div>
        </div>
      </Specimen>
      <Specimen as="section" name="CareerCore" layer="S3 Journey" className="plate pt-0" aria-label="Career, most recent first">
        <div className="plate-grid">
          <PlateMeta code="S3.0" label={`${journey.length} layers`} />
          <JourneyCore entries={journey} from={JOURNEY_FROM} to={JOURNEY_TO} undated={undatedAtPayvantage} />
        </div>
      </Specimen>
    </>
  );
}
