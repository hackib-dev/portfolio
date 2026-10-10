"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { registry } from "./registry";

/**
 * Registers a client component with the seam and counts its commits.
 *
 * The layout effect has no dependency list on purpose: it runs after every commit in which
 * this component rendered, which makes the count exact without React's profiling build.
 * Cost per commit is one Map write; notifications are batched per animation frame.
 */
export function useSpecimen<T extends Element = HTMLDivElement>(name: string, layer: string, state?: unknown) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    if (ref.current) registry.commit(ref.current, name, layer, state);
  });

  useEffect(() => {
    const el = ref.current;
    return () => {
      if (el) registry.drop(el);
    };
  }, []);

  return { ref, "data-specimen": name, "data-specimen-layer": layer } as const;
}
