# Project Coding Rules (Non-Obvious Only)

- `verbatimModuleSyntax` is enabled — use `import type { Foo }` for type-only imports or `tsc -b` will fail at build time.
- `noUnusedLocals`/`noUnusedParameters` are compile errors, not warnings — do not leave unused variables even in WIP code.
- Import `.tsx` files with their full extension: `import App from './App.tsx'` (required by `allowImportingTsExtensions`).
- Tailwind v4: no config file — all customisation goes in CSS using `@theme` / `@layer` inside `src/index.css`, not a separate config file.
- `@xyflow/react` CSS must only be imported once (already in `src/index.css`); do not import it inside individual components.
- The React Flow canvas area in `App.tsx` is an intentional placeholder — `@xyflow/react` is installed and ready to wire up.
