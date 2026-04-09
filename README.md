# React Exercise App

A personal showcase project exploring React patterns, architectural decisions, and modern tooling. Each feature is built with a specific set of concepts in mind and documented to explain the reasoning behind every choice.

## Stack

- **React 19** + **TypeScript 5** — core
- **Vite 6** — build tool and dev server
- **react-hook-form** — uncontrolled form management
- **Vitest** + **Testing Library** — unit and component testing
- **ESLint 9** — flat config with typescript-eslint, react-hooks, react-refresh

## Commands

```bash
npm run dev      # dev server
npm run build    # production build (tsc -b + vite build)
npm run lint     # lint
npm test         # tests in watch mode
npm run test:run # tests once (CI)
```

---

## Features & Concepts

### Notes App

The main feature running through the entire project. A note manager used as a real-world canvas to demonstrate different React patterns incrementally.

---

#### Step 1 — State management foundation
**Concepts:** `useReducer`, Context API, custom hooks, `localStorage` persistence

**Files:** `src/features/notes/`, `src/hooks/useLocalStorage.ts`

The notes state is managed with `useReducer` and a discriminated union of actions (`ADD`, `DELETE`, `UPDATE`). The reducer is a pure function with no side effects — easy to test in isolation. State is shared across the component tree via Context, exposed through a `NotesProvider` + `useNotes` hook pair. An `exhaustiveness check` (`action satisfies never`) on the reducer's default case ensures every action type is handled at compile time.

Persistence is handled by `useLocalStorage`, a generic hook that mirrors the `useState` API but syncs to `localStorage`. It uses a lazy initializer so the read happens once at mount, and `useCallback` to keep the setter reference stable.

The Context exposes a high-level API (`addNote`, `deleteNote`, `updateNote`) instead of raw `dispatch`, keeping action shapes as an internal implementation detail.

**Key patterns:**
- Discriminated union for type-safe action dispatch
- Reducer exhaustiveness check via `satisfies never`
- Lazy state initialization from external storage
- Context split into three files: context object, Provider, consumer hook (required by react-refresh)
- Domain wrapper (`NoteForm`) around a generic UI component (`Form`)

---

## Generic Components

### Form

**File:** `src/components/form.tsx`, `src/components/form.constraints.ts`

A fully generic, domain-agnostic form component built on `react-hook-form`. It accepts a declarative field configuration with typed constraints and delegates semantics to the caller via `onSubmit`.

```ts
<Form
  fields={{
    title: { label: 'Title', required: true, constraints: [{ code: Constraints.TOO_SHORT, args: [3] }] },
    content: { label: 'Content', required: true },
  }}
  onSubmit={(data) => console.log(data)}
/>
```

Inputs are uncontrolled (ref-based via `react-hook-form`) — no re-render on every keystroke. Validation runs on blur. The constraint system is defined separately in `form.constraints.ts` and is independently testable.

---

## Roadmap

| Step | Status | Concepts |
|------|--------|----------|
| 1 — State foundation | ✅ Done | `useReducer`, Context API, `useLocalStorage`, custom hooks |
| 2 — Search & debounce | 🔜 Next | `useDebounce`, derived state, controlled inputs |
| 3 — Compound components | ⬜ Planned | Compound component pattern, implicit context sharing |
| 4 — Performance | ⬜ Planned | `React.memo`, `useCallback`, `useMemo`, when *not* to use them |
| 5 — Data fetching | ⬜ Planned | TanStack Query, query invalidation, loading/error states |
| 6 — Code splitting | ⬜ Planned | `React.lazy`, `Suspense`, dynamic imports |
