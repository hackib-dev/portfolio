"use client";

export type VitalReading = { name: string; value: number; rating?: string };

/** Web Vitals for this visit, captured by Next's reporter. Kept in memory only, never sent anywhere. */
const readings = new Map<string, VitalReading>();

export const vitals = {
  record(r: VitalReading) {
    readings.set(r.name, r);
  },
  all(): VitalReading[] {
    return ["LCP", "FCP", "CLS", "INP", "TTFB"].flatMap((n) => {
      const r = readings.get(n);
      return r ? [r] : [];
    });
  },
};
