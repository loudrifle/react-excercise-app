/**
 * NotesProvider
 *
 * Combines three patterns:
 *
 * 1. useReducer — manages complex state transitions via explicit, named actions.
 * 2. Context API — makes state available anywhere in the tree without prop drilling.
 * 3. useLocalStorage — persists state across page reloads.
 *
 * Architectural decision: the Context exposes a high-level API (addNote, deleteNote,
 * updateNote) rather than raw dispatch. Consumers do not need to know the shape of
 * NotesAction — that is an implementation detail of this module. If the reducer
 * changes internally, consumers are unaffected.
 *
 * Alternative considered: expose dispatch directly.
 * Rejected: it couples consumers to the internal action structure.
 */
import { useCallback, useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';
import { NotesContext } from './NotesContext';
import { notesReducer } from './notesReducer';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { Note } from './types';

export function NotesProvider({ children }: { children: ReactNode }) {
  const [storedNotes, setStoredNotes] = useLocalStorage<Note[]>('notes', []);

  // Initialize the reducer from localStorage so the UI is correct on the
  // very first render — no flash of empty state.
  const [notes, dispatch] = useReducer(notesReducer, storedNotes);

  // Sync reducer state back to localStorage after every change.
  // useEffect runs after the render, so the UI always reflects the latest
  // state before persistence occurs (non-blocking).
  useEffect(() => {
    setStoredNotes(notes);
  }, [notes, setStoredNotes]);

  // [] dependency array is intentional: dispatch is referentially stable by
  // React's guarantee (same as setState), so these callbacks never change.
  // This prevents unnecessary re-renders in consumers that receive them as props.
  const addNote = useCallback((title: string, content: string) => {
    dispatch({
      type: 'ADD',
      payload: {
        // crypto.randomUUID() is natively available in modern browsers and Node 18+.
        // No external library needed for IDs.
        id: crypto.randomUUID(),
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      },
    });
  }, []);

  const deleteNote = useCallback((id: string) => {
    dispatch({ type: 'DELETE', payload: { id } });
  }, []);

  const updateNote = useCallback((id: string, title: string, content: string) => {
    dispatch({ type: 'UPDATE', payload: { id, title, content } });
  }, []);

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote, updateNote }}>
      {children}
    </NotesContext.Provider>
  );
}
