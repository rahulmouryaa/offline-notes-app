import React, { createContext, useContext, useEffect, useState } from "react";
import db from "../db/db";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const NotesContext = createContext();
const API_URL = "http://localhost:3000/notes";

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const loadNotes = async () => {
      const allNotes = await db.notes.toArray();
      setNotes(
        allNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );
    };
    loadNotes();
  }, []);

  const saveToDB = async (note) => {
    await db.notes.put(note);
    const updatedNotes = await db.notes.toArray();
    setNotes(
      updatedNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  };

  const createNote = async () => {
    const newNote = {
      id: uuidv4(),
      title: "Untitled Note",
      content: "",
      updatedAt: new Date().toISOString(),
      synced: false,
    };
    await saveToDB(newNote);
    return newNote.id;
  };

  const updateNote = async (id, changes) => {
    const note = await db.notes.get(id);
    const updated = {
      ...note,
      ...changes,
      updatedAt: new Date().toISOString(),
      synced: false,
    };
    await saveToDB(updated);
  };

  const deleteNote = async (id) => {
    await db.notes.delete(id);
    const remaining = await db.notes.toArray();
    setNotes(
      remaining.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  };

  const syncAllNotes = async () => {
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

      const updatedNotes = await db.notes.toArray();
      setNotes(
        updatedNotes.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )
      );
    } catch (err) {
      console.error("Sync failed:", err);
    }
  };

  return (
    <NotesContext.Provider
      value={{ notes, createNote, updateNote, deleteNote, syncAllNotes }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => useContext(NotesContext);
