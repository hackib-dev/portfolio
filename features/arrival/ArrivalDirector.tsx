"use client";

import { useEffect } from "react";

const SEEN_KEY = "aqos-arrived";
const DURATION = 1600;

/**
 * Plays the first cut once per session. The arrival is fully rendered on the server and
 * readable without this script; the director only adds `data-intro="play"` to animate it.
 * Any key, click, scroll or touch skips to the final frame.
 */
export function ArrivalDirector({ targetId }: { targetId: string }) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Without storage the intro plays each visit, which is acceptable.
    }
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const finish = () => {
      el.removeAttribute("data-intro");
      window.clearTimeout(timer);
      events.forEach((type) => window.removeEventListener(type, finish));
    };
    const events = ["keydown", "pointerdown", "wheel", "touchstart"] as const;
    el.setAttribute("data-intro", "play");
    const timer = window.setTimeout(finish, DURATION + 50);
    events.forEach((type) => window.addEventListener(type, finish, { passive: true, once: true }));
    return finish;
  }, [targetId]);

  return null;
}
