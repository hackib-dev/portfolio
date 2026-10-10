import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { DecisionRecord, Project } from "@/content/types";
import { Specimen } from "@/components/Specimen";
import { PlateMeta } from "@/components/PlateHeader";
import { SourceTag, sourceLabel } from "@/components/SourceTag";
import { DescentLink } from "@/features/descent/DescentLink";
import { FirsReplica } from "@/features/firs-replica/FirsReplica";
import { contextLine, ownershipVerb, periodLabel, platformLabel, visibilityPill } from "./labels";
import { Pressed } from "@/features/shell/Pressed";

function Plate({ code, label, title, id, name, children }: { code: string; label: string; title: string; id: string; name: string; children: ReactNode }) {
  return (
    <Specimen as="section" name={name} layer="Case study" className="plate rule" aria-labelledby={id}>
      <div className="plate-grid">
        <PlateMeta code={code} label={label} />
        <div className="flex min-w-0 flex-col gap-6">
          <h2 id={id} className="display text-[clamp(28px,3.6vw,46px)]" style={{ ["--wdth" as string]: 116 }}>
            <Pressed text={title} />
          </h2>
          {children}
        </div>
      </div>
    </Specimen>
  );
}

function longestWord(text: string) {
  return Math.max(...text.split(/\s+/).map((w) => w.length));
}

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-t border-ink py-3">
      <dt className="label text-ink-2">{label}</dt>
      <dd className="m-0 text-[16px] leading-snug">{children}</dd>
    </div>
  );
}

function StatusPill({ status }: { status: "verified-in-code" | "confirmed" }) {
  return status === "verified-in-code" ? <span className="pill pill-verified">Verified in code</span> : null;
}

function Decision({ d, index }: { d: DecisionRecord; index: number }) {
  return (
    <article className="flex flex-col gap-4" aria-labelledby={`d-${d.id}`}>
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="code-tag">D{index + 1}</span>
        <h3 id={`d-${d.id}`} className="font-display text-[24px] font-extrabold [font-variation-settings:'wdth'_104]">
          {d.title}
        </h3>
      </div>
      <dl className="record">
        <dt>Problem</dt>
        <dd>{d.problem}</dd>
        <dt>Approach</dt>
        <dd>
          {d.approach.text}{" "}
          <span className="pill pill-verified ml-1 align-middle">Verified in code</span>
        </dd>
        {d.alternatives ? (
          <>
            <dt>Alternatives</dt>
            <dd>
              {d.alternatives.text} <StatusPill status={d.alternatives.status} />
            </dd>
          </>
        ) : null}
        <dt>Trade-offs</dt>
        <dd>
          {d.tradeoffs.text}
          {d.tradeoffs.basis === "analysis-of-code" ? <span className="label text-ink-2"> (a reading of the code, not the original rationale)</span> : null}
        </dd>
        <dt>Outcome</dt>
        <dd>
          {d.outcome.text} <span className="label text-ink-2">· {sourceLabel(d.outcome.source)}</span>
        </dd>
        {d.reasoning ? (
          <>
            <dt>Why</dt>
            <dd>
              {d.reasoning.text} <StatusPill status={d.reasoning.status} />
            </dd>
          </>
        ) : null}
      </dl>
    </article>
  );
}

export function CaseStudy({
  project,
  decisions,
  prev,
  next,
}: {
  project: Project;
  decisions: DecisionRecord[];
  prev?: Project;
  next?: Project;
}) {
  const p = project;
  const pill = visibilityPill(p.visibility);
  const period = periodLabel(p);
  let n = 0;
  const code = () => `${p.lithologyCode}.${++n}`;

  return (
    <article>
      <Specimen as="header" name="CaseHeader" layer="Case study" className="plate pb-10">
        <div className="plate-grid">
          <PlateMeta code={p.lithologyCode} label={p.tier === "featured" ? "Featured work" : "Archive"}>
            <Link href="/work" className="label underline">
              ← All work
            </Link>
          </PlateMeta>
          <div className="@container flex min-w-0 flex-col gap-6">
            <div className="flex flex-wrap gap-2">
              <span className={`pill ${pill.className}`}>{pill.label}</span>
              {p.replica ? <span className="pill pill-replica">Interactive replica below</span> : null}
            </div>
            {/* Sized so the longest word fits the column whole: a title never breaks mid-word. */}
            <h1
              id="page-heading"
              tabIndex={-1}
              className="display text-[clamp(44px,calc(100cqi/(var(--longest)*0.95)),112px)] leading-[0.9] outline-none"
              style={{ ["--wdth" as string]: 128, ["--longest" as string]: longestWord(p.title) }}
            >
              <Pressed text={p.title} />
            </h1>
            <p className="max-w-[56ch] text-[clamp(19px,1.8vw,23px)] leading-[1.45]">{p.summary}</p>
            <dl className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              <MetaRow label="Context">{contextLine(p)}</MetaRow>
              {period ? <MetaRow label="Period">{period}</MetaRow> : null}
              {p.role ? <MetaRow label="Role">{p.role.text}</MetaRow> : null}
              {p.ownership ? <MetaRow label="Ownership">{ownershipVerb(p.ownership)}</MetaRow> : null}
              <MetaRow label="Platforms">{p.platforms.map(platformLabel).join(" · ")}</MetaRow>
              {p.stack ? <MetaRow label="Stack">{p.stack.items.join(", ")}</MetaRow> : null}
              {p.links?.demo || p.links?.live ? (
                <MetaRow label="Links">
                  <span className="flex flex-wrap gap-x-4">
                    {p.links.demo ? (
                      <a href={p.links.demo} target="_blank" rel="noopener noreferrer" className="underline">
                        Public demo ↗
                      </a>
                    ) : null}
                    {p.links.live ? (
                      <a href={p.links.live} target="_blank" rel="noopener noreferrer" className="underline">
                        Live site ↗
                      </a>
                    ) : null}
                  </span>
                </MetaRow>
              ) : null}
            </dl>
            {p.visibility === "confidential" ? (
              <p className="max-w-[62ch] border-l-2 border-marker-ink pl-4 text-[16px] leading-snug text-ink-2">
                Confidential production system. No screenshots, code, architecture or data from it are published here, and
                descriptions stay at the product level.
              </p>
            ) : null}
          </div>
        </div>
      </Specimen>

      <Plate code={code()} label="Responsibilities" title="What I did" id="resp" name="Responsibilities">
        <ul className="prose-strata">
          {p.responsibilities.map((r) => (
            <li key={r.text}>{r.text}</li>
          ))}
        </ul>
      </Plate>

      {p.outcomes.length > 0 ? (
        <Plate code={code()} label="Outcomes" title="What came of it" id="outcomes" name="Outcomes">
          <ul className="flex flex-col">
            {p.outcomes.map((o) => (
              <li key={o.text} className="flex flex-col gap-1 border-t border-ink py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="max-w-[60ch] text-[19px] leading-snug">{o.text}</span>
                <SourceTag source={o.source} className="shrink-0" />
              </li>
            ))}
          </ul>
        </Plate>
      ) : null}

      {p.replica === "firs-roles" ? (
        <Plate code={code()} label="Decision switch" title="Switch the signed-in role" id="replica" name="ReplicaPlate">
          <div className="prose-strata">
            <p>
              The navigation, landing dashboards and analysis scopes below follow the role rules in the FIRS source code,
              re-implemented here. Everything else is synthetic: numbers, offices and coordinating units are generated, and the
              map is a tile cartogram.
            </p>
            <p>
              Switch roles to see the interface reshape itself, then open the seam to see which components actually re-rendered.
            </p>
          </div>
          <FirsReplica />
          <p className="label text-ink-2">
            My CV describes five user levels (federal, state, regional, coordinating unit, tax officer). The code defines four
            role identifiers, and &quot;Regional&quot; is a dashboard rather than a role. The replica uses the four from the code.
          </p>
        </Plate>
      ) : null}

      {decisions.length > 0 ? (
        <Plate code={code()} label="Decisions" title="Decisions behind it" id="decisions" name="DecisionRecords">
          <p className="max-w-[64ch] text-[17px] leading-snug text-ink-2">
            Each approach is verified against the source code. The trade-offs are the reasoning behind each choice. Every
            decision also appears in Mind, cut through the concerns it touched.
          </p>
          <div className="flex flex-col gap-12">
            {decisions.map((d, i) => (
              <Decision key={d.id} d={d} index={i} />
            ))}
          </div>
        </Plate>
      ) : null}

      {p.media.length > 0 ? (
        <Plate code={code()} label="Specimens" title="From the interface" id="media" name="MediaGallery">
          <ul className="grid gap-6 lg:grid-cols-2">
            {p.media.map((m) => (
              <li key={m.caption}>
                <figure className="frame">
                  <Image src={m.src} alt={m.alt} sizes="(min-width: 1024px) 560px, 100vw" className="h-auto w-full" placeholder="blur" />
                  <figcaption className="frame-cap">
                    <span className="font-display text-[15px] font-semibold [font-variation-settings:'wdth'_100]">{m.caption}</span>
                    <span className="label text-ink-2">
                      {m.kind === "production-screenshot" ? "Production screenshot" : m.kind === "public-demo" ? "Public demo" : "Replica"}
                      {m.redaction ? " · redacted" : ""}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
          {p.media.some((m) => m.redaction) ? <p className="label text-ink-2">Redacted: signed-in user&apos;s name removed from the header.</p> : null}
        </Plate>
      ) : null}

      {p.experiment ? (
        <Specimen as="section" name="DescentLink" layer="Case study" aria-label="Continue into the Lab">
          <DescentLink
            href={`/lab/${p.experiment.slug}`}
            carry={p.replica === "firs-roles" ? "firs" : undefined}
            word="Lab"
            className="descent-link"
          >
            <span className="flex flex-col gap-3">
              <span className="code-tag">S5 · Descend to the Lab</span>
              <span className="display text-[clamp(36px,6vw,84px)] leading-[0.9]" style={{ ["--wdth" as string]: 118 }}>
                {p.experiment.title}
              </span>
              <span className="max-w-[52ch] text-[18px] leading-snug">{p.experiment.pitch}</span>
            </span>
            <span aria-hidden="true" className="font-display text-[48px] leading-none">
              ↓
            </span>
          </DescentLink>
        </Specimen>
      ) : null}

      <nav aria-label="More work" className="plate rule grid gap-4 sm:grid-cols-2">
        {prev ? (
          <Link href={`/work/${prev.slug}`} className="group flex flex-col gap-1 no-underline">
            <span className="label text-ink-2">← Previous</span>
            <span className="font-display text-[26px] font-extrabold [font-variation-settings:'wdth'_110] group-hover:underline">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/work/${next.slug}`} className="group flex flex-col gap-1 text-right no-underline sm:items-end">
            <span className="label text-ink-2">Next →</span>
            <span className="font-display text-[26px] font-extrabold [font-variation-settings:'wdth'_110] group-hover:underline">{next.title}</span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
