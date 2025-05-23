import axios from "axios";
import db from "../db/db";

const API_URL = "/api/notes";

export async function syncNotes() {
  try {
    const { data: serverNotes } = await axios.get(API_URL);

    const localNotes = await db.notes.toArray();

    for (const localNote of localNotes) {
      const serverNote = serverNotes.find((n) => n.id === localNote.id);

      if (!serverNote) {
        await axios.post(API_URL, localNote);

        await db.notes.update(localNote.id, { synced: true });
      } else if (
        new Date(localNote.updatedAt) > new Date(serverNote.updatedAt)
      ) {
        await axios.put(`${API_URL}/${localNote.id}`, localNote);
        await db.notes.update(localNote.id, { synced: true });
      } else if (
        new Date(localNote.updatedAt) < new Date(serverNote.updatedAt)
      ) {
        await db.notes.put({ ...serverNote, synced: true });
      } else {
        await db.notes.update(localNote.id, { synced: true });
      }
    }

    return "Synced";
  } catch (err) {
    console.error("Sync error:", err);
    return "Error";
  }
}
