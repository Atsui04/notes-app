import { useState } from "react";
import type { Note } from "../types/note";

interface Props {
  note: Note;
  onEdit: (id: string, data: Omit<Note, "id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function NoteItem({ note, onEdit, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setError("");
    setIsSaving(true);
    try {
      await onEdit(note.id, { title, content });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save a note");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setTitle(note.title);
    setContent(note.content);
    setError("");
    setIsEditing(false);
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await onDelete(note.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete a note");
    } finally {
      setIsDeleting(false);
    }
  }

  if (isEditing) {
    return (
      <li className="note-item">
        <input
          className="note-item__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
        />
        <textarea
          className="note-item__textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="note-item__actions">
          <button
            disabled={isSaving}
            className="btn btn__save"
            onClick={handleSave}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button className="btn btn__cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
        {error && <p className="note-item__error">{error}</p>}
      </li>
    );
  }

  return (
    <li className="note-item">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <div className="note-item__actions">
        <button className="btn btn__edit" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button
          className="btn btn__delete"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
      {error && <p className="note-item__error">{error}</p>}
    </li>
  );
}

export default NoteItem;
