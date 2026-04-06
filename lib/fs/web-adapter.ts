import localforage from 'localforage';
import type { FileSystemAdapter, NoteFile } from './types';

const store = localforage.createInstance({
  name: 'obsidian-notes',
  storeName: 'notes',
  description: 'Local note storage for web',
});

const INDEX_KEY = '__note_ids__';

export const webAdapter: FileSystemAdapter = {
  async init() {
    const ids = await store.getItem<string[]>(INDEX_KEY);
    if (!ids) {
      await store.setItem(INDEX_KEY, []);
    }
  },

  async listNotes() {
    const ids = (await store.getItem<string[]>(INDEX_KEY)) ?? [];
    const notes: NoteFile[] = [];
    for (const id of ids) {
      const note = await store.getItem<NoteFile>(id);
      if (note) notes.push(note);
    }
    return notes.sort((a, b) => b.updatedAt - a.updatedAt);
  },

  async getNote(id: string) {
    return await store.getItem<NoteFile>(id);
  },

  async saveNote(note: NoteFile) {
    let ids = (await store.getItem<string[]>(INDEX_KEY)) ?? [];
    if (!ids.includes(note.id)) {
      ids.push(note.id);
      await store.setItem(INDEX_KEY, ids);
    }
    await store.setItem(note.id, note);
  },

  async deleteNote(id: string) {
    let ids = (await store.getItem<string[]>(INDEX_KEY)) ?? [];
    ids = ids.filter((i) => i !== id);
    await store.setItem(INDEX_KEY, ids);
    await store.removeItem(id);
  },
};
