import React, { useEffect, useState } from "react";
import { useNotes } from "../context/NotesContext";

function NotesList({ activeId, setActiveId }) {
  const { notes, createNote } = useNotes();
  const [search, setSearch] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredNotes(
      filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  }, [notes, search]);

  return (
    <div className="w-1/3 h-screen flex flex-col border-r bg-white shadow-sm">
      {/* Header: New Note & Search */}
      <div className="flex gap-3 p-4 border-b items-center">
        <button
          onClick={async () => {
            const id = await createNote();
            setActiveId(id);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 text-white rounded shadow transition duration-150"
          aria-label="Create new note"
        >
          + New Note
        </button>
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search notes"
        />
      </div>

      {/* Notes List */}
      <ul className="flex-grow overflow-y-auto divide-y divide-gray-200">
        {filteredNotes.length === 0 ? (
          <li className="p-4 text-center text-gray-400 select-none">
            No notes found.
          </li>
        ) : (
          filteredNotes.map((note) => (
            <li
              key={note.id}
              onClick={() => setActiveId(note.id)}
              className={`cursor-pointer p-4 hover:bg-blue-50 transition-colors duration-150 rounded-r ${
                note.id === activeId
                  ? "bg-blue-100 border-l-4 border-blue-600 font-semibold"
                  : "border-l-4 border-transparent"
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActiveId(note.id);
              }}
              aria-selected={note.id === activeId}
            >
              <div className="truncate text-lg">{note.title || "Untitled"}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(note.updatedAt).toLocaleString()}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default NotesList;
