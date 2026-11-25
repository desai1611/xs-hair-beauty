// Loads src/seed/content.json (made by export-content.js) into the database in MONGO_URI so the
// live site shows the same services, prices, offers, photos and reviews as the reviewed copy.
//
// Only website content is touched: services, products, offers, gallery, reviews, site images.
// Bookings and admin accounts are NEVER read or changed.
//
//   node src/seed/import-content.js            -> dry run, shows what would change
//   node src/seed/import-content.js --apply    -> writes it
//
// Each collection is made to match the file exactly (documents are matched by _id; anything
// not in the file is removed). Safe to run more than once.
require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

async function main() {
  const apply = process.argv.includes('--apply');
  const { EJSON } = mongoose.mongo.BSON;
  const content = JSON.parse(fs.readFileSync(path.join(__dirname, 'content.json'), 'utf8'));

  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Database: ${mongoose.connection.host}/${mongoose.connection.name}  (${apply ? 'APPLY' : 'dry run'})\n`);

  for (const [name, serialised] of Object.entries(content)) {
    const docs = EJSON.deserialize(serialised);
    const col = mongoose.connection.db.collection(name);
    const existing = await col.find({}, { projection: { _id: 1 } }).toArray();
    const keep = new Set(docs.map((d) => String(d._id)));
    const toRemove = existing.filter((d) => !keep.has(String(d._id))).length;
    const toAdd = docs.filter((d) => !existing.some((e) => String(e._id) === String(d._id))).length;
    console.log(`${name.padEnd(14)} now ${String(existing.length).padStart(2)} -> will have ${String(docs.length).padStart(2)}   (add ${toAdd}, replace ${docs.length - toAdd}, remove ${toRemove})`);

    if (apply && docs.length) {
      await col.bulkWrite(docs.map((d) => ({ replaceOne: { filter: { _id: d._id }, replacement: d, upsert: true } })));
      await col.deleteMany({ _id: { $nin: docs.map((d) => d._id) } });
    }
  }

  console.log(apply ? '\nDone.' : '\nDry run only - nothing was changed. Add --apply to write.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
