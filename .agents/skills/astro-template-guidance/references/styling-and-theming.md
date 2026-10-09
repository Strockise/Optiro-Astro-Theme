# Styling and theming

The theme uses plain CSS. It has no Tailwind and no CSS-in-JS.

| File | Role |
| :--- | :--- |
| `public/css/normalize.css` | Reset |
| `public/css/base.css` | Base styles for the widgets the runtime uses (`w-nav`, `w-dropdown`, `w-form`, `w-richtext`, …) |
| `public/css/optiro.css` | All theme styles |

`BaseLayout` loads them in that order.

## Design tokens

The `:root` block at the top of `optiro.css` holds the variables:

- Colours: `--colors-variable--primary-color` (#45d57e, the green accent), `--colors-variable--brand-black`, `--colors-variable--black-pearl`, `--colors-variable--brand-color`, `--colors-variable--white`, `--colors-variable--border-color`
- Font: `--fonts--brand-font` (Geist)
- Type scale: `--typography-variable--display-header`, `--typography-variable--header-large`, `--typography-variable--header-medium`, `--typography-variable--header-small`, `--typography-variable--body-text`, `--typography-variable--body-text-small`
- Font weights, line heights, container sizes and spacers

Change a variable to restyle the whole site.

## Fonts

Geist (300–700) is loaded from Google Fonts by the WebFont loader in `BaseLayout.astro`. To change the font, update the `families` list there and `--fonts--brand-font`.

## Breakpoints

Desktop-first: base styles, then `max-width` 991px (tablet), 767px (mobile landscape) and 479px (mobile). Large screens get `min-width` 1280px, 1440px and 1920px. Keep new rules in the matching media block.

## Dark theme

The design is dark by default and has no light mode. The two favicons (`favicon.png`, `favicon-dark.png`) switch with the OS colour scheme.

## Animations

- Scroll reveals, hover effects and loops: `public/js/interactions.js`, matched by `data-w-id` + the page's `pageId`. An animated element starts from its inline `style` (use `ixUp()` from `src/lib/ix.ts`).
- Heading reveals: every `.display-header` (on load) and `.section-header` (on scroll) is split into lines by GSAP SplitText.
- To turn off one animation, remove the element's `data-w-id` and inline `style`.

## Custom CSS

Add new rules to the end of `optiro.css`, or put them in a new file under `public/css/` and link it in `BaseLayout.astro` after the theme stylesheet.
