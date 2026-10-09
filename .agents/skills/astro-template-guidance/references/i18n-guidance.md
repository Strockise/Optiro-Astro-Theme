# Multi-language (i18n)

Optiro ships in a single language (English, `site.language` in `config.json`) and has no i18n routing. To add languages:

1. **Routing:** enable Astro's i18n in `astro.config.mjs`:

   ```js
   i18n: { locales: ['en', 'de'], defaultLocale: 'en', routing: { prefixDefaultLocale: false } }
   ```

   Put translated pages in `src/pages/de/…`.

2. **UI strings:** move hard-coded labels (menus, buttons, section text) into per-locale JSON files, e.g. `src/config/i18n/en.json` and `de.json`. Load the right one with `Astro.currentLocale`. Make one `menu.json` per locale, or nest it by locale.

3. **Blog content:** turn on Strapi's Internationalization for the Blog content type (Content-Type Builder → Blog → Advanced settings → Internationalization). Then fetch each locale with `locale=<code>` in `src/content.config.ts` (one collection per locale, or `id: \`${locale}/${slug}\``). Generate `/de/blog/[slug]` with `getStaticPaths()`.

4. **`<html lang>`:** pass the locale to `BaseLayout` and use it instead of `config.site.language`.

5. **Dates:** `formatDate` in `src/lib/utils.ts` uses `en-US`. Pass the locale to it.
