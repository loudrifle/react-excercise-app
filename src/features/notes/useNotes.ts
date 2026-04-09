/**
 * useNotes
 *
 * Public hook for consuming the NotesContext.
 * Kept in a dedicated file for two reasons:
 * - react-refresh requires each file to export only components or only non-components.
 *   Provider (component) and useNotes (hook) in separate files respects this rule.
 * - Clarity: consumers of useNotes do not need to know about the Provider.
 *
 * The null check turns a silent failure (undefined everywhere) into a clear
 * error message during development.
 */
import { useContext } from 'react';
import { NotesContext } from './NotesContext';
import type { NotesContextValue } from './NotesContext';

export function useNotes(): NotesContextValue {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used inside a NotesProvider');
  }
  return context;
}
