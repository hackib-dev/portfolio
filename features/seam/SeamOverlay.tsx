"use client";

import { useEffect, useState } from "react";
import { registry } from "./registry";
import { collectSpecimens, tabbablesIn } from "./readings";
import { useSeam } from "./store";

type Box = {
  index: number;
  name: string;
  client: boolean;
  commits: number;
  rect: DOMRect;
};

type Frame = { top: number; boxes: Box[]; focus: { x: number; y: number }[] };

function saveData() {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return Boolean(nav.connection?.saveData);
}

/**
 * Renders the substrate below the seam: the real page, inverted into film by a backdrop
 * filter, with specimen outlines measured from the DOM. Listeners exist only while open.
 */
export default function SeamOverlay() {
  const substrate = useSeam((s) => s.substrate);
  const selectedIndex = useSeam((s) => s.selectedIndex);
  const select = useSeam((s) => s.select);
  const setPanel = useSeam((s) => s.setPanel);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [lite] = useState(saveData);

  useEffect(() => {
    if (substrate === 0) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const vh = window.innerHeight;
      const top = vh * (1 - substrate);
      const specs = collectSpecimens();
      const boxes = specs
        .map((s, index) => ({
          index,
          name: s.name,
          client: Boolean(s.client),
          commits: s.client?.commits ?? 0,
          rect: s.el.getBoundingClientRect(),
        }))
        .filter((b) => b.rect.width > 0 && b.rect.bottom > top && b.rect.top < vh);
      const sel = selectedIndex !== null ? specs[selectedIndex] : undefined;
      const focus = sel
        ? tabbablesIn(sel.el).map((node) => {
            const r = node.getBoundingClientRect();
            return { x: r.left, y: r.top };
          })
        : [];
      setFrame({ top, boxes, focus });
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
  }, [substrate, selectedIndex]);

  if (substrate === 0 || !frame) return null;

  return (
    <div className="seam-overlay" aria-hidden="true" data-lite={lite} style={{ clipPath: `inset(${frame.top}px 0 0 0)` }}>
      {frame.boxes.map((b) => (
        <div
          key={b.index}
          className="seam-spec"
          data-client={b.client}
          data-selected={selectedIndex === b.index}
          style={{ left: b.rect.left, top: b.rect.top, width: b.rect.width, height: b.rect.height }}
        >
          <button
            type="button"
            tabIndex={-1}
            className="seam-tag"
            style={{ top: Math.max(0, frame.top - b.rect.top) + 20 }}
            onClick={() => {
              select(b.index);
              setPanel(true);
            }}
          >
            {b.name} · {b.client ? `client · ${b.commits} ${b.commits === 1 ? "commit" : "commits"}` : "server"}
          </button>
        </div>
      ))}
      {frame.focus.map((p, i) => (
        <span key={i} className="seam-focus-badge" style={{ left: p.x, top: p.y }}>
          {i + 1}
        </span>
      ))}
    </div>
  );
}
