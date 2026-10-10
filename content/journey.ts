import type { Source, Year, YearMonth } from "./types";

const cv: Source = { kind: "cv" };
const aqib: Source = { kind: "aqib", said: "2026-10" };

export type JourneyEntry = {
  id: string;
  title: string;
  org: string;
  kind: "role" | "education" | "contract" | "project" | "milestone";
  /** A year alone means Aqib gave the year without a month; the core draws that edge soft. */
  start: YearMonth | Year;
  /** Milestones have no end. */
  end?: YearMonth | Year | "present";
  detail?: string;
  href?: string;
  source: Source;
};

/** The core runs from the oldest dated layer to now. */
export const JOURNEY_FROM: YearMonth = "2021-01";
export const JOURNEY_TO: YearMonth = "2026-10";

export const journey: JourneyEntry[] = [
  {
    id: "mid",
    title: "Frontend Engineer",
    org: "Payvantage",
    kind: "role",
    start: "2022-04",
    end: "present",
    detail: "Joined in April 2022. Now leads the frontend team, owning delivery, architecture and code quality across the core banking products, reviewing pull requests and mentoring engineers.",
    source: aqib,
  },
  {
    id: "thinkvantage",
    title: "ThinkVantage Award, overall winner",
    org: "Ethica Microfinance Bank",
    kind: "milestone",
    start: "2026",
    detail: "The bank's inaugural innovation challenge.",
    source: { kind: "public", url: "https://ethicamfb.com/blog/ethica-launches-thinkvantage-rewards-innovative-staff", label: "Ethica announcement" },
  },
  {
    id: "ethcore",
    title: "Ethcore launched",
    org: "Payvantage, for Ethica MFB",
    kind: "milestone",
    start: "2026-05",
    detail: "The core banking platform I architected went into production.",
    href: "/work/ethcore",
    source: cv,
  },
  {
    id: "firs",
    title: "FIRS Tax Management System",
    org: "Contract, Federal Inland Revenue Service",
    kind: "contract",
    start: "2025-08",
    end: "2026-01",
    detail: "Frontend Engineer on contract: role-based dashboards, the Nigeria map and reports.",
    href: "/work/firs",
    source: cv,
  },
  {
    id: "super",
    title: "Super International Travels",
    org: "Super International Travels Limited",
    kind: "project",
    start: "2025-06",
    end: "present",
    detail: "The booking platform and its agent, partner and corporate dashboards.",
    href: "/work/super-international-travels",
    source: aqib,
  },
  {
    id: "bitooqoh",
    title: "Bitooqoh",
    org: "Bitooqoh",
    kind: "project",
    start: "2024",
    end: "present",
    detail: "Event ticketing, co-built in a two-person team, live in Nigeria and Kenya.",
    href: "/work/bitooqoh",
    source: aqib,
  },
  {
    id: "mte",
    title: "Muslim Tech Expo",
    org: "Voluntary",
    kind: "project",
    start: "2024",
    end: "present",
    detail: "The expo's website across editions, and MTE Kenya.",
    href: "/work/muslim-tech-expo",
    source: aqib,
  },
  {
    id: "degree",
    title: "B.Eng, Agricultural and Bio-Resources Engineering",
    org: "Federal University of Agriculture, Abeokuta",
    kind: "education",
    start: "2021",
    end: "2021",
    source: cv,
  },
];

/** Payvantage work that has no dates of its own yet. It is listed with the employer, not placed in time. */
export const undatedAtPayvantage = [
  { title: "Ethica Pass", href: "/work/ethica-pass" },
  { title: "Address Verification SDK", href: "/work/address-verification-sdk" },
  { title: "Ethica Mobile Banking", href: "/work/ethica-mobile" },
];
