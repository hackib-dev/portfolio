import type { Metadata } from "next";
import { CoreTray } from "@/features/index/CoreTray";
import { PlateMeta } from "@/components/PlateHeader";
import { Specimen } from "@/components/Specimen";
import { featured } from "@/content/projects";
import { Pressed } from "@/features/shell/Pressed";

export const metadata: Metadata = {
  title: "Work",
  description: "Production systems by Aqib Akinyele: core banking, security tokens, KYC SDK, FIRS tax dashboards, ticketing and travel booking.",
  alternates: { canonical: "/work" },
};

export default function WorkIndex() {
  return (
    <>
      <Specimen as="header" name="StratumHeader" layer="S1 Work" className="plate pb-6">
        <div className="plate-grid">
          <PlateMeta code="S1" label="Work · sandstone" />
          <div className="flex flex-col gap-4">
            <h1 id="page-heading" tabIndex={-1} className="display text-[clamp(48px,8vw,120px)] leading-[0.9] outline-none" style={{ ["--wdth" as string]: 128 }}>
              <Pressed text="Work" />
            </h1>
            <p className="max-w-[58ch] text-[20px] leading-snug">
              Eight production systems across banking, government, events and travel. Four are confidential Payvantage
              projects, shown without screenshots or code.
            </p>
          </div>
        </div>
      </Specimen>
      <Specimen as="section" name="FeaturedList" layer="S1 Work" className="plate pt-0" aria-label="Featured work">
        <CoreTray projects={featured} />
      </Specimen>
    </>
  );
}
