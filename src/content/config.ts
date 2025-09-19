import { defineCollection, z } from 'astro:content';

const hero = z.object({
  image: z.string().optional(),
  alt: z.string().optional(),
  link: z.string().optional(),
  link_text: z.string().optional(),
}).optional();

const galleryItem = z.object({
  src: z.string(),
  title: z.string().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  link: z.string().optional(),
});

const gallery = z.object({
  layout: z.string().optional(),
  columns: z.union([z.number(), z.string()]).optional(),
  items: z.array(galleryItem).optional(),
}).optional();

const contentBlock = z.object({
  type: z.string(),
  level: z.number().optional(),
  text: z.string().optional(),
  content: z.string().optional(),
  items: z.array(z.string()).optional(),
  ordered: z.boolean().optional(),
  src: z.string().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  cite: z.string().optional(),
});

const baseFields = {
  title: z.string(),
  slug: z.string().optional(),
  date: z.string().optional(),
  date_pretty: z.string().optional(),
  description: z.string().optional(),
  external_link: z.string().optional(),
  hero,
  gallery,
  content_blocks: z.array(contentBlock).optional(),
  seo: z.record(z.any()).optional(),
};

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    ...baseFields,
    importance: z.number().optional(),
    type: z.literal('project'),
    project: z.object({
      tags: z.array(z.string()).optional(),
    }).optional(),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    ...baseFields,
    type: z.literal('post'),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { projects, posts };
