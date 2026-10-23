import type { Note } from "../types/note";

const BASE_URL = "http://localhost:3000/api/notes";

async function toError(res: Response, fallback: string): Promise<Error> {
  const body = await res.json().catch(() => null);
  const message =
    body?.errors?.properties?.title?.errors?.[0] ?? body?.error ?? fallback;
  return new Error(message);
}

export async function getNotes(): Promise<Note[]> {
  const res = await fetch(BASE_URL);

  if (!res.ok) throw await toError(res, "Failed to get notes");

  return res.json();
}

export async function createNote(data: Omit<Note, "id">): Promise<Note> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw await toError(res, "Failed to create a note");

  return res.json();
}

export async function updateNote(
  id: string,
  data: Omit<Note, "id">,
): Promise<Note> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw await toError(res, "Failed to update a note");

  return res.json();
}

export async function deleteNote(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

  if (!res.ok) throw await toError(res, "Failed to delete a note");
}
