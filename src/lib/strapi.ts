/**
 * Minimal Strapi v5 REST client used by the content collection (src/content.config.ts).
 * Data is fetched at build time (and on dev-server start / content sync).
 */
import { STRAPI_URL, STRAPI_TOKEN } from 'astro:env/server';

export interface StrapiMedia {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: Record<string, { url: string; width: number; height: number }> | null;
}

/** True when a Strapi instance is configured; otherwise the site builds with the bundled demo posts. */
export const hasStrapi = !!STRAPI_URL;

const base = (STRAPI_URL ?? '').replace(/\/+$/, '');

/** Fetches every entry of a collection type, following Strapi's pagination. */
export async function fetchAll<T>(endpoint: string, query: Record<string, string> = {}): Promise<T[]> {
  const results: T[] = [];
  let page = 1;
  let pageCount = 1;
  do {
    const params = new URLSearchParams({ ...query, 'pagination[page]': String(page), 'pagination[pageSize]': '100' });
    const url = `${base}/api/${endpoint}?${params}`;
    let res: Response;
    try {
      res = await fetch(url, { headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {} });
    } catch (error) {
      throw new Error(`Could not reach Strapi at ${base}. Is it running? (cd strapi && npm run develop) Unset STRAPI_URL to build with the demo posts.`, { cause: error });
    }
    if (!res.ok) {
      const hint = res.status === 403 || res.status === 401 ? ' – check the Public role permissions or STRAPI_TOKEN.' : '';
      throw new Error(`Strapi request failed: ${res.status} ${res.statusText} for ${url}${hint}`);
    }
    const json = (await res.json()) as { data: T[]; meta: { pagination: { pageCount: number } } };
    results.push(...json.data);
    pageCount = json.meta.pagination.pageCount;
    page++;
  } while (page <= pageCount);
  return results;
}

/** Strapi's local upload provider returns relative URLs; cloud providers return absolute ones. */
export function mediaUrl(url: string) {
  return /^https?:\/\//.test(url) || !hasStrapi ? url : `${base}${url}`;
}

export interface Img {
  src: string;
  srcset?: string;
  alt: string;
}

/** Turns a Strapi media object into src + a responsive srcset built from Strapi's generated formats. */
export function toImg(media: StrapiMedia | null | undefined, fallbackAlt: string): Img | null {
  if (!media) return null;
  const candidates = Object.values(media.formats ?? {})
    .filter((f) => f && f.width)
    .map((f) => ({ url: f.url, width: f.width }));
  if (media.width) candidates.push({ url: media.url, width: media.width });
  candidates.sort((a, b) => a.width - b.width);
  return {
    src: mediaUrl(media.url),
    srcset: candidates.length > 1 ? candidates.map((c) => `${mediaUrl(c.url)} ${c.width}w`).join(', ') : undefined,
    alt: media.alternativeText || fallbackAlt,
  };
}
