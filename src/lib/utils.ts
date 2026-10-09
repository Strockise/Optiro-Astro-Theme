const trim = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);

/** Webflow marks links to the current page with `w--current` + aria-current. */
export function isCurrent(url: string, pathname: string) {
  return trim(url) === trim(pathname);
}

/** Attributes Webflow adds to a link that points at the current page. */
export function currentAttrs(url: string, pathname: string, className: string) {
  const current = isCurrent(url, pathname);
  return {
    'aria-current': current ? ('page' as const) : undefined,
    class: current ? `${className} w--current` : className,
  };
}

/** Route builder – the blog detail URL used by the original template. */
export const blogUrl = (slug: string) => `/blog/${slug}`;

/** "October 1, 2025" – the date format the Webflow template used. */
export function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
