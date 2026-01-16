import type { CollectionEntry } from 'astro:content';

export type ContentEntry = {
  data?: {
    tags?: string[];
    project?: { tags?: string[] };
  };
};

export function hasDraftTag(entry: ContentEntry | undefined | null): boolean {
  if (!entry || typeof entry !== 'object') return false;
  const tags = [
    ...((entry.data?.tags as string[] | undefined) ?? []),
    ...((entry.data?.project?.tags as string[] | undefined) ?? []),
  ];
  return tags.some((tag) => String(tag).toLowerCase() === 'draft');
}

type ProjectEntry = CollectionEntry<'projects'>;

function getImportanceValue(entry: ProjectEntry): number {
  const value = entry.data.importance;
  return typeof value === 'number' && Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
}

function getDateValue(entry: ProjectEntry): number {
  if (!entry.data.date) return 0;
  const timestamp = new Date(entry.data.date).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function compareProjectImportance(a: ProjectEntry, b: ProjectEntry): number {
  // Sort by importance first (lower number = higher priority)
  const importanceDiff = getImportanceValue(a) - getImportanceValue(b);
  if (importanceDiff !== 0) return importanceDiff;

  // Then by date descending
  const dateDiff = getDateValue(b) - getDateValue(a);
  if (dateDiff !== 0) return dateDiff;

  const aKey = a.slug ?? a.id;
  const bKey = b.slug ?? b.id;
  return aKey.localeCompare(bKey);
}
