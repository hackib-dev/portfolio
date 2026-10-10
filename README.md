# AQ/OS · Aqib Akinyele

The portfolio of Aqib Akinyele, Frontend Engineer at Payvantage. Live at [aqibakinyele.com](https://www.aqibakinyele.com).

The site is built as a geological cross-section. Its finished, editorial surface is **vellum**. Underneath is **film**, the engineering of the site itself, which visitors can open and inspect. Every section is a stratum (layer), numbered by depth.

| Code | Route | Section | Holds |
|---|---|---|---|
| S0 | `/` | Surface | Arrival, statement, featured work, signals, contact |
| S1 | `/work`, `/work/[slug]` | Work | Eight case studies |
| S2 | `/signals` | Signals | Evidence of impact, each with its source |
| S3 | `/journey` | Journey | Career core, drawn to scale |
| S4 | `/mind` | Mind | Engineering decisions, cut through the concerns they touched |
| S5 | `/lab`, `/lab/[experiment]` | Lab | Working frontend experiments |
| S6 | `/connect` | Connect | Email, phone, GitHub, LinkedIn, résumé |

Codes nest. `S1.01` is the first case study and `S5.01` the first experiment. Codes for parts of a page (such as `S1.01.3` or `S6.1`) still exist in the source, where they pick the plate's pattern, but `PlateMeta` doesn't display them. The homepage explains the numbering in one line under "Reading the codes".

## Getting started

Requires Node 24 and **yarn**. `package.json` pins `engines.node` to `24.x`, which Vercel uses for builds.

```bash
yarn install
yarn dev         # http://localhost:3000
```

| Script | Does |
|---|---|
| `yarn dev` | Development server |
| `yarn build` | Production build. Every route is statically generated |
| `yarn start` | Serves the production build |
| `yarn lint` | ESLint |
| `yarn typecheck` | TypeScript, strict, no emit |

No environment variables are needed. Vercel Analytics loads only when deployed on Vercel.

## Stack

- Next.js 16 (App Router), React 19, TypeScript (strict)
- Tailwind CSS 4, with design tokens in `app/globals.css`
- Zustand for client state
- `dom-accessibility-api` for accessible names in the seam (lazy-loaded)
- Fonts: Anybody (display, variable width axis), Newsreader (reading), Martian Mono (labels and data)

Server Components by default. Client code is limited to interactive islands: the shell, the seam, replicas, the Journey core, the Mind section and the Lab.

## Project structure

```
app/                 Routes, root layout, global styles, sitemap, robots, manifest
components/          Server primitives: Specimen, PlateHeader (depth gauge), Lithology, SourceTag
config/site.ts       Name, title, URL and contact channels
content/             All copy and facts, typed
  projects/          Case studies and decision records
  signals.ts         Evidence strip and Signals page
  journey.ts         Career entries for Journey
  experiments.ts     Lab experiment copy
  strata.ts          The six sections, their codes and patterns
  types.ts           The content model, including Source
features/
  arrival/           The faulted name on the homepage
  shell/             Section rail, phone bottom bar, depth gauges, heading compression (Pressed)
  seam/              The seam, specimen registry and panel, Web Vitals recorder
  descent/           The animated transition from a case study into the Lab
  case-study/        Case study template
  firs-replica/      Conceptual replica of the FIRS role rules
  journey/           Career core
  mind/              Decision cross-section
  lab/               state-propagation and fault-lines experiments
  index/, connect/   Homepage core tray, contact composer and links
lib/                 Small shared helpers
assets/              Screenshots used by case studies
public/              Favicon, résumé PDF
docs/aqos/           Build notes, open questions and test results
```

## Content rules

All facts live in `content/`. Components only render them.

- **Every claim has a source.** Outcomes, roles, periods and decisions carry a `Source` (`cv`, `aqib`, `live-site`, `public`, `code-review`, `screenshots`). An unsourced claim is a type error, so the build fails on it.
- **Only public sources are shown as links.** Other sources stay in the content model and are not rendered.
- **Signals need `publish: true`** to appear. Figures not cleared for publication are left out, not rounded.
- **Confidential work stays at product level.** Payvantage projects have no screenshots, code or architecture. Replicas are labelled "Conceptual replica · synthetic data · not production code".
- **Leave a section out rather than pad it.** Case study sections without verified material are not rendered.

### Adding content

- **A project:** add a `Project` to a file in `content/projects/` and include it in `featured` in `content/projects/index.ts`. The route, homepage tray, sitemap and navigation follow automatically.
- **A decision:** add a `DecisionRecord` and list its id on the project's `decisions`. It appears in the case study and in Mind.
- **A signal:** add it to `content/signals.ts` with `publish: true`.
- **A Journey entry:** add it to `content/journey.ts`. A year without a month (`"2024"`) is drawn with a soft edge across that year.
- **An experiment:** add copy to `content/experiments.ts` and render its component in `app/lab/[experiment]/page.tsx`.
- **Contact details:** edit `config/site.ts`. A channel set to `null` is not rendered.

## Signature features

- **The seam.** Drag the handle (or press `S`) to see the page as film. Outlines show which regions are server-rendered and which are client components, with commit counts, accessible names, contrast and typography. `Shift+S` opens the Specimens panel, the same readings as a list. Everything the seam shows is measured in the browser. Nothing is estimated.
- **Decision switch.** The FIRS case study has a replica of the real role rules. Switching roles reshapes the interface, and a ledger lists what changed.
- **The descent.** From a case study, "Descend to the Lab" opens the related experiment with the state you just set.
- **Fault lines** (`/lab/fault-lines`). State a product requirement and watch it run through the FIRS role rules. Where the rules stop agreeing, they visibly fault. The same requirements can be recompiled under a second architecture to compare the trade-off. It has keyboard navigation, a plain table view, shareable links and undo.
- **Journey and Mind.** The career as a core drawn to scale, and decisions as cores drilled through the concerns they touched.

## Keyboard

| Key | Action |
|---|---|
| `S` | Open or close the seam |
| `Shift+S` | Specimens panel |
| `[` and `]` | Previous and next section |
| `Esc` | Close the panel or seam |
| `A` | In Fault lines: switch architecture |
| `Ctrl/⌘ Z`, `Shift+Ctrl/⌘ Z` | In Fault lines: undo, redo |

Single-key shortcuts are ignored while typing in a text field.

## Accessibility and quality

- Target: WCAG 2.2 AA. axe-core reports 0 violations on every route, at 1440 px and 390 px.
- No horizontal scroll at 390 px.
- Reduced motion: no intro, transitions cut, focus moves to the new heading after a descent.
- Every interactive visual has a text or table equivalent.
- Fonts use `display: optional` to keep layout shift at zero.

Before shipping, run `yarn typecheck`, `yarn lint` and `yarn build`.

## Privacy

The repository is private.

- `productionBrowserSourceMaps` is off. Builds must contain no `.map` files.
- The seam shows component names and feature areas only, never file paths, repository URLs or commit data.
- No environment variables or secrets are used.

## Deployment

Deployed on Vercel. Old routes from the previous site (`/tax`, `/bitooqoh`, `/super`, `/mte` and others) redirect permanently to their new pages, as set in `next.config.ts`. Security headers are set there too.
