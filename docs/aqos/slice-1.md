# AQ/OS · Slice 1 notes

Branch: `aqos`. The live site on `main` is untouched.

## Unresolved assumptions (need Aqib's confirmation)

### FIRS
1. **Five levels vs four roles.** The CV lists five user levels (Federal, State, Regional, Coordinating Unit, Tax Officer). The code defines four role identifiers: `NATIONAL_USER`, `STATE_USER`, `COORDINATION_OFFICE_USER`, `TAX_OFFICE_USER`. "Regional" exists in the code as a dashboard (open to national and coordination office users), not as a role. The replica uses the four from the code, and the case study says so on the page.
2. **Rules in the replica come from the code only.** Navigation visibility, landing dashboard and analysis coverage per role are copied as data into `features/firs-replica/model.ts`. Nothing else is modelled. To change a rule, edit that file.
3. **Data-level scoping is not represented.** The frontend code filters what the interface offers. Whether the API limits what each role can fetch isn't visible there. The case study describes this neutrally and doesn't speculate. (Private note: in the frontend reviewed, dashboard routes are guarded only for "signed in", not by role. That's normal when the API enforces scope, but worth confirming. It is deliberately not published.)
4. **Decision rationale.** All six decision records show *what* was built (verified in code). *Why*, and the alternatives considered, are marked "Needs Aqib's confirmation" on the page. The trade-offs are labelled as my reading of the code, not the original reasoning.
5. **Screenshots.** Seven production screenshots are used. The signed-in user's name was removed from every header. Screenshots showing what may be real revenue figures (national totals, named tax-office performance) were excluded, along with the login screen. Originals are unchanged in `assets/tax/`.
6. **Coordinating units in the replica are synthetic** (U1–U8, arbitrary groupings). The map is a tile cartogram with approximate positions.

### Resolved on 10 Oct 2026 (from Aqib, plus a review of the local repositories)
7. **Context:** Bitooqoh is an independent company (co-built for Bitooqoh by a two-person team, live in Nigeria and Kenya; the multi-currency, analytics and event-creation work in v2 was done by teammates, so it isn't credited), Super International Travels is a standalone client company, and MTE is a standalone client. None are attributed to Payvantage.
8. **Kenntechs** is Aqib's technology venture. It is linked from the Index statement.
9. **Ethica mobile contributions:** discounts on bills and utilities (airtime, data, cable TV, electricity), KYC 1→2 upgrade, integrating the address verification SDK for KYC 2→3, and target savings (confirmed by the git history in `~/ethica`). The app has 12,000+ users (Aqib).
10. **Ethica Pass** = `~/ethica_softtoken`, built solely by Aqib. Capabilities are described at product level only (no algorithm, timings or storage details).
11. **Address Verification SDK** lives at `~/ethica/lib/modules/address_verify`. The public API, the 13-state flow and the sealed results are described. The radius value, AI vendor and endpoints are deliberately not published.
12. **Bitooqoh figures** come from bitooqoh.com: ₦198M+ ticket sales, 21K+ tickets, 115+ events, 70+ organisations.
13. **Phones** are published from `config/site.ts`: +234 811 888 8108 (call and WhatsApp), +234 903 082 3149 (call). The résumé PDF's number is one of these.
14. **"Source: CV" and "Source: previous portfolio" labels** are no longer rendered. Sources stay in the content model, so the build still enforces them. Only public links (Ethica announcement, Bitooqoh homepage) are shown.

### Still open
- **"5,000+ active users" on Ethcore:** not published.
- **Ethcore replica concepts:** for Phase 4.

## Privacy measures
- `productionBrowserSourceMaps: false` in `next.config.ts`. The build is checked to contain no `.map` files.
- The seam shows component names and feature layers only: no file paths, no repository URLs, no commit data.
- Client bundles were grepped for local paths, repository names and environment values. The only personal string is the public email address.
- No environment variables are used.

## What the seam measures
| Reading | How |
|---|---|
| Server vs client | Client components register from a layout effect, so registration is proof of hydration. Server regions carry only `data-specimen` attributes. |
| Commits | A layout effect with no dependency list counts every commit. No profiling build is needed. |
| Live state | A small, explicitly chosen value per client specimen (e.g. `{ role }`). Never whole props. |
| Role, accessible name | `dom-accessibility-api` (lazy-loaded with the seam). |
| Tab stops | Tabbable query in DOM order. A radio group counts as one stop. |
| Contrast | Computed text colour vs nearest opaque background (WCAG 2 formula). |
| Typography, box, DOM nodes | `getComputedStyle`, `getBoundingClientRect`, `getElementsByTagName`. |
| JS transferred | `PerformanceResourceTiming` (cached files show 0 KB; the panel says so). |
| Web Vitals | `useReportWebVitals`, in memory only, never sent anywhere. |
| Not shown | Render duration (needs React's profiling build, which is deliberately off). |

## Test results (production build, local)
- `yarn build`: passes, all 24 routes static. `yarn lint`: clean. Strict TypeScript.
- axe-core (WCAG 2.2 AA + best practice): **0 violations** on all 9 routes, at 1440 px and 390 px, including the FIRS page with the seam and panel open.
- Lighthouse, mobile emulation (simulated slow 4G): accessibility 100, best practices 100, SEO 100 on all pages tested. Performance 87–91. CLS 0. TBT ≤ 40 ms. LCP 3.5–3.9 s.
- No horizontal overflow at 390 px on any route.
- Reduced motion: no intro, the Descent is an instant route change, and focus moves to the new heading.
- Keyboard: skip link first; the rail, seam (slider) and specimens button can all be reached; radio groups use arrow keys; `S`, `Shift+S`, `[`, `]` and `Esc` work, and are ignored inside text fields.
- Legacy routes redirect (e.g. `/tax` → `/work/firs`). The résumé serves as `application/pdf`.

## Known gaps
- Lighthouse performance is below the 95 target. The remaining LCP cost is font and framework bytes on simulated slow 4G. Next step: subset Anybody to the glyphs actually used in display type.
- Fonts use `display: optional` to keep CLS at 0. On a very slow first visit the fallback faces show for that page view.
- The Back button after a Descent is a normal navigation; the reverse animation (Ascent) runs only from the in-page "Ascend" link.
- No Open Graph images yet.

## Design review pass (10 Oct 2026)
Built: the faulted name (arrival), the core tray (featured work, data-encoded), the scan band (seam at rest, desktop), and the strip log (Index signals).
Built after the pass: the depth gauge. Every plate's left column is now a stratigraphic column: the stratum's lithology strip (none for S0 and 404) and a depth scale with a tick every 20 px and a major tick every 100 px, aligned to the document. The head (code, label, links) rides down the column, its top rule is the needle, and on desktop it shows the needle's real depth in CSS pixels. `DepthGauges` (one client component in the layout) writes the readings once per frame, only for gauges on screen. Below 861 px the gauge falls back to the old inline row.
Built after the pass: scroll-linked heading compression (`Pressed`). A heading's lines are read from the browser at natural width, then fixed as unbreakable lines; only then does pressure apply, so the heading's box never changes (CLS 0 measured while scrolling every route). Pressure runs from 0 at 35% of the viewport (or the heading's load position, if higher) to 1 as it leaves the top; it narrows wdth by up to 44, never below 58. Lines are re-read when the heading's width changes. Off under reduced motion. A heading whose word would break mid-word is never locked or compressed.
Fixed alongside: case-study titles broke mid-word on desktop ("Managemen/t", also Super International Travels and Address Verification SDK at 900 px). Titles are now sized from the content column (container units) so the longest word fits whole.
Fixed alongside: the scan band's second reading shifted sideways as the first changed length (small CLS while scrolling). Both readings now have fixed slots. The latter needs fixed line breaks per heading to avoid layout shift.
Checks after the pass: axe 0 violations on all routes at both widths. Lighthouse mobile: / perf 88, /work perf 90, CLS 0.

## Signature interaction: Fault lines (10 Oct 2026)
Route: `/lab/fault-lines` (S5.01). Teaser on the Index, after the core tray. Code: `features/lab/fault-lines/`.

**Mechanisms considered**
1. *Fault lines* (chosen): requirements compiled into the FIRS role rules under two architectures; disagreements between the three lists shown as geological faults across four role cores.
2. *Interaction core*: each click drilled into a core of measured phases (Event Timing input delay, processing, presentation; commits; DOM mutations). Rejected: Event Timing is not in Safari, real interactions here take a few ms so the cores would be thin and noisy, and making them thicker means inventing load.
3. *Sealed outcomes*: the Address Verification SDK's 13-state machine driven by perturbed conditions, with an exhaustive host handler. Rejected for now: confidential client work, and the state names and transitions would need Aqib's sign-off before publishing.

**What is verified vs counterfactual**
- Baseline rules are the replica's verified tables (`features/firs-replica/model.ts`). Under them, both compilers produce identical output and zero faults (checked).
- "Three lists" is the shipped shape. "One source" is labelled on the page as my counterfactual, not what shipped.
- No claim is made about FIRS route guards or API scoping.

**How it works**
- State is an append-only requirement log plus a cursor; undo, redo, rewind and the `#fl=` link are positions in it. Switching architecture recompiles the same log.
- The compiler keeps the identity of unchanged role views (structural sharing); each core subscribes to its own role, and commits are counted from layout effects.
- Each core's audit (tab stops, announced current page, coverage options) is measured from its rendered surface after each commit. Surfaces are `inert`; each core has a text summary, and the Table view is a plain-HTML alternative over the same store.
- Keyboard: one tab stop for the whole rule grid (roving tabindex moved imperatively, so focus never re-renders a core); arrows, Page Up/Down between beds, Home/End, Space/Enter; `A` switches architecture; Ctrl/⌘ Z and Shift+Ctrl/⌘ Z undo and redo while focus is inside the experiment.

**Checks**: typecheck, lint and build pass. axe (WCAG 2.2 AA + best practice): 0 violations on `/`, `/lab`, both experiments, both views, faulted and derived link states, at 1440 and 390 px. No horizontal overflow at 390 px.

## Journey, Mind and navigation fixes (10 Oct 2026)
- **Confirmed by Aqib:** Bitooqoh 2024 to present; Muslim Tech Expo 2024 to present (voluntary); Super International Travels from June 2025 (end recorded as "present", to confirm); all six FIRS decision trade-offs confirmed as his reasoning. Unrecorded "alternatives" and separate "why" rows are now left out rather than marked.
- **Journey** (`/journey`): career core to scale, Jan 2022 to Oct 2026. Payvantage roles are beds, client work and the FIRS contract are dikes, and milestones are lines. Year-only dates are drawn soft across the year. Nothing before April 2022 is shown (no source yet). Ethica Pass, the Address SDK and Ethica Mobile are listed under Payvantage without dates.
- **Mind** (`/mind`): nine concern layers, six FIRS decision cores drilled through the layers they crossed; filter by concern, plus a plain list of every decision.
- **Rail bug:** lithology SVGs fell back to their default 150 px height, so each rail item was ~150 px and Lab and Connect sat below the screen on desktop. Swatches are now absolutely positioned and the rail scrolls if a window is very short.
- **Bottom bar** (below 900 px, phones and iPad portrait) now starts with an AQ/OS home link.
- axe: 0 violations on `/`, `/journey`, `/mind`, case studies and the Lab, at 1440 and 390 px.

## Titles and Journey revisions (10 Oct 2026, from Aqib)
- "Senior" removed from the whole site (meta description, manifest, arrival, statement, site title, Ethcore and FIRS roles, Journey). Titles now: Junior Frontend Engineer, Payvantage, Apr 2022 – 2023; Mid-Level Frontend Engineer, 2024 – present; FIRS: Frontend Engineer (contract).
- Degree added to Journey from the résumé: B.Eng Agricultural and Bio-Resources Engineering, Federal University of Agriculture, Abeokuta, 2021. The core now starts in 2021.
- Super's organisation is "Super International Travels Limited"; Bitooqoh's is "Bitooqoh".
- Not changed: `public/aqib-akinyele-resume.pdf` still says Senior Frontend Engineer and "5000+ active users". It needs replacing by Aqib.
- Later the same day: level titles dropped too. The site uses "Frontend Engineer" (Payvantage, Apr 2022 – present) as one Journey bed.
