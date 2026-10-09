# Page configuration

## `src/config/config.json`

| Key                    | Purpose |
| :--------------------- | :------ |
| `site.name`            | Site name, used in the footer copyright line |
| `site.title`           | Home page title and fallback title |
| `site.titleSuffix`     | Added to page titles (`"Blog" + " || Optiro"`) |
| `site.description`     | Default meta description |
| `site.ogImage`         | Default Open Graph image (path in `public/`) |
| `site.language`        | `<html lang>` |
| `webflow.siteId`       | Site id the interaction runtime reads. Don't change it. |
| `forms.contactAction`  | Form service endpoint for the contact form (empty means not connected) |
| `credits.poweredBy`    | "Powered by" link in the footer |
| `blog.relatedPosts`    | Number of related posts on a blog post |

## `src/config/menu.json`

- `main`: navbar items in order. `{ "dropdown": "Pages" }` marks where the Pages dropdown goes.
- `pagesMenu`: the dropdown's columns (`title` + `links`).
- `cta`: the navbar's green button. `mobileCta`: the button inside the mobile menu.
- `footer`: two link columns, `[mainLinks, utilityLinks]`.

Each link is `{ "label": "...", "url": "/path" }`. A link whose `url` matches the current page is highlighted automatically.

## `src/config/social.json`

URLs for `x`, `facebook`, `instagram`, `linkedin` in the footer. Set a value to `""` to hide that icon.

## SEO

- Set `SITE_URL` (env) so canonical and Open Graph URLs are absolute and correct.
- Per page: `<BaseLayout title description image type noindex>`.
- Blog posts use the post title, `metaDescription` and cover image automatically.
- The 404 page is `noindex`.
