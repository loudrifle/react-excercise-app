# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at localhost:3000
npm test           # Run tests in watch mode
npm test -- --watchAll=false  # Run tests once (CI mode)
npm test -- -t "test name"    # Run a single test by name
npm run build      # Production build
```

## Architecture

This is a Create React App project (TypeScript) — a personal exercise app for learning React patterns, currently implementing a notes manager.

**Entry point:** `src/index.tsx` → `src/App.tsx`

**`src/App.tsx`** — Root component. Holds `notes[]` state and an `isCreating` toggle. When creating, renders the `Form` component configured with field descriptors. Notes are displayed in a table with delete functionality. The old inline `<form>` is commented out, replaced by the generic `Form`.

**`src/components/form.tsx`** — Generic form component driven by a `fields` config object. Uses `react-hook-form` in `onBlur` mode. Each field accepts an array of `InputConstraint` objects (`TOO_SHORT`, `NOT_UNIQUE`). Validation runs via `validateField` → `runConstraint`, which maps constraint codes to typed validator functions in `constraintsMessages`.

**`src/components/note/note.ts`** — Stub `Note` component (not yet implemented).

**`src/page.tsx`** — Standalone experimental page with a different hand-rolled validation approach (`raiseError`/`clearError` with a `FieldErrors` ref). Not wired into routing — exists as an exercise reference.

## Key patterns

- The `Form` component is configured declaratively: callers pass a `fields` map where each entry defines `label`, `required`, and `constraints`. Extending validation means adding a new `Constraints` enum value, a matching `ConstraintsArgs` entry, and a handler in `constraintsMessages`.
- `page.tsx` uses `useRef<FieldErrors>` for live validation state (no re-render on change) and `useState<FieldErrors>` only for display on submit — a deliberate performance pattern worth preserving if that file evolves.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
