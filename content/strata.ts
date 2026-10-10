import type { Lithology } from "./types";

export type Stratum = {
  id: "work" | "signals" | "journey" | "mind" | "lab" | "connect";
  code: string;
  label: string;
  href: string;
  lithology: Lithology;
  holds: string;
  /** Sealed strata are shown in the section but are not links yet. */
  open: boolean;
};

export const strata: Stratum[] = [
  { id: "work", code: "S1", label: "Work", href: "/work", lithology: "sandstone", holds: "Production systems and case studies", open: true },
  { id: "signals", code: "S2", label: "Signals", href: "/signals", lithology: "limestone", holds: "Evidence of impact, each with its source", open: true },
  { id: "journey", code: "S3", label: "Journey", href: "/journey", lithology: "shale", holds: "Career core, to scale with time", open: true },
  { id: "mind", code: "S4", label: "Mind", href: "/mind", lithology: "conglomerate", holds: "Engineering decisions across concerns", open: true },
  { id: "lab", code: "S5", label: "Lab", href: "/lab", lithology: "crystalline", holds: "Working frontend experiments", open: true },
  { id: "connect", code: "S6", label: "Connect", href: "/connect", lithology: "granite", holds: "Email, GitHub, LinkedIn, résumé", open: true },
];
