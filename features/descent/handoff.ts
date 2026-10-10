"use client";

/**
 * State carried across a Descent. The replica writes here as the visitor changes it, and the
 * Descent link appends it to the destination URL at click time, so the Lab opens on the
 * exact state the visitor just set and the link stays shareable.
 */
const seeds: Record<string, string | undefined> = {};

export const handoff = {
  set(key: string, value: string) {
    seeds[key] = value;
  },
  seedParam(key: string): string | undefined {
    const v = seeds[key];
    return v ? `${key}:${v}` : undefined;
  },
};
