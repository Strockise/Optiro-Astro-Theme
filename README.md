# Optiro — AI agent Astro theme with Strapi CMS

Optiro is a premium theme for AI agent, chatbot and SaaS products, built with [Astro](https://astro.build) 7. Blog posts are managed in [Strapi](https://strapi.io) 5 and fetched at build time. Everything else ships as static HTML with no framework runtime.

**Pages:** Home, Features, Pricing, Contact, Blog, blog post details (`/blog/[slug]`), Style Guide and 404.

## Quick start

You need Node.js 22.12 or newer.

```sh
npm install
npm run dev            # http://localhost:4321
```

Without a CMS, the site builds from the bundled demo posts (`strapi/data/seed.json`, images in `public/images/blog/`). To manage posts in Strapi:

```sh
cd strapi
npm install
cp .env.example .env   # replace every "tobemodified" with a random string
npm run seed           # loads the 7 demo posts and their images
npm run develop        # http://localhost:1337/admin – create your admin user
```

Then, back in the theme root:

```sh
cp .env.example .env   # STRAPI_URL=http://localhost:1337
npm run dev
```

| Command           | Action                                   |
| :---------------- | :--------------------------------------- |
| `npm run dev`     | Start the dev server at `localhost:4321` |
| `npm run build`   | Build the static site into `./dist/`     |
| `npm run preview` | Preview the production build             |

## Environment variables

| Variable       | Required | Description                                                                                   |
| :------------- | :------- | :-------------------------------------------------------------------------------------------- |
| `STRAPI_URL`   | no       | Base URL of Strapi, e.g. `http://localhost:1337`. If unset, the bundled demo posts are used.  |
| `STRAPI_TOKEN` | no       | Read-only API token. Leave it empty if the Public role can `find`/`findOne` Blog entries.     |
| `SITE_URL`     | no       | Production URL, used for canonical and Open Graph tags                                        |

`astro:env` validates these variables (see `astro.config.mjs`). They are server-only, so they never reach the browser, and nothing secret is committed.

## Content model (Strapi)

One collection type, **Blog** (`/api/blogs`):

| Field             | Type                | Shown as                                     |
| :---------------- | :------------------ | :------------------------------------------- |
| `title`           | text, required      | card title, post `<h1>`, page title          |
| `slug`            | UID (from title)    | URL: `/blog/<slug>`                          |
| `date`            | date, required      | "October 1, 2025" on cards and post overview |
| `authorName`      | text, required      | cards and post overview                      |
| `readTime`        | text                | "Reading Time" on the post                   |
| `isFeatured`      | boolean             | the "Featured" card on /blog                 |
| `image`           | media (image)       | card and post cover, Open Graph image        |
| `content`         | Blocks (rich text)  | post body                                    |
| `metaDescription` | long text           | post meta and Open Graph description         |

It feeds the site's two CMS-driven areas:

- **Blog listing (`/blog`):** the newest post with `isFeatured` checked, then all posts.
- **Blog details (`/blog/[slug]`):** one static page per post, plus the 2 newest other posts as "Related blogs" (count set by `blog.relatedPosts` in `src/config/config.json`).

Posts are sorted newest first by `date`. The site is static: after you publish changes in Strapi, rebuild it. To automate rebuilds, add a Strapi webhook (Settings → Webhooks) that calls your host's build hook.

## Project structure

```
├── src/
│   ├── config/
│   │   ├── config.json      # site name/title/description, OG image, form endpoint, credits, related posts
│   │   ├── menu.json        # navbar, "Pages" dropdown, navbar buttons, footer links
│   │   └── social.json      # footer social links
│   ├── content.config.ts    # "blogs" content collection (Strapi or demo posts)
│   ├── layouts/BaseLayout.astro
│   ├── components/          # Navbar, Footer, Cta, Faq, SeoMeta, buttons, FormHandler, cards/
│   ├── lib/                 # strapi.ts, content.ts, blocks.ts, ix.ts, utils.ts
│   └── pages/               # one file per route
├── public/
│   ├── css/                 # theme stylesheets
│   ├── js/                  # interactions runtime, jQuery, GSAP (all local)
│   └── images/
└── strapi/                  # Strapi 5 project: Blog content type, seed data, MCP enabled
```

A guide for working on the theme (adding pages, components, content, configuration, styling) lives in `.agents/skills/astro-template-guidance/`.

### About the animations

The interactions (navbar, dropdown, FAQ, scroll reveals, heading reveals, hover effects, marquee and testimonial loops) run from `public/js/webflow.js`, with GSAP for the heading animations. They are keyed to the `pageId` passed to `BaseLayout` and to the `data-w-id` attributes in the markup, so keep both when you edit pages. To drop an animation from an element, remove its `data-w-id` attribute and its inline `style`.

### Forms

A static site has no form backend, so point the contact form at a form service (Formspree, Basin, Getform, …) by setting `forms.contactAction` in `src/config/config.json`. The form then submits with `fetch` and shows the theme's success or error message.

## Customising

- **Site name, description, OG image:** `src/config/config.json`
- **Navigation and footer links:** `src/config/menu.json`
- **Social links:** `src/config/social.json`
- **Styles:** `public/css/optiro-astro-theme.webflow.css` (colours, fonts and sizes are CSS variables at the top of the file)

## Deploying

Build with `npm run build` and deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, …). To build from Strapi, set `STRAPI_URL` (and `STRAPI_TOKEN` if you use one) in the host's build environment. Strapi must be reachable from the build machine, and its uploads URL must be public. Leave `STRAPI_URL` unset to deploy the demo content.
