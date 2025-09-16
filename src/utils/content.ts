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
