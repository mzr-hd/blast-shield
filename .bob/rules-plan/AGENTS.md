# Project Architecture Rules (Non-Obvious Only)

- All app logic is in a single `src/App.tsx` — there is no component directory, routing, or state management layer yet.
- `@xyflow/react` is installed and the canvas placeholder is in `App.tsx`, but no nodes/edges/state exist — the flow integration is the primary pending feature.
- Tailwind v4's Vite plugin (`@tailwindcss/vite`) handles CSS compilation at build time — no PostCSS config is needed or present.
- Build uses `tsc -b` (project references mode) with two tsconfigs: `tsconfig.app.json` (src) and `tsconfig.node.json` (vite config) — changes to compiler options must be reflected in the correct file.
- No backend, no API layer, no routing library is present — this is a pure frontend SPA.
