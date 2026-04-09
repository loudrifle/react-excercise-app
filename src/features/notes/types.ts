export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Discriminated union of actions.
 * Each branch has a unique literal type: TypeScript can narrow the type of
 * `action` inside each switch case without manual casts.
 */
export type NotesAction =
  | { type: 'ADD'; payload: Note }
  | { type: 'DELETE'; payload: { id: string } }
  | { type: 'UPDATE'; payload: { id: string; title: string; content: string } };
