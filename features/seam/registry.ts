/**
 * Runtime registry of client components that opted into the seam.
 *
 * Only client components register, from a layout effect, so an element's presence here is
 * direct evidence that it hydrated in this browser. The registry stores names, commit counts
 * and a small, deliberately chosen piece of portfolio state. It never stores props wholesale.
 */
export type ClientSpecimen = {
  name: string;
  layer: string;
  commits: number;
  lastCommitAt: number;
  state?: unknown;
};

type Listener = () => void;

const entries = new Map<Element, ClientSpecimen>();
const listeners = new Set<Listener>();
let version = 0;
let scheduled = false;

function emit() {
  version += 1;
  if (scheduled || listeners.size === 0) return;
  scheduled = true;
  // Coalesce bursts of commits into one notification per frame.
  requestAnimationFrame(() => {
    scheduled = false;
    listeners.forEach((l) => l());
  });
}

export const registry = {
  commit(el: Element, name: string, layer: string, state?: unknown) {
    const prev = entries.get(el);
    entries.set(el, {
      name,
      layer,
      commits: (prev?.commits ?? 0) + 1,
      lastCommitAt: performance.now(),
      state,
    });
    emit();
  },
  drop(el: Element) {
    if (entries.delete(el)) emit();
  },
  get(el: Element) {
    return entries.get(el);
  },
  size() {
    return entries.size;
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  version() {
    return version;
  },
};
