import type { DecisionRecord, Project } from "../types";
import { firs, firsDecisions } from "./firs";
import { ethcore, ethicaMobile, ethicaPass, addressSdk } from "./payvantage";
import { bitooqoh, superTravels, mte } from "./public-work";

// Public work first, so visitors meet what they can see and try before the confidential systems.
export const featured: Project[] = [firs, bitooqoh, superTravels, mte, ethcore, ethicaMobile, ethicaPass, addressSdk];

export const allProjects: Project[] = [...featured];

export const decisions: DecisionRecord[] = [...firsDecisions];

export function getProject(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}

export function getDecisions(ids: string[] = []): DecisionRecord[] {
  return ids.map((id) => decisions.find((d) => d.id === id)).filter((d): d is DecisionRecord => Boolean(d));
}

