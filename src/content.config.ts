import fs from 'node:fs/promises';
import path from 'node:path';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { fetchAll, hasStrapi, toImg, type StrapiMedia } from './lib/strapi';

/*
 * Blog CMS, served by Strapi (content type `api::blog.blog`, REST endpoint /api/blogs).
 * It feeds the two CMS-driven parts of the site:
 *  - /blog         featured post + all posts
 *  - /blog/[slug]  post details + related posts
 * Without STRAPI_URL the collection uses the bundled demo posts (strapi/data/seed.json,
 * the same data `npm run seed` loads into Strapi) with images from public/images/blog.
 * Entries are keyed by slug so pages can call getEntry('blogs', slug).
 */

interface StrapiBlog {
  slug: string;
  title: string;
  date: string;
  authorName: string;
  readTime: string | null;
  isFeatured: boolean | null;
  image: StrapiMedia | null;
  content: unknown[] | null;
  metaDescription: string | null;
}

interface SeedBlog extends Omit<StrapiBlog, 'image'> {
  image: string;
}

async function fromStrapi() {
  // Newest first; posts with the same date keep Strapi's creation order (newest first), like Webflow did.
  const data = await fetchAll<StrapiBlog>('blogs', { 'sort[0]': 'date:desc', 'sort[1]': 'createdAt:desc', populate: 'image' });
  return data.map((b) => ({ ...b, image: toImg(b.image, b.title) }));
}

async function fromDemo() {
  const file = path.resolve('strapi/data/seed.json');
  const { blogs } = JSON.parse(await fs.readFile(file, 'utf8')) as { blogs: SeedBlog[] };
  // seed.json is ordered oldest -> newest (the order Strapi creates them in)
  return blogs
    .map((b, i) => ({ ...b, created: i, image: { src: `/images/blog/${b.image}`, alt: b.title } }))
    .sort((a, b) => b.date.localeCompare(a.date) || b.created - a.created);
}

const img = z.object({ src: z.string(), srcset: z.string().optional(), alt: z.string() });

const blogs = defineCollection({
  loader: async () => {
    const data = hasStrapi ? await fromStrapi() : await fromDemo();
    return data.map((b, order) => ({
      id: b.slug,
      order,
      slug: b.slug,
      title: b.title,
      date: b.date,
      authorName: b.authorName,
      readTime: b.readTime ?? '',
      isFeatured: !!b.isFeatured,
      image: b.image,
      content: b.content ?? [],
      metaDescription: b.metaDescription ?? '',
    }));
  },
  schema: z.object({
    order: z.number(),
    slug: z.string(),
    title: z.string(),
    date: z.coerce.date(),
    authorName: z.string(),
    readTime: z.string(),
    isFeatured: z.boolean(),
    image: img.nullable(),
    // Strapi "blocks" rich text – rendered by src/lib/blocks.ts
    content: z.array(z.any()),
    metaDescription: z.string(),
  }),
});

export const collections = { blogs };
