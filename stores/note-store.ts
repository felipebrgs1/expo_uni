import { create } from 'zustand';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface NoteStore {
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  addNote: (title: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  getActiveNote: () => Note | undefined;
  getFilteredNotes: () => Note[];
}

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Welcome',
    content: '# Welcome to your notes\n\nThis is your first note. Start writing!\n\nCheck out [[Getting Started]] for more info.',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: '2',
    title: 'Getting Started',
    content: '# Getting Started\n\n- Create notes with [[wikilinks]]\n- View your [[Graph View]] to see connections\n- Use **markdown** for formatting',
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000,
  },
  {
    id: '3',
    title: 'Ideas',
    content: '# Ideas\n\nSome random ideas:\n\n1. Build a graph view\n2. Add search functionality\n3. Support tags in frontmatter',
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 259200000,
  },
];

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: MOCK_NOTES,
  activeNoteId: null,
  searchQuery: '',

  addNote: (title: string) => {
    const now = Date.now();
    const note: Note = {
      id: crypto.randomUUID(),
      title,
      content: `# ${title}\n\n`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ notes: [note, ...state.notes] }));
  },

  updateNote: (id: string, content: string) => {
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, content, updatedAt: Date.now() } : n
      ),
    }));
  },

  deleteNote: (id: string) => {
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
    }));
  },

  setActiveNote: (id: string | null) => {
    set({ activeNoteId: id });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  getActiveNote: () => {
    const { notes, activeNoteId } = get();
    return notes.find((n) => n.id === activeNoteId);
  },

  getFilteredNotes: () => {
    const { notes, searchQuery } = get();
    if (!searchQuery) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  },
}));
