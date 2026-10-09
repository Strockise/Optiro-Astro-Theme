# Project architecture

Optiro is a static Astro 7 site. Blog content comes from Strapi 5 at build time, or from the bundled demo posts when `STRAPI_URL` isn't set. Every other page is static markup.

```
./
├── astro.config.mjs        # site URL, compressHTML: false, astro:env schema (STRAPI_URL, STRAPI_TOKEN)
├── strapi/                 # Strapi 5 project (Blog content type, seed data in strapi/data/)
├── public/
│   ├── css/                # normalize.css, base.css (base widgets), optiro.css (theme)
│   ├── js/                 # interactions.js (animations runtime), jquery, gsap + SplitText + ScrollTrigger
│   └── images/             # all static images, favicons, og-image.png
└── src/
    ├── config/             # config.json, menu.json, social.json
    ├── content.config.ts   # "blogs" collection – loader fetches /api/blogs from Strapi
    ├── layouts/BaseLayout.astro
    ├── components/         # Navbar, Footer, Cta, Faq, SeoMeta, buttons, FormHandler, cards/
    ├── lib/                # strapi.ts, content.ts, blocks.ts, ix.ts, utils.ts
    └── pages/              # routes
```

## Routes

| Route            | File                          | Data                         |
| :--------------- | :---------------------------- | :--------------------------- |
| `/`              | `pages/index.astro`           | static                       |
| `/feature`       | `pages/feature.astro`         | static                       |
| `/pricing`       | `pages/pricing.astro`         | static (uses `<Faq />`)      |
| `/contact`       | `pages/contact.astro`         | static + form handler        |
| `/blog`          | `pages/blog/index.astro`      | Strapi: featured + all posts |
| `/blog/[slug]`   | `pages/blog/[slug].astro`     | Strapi: post + related posts |
| `/style-guide`   | `pages/style-guide.astro`     | static                       |
| `/404`           | `pages/404.astro`             | static, `noindex`            |

## Data flow

1. `astro build` (or `astro dev`) runs the loader in `src/content.config.ts`. Without `STRAPI_URL`, it reads `strapi/data/seed.json` and uses images from `public/images/blog/`, and steps 2–3 are skipped.
2. The loader calls `fetchAll('blogs', …)` from `src/lib/strapi.ts`. That function follows Strapi's pagination, adds `STRAPI_TOKEN` as a Bearer header if one is set, and fails the build with a clear message if Strapi can't be reached.
3. Each entry is normalised: `image` becomes `{ src, srcset, alt }` (absolute URLs, srcset built from Strapi's image formats), and `content` keeps the Strapi Blocks JSON.
4. Pages call `getBlogs()` from `src/lib/content.ts`, which returns posts newest first.
5. `src/lib/blocks.ts` turns Blocks into the HTML that the `.w-richtext` styles expect.

## Runtime JavaScript

The site ships no framework runtime. It loads only the original interaction scripts from `public/js/`, plus one small bundled module (`FormHandler.astro`) on the contact page.
