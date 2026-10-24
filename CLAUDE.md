# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for the fundación "Nueve Lunas" (mental/physical health). Single page, Spanish copy, heavy scroll animation. Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui (`base-nova` style, `@base-ui/react`). Work happens on branch `santiago`; the remote has no `main`.

## Commands

Node 22 (README says 20+). On this machine Node is not global: it lives in `.tools/` (git-ignored via `.git/info/exclude`, installed with fnm). Prepend it to PATH first:

```powershell
$env:PATH = "$PWD\.tools\fnm-data\node-versions\v22.23.4\installation;" + $env:PATH
```

```bash
npm install
npm run dev            # http://localhost:3000 (use `-- -p 3002` if busy)
npm run build          # production build; also type-checks
npx tsc --noEmit       # type check
npx eslint src         # lint (`npm run lint` runs plain `eslint`)
```

There is no test suite.

## Architecture

- **Next.js is non-standard here.** `next.config.ts` enables `cacheComponents` and `partialPrefetching`, and the version has breaking changes: read the matching guide in `node_modules/next/dist/docs/` before writing Next-specific code. `agentRules: false` stops `next dev` from regenerating `AGENTS.md`; do not recreate it. Tailwind CSS is wired through a Turbopack rule (`@tailwindcss/turbopack`) in `next.config.ts`.
- **One scroll card for every route.** `src/app/layout.tsx` wraps all pages in `<SiteFrame>` (fixed, rounded card; scrolling happens *inside* it, not on `window`), which also renders `<Nav>` and `<Footer>`. Pages only render their own content. `src/app/page.tsx` is the home: the sections from `src/components/site/sections/` in order. `SiteFrame` scrolls back to top on route change.
- **Scrolling contract.** `SiteFrame` creates a Lenis instance on the inner scroller div, drives it from `gsap.ticker`, and forwards `lenis.on("scroll")` to `ScrollTrigger.update`. Any ScrollTrigger in a section must use that div as its `scroller`. Get it (and `scrollTo`) from `useScroller()` in `scroller-context.tsx`. Using the default window scroller will not work.
- **GSAP setup.** Import `gsap`, `ScrollTrigger` and `useGSAP` from `@/lib/gsap` (plugins are registered once there), not from `gsap` directly.
- **Nav** (`nav.tsx`) sits above the scroller and changes its logo/colour depending on the section underneath.
- **Three.js / React Three Fiber / Drei** are installed but not used in `src/` yet.
- Alias `@/*` → `src/*`; shadcn aliases are in `components.json` (`ui` → `@/components/ui`, `cn` helper in `src/lib/utils.ts`).

## Assets

- Hero video: `public/videos/hero.mp4` (replace the file keeping the same name; reduced-motion users get a still photo).
- Photos and logos in `public/images/`; photo credits in `public/images/CREDITS.md`. Header uses a white logo over the photo and a coloured one on light sections.

## Conventions

- Folder, file and identifier names are in English (e.g. `services`, not `servicios`), even though the visible copy is Spanish.
- Each view is its own route under `src/app/` (`services`, `programs`, `contact`), each with a `page.tsx` that renders only its content (frame, Nav and Footer come from the layout).
