import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

type BlogEntry = CollectionEntry<'blog'>;

export async function getPublishedPosts(): Promise<BlogEntry[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getFeaturedPosts(): Promise<BlogEntry[]> {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.data.featured);
}

export function getCategories(posts: BlogEntry[]): string[] {
  const categories = new Set(posts.map((post) => post.data.category));
  return [...categories].sort();
}

export function getTags(posts: BlogEntry[]): string[] {
  const tags = new Set(posts.flatMap((post) => post.data.tags));
  return [...tags].sort();
}

export function getPostsByCategory(posts: BlogEntry[], category: string): BlogEntry[] {
  return posts.filter((post) => post.data.category === category);
}

export function getPostsByTag(posts: BlogEntry[], tag: string): BlogEntry[] {
  return posts.filter((post) => post.data.tags.includes(tag));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
