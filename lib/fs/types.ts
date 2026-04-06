export interface NoteFile {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}

export interface FileSystemAdapter {
  init(): Promise<void>;
  listNotes(): Promise<NoteFile[]>;
  getNote(id: string): Promise<NoteFile | null>;
  saveNote(note: NoteFile): Promise<void>;
  deleteNote(id: string): Promise<void>;
}
