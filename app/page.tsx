import Link from "next/link";
import { Arrival } from "@/features/arrival/Arrival";
import { CoreTray } from "@/features/index/CoreTray";
import { ContactLinks } from "@/features/connect/ContactLinks";
import { Specimen } from "@/components/Specimen";
import { PlateMeta } from "@/components/PlateHeader";
import { SourceTag } from "@/components/SourceTag";
import { featured } from "@/content/projects";
import { publishedSignals } from "@/content/signals";
import { Pressed } from "@/features/shell/Pressed";
import { DescentLink } from "@/features/descent/DescentLink";

const statement = [
  "Frontend Engineer at Payvantage, where I have worked since April 2022. I architected and launched Ethcore, the core banking platform for Ethica Microfinance Bank, and lead the frontend team that builds it.",
  "My work spans web and mobile: Ethica Pass, a security token app I built on my own; an address verification SDK for KYC; features in the Ethica mobile app, used by 50,000+ people; and a role-based tax dashboard for FIRS. Outside Payvantage I build products for clients such as Super International Travels and Bitooqoh.",
];

export default function Home() {
  const strip = publishedSignals.slice(0, 4);
  return (
    <>
      <Arrival />

      <Specimen as="section" name="Statement" layer="Index" id="index" className="plate" aria-labelledby="statement-title">
        <div className="plate-grid">
          <PlateMeta code="S0.1" label="In thirty seconds" />
          <div className="flex flex-col gap-6">
            <h2 id="statement-title" className="display text-[clamp(32px,4.6vw,60px)]" style={{ ["--wdth" as string]: 124 }}>
              <Pressed text="Production fintech, built from the interface down." />
            </h2>
            <div className="prose-strata">
              {statement.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Quick facts">
              <li className="label">Lagos, Nigeria</li>
              <li className="label">React · Next.js · TypeScript · Flutter</li>
              <li className="label">ThinkVantage Award, 2026</li>
              <li className="label">Leads a frontend team</li>
            </ul>
            <p className="text-[16px] leading-snug text-ink-2">
              I also run{" "}
              <a href="https://kenntechs.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline">
                Kenntechs<span className="sr-only"> (opens in a new tab)</span>
              </a>
              , my technology venture.
            </p>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-vellum-3 pt-4 text-[15px] leading-snug text-ink-2">
              <span className="label text-ink">Reading the codes</span>
              <span>Sections are numbered by depth, like layers of rock: S0 at the surface, down to S6 at bedrock.</span>
            </p>
          </div>
        </div>
      </Specimen>

      <Specimen as="section" name="FeaturedWork" layer="Index" className="plate pt-0" aria-labelledby="work-title">
        <div className="plate-grid">
          <PlateMeta code="S1" label="Work · core tray">
            <Link href="/work" className="label underline">
              All work →
            </Link>
          </PlateMeta>
          <div className="flex min-w-0 flex-col gap-3">
            <h2 id="work-title" className="display text-[clamp(28px,3.6vw,44px)]" style={{ ["--wdth" as string]: 118 }}>
              <Pressed text="Eight production systems, cored" />
            </h2>
            <p className="max-w-[60ch] text-[17px] leading-snug text-ink-2">
              Each core is one system. Its bands are its makeup: what it runs on, whether it can be shown, how many
              technologies it took. Hover or focus a core to pull it from the tray.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <CoreTray projects={featured} />
        </div>
      </Specimen>

      <Specimen as="section" name="SignatureExperiment" layer="Index" aria-labelledby="sig-title">
        <DescentLink href="/lab/fault-lines" word="Lab" className="descent-link">
          <span className="sig">
            <span className="flex flex-col gap-3">
              <span className="code-tag">S5.01 · Descend to the Lab</span>
              <span id="sig-title" className="display text-[clamp(40px,6.4vw,92px)] leading-[0.9]" style={{ ["--wdth" as string]: 118 }}>
                Fault lines
              </span>
              <span className="max-w-[50ch] text-[18px] leading-snug">
                State a product requirement and watch it run through the FIRS role rules: four interfaces reshape, and the rules
                beneath them fault where they stop agreeing.
              </span>
            </span>
            <span className="sig-cores" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="sig-core" data-faulted={i === 1 || undefined}>
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              ))}
            </span>
          </span>
          <span aria-hidden="true" className="font-display text-[48px] leading-none">
            ↓
          </span>
        </DescentLink>
      </Specimen>

      <Specimen as="section" name="SignalStrip" layer="Index" className="plate rule" aria-labelledby="signals-title">
        <div className="plate-grid">
          <PlateMeta code="S2" label="Signals · strip log">
            <Link href="/signals" className="label underline">
              Full assay →
            </Link>
          </PlateMeta>
          <h2 id="signals-title" className="display text-[clamp(28px,3.6vw,44px)]" style={{ ["--wdth" as string]: 114 }}>
            <Pressed text="Evidence, logged" />
          </h2>
        </div>
        <dl className="strip-log mt-10">
          {strip.map((s, i) => (
            <div key={s.id} className="strip-col">
              <dt className="label text-ink-2">
                <span className="code-tag">S2.{String(i + 1).padStart(2, "0")}</span> {s.sample}
              </dt>
              <dd className="strip-value display">{s.value}</dd>
              <dd className="m-0 text-[15.5px] leading-snug">{s.context}</dd>
              <dd className="m-0 mt-auto">
                <SourceTag source={s.source} />
              </dd>
            </div>
          ))}
        </dl>
      </Specimen>

      <Specimen as="section" name="Contact" layer="Index" className="plate rule" aria-labelledby="contact-title">
        <div className="plate-grid">
          <PlateMeta code="S6" label="Connect" />
          <div className="flex flex-col gap-5">
            <h2 id="contact-title" className="display text-[clamp(28px,3.6vw,44px)]" style={{ ["--wdth" as string]: 110 }}>
              <Pressed text="Working on something serious?" />
            </h2>
            <ContactLinks />
          </div>
        </div>
      </Specimen>
    </>
  );
}
