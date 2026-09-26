# Project Documentation Rules (Non-Obvious Only)

- The `README.md` is the default Vite scaffold README, not project-specific docs — ignore it for architecture questions.
- Tailwind v4 is used (not v3): configuration, theming, and plugin syntax differ significantly from Tailwind v3 docs.
- `@xyflow/react` (not the older `reactflow` package) is installed — use v12 API docs, not older `reactflow` references.
- There is no test framework, no test files, and no test directory — do not suggest running tests.
- `bob_sessions/` directory exists at root (likely IBM Bob session logs) — not part of the app source.
