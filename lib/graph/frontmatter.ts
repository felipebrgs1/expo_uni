import matter from 'gray-matter';

export interface ParsedNote {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

export interface Frontmatter {
  tags?: string[];
  created?: string;
  updated?: string;
  [key: string]: unknown;
}

export function parseNote(rawContent: string, id: string, title: string): ParsedNote {
  const { data, content } = matter(rawContent);
  const now = Date.now();

  let createdAt = now;
  let updatedAt = now;

  if (data.created) {
    const parsed = Date.parse(data.created);
    if (!isNaN(parsed)) createdAt = parsed;
  }

  if (data.updated) {
    const parsed = Date.parse(data.updated);
    if (!isNaN(parsed)) updatedAt = parsed;
  }

  const tags = Array.isArray(data.tags) ? data.tags : [];

  return {
    id,
    title,
    content,
    createdAt,
    updatedAt,
    tags,
  };
}

export function stringifyNote(note: ParsedNote): string {
  const frontmatter: Frontmatter = {
    tags: note.tags,
    created: new Date(note.createdAt).toISOString(),
    updated: new Date(note.updatedAt).toISOString(),
  };

  return matter.stringify(note.content, frontmatter);
}
