"use client";

import { createStore } from "zustand";

export type LogEntry = { id: number; action: string; rendered: string[] };

/**
 * Records which nodes committed in response to one action. Nodes report from their layout
 * effects; the entry is closed on a macrotask, after React has flushed the synchronous update
 * the action caused. Nothing is inferred: if a node did not commit, it is not listed.
 */
export function createTracker() {
  const log = createStore<{ entries: LogEntry[] }>(() => ({ entries: [] }));
  let open: LogEntry | null = null;
  let seq = 0;
  return {
    log,
    begin(action: string) {
      const entry: LogEntry = { id: ++seq, action, rendered: [] };
      open = entry;
      window.setTimeout(() => {
        if (open === entry) open = null;
        log.setState((s) => ({ entries: [entry, ...s.entries].slice(0, 8) }));
      }, 0);
    },
    report(node: string) {
      if (open && !open.rendered.includes(node)) open.rendered.push(node);
    },
    reset() {
      open = null;
      log.setState({ entries: [] });
    },
  };
}

export type Tracker = ReturnType<typeof createTracker>;
