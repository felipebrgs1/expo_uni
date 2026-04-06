import { create } from 'zustand';
import { Platform } from 'react-native';
import type { NoteFile } from '@/lib/fs';
import { mobileAdapter, webAdapter } from '@/lib/fs';
import { buildGraph, type GraphData, type GraphNode, type GraphEdge } from '@/lib/graph';

const adapter = Platform.OS === 'web' ? webAdapter : mobileAdapter;

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
  isInitialized: boolean;
  graphData: GraphData;
  initFromFileSystem: () => Promise<void>;
  addNote: (title: string) => Promise<void>;
  updateNote: (id: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setActiveNote: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  getActiveNote: () => Note | undefined;
  getFilteredNotes: () => Note[];
  getGraphData: () => GraphData;
  getNoteGraph: (noteId: string) => { node: GraphNode | undefined; edges: GraphEdge[] };
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

function noteFileToNote(file: NoteFile): Note {
  return {
    id: file.id,
    title: file.title,
    content: file.content,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
  };
}

function noteToNoteFile(note: Note): NoteFile {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const emptyGraphData: GraphData = { nodes: [], edges: [] };

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  activeNoteId: null,
  searchQuery: '',
  isInitialized: false,
  graphData: emptyGraphData,

  initFromFileSystem: async () => {
    try {
      await adapter.init();
      const files = await adapter.listNotes();
      let notes: Note[];
      if (files.length > 0) {
        notes = files.map(noteFileToNote);
      } else {
        for (const mock of MOCK_NOTES) {
          await adapter.saveNote(noteToNoteFile(mock));
        }
        notes = MOCK_NOTES;
      }
      const graphData = buildGraph(notes);
      set({ notes, graphData, isInitialized: true });
    } catch (e: unknown) {
      console.error('Failed to init from file system:', e);
      const graphData = buildGraph(MOCK_NOTES);
      set({ notes: MOCK_NOTES, graphData, isInitialized: true });
    }
  },

  addNote: async (title: string) => {
    const now = Date.now();
    const note: Note = {
      id: generateId(),
      title,
      content: `# ${title}\n\n`,
      createdAt: now,
      updatedAt: now,
    };
    await adapter.saveNote(noteToNoteFile(note));
    const newNotes = [note, ...get().notes];
    const graphData = buildGraph(newNotes);
    set({ notes: newNotes, graphData });
  },

  updateNote: async (id: string, content: string) => {
    const existing = await adapter.getNote(id);
    if (!existing) return;
    const updated: NoteFile = {
      ...existing,
      content,
      updatedAt: Date.now(),
    };
    await adapter.saveNote(updated);
    const newNotes = get().notes.map((n) =>
      n.id === id ? noteFileToNote(updated) : n
    );
    const graphData = buildGraph(newNotes);
    set({ notes: newNotes, graphData });
  },

  deleteNote: async (id: string) => {
    await adapter.deleteNote(id);
    const newNotes = get().notes.filter((n: Note) => n.id !== id);
    const graphData = buildGraph(newNotes);
    set({
      notes: newNotes,
      graphData,
      activeNoteId: get().activeNoteId === id ? null : get().activeNoteId,
    });
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

  getGraphData: () => {
    return get().graphData;
  },

  getNoteGraph: (noteId: string) => {
    const { graphData } = get();
    const node = graphData.nodes.find((n) => n.id === noteId);
    if (!node) {
      return { node: undefined, edges: [] };
    }

    const nodeLower = node.title.toLowerCase();
    const edges = graphData.edges.filter(
      (e) => e.source === nodeLower || e.target === nodeLower
    );

    return { node, edges };
  },
}));
