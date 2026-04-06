export interface GraphNode {
  id: string;
  title: string;
  links: string[];
  backlinks: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const WIKILINK_REGEX = /\[\[([^\]]+)\]\]/g;

function extractWikilinks(content: string): string[] {
  const links: string[] = [];
  let match;
  const regex = new RegExp(WIKILINK_REGEX.source, 'g');
  while ((match = regex.exec(content)) !== null) {
    links.push(match[1]);
  }
  return [...new Set(links)];
}

export function buildGraph(notes: { id: string; title: string; content: string }[]): GraphData {
  const nodeMap = new Map<string, GraphNode>();

  for (const note of notes) {
    const links = extractWikilinks(note.content);
    nodeMap.set(note.title.toLowerCase(), {
      id: note.id,
      title: note.title,
      links: links.map((l) => l.toLowerCase()),
      backlinks: [],
    });
  }

  const edges: GraphEdge[] = [];

  for (const note of notes) {
    const links = extractWikilinks(note.content);
    const sourceLower = note.title.toLowerCase();

    for (const link of links) {
      const targetLower = link.toLowerCase();

      if (nodeMap.has(targetLower)) {
        const targetNode = nodeMap.get(targetLower)!;
        if (!targetNode.backlinks.includes(sourceLower)) {
          targetNode.backlinks.push(sourceLower);
        }
        edges.push({ source: sourceLower, target: targetLower });
      }
    }
  }

  return {
    nodes: Array.from(nodeMap.values()),
    edges,
  };
}

export function getNoteGraph(
  noteId: string,
  graphData: GraphData
): { node: GraphNode | undefined; edges: GraphEdge[] } {
  const node = graphData.nodes.find((n) => n.id === noteId);
  if (!node) {
    return { node: undefined, edges: [] };
  }

  const connectedIds = new Set<string>([node.title.toLowerCase()]);
  for (const link of node.links) {
    connectedIds.add(link);
  }
  for (const backlink of node.backlinks) {
    connectedIds.add(backlink);
  }

  const edges = graphData.edges.filter(
    (e) => e.source === node.title.toLowerCase() || e.target === node.title.toLowerCase()
  );

  return { node, edges };
}
