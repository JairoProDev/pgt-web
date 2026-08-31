import type { BlogPost, PageContent, Tour } from "./types";
import homePage from "@/content/pages/home.json";
import packagesPage from "@/content/pages/packages.json";
import salkantayTour from "@/content/tours/the-classic-salkantay-trek-5d.json";
import thingsMpBlog from "@/content/blogs/things-to-do-in-machu-picchu.json";

const tours: Record<string, Tour> = {
  [salkantayTour.slug]: salkantayTour as Tour,
};

const blogs: Record<string, BlogPost> = {
  [thingsMpBlog.slug]: thingsMpBlog as BlogPost,
};

const pages: Record<string, PageContent> = {
  home: homePage as PageContent,
  packages: packagesPage as PageContent,
};

export function getTour(slug: string): Tour | undefined {
  return tours[slug];
}

export function getAllTourSlugs(): string[] {
  return Object.keys(tours);
}

export function getBlog(slug: string): BlogPost | undefined {
  return blogs[slug];
}

export function getAllBlogSlugs(): string[] {
  return Object.keys(blogs);
}

export function getPage(slug: keyof typeof pages): PageContent {
  return pages[slug];
}

export function getToursBySlugs(slugs: string[]): Tour[] {
  return slugs.map((s) => tours[s]).filter(Boolean);
}
