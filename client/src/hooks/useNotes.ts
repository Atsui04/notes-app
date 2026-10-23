import { useEffect, useState } from "react";
import type { Note } from "../types/note";
import { createNote, deleteNote, getNotes, updateNote } from "../api/notes";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNotes() {
      try {
        setIsLoading(true);
        const data = await getNotes();
        setNotes(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotes();
  }, []);

  async function addNote(data: Omit<Note, "id">) {
    const newNote = await createNote(data);
    setNotes((prev) => [...prev, newNote]);
  }

  async function editNote(id: string, data: Omit<Note, "id">) {
    const updated = await updateNote(id, data);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
  }

  async function removeNote(id: string) {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return { notes, error, isLoading, addNote, editNote, removeNote };
}
