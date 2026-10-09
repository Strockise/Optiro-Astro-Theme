// @ts-check
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Set your production URL (used for canonical and Open Graph URLs)
  site: process.env.SITE_URL || 'https://example.com',
  // Keep the whitespace between tags exactly as in the original markup – it affects inline layout.
  compressHTML: false,
  // The Strapi app lives in ./strapi – keep the dev server from watching it.
  vite: { server: { watch: { ignored: ['**/strapi/**'] } } },
  env: {
    schema: {
      // Base URL of Strapi. Leave unset to build with the bundled demo posts (strapi/data/seed.json).
      STRAPI_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Optional read-only API token; leave empty when the Public role can read blog posts
      STRAPI_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
