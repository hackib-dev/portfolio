import type { Metadata } from "next";
import { PlateMeta } from "@/components/PlateHeader";
import { Specimen } from "@/components/Specimen";
import { Composer } from "@/features/connect/Composer";
import { ContactLinks } from "@/features/connect/ContactLinks";
import { Pressed } from "@/features/shell/Pressed";

export const metadata: Metadata = {
  title: "Connect",
  description: "Contact Aqib Akinyele by email or LinkedIn, see his GitHub, or download his résumé.",
  alternates: { canonical: "/connect" },
};

export default function ConnectPage() {
  return (
    <>
      <Specimen as="header" name="StratumHeader" layer="S6 Connect" className="plate pb-6">
        <div className="plate-grid">
          <PlateMeta code="S6" label="Connect · granite" />
          <div className="flex flex-col gap-4">
            <h1 id="page-heading" tabIndex={-1} className="display text-[clamp(48px,8vw,120px)] leading-[0.9] outline-none" style={{ ["--wdth" as string]: 110 }}>
              <Pressed text="Bedrock" />
            </h1>
            <p className="max-w-[56ch] text-[20px] leading-snug">Everything above rests here. Tell me what you&apos;re building.</p>
          </div>
        </div>
      </Specimen>
      <Specimen as="section" name="Channels" layer="S6 Connect" className="plate pt-0" aria-label="Contact channels">
        <div className="plate-grid">
          <PlateMeta code="S6.1" label="Direct" />
          <ContactLinks dense />
        </div>
      </Specimen>
      <section className="plate rule" aria-labelledby="compose-title">
        <div className="plate-grid">
          <PlateMeta code="S6.2" label="Compose" />
          <div className="flex max-w-[760px] flex-col gap-5">
            <h2 id="compose-title" className="display text-[clamp(28px,3.4vw,42px)]" style={{ ["--wdth" as string]: 108 }}>
              <Pressed text="Write it once, send it your way" />
            </h2>
            <Composer />
          </div>
        </div>
      </section>
    </>
  );
}
