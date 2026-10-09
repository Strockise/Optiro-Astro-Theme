---
name: astro-template-guidance
description: Use this skill whenever you need to understand how the Optiro template works, including adding new pages, managing blog content in Strapi, configuring pages and navigation, using components, understanding project architecture, using scripts, or styling and theming. Use it for ANY question related to the structure, usage, and customization of this project template.
---

# Template Guidance (Optiro)

This skill is the handbook for the Optiro Astro theme. It uses progressive disclosure to keep context lean.

Depending on the request, **read the matching reference document** in `references/` before you start.

## Routing Guide

- **Adding a new page, route, or section:**
  Read: `references/adding-new-pages.md`

- **Using, modifying, or understanding UI components (e.g. BlogCard, SeoMeta):**
  Read: `references/component-usage.md`

- **Adding, editing, or updating blog content (Strapi):**
  Read: `references/content-management.md`

- **Configuring site settings, navigation, social links, or SEO (config.json, menu.json):**
  Read: `references/page-configuration.md`

- **Understanding the high-level codebase structure or data flow:**
  Read: `references/project-architecture.md`

- **Running the npm scripts (dev, build, seed):**
  Read: `references/script-usage.md`

- **Customizing styles, colors, fonts, or animations:**
  Read: `references/styling-and-theming.md`

- **Working with multiple languages (i18n):**
  Read: `references/i18n-guidance.md`

## Instructions

1. Identify the domain of the user's request.
2. Read the corresponding reference file in `references/`, relative to this skill.
3. Follow the instructions in that file.

## Golden rules for this theme

- The markup is a 1:1 port of the original design. Keep class names, `data-w-id` attributes and their inline `style` attributes, because the animations in `public/js/interactions.js` depend on them.
- Keep the `pageId` that each page passes to `BaseLayout`.
- Don't add a CSS framework. Styles live in `public/css/optiro.css`.
