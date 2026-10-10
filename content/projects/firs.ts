import type { DecisionRecord, Project, Source } from "../types";
import nationalMap from "@/assets/work/firs/national-map.png";
import analysisCoverage from "@/assets/work/firs/analysis-coverage.png";
import regionalPerformance from "@/assets/work/firs/regional-performance.png";
import performanceScale from "@/assets/work/firs/performance-scale.png";
import economicIndicators from "@/assets/work/firs/economic-indicators.png";
import dataUpload from "@/assets/work/firs/data-upload.png";
import sidebarNavigation from "@/assets/work/firs/sidebar-navigation.png";

const cv: Source = { kind: "cv" };
const code: Source = { kind: "code-review", project: "FIRS Tax Management System", reviewed: "2026-10" };
const shots: Source = { kind: "screenshots", project: "FIRS Tax Management System" };
const redacted = "Signed-in user's name removed from the header.";

export const firs: Project = {
  slug: "firs",
  title: "FIRS Tax Management System",
  tier: "featured",
  summary:
    "A role-based tax administration dashboard for the Federal Inland Revenue Service. National, regional, state and tax-office views of remittance performance, an interactive Nigeria map, and analysis reports exported as PDF or Excel.",
  context: { kind: "contract", org: "Federal Inland Revenue Service" },
  period: { start: "2025-08", end: "2026-01", source: cv },
  role: { text: "Frontend Engineer (contract)", source: { kind: "aqib", said: "2026-10" } },
  ownership: "built",
  platforms: ["web"],
  stack: {
    items: ["Next.js", "TypeScript", "Redux Toolkit", "TanStack Query", "React Context", "Apache ECharts", "react-simple-maps", "jsPDF", "SheetJS", "Zod", "Tailwind CSS"],
    source: code,
  },
  visibility: "public-demo",
  links: { demo: "https://tax-manager-demo.vercel.app/" },
  lithologyCode: "S1.01",
  responsibilities: [
    { text: "Built the role-based access control for the user hierarchy, with each role seeing only the dashboards and analysis scopes that apply to it.", source: cv },
    { text: "Built the dashboards for tax remittance, collection trends and compliance metrics at national, state and regional level, using Apache ECharts.", source: cv },
    { text: "Implemented the interactive Nigeria map showing tax collection by state, region and coordinating unit.", source: cv },
    { text: "Created the interfaces officers use to track taxpayer records, payment history and compliance status.", source: cv },
    { text: "Built the multi-level reporting system: reports scoped by role, region and access level, exported as PDF or Excel.", source: cv },
    { text: "Managed state across roles and hierarchy levels with Redux, alongside TanStack Query for server data.", source: cv },
  ],
  outcomes: [
    { text: "Four role types share one application. Each lands on its own dashboard and sees only its permitted navigation and analysis scopes.", source: code },
    { text: "The platform is available as a public demo.", source: { kind: "public", url: "https://tax-manager-demo.vercel.app/", label: "tax-manager-demo.vercel.app" } },
  ],
  media: [
    { src: nationalMap, alt: "Map of Nigeria divided into states, each coloured by tax performance and labelled with coordinating unit codes such as C005 and C022.", caption: "National map by coordinating unit", kind: "production-screenshot", redaction: redacted },
    { src: analysisCoverage, alt: "Analysis form with analysis type, coverage area set to National, tax type, period type and year selectors, and a Preview result button.", caption: "Analysis: coverage options depend on role", kind: "production-screenshot", redaction: redacted },
    { src: regionalPerformance, alt: "Regional dashboard with a faded Nigeria map highlighting three south-south states and an area chart of period performance.", caption: "Regional dashboard, selected states", kind: "production-screenshot", redaction: redacted },
    { src: performanceScale, alt: "Period performance map in a dialog with a performance scale legend running from below minus 20 percent to above plus 20 percent.", caption: "Performance scale legend", kind: "production-screenshot" },
    { src: economicIndicators, alt: "Four line charts for inflation rate, exchange rate, unemployment rate and foreign reserve, each with quarter range selectors.", caption: "Economic indicators", kind: "production-screenshot", redaction: redacted },
    { src: dataUpload, alt: "Settings page with four upload cards: tax collection data, tax target data, GDP growth data and sectoral growth data.", caption: "Data upload", kind: "production-screenshot", redaction: redacted },
    { src: sidebarNavigation, alt: "Sidebar listing National Dashboard, Regional Dashboard, State Dashboard, Tax Office, Analysis and Settings.", caption: "Navigation as seen by a national user", kind: "production-screenshot" },
  ],
  decisions: ["firs-nav", "firs-landing", "firs-coverage", "firs-state", "firs-map", "firs-reports"],
  replica: "firs-roles",
  experiment: {
    slug: "state-propagation",
    title: "State propagation",
    pitch: "Take the role you just picked into a live component tree and watch which parts re-render.",
  },
};

export const firsDecisions: DecisionRecord[] = [
  {
    id: "firs-nav",
    project: "firs",
    title: "Navigation declared as data, filtered by role",
    concerns: ["security", "ux", "architecture"],
    problem: "Four kinds of user share one dashboard application, and each should be offered only the areas that apply to them.",
    approach: {
      text: "Every navigation entry lists the roles allowed to see it. An entry with no list is open to every role. The sidebar filters this one list against the signed-in user's role, which is held in the Redux session store.",
      source: code,
    },
    tradeoffs: {
      text: "The rules sit in one reviewable place, and adding a role or a page is a change to data, not to components. The list decides what the interface offers. Which data a role may fetch is a separate concern outside the frontend code reviewed, so the replica below does not model it.",
      basis: "confirmed",
    },
    outcome: { text: "One configuration drives the sidebar for all four roles.", source: code },
  },
  {
    id: "firs-landing",
    project: "firs",
    title: "Each role lands on its own dashboard",
    concerns: ["ux", "product"],
    problem: "After signing in, a state officer and a national user need different starting points.",
    approach: {
      text: "A lookup maps each role to its home dashboard: national users to National, state users to State, coordination office users to Regional, tax office users to Tax Office. Login routes through it.",
      source: code,
    },
    tradeoffs: {
      text: "The first screen is relevant for every role, with no extra clicks. The map has to be kept in step with the navigation rules, since they are two separate lists.",
      basis: "confirmed",
    },
    outcome: { text: "Sign-in lands each role on the dashboard that matches its scope.", source: code },
  },
  {
    id: "firs-coverage",
    project: "firs",
    title: "Analysis scopes follow the same rule",
    concerns: ["security", "ux", "product"],
    problem: "The Analysis page can report at national, state, coordination or tax-office level, but not every role should be offered every level.",
    approach: {
      text: "Coverage areas carry their own role lists and the selector shows only the permitted ones. National coverage is offered to national users only. Tax-office coverage is offered to all four roles.",
      source: code,
    },
    tradeoffs: {
      text: "It reuses the navigation's pattern, so the concept is learned once. It is a third list to keep consistent with the other two.",
      basis: "confirmed",
    },
    outcome: { text: "Report scope options change with the signed-in role.", source: code },
  },
  {
    id: "firs-state",
    project: "firs",
    title: "Three kinds of state, three tools",
    concerns: ["state", "architecture", "performance"],
    problem: "The app juggles a signed-in session, server data across many endpoints, and per-dashboard filters such as period type and date range.",
    approach: {
      text: "Redux Toolkit holds the session. TanStack Query holds server data through a shared wrapper that standardises success and error notifications and turns off refetching on window focus. Dashboard-level React Context providers own the filters and derive one memoised set of API parameters for the chosen period type: month, quarter or year.",
      source: code,
    },
    tradeoffs: {
      text: "Each tool has one job and server caching stays out of Redux. A Context re-renders every consumer whenever its value changes, which is fine for a filter bar and a handful of widgets but grows with each consumer added. The Lab experiment shows this effect directly.",
      basis: "confirmed",
    },
    outcome: { text: "Every widget on a dashboard reads the same derived parameters, so a period change applies everywhere at once.", source: code },
  },
  {
    id: "firs-map",
    project: "firs",
    title: "A hierarchy flattened into lookups for the map",
    concerns: ["performance", "ux", "architecture"],
    problem: "The API describes coordinating units, the states they cover and the tax offices within them. The map needs a colour and a tooltip for every state.",
    approach: {
      text: "The map uses react-simple-maps with a Nigeria GeoJSON in a Mercator projection. The component flattens the hierarchy into memoised lookups (state to units, unit to states, unit to performance), so colouring each state is a lookup rather than a search. Selecting a state or unit opens a detail view.",
      source: code,
    },
    tradeoffs: {
      text: "The derivation is recomputed only when the data changes. It runs on the client, which suits 37 states but would need revisiting for local-government-level detail.",
      basis: "confirmed",
    },
    outcome: { text: "Performance is shown in eleven colour bands from below −20% to above +20%.", source: shots },
  },
  {
    id: "firs-reports",
    project: "firs",
    title: "Reports generated in the browser",
    concerns: ["product", "architecture", "performance"],
    problem: "Officers need to take analysis results away as documents.",
    approach: {
      text: "Results are previewed first, then exported in the browser: PDF through jsPDF with an auto-generated table, Excel through SheetJS.",
      source: code,
    },
    tradeoffs: {
      text: "There is no server rendering or file storage to run, and the export matches exactly what the officer previewed. Both libraries are heavy, which suits an internal tool better than a public page.",
      basis: "confirmed",
    },
    outcome: { text: "Any analysis can be downloaded as PDF or Excel from its preview.", source: code },
  },
];
