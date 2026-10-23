import { useState, type SubmitEvent } from "react";
import type { Note } from "../types/note";

interface Props {
  error: string | null;
  onSubmit: (data: Omit<Note, "id">) => Promise<void>;
}

function NoteForm({ error, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    setIsSubmitting(true);
    e.preventDefault();
    if (!title.trim()) return;
    await onSubmit({ title, content });
    setTitle("");
    setContent("");
    setIsSubmitting(false);
  }

  return (
    <div className="note-form__container">
      <h2 className="note-form__header">Add Note</h2>
      <form className="note-form" onSubmit={handleSubmit}>
        <input
          className="note-form__input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="note-form__textarea"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button
          disabled={isSubmitting}
          className="btn btn__primary"
          type="submit"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
        {error && <p className="note-form__error">{error}</p>}
      </form>
    </div>
  );
}

export default NoteForm;
