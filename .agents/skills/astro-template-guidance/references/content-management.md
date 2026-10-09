# Content management (Strapi)

Blog posts are the only CMS content. They live in Strapi as the **Blog** collection type (`api::blog.blog`, REST `/api/blogs`).

## Fields

| Field             | Type               | Notes |
| :---------------- | :----------------- | :---- |
| `title`           | text, required     | |
| `slug`            | UID from `title`   | Becomes `/blog/<slug>`. Changing it changes the URL. |
| `date`            | date, required     | Shown as "October 1, 2025". Lists are sorted by it, newest first. |
| `authorName`      | text, required     | |
| `readTime`        | text               | Free text, e.g. "04 min". |
| `isFeatured`      | boolean            | The newest featured post fills the large card on /blog. |
| `image`           | single image       | Its alternative text becomes the `alt` (the title is the fallback). |
| `content`         | Blocks             | Headings, paragraphs, lists, quotes, code, links and images are supported. |
| `metaDescription` | long text          | Post `<meta name="description">`. The site description is the fallback. |

Draft & Publish is on, so only **published** entries appear on the site.

## Everyday tasks

- **Add a post:** Content Manager → Blog → Create new entry → fill in the fields → Publish. Then rebuild the site.
- **Feature a post:** turn on `isFeatured`. If several posts are featured, the newest one is shown.
- **Change how many related posts appear:** `blog.relatedPosts` in `src/config/config.json`.

## Rebuilding

The site is static, so content changes appear after `npm run build` and a redeploy. To automate this, add a Strapi webhook (Settings → Webhooks) on entry publish/unpublish that calls your host's build hook.

## Demo content

`strapi/data/seed.json` and `strapi/data/uploads/` hold the 7 demo posts. `npm run seed` (in `strapi/`) loads them into an empty database (`-- --force` replaces existing posts) and lets the Public role read Blog entries.

When `STRAPI_URL` isn't set, the site builds straight from `strapi/data/seed.json` with images from `public/images/blog/`. That is how the demo deploys without a CMS. If you edit the demo posts, keep both image folders in sync.

## Strapi MCP server

The MCP server is enabled (`strapi/config/server.ts`, `MCP_ENABLED`). An AI client with an Admin token can list, create, update and publish Blog entries and manage Media Library assets. See `strapi/README.md` for setup. It can't change the schema or upload files: edit schemas in `src/api/blog/content-types/blog/schema.json` (or the Content-Type Builder) and upload files in the Media Library.

## Changing the schema

If you add a field, also update the `StrapiBlog` interface, the mapper and the zod schema in `src/content.config.ts`, then use the field in a page or component.
