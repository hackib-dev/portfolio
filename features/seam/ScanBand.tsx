"use client";

import { useEffect, useRef } from "react";
import { registry } from "./registry";

const HEIGHT = 36;

function describe(): { specimen: string; element: string } {
  const y = window.innerHeight - HEIGHT / 2;
  const x = Math.min(window.innerWidth * 0.5, window.innerWidth - 260);
  const el = document.elementFromPoint(x, y);
  if (!el) return { specimen: "", element: "" };
  const host = el.closest("[data-specimen]");
  const client = host ? registry.get(host) : undefined;
  const name = host?.getAttribute("data-specimen") ?? "page";
  const mode = client ? `client · ${client.commits} ${client.commits === 1 ? "commit" : "commits"}` : "server-rendered";
  const cs = getComputedStyle(el);
  const family = (cs.fontFamily.split(",")[0] ?? "").replace(/["']/g, "").replace(/^__|_[a-f0-9]{6}$/g, "").replace(/_/g, " ").trim();
  const wdth = cs.fontVariationSettings.match(/"wdth"\s+([\d.]+)/)?.[1];
  return {
    specimen: `${name} · ${mode}`,
    element: `<${el.tagName.toLowerCase()}> ${family} ${Math.round(parseFloat(cs.fontSize))}px${wdth ? ` · wdth ${Math.round(+wdth)}` : ""}`,
  };
}

/**
 * The seam at rest. A strip along the bottom of the screen inverts the page passing under it
 * and names what it is crossing: the component, how it rendered, and the type under the line.
 * Readings come from the live DOM; they update once per frame while scrolling and never otherwise.
 */
export function ScanBand() {
  const spec = useRef<HTMLSpanElement>(null);
  const elem = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = describe();
      if (spec.current) spec.current.textContent = r.specimen;
      if (elem.current) elem.current.textContent = r.element;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    const unsubscribe = registry.subscribe(schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      unsubscribe();
    };
  }, []);

  return (
    <div className="scan-band" aria-hidden="true">
      <span className="scan-key">Scan</span>
      <span ref={spec} className="scan-read" />
      <span ref={elem} className="scan-read scan-elem" />
    </div>
  );
}
