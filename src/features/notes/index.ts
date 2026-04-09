// Barrel export: single entry point for the notes module.
// Consumers import from 'features/notes' without knowing the internal structure.
export { NotesProvider } from './NotesProvider';
export { useNotes } from './useNotes';
export { NoteForm } from './NoteForm';
export type { Note } from './types';
