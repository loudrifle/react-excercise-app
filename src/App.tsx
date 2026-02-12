import { Fragment, useState } from "react";
import "./App.css";
import { Constraints, Form } from "./components/form";

interface Note {
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const deleteNote = (title: string) => {
    setNotes((prevState) => prevState.filter((item) => item.title !== title));
  };

  return (
    <Fragment>
      <div>
        <button
          disabled={isCreating}
          onClick={() => {
            setIsCreating((value) => !value);
          }}
        >
          Add a new note
        </button>
        {isCreating && (
          <button
            onClick={() => {
              setIsCreating(false);
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {isCreating && (
        <Form
          fields={{
            Title: {
              label: "Title",
              required: true,
              constraints: [
                { code: Constraints.TOO_SHORT, args: [6] },
                { code: Constraints.NOT_UNIQUE },
              ],
            },
            Description: {
              label: "Description",
              required: true,
              constraints: [{ code: Constraints.TOO_SHORT, args: [10] }],
            },
            Password: {
              label: "Password",
              required: true,
              constraints: [{ code: Constraints.TOO_SHORT, args: [10] }],
            },
          }}
        />
        /*         <form
          onSubmit={(ev) => {
            ev.preventDefault();

            const data = Object.fromEntries(
              new FormData(ev.currentTarget).entries()
            ) as { noteTitle: string; noteContent: string };

            setNotes((prevState) => [
              ...prevState,
              {
                title: data.noteTitle,
                content: data.noteContent,
                createdAt: new Date().toISOString(),
                updatedAt: null,
              },
            ]);

            setIsCreating(false);
          }}
        >
          <label htmlFor="noteTitle" style={{ display: "block" }}>
            Title
          </label>
          <input type="text" id="noteTitle" name="noteTitle" />
          <label style={{ display: "block" }} htmlFor="noteContent">
            Content
          </label>
          <input type="text" id="noteContent" name="noteContent" />
          <button
            type="submit"
            style={{ cursor: "pointer", marginLeft: 10 }}
                        onClick={() => {
         
            }}
          >
            Save
          </button>
        </form> */
      )}

      {!!notes.length && (
        <div className="App">
          <table>
            <thead>
              <tr>
                <th>Titolo</th>
                <th>Created at</th>
                <th>Updated at</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note.title}>
                  <td>{note.title}</td>
                  <td>{note.createdAt}</td>
                  <td>{note.updatedAt}</td>
                  <td>
                    <button>View</button>
                    <button>Modify</button>
                    <button onClick={() => deleteNote(note.title)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Fragment>
  );
}

export default App;
