import { useNotes } from "./hooks/useNotes";
import NoteList from "./components/NoteList";
import { useState } from "react";
import NoteForm from "./components/NoteForm";
import type { Note, Mode } from "./types/note";

function App() {
  const { notes, error, isLoading, addNote, editNote, removeNote } = useNotes();
  const [mode, setMode] = useState<Mode>("notes");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleAdd(data: Omit<Note, "id">) {
    try {
      await addNote(data);
      setMode("notes");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to create a note",
      );
    }
  }

  function toggleForm() {
    setFormError(null);
    setMode((prev) => (prev === "form" ? "notes" : "form"));
  }

  if (isLoading) {
    return <p>Loading notes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <header className="container">
        <h1>Notes App</h1>
        <button
          className={`btn ${mode === "form" ? "btn__cancel" : "btn__primary"}`}
          onClick={toggleForm}
        >
          {mode === "form" ? "Cancel" : "Add Note +"}
        </button>
      </header>

      <main className="container">
        {mode === "form" && (
          <>
            <NoteForm error={formError} onSubmit={handleAdd} />
          </>
        )}
        {mode === "notes" && (
          <NoteList notes={notes} onEdit={editNote} onDelete={removeNote} />
        )}
      </main>
    </div>
  );
}

export default App;
