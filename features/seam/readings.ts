import { computeAccessibleName, getRole } from "dom-accessibility-api";
import { registry, type ClientSpecimen } from "./registry";

/** Everything here is read from the live DOM in the visitor's browser. Nothing is estimated. */

export type SpecimenRef = {
  el: Element;
  name: string;
  layer: string;
  client: ClientSpecimen | undefined;
};

export function collectSpecimens(): SpecimenRef[] {
  return Array.from(document.querySelectorAll("[data-specimen]")).map((el) => ({
    el,
    name: el.getAttribute("data-specimen") ?? "Unnamed",
    layer: el.getAttribute("data-specimen-layer") ?? "",
    client: registry.get(el),
  }));
}

const TABBABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), summary';

/**
 * Elements reached with Tab, in DOM order. A radio group is a single tab stop: the checked
 * radio, or the first one when none is checked. Visually hidden radios still count, because
 * keyboard focus lands on them.
 */
export function tabbablesIn(el: Element): HTMLElement[] {
  const seenGroups = new Set<string>();
  const nodes = Array.from(el.querySelectorAll<HTMLElement>(TABBABLE)).filter((node) => {
    if (node.closest("[inert]") || node.tabIndex < 0) return false;
    const radio = node instanceof HTMLInputElement && node.type === "radio";
    return radio || node.getClientRects().length > 0;
  });
  return nodes.filter((node) => {
    if (!(node instanceof HTMLInputElement) || node.type !== "radio" || !node.name) return true;
    if (seenGroups.has(node.name)) return false;
    const group = nodes.filter((n): n is HTMLInputElement => n instanceof HTMLInputElement && n.name === node.name);
    const stop = group.find((r) => r.checked) ?? group[0];
    if (stop === node) {
      seenGroups.add(node.name);
      return true;
    }
    return false;
  });
}

type RGBA = [number, number, number, number];

function parseColor(value: string): RGBA | null {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m || !m[1]) return null;
  const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  const [r = 0, g = 0, b = 0, a = 1] = parts;
  return [r, g, b, a];
}

function luminance([r, g, b]: RGBA): number {
  const ch = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (ch[0] ?? 0) + 0.7152 * (ch[1] ?? 0) + 0.0722 * (ch[2] ?? 0);
}

/** WCAG 2 contrast of the element's text colour against the nearest solid background behind it. */
export function contrastOf(el: Element): { ratio: number; fg: string; bg: string } | null {
  const fg = parseColor(getComputedStyle(el).color);
  if (!fg) return null;
  let node: Element | null = el;
  let bg: RGBA | null = null;
  while (node) {
    const c = parseColor(getComputedStyle(node).backgroundColor);
    if (c && c[3] > 0.95) {
      bg = c;
      break;
    }
    node = node.parentElement;
  }
  bg ??= [255, 255, 255, 1];
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const hex = (c: RGBA) => `#${c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
  return { ratio, fg: hex(fg), bg: hex(bg) };
}

export function wcagGrade(ratio: number): string {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA large text only";
  return "Fails AA";
}

export function typographyOf(el: Element) {
  const cs = getComputedStyle(el);
  const family = (cs.fontFamily.split(",")[0] ?? "").replace(/["']/g, "").replace(/^__|_[a-f0-9]{6}$/g, "").replace(/_/g, " ").trim();
  return {
    family,
    size: cs.fontSize,
    weight: cs.fontWeight,
    variation: cs.fontVariationSettings === "normal" ? "none" : cs.fontVariationSettings,
    lineHeight: cs.lineHeight,
  };
}

export function accessibilityOf(el: Element) {
  let role = "";
  let name = "";
  try {
    role = getRole(el) ?? "";
    name = computeAccessibleName(el);
  } catch {
    // Unusual markup can throw inside the name algorithm; report it as unavailable.
  }
  return { role: role || "none (generic container)", name };
}

export function pageReadings() {
  const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  const scripts = resources.filter((r) => r.initiatorType === "script" || /\.js(\?|$)/.test(r.name));
  const transferred = scripts.reduce((sum, r) => sum + r.transferSize, 0);
  const decoded = scripts.reduce((sum, r) => sum + r.decodedBodySize, 0);
  const cached = scripts.filter((r) => r.transferSize === 0 && r.decodedBodySize > 0).length;
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  return {
    scriptFiles: scripts.length,
    transferredKB: transferred / 1024,
    decodedKB: decoded / 1024,
    cachedFiles: cached,
    htmlTransferredKB: nav ? nav.transferSize / 1024 : null,
    domNodes: document.getElementsByTagName("*").length,
    hydratedRegions: registry.size(),
  };
}
