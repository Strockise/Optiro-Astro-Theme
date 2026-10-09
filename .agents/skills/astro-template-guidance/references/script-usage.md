# Script usage

The theme uses npm.

## Astro (project root)

| Command           | What it does |
| :---------------- | :----------- |
| `npm install`     | Install dependencies (Astro only) |
| `npm run dev`     | Dev server at http://localhost:4321. Fetches blog posts from Strapi on start (or uses the demo posts if `STRAPI_URL` isn't set). |
| `npm run build`   | Static build into `dist/` (if `STRAPI_URL` is set, Strapi must be reachable) |
| `npm run preview` | Serve `dist/` locally |
| `npm run astro -- <cmd>` | Any Astro CLI command |

## Strapi (`strapi/`)

| Command                  | What it does |
| :----------------------- | :----------- |
| `npm run develop`        | Strapi with auto-reload, admin at http://localhost:1337/admin |
| `npm run start`          | Production mode (run `npm run build` first) |
| `npm run build`          | Build the admin panel |
| `npm run seed`           | Load the demo posts into an empty database and allow public read access |
| `npm run seed -- --force`| Delete all Blog entries and reseed |

## Common problems

- **"Could not reach Strapi at …"**: start Strapi, fix `STRAPI_URL` in `.env`, or remove it to use the demo posts.
- **403/401 from Strapi**: give the Public role `find`/`findOne` on Blog (the seed does this), or set `STRAPI_TOKEN`.
- **Port 1337 in use**: run Strapi with another port (`PORT=1338 npm run develop`) and set `STRAPI_URL` to match.
