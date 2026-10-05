import { getCollection, type CollectionEntry } from 'astro:content';
import { profile } from '../data/site';

export type Project = CollectionEntry<'projects'> & {
  /** The project's own page on this site, if it has one. */
  page?: string;
};

// Drafts only show while running `npm run dev`.
const visible = ({ data }: CollectionEntry<'projects'>) => import.meta.env.DEV || !data.draft;

// "Ongoing" and other text years sort as the newest.
const yearValue = (year: number | string) =>
  typeof year === 'number' ? year : Number.parseInt(year, 10) || Number.POSITIVE_INFINITY;

/** Featured projects first, then by `order`, then newest year. */
export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('projects', visible);
  return entries
    .map((entry) => ({
      ...entry,
      page: entry.data.caseStudy ?? (entry.body?.trim() ? `/projects/${entry.id}/` : undefined),
    }))
    .sort(
      (a, b) =>
        Number(b.data.featured) - Number(a.data.featured) ||
        a.data.order - b.data.order ||
        yearValue(b.data.year) - yearValue(a.data.year) ||
        a.data.title.localeCompare(b.data.title),
    );
}

/** Where a click on the project should go: its page, then its demo, then its code. */
export const primaryLink = (project: Project) => project.page ?? project.data.demo ?? project.data.repo;

/** The demo is this website, so there's nothing to open. */
export const isThisSite = (project: Project) => project.data.demo === profile.site;

/** Shown in the fake browser address bar above a screenshot. */
export function demoAddress(demo: string) {
  const url = new URL(demo, profile.site);
  return `${url.host}${url.pathname}`.replace(/\/$/, '');
}

/** "Type" filter values in the order they first appear. */
export const projectTypes = (projects: Project[]) => [...new Set(projects.map((project) => project.data.type))];
