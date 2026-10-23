import type { Note } from "../types/note";
import NoteItem from "./NoteItem";

interface Props {
  notes: Note[];
  onEdit: (id: string, data: Omit<Note, "id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function NoteList({ notes, onEdit, onDelete }: Props) {
  return (
    <div className="note-list__container">
      <h2 className="note-list__header">Note List</h2>
      {notes.length > 0 ? (
        <ul className="note-list">
          {notes.map((n) => (
            <NoteItem key={n.id} note={n} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </ul>
      ) : (
        <h3 className="note-list__empty">You have no notes</h3>
      )}
    </div>
  );
}

export default NoteList;
