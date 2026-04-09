/**
 * notesReducer
 *
 * Pure function: (state, action) => newState.
 * No side effects, no external dependencies — easy to test in isolation
 * by passing plain arrays and objects.
 *
 * Why useReducer instead of multiple useState calls?
 * - State transitions are explicit and named (ADD, DELETE, UPDATE):
 *   reading the actions tells you everything that can happen to the state
 *   without hunting for setX calls scattered across components.
 * - All mutation logic lives in one place.
 * - dispatch is referentially stable (React guarantees this, like setState):
 *   passing it via Context does not cause re-renders in consumers.
 * - Scales naturally: adding a new action means adding a case here,
 *   not modifying multiple components.
 */
import type { Note, NotesAction } from './types';

export function notesReducer(state: Note[], action: NotesAction): Note[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];

    case 'DELETE':
      return state.filter((note) => note.id !== action.payload.id);

    case 'UPDATE':
      return state.map((note) =>
        note.id === action.payload.id
          ? {
              ...note,
              title: action.payload.title,
              content: action.payload.content,
              updatedAt: new Date().toISOString(),
            }
          : note
      );

    default:
      // Exhaustiveness check: if a new type is added to NotesAction
      // without handling it here, TypeScript will produce a compile error.
      action satisfies never;
      return state;
  }
}
