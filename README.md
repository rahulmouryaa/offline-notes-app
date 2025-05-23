# 📝 Offline-First Notes App with Markdown & Sync

This is a React-based offline-first notes application that allows users to create, edit, delete, and search notes in Markdown format. It works seamlessly offline using IndexedDB and syncs with a mock backend when the device is online.

---

## 🚀 Features

- ✅ Create, edit, and delete notes
- 🖋️ Markdown support (via `react-mde` and `react-markdown`)
- 💾 Offline support with IndexedDB (`dexie`)
- 🔁 Auto-sync with mock backend (`json-server`)
- 🌐 Detects online/offline status
- 🔍 Search notes by title or content
- 💡 Autosave with debounce (500ms)
- 📆 Notes sorted by last updated time
- 🧠 Basic conflict resolution (client-wins)
- 🖥️ Clean and responsive UI using Tailwind CSS

---

## 🏗️ Tech Stack

- React (Hooks + Context API)
- Dexie.js (IndexedDB wrapper)
- Axios (for HTTP requests)
- React-MDE & React-Markdown (for markdown editing)
- Tailwind CSS (for styling)
- json-server (mock backend API)

---

## 📁 Project Structure

src/
├── components/ # NotesList, NoteEditor
├── context/ # NotesContext
├── db/ # IndexedDB setup with Dexie
├── utils/ # Sync & connectivity logic
├── App.jsx
├── main.jsx
└── index.css


---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/offline-notes-app.git
cd offline-notes-app
npm install
npx json-server --watch db.json --port 3001
npm run dev



---
Rahul Mourya
https://github.com/rahulmouryaa
Let me know if you'd like it auto-filled with your actual GitHub repo link or name!
