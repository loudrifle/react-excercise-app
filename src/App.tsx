/**
 * App
 *
 * Root component: renders the Provider and the main UI.
 *
 * Why is NotesApp separate from App?
 * A component cannot consume a Context that it renders itself:
 * the Provider must be an ancestor in the tree, not the same node.
 * App renders the Provider; NotesApp (child) consumes it via useNotes.
 */
import { useState } from 'react';
import './App.css';
import { NotesProvider, useNotes, NoteForm } from './features/notes';
import type { Note } from './features/notes';

function NotesList() {
  const { notes, deleteNote } = useNotes();

  if (!notes.length) {
    return <p>No notes yet. Add one!</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Created at</th>
          <th>Updated at</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {notes.map((note: Note) => (
          <tr key={note.id}>
            <td>{note.title}</td>
            <td>{new Date(note.createdAt).toLocaleString('en-GB')}</td>
            <td>
              {note.updatedAt
                ? new Date(note.updatedAt).toLocaleString('en-GB')
                : '—'}
            </td>
            <td>
              <button onClick={() => deleteNote(note.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function NotesApp() {
  const [isCreating, setIsCreating] = useState(false);
  const { addNote } = useNotes();

  return (
    <div>
      <h1>Notes</h1>

      <button disabled={isCreating} onClick={() => setIsCreating(true)}>
        Add note
      </button>

      {isCreating && (
        <NoteForm
          onSubmit={(title, content) => {
            addNote(title, content);
            setIsCreating(false);
          }}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <NotesList />
    </div>
  );
}

function App() {
  return (
    <NotesProvider>
      <NotesApp />
    </NotesProvider>
  );
}

export default App;
