const WIKILINK_REGEX = /\[\[([^\]]+)\]\]/g;

export interface WikilinkMatch {
  full: string;
  title: string;
  start: number;
  end: number;
}

export function parseWikilinks(content: string): WikilinkMatch[] {
  const matches: WikilinkMatch[] = [];
  let match;
  const regex = new RegExp(WIKILINK_REGEX.source, 'g');
  while ((match = regex.exec(content)) !== null) {
    matches.push({
      full: match[0],
      title: match[1],
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return matches;
}

export function processWikilinks(
  content: string,
  onLink: (title: string, index: number) => string
): string {
  let result = content;
  const matches = parseWikilinks(content);
  
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    const processed = onLink(m.title, i);
    result = result.slice(0, m.start) + processed + result.slice(m.end);
  }
  
  return result;
}

export function extractLinkTitles(content: string): string[] {
  const matches = parseWikilinks(content);
  return [...new Set(matches.map((m) => m.title))];
}
