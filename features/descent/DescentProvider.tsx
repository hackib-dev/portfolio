"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type Direction = "down" | "up";
type DescentApi = { travel: (href: string, word: string, direction?: Direction) => void };

const DescentContext = createContext<DescentApi | null>(null);

const SHEAR = "cubic-bezier(0.7, 0, 0.2, 1)";
const SETTLE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function focusHeading() {
  const h = document.getElementById("page-heading");
  if (h) {
    h.focus({ preventScroll: true });
  }
}

/**
 * The Descent: surface lifts, film floods, type compresses, then the route changes and the
 * new stratum is revealed. It is a real navigation (Back works, the URL is shareable).
 * Reduced motion gets an instant route change with focus moved to the new heading.
 */
export function DescentProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const veil = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const wordEl = useRef<HTMLSpanElement>(null);
  const pending = useRef<{ from: string; direction: Direction } | null>(null);
  const [word, setWord] = useState("");
  const [active, setActive] = useState(false);
  const [announce, setAnnounce] = useState("");

  const travel = useCallback(
    (href: string, label: string, direction: Direction = "down") => {
      router.prefetch(href);
      setAnnounce(direction === "down" ? `Descending to ${label}` : `Ascending to ${label}`);
      if (prefersReducedMotion() || !veil.current || !line.current) {
        pending.current = { from: window.location.pathname, direction };
        router.push(href);
        return;
      }
      setWord(label);
      setActive(true);
      const main = document.getElementById("main");
      const down = direction === "down";
      line.current.style.visibility = "visible";
      line.current.animate(
        [{ transform: `translateY(${down ? "100vh" : "0"})` }, { transform: `translateY(${down ? "0" : "100vh"})` }],
        { duration: 260, easing: SHEAR, fill: "forwards" },
      );
      main?.animate(
        [
          { transform: "none", opacity: 1 },
          {
            transform: `perspective(1600px) rotateX(${down ? 7 : -7}deg) translateY(${down ? -5 : 5}%) scale(0.94)`,
            opacity: 0.12,
          },
        ],
        { delay: 150, duration: 560, easing: SHEAR, fill: "forwards" },
      );
      veil.current.animate(
        [{ clipPath: down ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }],
        { delay: 380, duration: 560, easing: SHEAR, fill: "forwards" },
      );
      wordEl.current?.animate(
        [{ fontVariationSettings: `"wdth" ${down ? 128 : 62}` }, { fontVariationSettings: `"wdth" ${down ? 62 : 128}` }],
        { delay: 420, duration: 620, easing: SHEAR, fill: "forwards" },
      );
      window.setTimeout(() => {
        pending.current = { from: window.location.pathname, direction };
        router.push(href);
      }, 980);
    },
    [router],
  );

  // Reveal once the new route has rendered.
  useEffect(() => {
    const p = pending.current;
    if (!p || p.from === pathname) return;
    pending.current = null;
    const main = document.getElementById("main");
    main?.getAnimations().forEach((a) => a.cancel());
    window.scrollTo(0, 0);
    if (!active || !veil.current || !line.current) {
      focusHeading();
      return;
    }
    document.documentElement.dataset.arrived = "descent";
    const reveal = veil.current.animate(
      [{ clipPath: "inset(0 0 0 0)" }, { clipPath: p.direction === "down" ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)" }],
      { duration: 520, easing: SETTLE, fill: "forwards" },
    );
    line.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" });
    reveal.onfinish = () => {
      veil.current?.getAnimations().forEach((a) => a.cancel());
      line.current?.getAnimations().forEach((a) => a.cancel());
      wordEl.current?.getAnimations().forEach((a) => a.cancel());
      if (line.current) line.current.style.visibility = "hidden";
      setActive(false);
      focusHeading();
      window.setTimeout(() => {
        delete document.documentElement.dataset.arrived;
      }, 1200);
    };
  }, [pathname, active]);

  return (
    <DescentContext.Provider value={{ travel }}>
      {children}
      <div ref={line} className="descent-line" aria-hidden="true" />
      <div ref={veil} className="descent-veil" data-active={active} data-material="film" aria-hidden="true">
        <span ref={wordEl} className="descent-word">
          {word}
        </span>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
    </DescentContext.Provider>
  );
}

export function useDescent() {
  const ctx = useContext(DescentContext);
  if (!ctx) throw new Error("useDescent must be used inside DescentProvider");
  return ctx;
}
