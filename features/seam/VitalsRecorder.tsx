"use client";

import { useReportWebVitals } from "next/web-vitals";
import { vitals } from "./vitals";

type Metric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];

function record(metric: Metric) {
  vitals.record({ name: metric.name, value: metric.value, rating: metric.rating });
}

export function VitalsRecorder() {
  useReportWebVitals(record);
  return null;
}
