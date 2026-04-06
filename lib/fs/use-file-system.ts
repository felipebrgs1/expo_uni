import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import type { NoteFile } from './types';
import type { FileSystemAdapter } from './types';
import { mobileAdapter } from './mobile-adapter';
import { webAdapter } from './web-adapter';

const adapter: FileSystemAdapter = Platform.OS === 'web' ? webAdapter : mobileAdapter;

export function useFileSystem() {
  const [notes, setNotes] = useState<NoteFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        await adapter.init();
        if (mounted) {
          const list = await adapter.listNotes();
          setNotes(list);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e.message : 'Failed to initialize file system');
          setLoading(false);
        }
      }
    }
    init();
    return () => { mounted = false; };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const list = await adapter.listNotes();
      setNotes(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to refresh notes');
    }
  }, []);

  const createNote = useCallback(async (title: string) => {
    const now = Date.now();
    const note: NoteFile = {
      id: crypto.randomUUID(),
      title,
      content: `# ${title}\n\n`,
      createdAt: now,
      updatedAt: now,
    };
    await adapter.saveNote(note);
    setNotes((prev) => [note, ...prev]);
    return note;
  }, []);

  const updateNote = useCallback(async (id: string, content: string) => {
    const existing = await adapter.getNote(id);
    if (!existing) return;
    const updated: NoteFile = {
      ...existing,
      content,
      updatedAt: Date.now(),
    };
    await adapter.saveNote(updated);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    await adapter.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const getNote = useCallback(async (id: string) => {
    return await adapter.getNote(id);
  }, []);

  return {
    notes,
    loading,
    error,
    refresh,
    createNote,
    updateNote,
    deleteNote,
    getNote,
  };
}
