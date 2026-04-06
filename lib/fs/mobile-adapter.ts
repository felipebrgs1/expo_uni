import { Paths, File, Directory } from 'expo-file-system';
import type { FileSystemAdapter, NoteFile } from './types';

const NOTES_DIR_NAME = 'notes';

function getNotesDir(): Directory {
  return new Directory(Paths.document, NOTES_DIR_NAME);
}

function noteFile(id: string): File {
  return new File(getNotesDir(), `${id}.json`);
}

function ensureDir() {
  const dir = getNotesDir();
  if (!dir.exists) {
    dir.create({ intermediates: true, idempotent: true });
  }
}

export const mobileAdapter: FileSystemAdapter = {
  async init() {
    ensureDir();
  },

  async listNotes() {
    ensureDir();
    const entries = getNotesDir().list();
    const notes: NoteFile[] = [];
    for (const entry of entries) {
      if (entry instanceof File && entry.name.endsWith('.json')) {
        try {
          const raw = await entry.text();
          notes.push(JSON.parse(raw) as NoteFile);
        } catch {
          // skip corrupted files
        }
      }
    }
    return notes.sort((a, b) => b.updatedAt - a.updatedAt);
  },

  async getNote(id: string) {
    const file = noteFile(id);
    if (!file.exists) return null;
    const raw = await file.text();
    return JSON.parse(raw) as NoteFile;
  },

  async saveNote(note: NoteFile) {
    ensureDir();
    const file = noteFile(note.id);
    file.write(JSON.stringify(note), { encoding: 'utf8', append: false });
  },

  async deleteNote(id: string) {
    const file = noteFile(id);
    if (file.exists) {
      file.delete();
    }
  },
};
