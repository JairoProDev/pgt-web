export type SearchTourEntry = {
  type: "tour";
  slug: string;
  title: string;
  summary: string;
  days: number;
  style: string;
  styleKey: string;
  difficulty: string;
  destinations: string;
  destinationTags: string[];
  priceFrom: number;
  trustedPrice: boolean;
  searchText: string;
};

export type SearchBlogEntry = {
  type: "blog";
  slug: string;
  title: string;
  intro: string;
  topics: string[];
  modifiedAt: string;
  relatedTourSlugs: string[];
  searchText: string;
};

export type SearchIndex = {
  generated: string;
  popularQueries: string[];
  counts: { tours: number; blogs: number };
  tours: SearchTourEntry[];
  blogs: SearchBlogEntry[];
};

export type SearchIndexBundle = {
  generated: string;
  markets: Record<"en" | "es" | "pt", SearchIndex>;
};

export type SearchResultTour = SearchTourEntry & { score: number };
export type SearchResultBlog = SearchBlogEntry & { score: number };

export type UnifiedSearchResults = {
  tours: SearchResultTour[];
  blogs: SearchResultBlog[];
  query: string;
  hasCommercialIntent: boolean;
};
