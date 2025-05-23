import React, { useEffect, useState } from "react";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { NotesProvider, useNotes } from "./context/NotesContext";

function InnerApp() {
  const [activeId, setActiveId] = useState(null);
  const isOnline = useOnlineStatus();
  const [syncing, setSyncing] = useState(false);
  const { syncAllNotes } = useNotes();

  useEffect(() => {
    if (isOnline) {
      setSyncing(true);
      syncAllNotes()
        .catch(console.error)
        .finally(() => setSyncing(false));
    }
  }, [isOnline]);

  return (
    <div className="flex h-screen">
      <NotesList activeId={activeId} setActiveId={setActiveId} />
      <div className="flex-1 flex flex-col">
        <div className="p-2 bg-gray-200 flex justify-between items-center">
          <div>
            Status:{" "}
            <span className={isOnline ? "text-green-600" : "text-red-600"}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <div>
            {syncing ? (
              <span className="text-blue-600">Syncing…</span>
            ) : (
              <span className="text-gray-600">Synced</span>
            )}
          </div>
        </div>

        <NoteEditor activeId={activeId} />
      </div>
    </div>
  );
}

function App() {
  return (
    <NotesProvider>
      <InnerApp />
    </NotesProvider>
  );
}

export default App;
