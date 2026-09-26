# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Stack

React 19 + TypeScript + Vite 8, styled with **Tailwind CSS v4** (loaded via `@tailwindcss/vite` plugin — no `tailwind.config.*` file; config is in-CSS or inline). Flow diagrams use **`@xyflow/react`** v12.

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` (`tsc -b && vite build`) |
| Lint | `npm run lint` |
| Preview prod build | `npm run preview` |

**No test framework is configured.** There are no test scripts or test files.

## Critical TypeScript Config

- `verbatimModuleSyntax: true` — **must use `import type` for type-only imports**, or the build will fail.
- `erasableSyntaxOnly: true` — no `const enum`, no legacy TS-only syntax.
- `noUnusedLocals` + `noUnusedParameters` are enforced — unused variables are build errors, not just warnings.
- `allowImportingTsExtensions: true` — import `.tsx` files with their extension (e.g. `import App from './App.tsx'`).

## Styling Convention

- Tailwind v4 is **not** configured via `tailwind.config.js`; it's imported directly as `@import "tailwindcss"` in [`src/index.css`](src/index.css).
- `@xyflow/react` styles are imported globally in `index.css`: `@import "@xyflow/react/dist/style.css"`. Do not re-import per component.
- Dark-first design: base palette is `slate-950`/`slate-900` backgrounds, `slate-100` text, `indigo-*` accents.

## Architecture

- Single-page app; all logic currently lives in [`src/App.tsx`](src/App.tsx).
- The canvas area is a placeholder (`@xyflow/react` is installed and ready but not yet wired up).
- Entry: [`src/main.tsx`](src/main.tsx) → `<App />` wrapped in `<StrictMode>`.
