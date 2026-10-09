# Optiro CMS (Strapi 5)

This is the headless CMS behind the Optiro Astro theme (the parent folder). It defines one content type and ships the demo content.

| Type | API          | Used for |
| :--- | :----------- | :------- |
| Blog | `/api/blogs` | `/blog` (featured post + all posts) and `/blog/[slug]` (post details + related posts) |

Fields: `title`, `slug` (UID), `date`, `authorName`, `readTime`, `isFeatured`, `image` (single image), `content` (Blocks rich text), `metaDescription`. The schema is in `src/api/blog/content-types/blog/schema.json`. Draft & Publish is enabled.

## Setup

```sh
npm install
cp .env.example .env   # replace every "tobemodified" with a random value
npm run seed           # demo posts from data/seed.json + data/uploads (skips if posts exist)
npm run develop        # admin at http://localhost:1337/admin
```

`npm run seed -- --force` deletes all Blog entries and reseeds them. The seed also gives the **Public** role `find`/`findOne` on Blog, so the Astro site can read published posts without a token. To use a token instead, remove those permissions, create a read-only API token, and set `STRAPI_TOKEN` in the Astro project.

`data/seed.json` holds the demo posts, with rich text in Strapi Blocks format. The Astro site also builds directly from this file when `STRAPI_URL` isn't set.

## Strapi MCP server

The [MCP server](https://docs.strapi.io/cms/features/strapi-mcp-server) (Strapi 5.47 or later; this project uses 5.57) is enabled in `config/server.ts` with `mcp.enabled`. Set `MCP_ENABLED=false` to turn it off. It serves Streamable HTTP at `POST /mcp` and authenticates with an **Admin token**.

1. Start Strapi, sign in to the admin panel, and open **Settings → Admin tokens**. Create a token that has only the permissions the AI client needs, for example Blog read/create/update/publish and Media Library read.
2. Connect a client. For Claude Code:

   ```sh
   claude mcp add strapi-mcp --transport http http://localhost:1337/mcp -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

The client then gets tools generated from the schema: `list`, `get`, `create`, `update`, `delete`, `publish`, `unpublish` and `discard_draft` for Blog, plus the Media Library tools. As the Strapi docs note, MCP can't change content-type schemas or upload files. Make schema changes in the Content-Type Builder or the schema file, and upload files in the Media Library. Keep the token out of version control.

## Deploying

Use any Node host or Strapi Cloud. For production, switch `DATABASE_CLIENT` to Postgres or MySQL and use a cloud upload provider (S3, Cloudinary, …). After deploying, set `STRAPI_URL` in the Astro project to the public Strapi URL.
