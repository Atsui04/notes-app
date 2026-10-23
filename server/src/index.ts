import express from "express";
import cors from "cors";
import z from "zod";

const app = express();
app.use(cors());
app.use(express.json());

const noteSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  content: z.string(),
});

type NoteInput = z.infer<typeof noteSchema>;
type Note = NoteInput & { id: string };

let notes: Note[] = [
  { id: "1", title: "First note", content: "First note's text" },
  { id: "2", title: "Buy products", content: "Milk, bread, cheese" },
];

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const note = notes.find((note) => note.id === req.params.id);

  if (!note) {
    return res.status(404).json({ error: "Note wasn't found" });
  }

  res.json(note);
});

app.post("/api/notes", (req, res) => {
  const result = noteSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: z.treeifyError(result.error) });
  }

  const newNote = {
    id: crypto.randomUUID(),
    title: result.data.title,
    content: result.data.content,
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

app.put("/api/notes/:id", (req, res) => {
  const note = notes.find((note) => note.id === req.params.id);

  if (!note) {
    return res.status(404).json({ error: "Note wasn't found" });
  }

  const result = noteSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: z.treeifyError(result.error) });
  }

  note.title = result.data.title;
  note.content = result.data.content;

  res.json(note);
});

app.delete("/api/notes/:id", (req, res) => {
  const exist = notes.some((note) => note.id === req.params.id);

  if (!exist) {
    return res.status(404).json({ error: "Note wasn't found" });
  }

  notes = notes.filter((n) => n.id !== req.params.id);
  res.status(204).send();
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
