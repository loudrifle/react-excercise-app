/**
 * Context definition and its value type.
 * Kept in a separate non-JSX file because it contains no components:
 * - The context object is shared between the Provider (NotesProvider.tsx)
 *   and the consumer hook (useNotes.ts).
 * - Isolating it avoids circular dependencies and satisfies react-refresh,
 *   which requires each file to export only components or only non-components.
 */
import { createContext } from 'react';

export interface NotesContextValue {
  notes: import('./types').Note[];
  addNote: (title: string, content: string) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
}

export const NotesContext = createContext<NotesContextValue | null>(null);
