"use client";

import { usePathname } from "next/navigation";
import { useEffect, useReducer, useRef, type RefObject } from "react";
import { registry } from "./registry";
import {
  accessibilityOf,
  collectSpecimens,
  contrastOf,
  pageReadings,
  tabbablesIn,
  typographyOf,
  wcagGrade,
} from "./readings";
import { useSeam } from "./store";
import { vitals } from "./vitals";

const kb = (n: number) => `${n.toFixed(1)} KB`;

function formatVital(name: string, value: number) {
  return name === "CLS" ? value.toFixed(3) : `${Math.round(value)} ms`;
}

/**
 * The readable equivalent of the seam: the same measurements as a list, available to
 * keyboard and screen-reader users, and on touch screens where dragging is awkward.
 */
export default function SpecimenPanel({ returnFocusTo }: { returnFocusTo: RefObject<HTMLButtonElement | null> }) {
  const panelOpen = useSeam((s) => s.panelOpen);
  const selectedIndex = useSeam((s) => s.selectedIndex);
  const select = useSeam((s) => s.select);
  const setPanel = useSeam((s) => s.setPanel);
  const pathname = usePathname();
  const [, refresh] = useReducer((n: number) => n + 1, 0);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!panelOpen) return;
    heading.current?.focus();
    const unsubscribe = registry.subscribe(refresh);
    const tick = window.setInterval(refresh, 1000);
    return () => {
      unsubscribe();
      window.clearInterval(tick);
    };
  }, [panelOpen]);

  useEffect(() => {
    select(null);
  }, [pathname, select]);

  if (!panelOpen) return null;

  const specs = collectSpecimens();
  const page = pageReadings();
  const vit = vitals.all();
  const sel = selectedIndex !== null ? specs[selectedIndex] : undefined;

  const close = () => {
    setPanel(false);
    returnFocusTo.current?.focus();
  };

  let details = null;
  if (sel) {
    const a11y = accessibilityOf(sel.el);
    const contrast = contrastOf(sel.el);
    const type = typographyOf(sel.el);
    const rect = sel.el.getBoundingClientRect();
    const focusables = tabbablesIn(sel.el);
    details = (
      <section aria-labelledby="specimen-selected">
        <h3 id="specimen-selected" className="label" style={{ color: "var(--color-marker)" }}>
          {sel.name}
        </h3>
        <dl>
          <dt>Layer</dt>
          <dd>{sel.layer || "n/a"}</dd>
          <dt>Rendering</dt>
          <dd>
            {sel.client
              ? "Client island. It registered from a layout effect, so it hydrated in this browser."
              : "Server-rendered. No client component registered this node in this browser."}
          </dd>
          {sel.client ? (
            <>
              <dt>Commits</dt>
              <dd>{sel.client.commits} since it mounted</dd>
            </>
          ) : null}
          <dt>Role</dt>
          <dd>{a11y.role}</dd>
          <dt>Accessible name</dt>
          <dd>{a11y.name ? `“${a11y.name.slice(0, 140)}${a11y.name.length > 140 ? "…" : ""}”` : "none"}</dd>
          <dt>Tab stops</dt>
          <dd>
            {focusables.length === 0
              ? "none"
              : `${focusables.length}: ${focusables
                  .slice(0, 5)
                  .map((f) => accessibilityOf(f).name || f.tagName.toLowerCase())
                  .join(" → ")}${focusables.length > 5 ? " → …" : ""}`}
          </dd>
          <dt>Text contrast</dt>
          <dd>
            {contrast
              ? `${contrast.ratio.toFixed(2)}:1 · ${wcagGrade(contrast.ratio)} (${contrast.fg} on ${contrast.bg})`
              : "n/a"}
          </dd>
          <dt>Type</dt>
          <dd>
            {type.family} · {type.size} · {type.weight}
            {type.variation !== "none" ? ` · ${type.variation}` : ""}
          </dd>
          <dt>Box</dt>
          <dd>
            {Math.round(rect.width)} × {Math.round(rect.height)} px · {sel.el.getElementsByTagName("*").length} DOM nodes
          </dd>
        </dl>
        {sel.client?.state !== undefined ? (
          <>
            <p className="label" style={{ color: "var(--color-film-dim)" }}>
              Live state
            </p>
            <pre>{JSON.stringify(sel.client.state, null, 2)}</pre>
          </>
        ) : null}
      </section>
    );
  }

  return (
    <aside id="specimen-panel" className="seam-panel" data-material="film" aria-labelledby="specimen-title">
      <header>
        <div className="flex flex-col gap-1">
          <h2 id="specimen-title" ref={heading} tabIndex={-1} className="display text-2xl" style={{ ["--wdth" as string]: 80 }}>
            Specimens
          </h2>
          <p className="note">Measured in your browser, from this page. Nothing here is estimated.</p>
        </div>
        <button type="button" className="x" onClick={close}>
          Close · Esc
        </button>
      </header>
      <div className="panel-body">
        <section aria-labelledby="specimen-page">
          <h3 id="specimen-page" className="label" style={{ color: "var(--color-film-dim)" }}>
            This page · {pathname}
          </h3>
          <dl>
            <dt>DOM nodes</dt>
            <dd>{page.domNodes}</dd>
            <dt>Hydrated regions</dt>
            <dd>{page.hydratedRegions} registered client components</dd>
            <dt>JavaScript</dt>
            <dd>
              {page.scriptFiles} files · {kb(page.transferredKB)} transferred · {kb(page.decodedKB)} decoded
              {page.cachedFiles > 0 ? ` · ${page.cachedFiles} from cache` : ""}
            </dd>
            {page.htmlTransferredKB !== null ? (
              <>
                <dt>First document</dt>
                <dd>{kb(page.htmlTransferredKB)} transferred</dd>
              </>
            ) : null}
            {vit.map((v) => (
              <div key={v.name} className="contents">
                <dt>{v.name}</dt>
                <dd>
                  {formatVital(v.name, v.value)}
                  {v.rating ? ` · ${v.rating.replace("-", " ")}` : ""}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {details}

        <section aria-labelledby="specimen-list">
          <h3 id="specimen-list" className="label" style={{ color: "var(--color-film-dim)" }}>
            {specs.length} specimens on this page
          </h3>
          <ul className="spec-list">
            {specs.map((s, i) => (
              <li key={i}>
                <button type="button" aria-pressed={selectedIndex === i} onClick={() => select(selectedIndex === i ? null : i)}>
                  <span>{s.name}</span>
                  <span>{s.client ? `client · ${s.client.commits}` : "server"}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="specimen-limits">
          <h3 id="specimen-limits" className="label" style={{ color: "var(--color-film-dim)" }}>
            Limits of these readings
          </h3>
          <p className="note">
            Render time is not shown. React only reports it in its profiling build, which stays off in production to
            keep the site fast, so commits are counted instead.
          </p>
          <p className="note">
            Files served from your browser cache transfer 0 KB, so transferred size can drop on a second visit. INP
            appears after your first interaction. Contrast uses the nearest solid background and cannot see images
            behind text.
          </p>
          <p className="note">
            Component names and layers are shown. Source files and repository details are not, because the code is
            private.
          </p>
        </section>
      </div>
    </aside>
  );
}
