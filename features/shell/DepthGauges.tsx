"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Scale period in px: one major tick every 100px of document depth. */
const PERIOD = 100;
const format = new Intl.NumberFormat("en-GB");

/**
 * Drives every depth gauge on the page. Readings are the needle's real offset from the top of
 * the document, in CSS pixels. Gauges are server-rendered markup; this writes text and one
 * custom property directly, once per frame while scrolling, and only for gauges on screen.
 */
export function DepthGauges() {
  const pathname = usePathname();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 861px)");
    const gauges = Array.from(document.querySelectorAll<HTMLElement>("[data-gauge]"));
    if (!gauges.length) return;

    const visible = new Set<HTMLElement>();
    const phase = new WeakMap<HTMLElement, number>();
    let raf = 0;

    const measure = () => {
      raf = 0;
      if (!desktop.matches) return;
      const y = window.scrollY;
      // Read everything first, then write, so the frame lays out once.
      const readings = Array.from(visible, (g) => {
        const head = g.querySelector<HTMLElement>(".gauge-head");
        const top = g.getBoundingClientRect().top + y;
        return { g, top, needle: head ? head.getBoundingClientRect().top + y : top };
      });
      for (const { g, top, needle } of readings) {
        const p = Math.round(top) % PERIOD;
        if (phase.get(g) !== p) {
          phase.set(g, p);
          g.style.setProperty("--gauge-phase", `${p}px`);
        }
        const out = g.querySelector(".gauge-read b");
        if (out) out.textContent = `${format.format(Math.round(needle))} px`;
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const g = e.target as HTMLElement;
        if (e.isIntersecting) visible.add(g);
        else visible.delete(g);
      }
      schedule();
    });
    gauges.forEach((g) => io.observe(g));
    // Content above a gauge can change height (images, the replica), which moves its depth.
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);

    window.addEventListener("scroll", schedule, { passive: true });
    desktop.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      desktop.removeEventListener("change", schedule);
    };
  }, [pathname]);

  return null;
}
