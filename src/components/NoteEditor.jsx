import React, { useEffect, useState } from "react";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
import { useNotes } from "../context/NotesContext";

function NoteEditor({ activeId }) {
  const { notes, updateNote, deleteNote } = useNotes();
  const note = notes.find((n) => n.id === activeId);
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [selectedTab, setSelectedTab] = useState("write");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  // Debounce autosave
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (note) {
        updateNote(note.id, { title, content });
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [title, content, note]);

  if (!note)
    return (
      <div className="p-6 w-2/3 h-screen flex items-center justify-center text-gray-400 select-none">
        Select a note to edit
      </div>
    );

  return (
    <div className="p-6 w-2/3 h-screen flex flex-col overflow-y-auto bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <input
          className="flex-grow text-3xl font-semibold border-b-2 border-gray-300 focus:border-blue-500 transition-colors px-3 py-2 outline-none placeholder-gray-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
        />
        <button
          onClick={() => {
            if (confirm("Delete this note?")) {
              deleteNote(note.id);
            }
          }}
          className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Delete note"
          title="Delete Note"
        >
          Delete
        </button>
      </div>

      {/* Markdown Editor */}
      <div className="flex-grow border border-gray-200 rounded-md shadow-inner">
        <ReactMde
          value={content}
          onChange={setContent}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          minEditorHeight={300}
          heightUnits="px"
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(
              <div className="prose max-w-none p-4">
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
            )
          }
          childProps={{
            writeButton: {
              tabIndex: -1,
            },
          }}
        />
      </div>
    </div>
  );
}

export default NoteEditor;
