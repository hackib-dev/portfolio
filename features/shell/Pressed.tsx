"use client";

import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { useSpecimen } from "@/features/seam/useSpecimen";

/**
 * Scroll pressure. Every locked heading on the page is driven from one scroll listener:
 * `--press` runs 0 → 1 as the heading rises from its threshold to off the top of the screen.
 * The threshold is 35% of the viewport, or the heading's own position on load if that is
 * higher, so nothing is compressed before the reader has scrolled.
 */
const locked = new Map<HTMLElement, { threshold: number; press: number }>();
let raf = 0;

function measure() {
  raf = 0;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reads = Array.from(locked, ([el, s]) => {
    const r = el.getBoundingClientRect();
    const press = reduce ? 0 : Math.min(1, Math.max(0, (s.threshold - r.top) / (s.threshold + r.height)));
    return { el, s, press: Math.round(press * 100) / 100 };
  });
  for (const { el, s, press } of reads) {
    if (press === s.press) continue;
    s.press = press;
    el.style.setProperty("--press", String(press));
  }
}
function schedule() {
  if (!raf) raf = requestAnimationFrame(measure);
}
function lock(el: HTMLElement) {
  if (locked.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  const top = el.getBoundingClientRect().top + window.scrollY;
  locked.set(el, { threshold: Math.min(window.innerHeight * 0.35, top), press: 0 });
  schedule();
}
function unlock(el: HTMLElement) {
  locked.delete(el);
  el.style.removeProperty("--press");
  if (locked.size === 0) {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  }
}

/** Groups word spans into the lines the browser chose. Null if a word itself wraps. */
function readLines(host: HTMLElement): string[] | null {
  const lines: string[][] = [];
  let lastTop = Number.NaN;
  for (const w of Array.from(host.children) as HTMLElement[]) {
    if (w.getClientRects().length > 1) return null;
    const word = w.textContent ?? "";
    const line = lines.at(-1);
    if (!line || w.offsetTop !== lastTop) lines.push([word]);
    else line.push(word);
    lastTop = w.offsetTop;
  }
  return lines.map((l) => l.join(" "));
}

/**
 * Heading text that compresses as it is buried. Width is the only thing that changes, and
 * only downwards, so to keep the layout still the line breaks are first read from the browser
 * at the heading's natural width and then fixed, one unbreakable line each. Narrower type in
 * the same lines cannot overflow or change the heading's height. When the heading's width
 * changes, the lines are released, read again and re-fixed.
 */
export function Pressed({ text }: { text: string }) {
  const [lines, setLines] = useState<string[] | null>(null);
  const spec = useSpecimen<HTMLSpanElement>("PressedHeading", "Shell", { lines: lines?.length ?? "reading" });
  const { ref } = spec;
  const words = text.split(/\s+/);

  // Read the lines once fonts are settled; the heading renders as words until then.
  useEffect(() => {
    if (lines) return;
    let live = true;
    document.fonts.ready.then(() => {
      if (live && ref.current) setLines(readLines(ref.current) ?? null);
    });
    return () => {
      live = false;
    };
  }, [lines, ref]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !lines) return;
    lock(el);
    return () => unlock(el);
  }, [lines, ref]);

  // A width change can move the breaks: release and read again.
  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    let width = host.clientWidth;
    const ro = new ResizeObserver(() => {
      if (host.clientWidth === width) return;
      width = host.clientWidth;
      setLines(null);
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, [ref]);

  return (
    <span {...spec} className="pressed" data-locked={lines ? "" : undefined}>
      {lines
        ? lines.map((l, i) => (
            <span key={i} className="press-line">
              {i < lines.length - 1 ? `${l} ` : l}
            </span>
          ))
        : words.map((w, i) => (
            <Fragment key={i}>
              {i > 0 ? " " : null}
              <span>{w}</span>
            </Fragment>
          ))}
    </span>
  );
}
