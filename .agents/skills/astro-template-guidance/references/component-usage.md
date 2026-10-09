# Component usage

All components are in `src/components/`. None of them ship client-side JavaScript except `FormHandler`.

| Component              | Props                                   | Notes |
| :--------------------- | :-------------------------------------- | :---- |
| `Navbar`               | –                                       | Built from `menu.json`. Marks the current page (`w--current` + `aria-current`). The mobile menu and dropdown come from interactions.js. |
| `Footer`               | –                                       | Built from `menu.json` (`footer`), `social.json` and `config.json` (`credits`). A social link is hidden when its URL is empty. |
| `Cta`                  | –                                       | Call-to-action banner shown above the footer. |
| `Faq`                  | –                                       | FAQ accordion (home and pricing). Edit the questions directly in the file. |
| `SeoMeta`              | `title`, `rawTitle`, `description`, `image`, `type`, `noindex` | Used by `BaseLayout`. Sets title, description, Open Graph/Twitter tags and the canonical URL (needs `SITE_URL`). |
| `PrimaryButton`        | `href`, `label`, `variant?: 'base' \| 'nav'` | The green button with the text-swap hover. |
| `SecondaryButton`      | `href`, `label`                         | Outline variant used in the home hero. |
| `FormHandler`          | –                                       | Add to a page that has a `.w-form form[action]`. Submits with fetch and shows `.w-form-done` / `.w-form-fail`. |
| `cards/BlogCard`       | `blog`, `wId`                           | Blog grid card. `wId` is the reveal animation id of the list it sits in. |
| `cards/FeaturedBlogCard` | `blog`                                | Large "Featured" card on /blog. |

## BlogCard example

```astro
---
import BlogCard from '../components/cards/BlogCard.astro';
import { getBlogs } from '../lib/content';
const latest = (await getBlogs()).slice(0, 2);
---
<div role="list" class="related-blog-cms-list w-dyn-items">
  {latest.map((blog) => (
    <div role="listitem" class="related-blog-cms-item w-dyn-item">
      <BlogCard blog={blog} wId="6c5069b3-d3c4-80dc-d798-7af9bba5eb1e" />
    </div>
  ))}
</div>
```

## Helpers (`src/lib`)

- `ixUp('10%')`: the inline start state (shifted down, transparent) that an animated element needs.
- `currentAttrs(url, pathname, className)`: the class and `aria-current` attributes for a link to the current page.
- `blogUrl(slug)`, `formatDate(date)`: route and date helpers.
- `toImg(media, alt)`, `mediaUrl(url)`: Strapi media helpers.
