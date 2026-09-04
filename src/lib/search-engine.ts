import type {
  SearchBlogEntry,
  SearchIndex,
  SearchResultBlog,
  SearchResultTour,
  SearchTourEntry,
  UnifiedSearchResults,
} from "./search-types";

const SYNONYMS: Record<string, string[]> = {
  mp: ["machu picchu", "machupicchu"],
  machupicchu: ["machu picchu"],
  inca: ["inca trail", "incan", "camino inca", "trilha inca"],
  camino: ["inca trail", "camino inca"],
  trilha: ["inca trail", "trilha inca"],
  salk: ["salkantay"],
  salkantay: ["salkantay trek"],
  trail: ["trek", "hike", "trekking"],
  trek: ["trail", "hiking", "trekking"],
  amazon: ["rainforest", "jungle", "selva", "amazonas"],
  selva: ["amazon", "amazonas"],
  cusco: ["cusco", "cuzco"],
  lima: ["lima"],
  budget: ["cheap", "affordable", "price", "precio", "preco"],
  luxury: ["deluxe", "belmond"],
  family: ["kids", "children", "familia"],
  day: ["full day", "1 day", "full day"],
  paquete: ["package", "tour"],
  pacote: ["package", "tour"],
  cotiz: ["quote", "price"],
};

const COMMERCIAL_RE =
  /\b(tour|package|paquete|pacote|trek|trekking|trail|trilha|camino|price|precio|preco|book|quote|cotiz|days|dias|itinerary|itinerario|roteiro|availability|cost|costo)\b/i;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function expandTokens(raw: string): string[] {
  const base = normalize(raw).split(" ").filter((t) => t.length >= 2);
  const out = new Set<string>(base);
  for (const token of base) {
    const syns = SYNONYMS[token];
    if (syns) syns.forEach((s) => out.add(normalize(s)));
  }
  return [...out];
}

function scoreEntry(
  entry: { searchText: string; title: string; slug: string },
  tokens: string[],
): number {
  if (tokens.length === 0) return 0;
  const text = entry.searchText;
  const title = normalize(entry.title);
  const slug = entry.slug.replace(/-/g, " ");
  let score = 0;

  for (const token of tokens) {
    if (title.includes(token)) score += 12;
    else if (slug.includes(token)) score += 8;
    else if (text.includes(token)) score += 4;
    else {
      // Partial match for longer tokens (typo tolerance)
      if (token.length >= 4) {
        const words = text.split(" ");
        if (words.some((w) => w.startsWith(token.slice(0, 4)))) score += 2;
      }
    }
  }

  return score;
}

function rankTours(tours: SearchTourEntry[], tokens: string[], limit: number): SearchResultTour[] {
  return tours
    .map((t) => ({ ...t, score: scoreEntry(t, tokens) }))
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function rankBlogs(blogs: SearchBlogEntry[], tokens: string[], limit: number): SearchResultBlog[] {
  return blogs
    .map((b) => ({ ...b, score: scoreEntry(b, tokens) }))
    .filter((b) => b.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function hasCommercialIntent(query: string): boolean {
  return COMMERCIAL_RE.test(query);
}

export function searchUnified(
  index: SearchIndex,
  rawQuery: string,
  opts?: { tourLimit?: number; blogLimit?: number },
): UnifiedSearchResults {
  const query = rawQuery.trim();
  const tokens = expandTokens(query);
  const commercial = hasCommercialIntent(query);
  const tourLimit = opts?.tourLimit ?? 6;
  const blogLimit = opts?.blogLimit ?? 6;

  let tours = rankTours(index.tours, tokens, tourLimit);
  let blogs = rankBlogs(index.blogs, tokens, blogLimit);

  if (commercial && tours.length > 0) {
    tours = tours.map((t) => ({ ...t, score: t.score + 3 }));
    tours.sort((a, b) => b.score - a.score);
  }

  return { tours, blogs, query, hasCommercialIntent: commercial };
}

export function filterBlogEntries(
  blogs: SearchBlogEntry[],
  query: string,
  topic: string | null,
  allLabel = "All",
): SearchBlogEntry[] {
  const tokens = expandTokens(query);
  let filtered = blogs;

  if (topic && topic !== allLabel) {
    filtered = filtered.filter((b) => b.topics.includes(topic));
  }

  if (tokens.length === 0) return filtered;

  return filtered
    .map((b) => ({ entry: b, score: scoreEntry(b, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ entry }) => entry);
}

export const BLOG_TOPICS = [
  "All",
  "Cusco",
  "Machu Picchu",
  "Lima",
  "Amazon",
  "Food",
  "Planning",
  "Peru",
] as const;
