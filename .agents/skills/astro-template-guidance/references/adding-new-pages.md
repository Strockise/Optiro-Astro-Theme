# Adding new pages

## A new static page

Create `src/pages/<name>.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Cta from '../components/Cta.astro';
---

<BaseLayout pageId="6ac8861e88e22add894545b8" title="Integrations">
  <section class="feature-main-section">
    <div class="w-layout-blockcontainer main-container w-container">
      <!-- section markup -->
    </div>
  </section>
  <Cta />
</BaseLayout>
```

- `title` gets the site suffix from `config.json` (`" || Optiro"`). Pass `rawTitle` to use it as is.
- `description`, `image` (an absolute or `/public` path), `type` and `noindex` control the SEO tags.
- `layout`: `default` (navbar + main + footer) or `utility` (404 style: navbar and centred content, no footer).
- `navbarSpacer={false}` removes the spacer under the fixed navbar. The home page does this because its hero sits under the navbar.

### About `pageId`

`pageId` is the page id that the animations in `public/js/interactions.js` are keyed by. A new page has no animations of its own, so either:

- reuse the `pageId` of the page whose sections you copied (copied `data-w-id` elements then animate the same way), or
- remove the `data-w-id` attributes and the inline `opacity:0` styles from the copied sections, so the content is visible without an animation.

Scroll and heading reveals on `.display-header` and `.section-header` work on every page.

## Reusing sections

Copy a `<section>` from any page; all styling comes from its class names. Shared sections are components:

- `<Cta />`: the "Hire your first AI agent today" banner
- `<Faq />`: the FAQ accordion

## A new dynamic route

Follow `src/pages/blog/[slug].astro`: export `getStaticPaths()`, read the entries with a getter from `src/lib/content.ts`, and pass the data as props. Add a URL builder to `src/lib/utils.ts` (like `blogUrl`) so links stay consistent.

## Linking the page

Add it to `src/config/menu.json` (navbar, Pages dropdown or footer). See `page-configuration.md`.
