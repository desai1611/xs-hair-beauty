// Snapshots the website content (services, products, offers, gallery, reviews, site images)
// from the database in .env into src/seed/content.json, so it can be loaded into another
// database (e.g. production) with import-content.js.
//
// Photos that were uploaded on localhost ("http://localhost:5000/uploads/x.jpg") are rewritten
// to "/uploads/x.jpg" and copied into frontend/public/uploads, so they are served by the
// website itself and keep working on the live site.
//
// Bookings and admin accounts are never exported.
//
//   node src/seed/export-content.js
require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const COLLECTIONS = ['services', 'products', 'offers', 'galleryimages', 'reviews', 'sitecontents'];
const UPLOADS_SRC = path.join(__dirname, '..', '..', 'uploads');
const UPLOADS_DEST = path.join(__dirname, '..', '..', '..', 'frontend', 'public', 'uploads');
const LOCAL_UPLOAD = /https?:\/\/(?:localhost|127\.0\.0\.1):\d+\/uploads\//g;

async function main() {
  const { EJSON } = mongoose.mongo.BSON;
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Database: ${mongoose.connection.host}/${mongoose.connection.name}\n`);

  const out = {};
  for (const name of COLLECTIONS) {
    const docs = await mongoose.connection.db.collection(name).find().toArray();
    out[name] = EJSON.serialize(docs);
    console.log(`${name.padEnd(14)} ${docs.length}`);
  }
  await mongoose.disconnect();

  // rewrite localhost upload URLs to site-relative ones
  let json = JSON.stringify(out, null, 2).replace(LOCAL_UPLOAD, '/uploads/');
  const files = [...new Set([...json.matchAll(/"\/uploads\/([^"]+)"/g)].map((m) => m[1]))];

  fs.mkdirSync(UPLOADS_DEST, { recursive: true });
  let copied = 0;
  const missing = [];
  for (const f of files) {
    const src = path.join(UPLOADS_SRC, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(UPLOADS_DEST, f));
      copied++;
    } else {
      missing.push(f);
    }
  }

  fs.writeFileSync(path.join(__dirname, 'content.json'), json + '\n');
  console.log(`\nWrote src/seed/content.json`);
  console.log(`Photos copied to frontend/public/uploads: ${copied}`);
  if (missing.length) console.log(`WARNING - referenced but not found in backend/uploads: ${missing.join(', ')}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
