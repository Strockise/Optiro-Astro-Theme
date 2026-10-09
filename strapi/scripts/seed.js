'use strict';

/**
 * Seeds Strapi with the Optiro demo blog posts (data/seed.json + data/uploads/*).
 *
 *   npm run seed            # only seeds an empty database
 *   npm run seed -- --force # deletes existing blog posts first
 *
 * The Astro site uses the same data/seed.json directly when STRAPI_URL is not set.
 */
const fs = require('node:fs');
const path = require('node:path');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const DATA_DIR = path.join(__dirname, '..', 'data');
const MIME = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif' };
const BLOG = 'api::blog.blog';

async function uploadImage(strapi, fileName, alt) {
  const existing = await strapi.query('plugin::upload.file').findOne({ where: { name: fileName } });
  if (existing) return existing;
  const filepath = path.join(DATA_DIR, 'uploads', fileName);
  const ext = fileName.split('.').pop().toLowerCase();
  const [file] = await strapi
    .plugin('upload')
    .service('upload')
    .upload({
      files: { filepath, originalFilename: fileName, mimetype: MIME[ext], size: fs.statSync(filepath).size },
      data: { fileInfo: { name: fileName, alternativeText: alt, caption: alt } },
    });
  return file;
}

async function setPublicPermissions(strapi) {
  const role = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  for (const action of ['find', 'findOne']) {
    const name = `${BLOG}.${action}`;
    const exists = await strapi.query('plugin::users-permissions.permission').findOne({ where: { action: name, role: role.id } });
    if (!exists) await strapi.query('plugin::users-permissions.permission').create({ data: { action: name, role: role.id } });
  }
}

async function seed(strapi, { force }) {
  const count = await strapi.documents(BLOG).count({});
  if (count > 0 && !force) {
    console.log(`Database already has ${count} blog posts – skipping (use --force to reseed).`);
    return;
  }
  if (force) await strapi.db.query(BLOG).deleteMany({});

  const { blogs } = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'seed.json'), 'utf8'));
  // seed.json is ordered oldest -> newest so Strapi's createdAt keeps the original ordering
  for (const { image, ...blog } of blogs) {
    const file = await uploadImage(strapi, image, blog.title);
    await strapi.documents(BLOG).create({ data: { ...blog, image: file.id }, status: 'published' });
  }
  console.log(`✓ ${blogs.length} blog posts`);
}

async function main() {
  const force = process.argv.includes('--force');
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';
  try {
    await seed(app, { force });
    await setPublicPermissions(app);
    console.log('✓ Public role can read blog posts');
  } finally {
    await app.destroy();
  }
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
