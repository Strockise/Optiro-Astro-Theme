import { getCollection, type CollectionEntry } from 'astro:content';

export type Blog = CollectionEntry<'blogs'>['data'];

/** Newest first – the order every blog list in the original template used. */
export async function getBlogs(): Promise<Blog[]> {
  return (await getCollection('blogs')).map((e) => e.data).sort((a, b) => a.order - b.order);
}
