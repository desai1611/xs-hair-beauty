// Makes the website's services match the salon's Fresha booking page exactly (names, prices,
// durations, descriptions), using src/seed/fresha-services.json (66 services, checked 26 Nov 2026).
// Services that are not on Fresha are removed so the site never lists something that can't be booked.
//
//   node src/seed/sync-fresha-services.js            -> dry run
//   node src/seed/sync-fresha-services.js --apply    -> writes the changes
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Service = require('../models/Service');
const data = require('./fresha-services.json');

async function main() {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Database: ${mongoose.connection.host}/${mongoose.connection.name}  (${apply ? 'APPLY' : 'dry run'})\n`);

  const existing = await Service.find();
  const byName = new Map(existing.map((s) => [s.name.toLowerCase(), s]));
  const wanted = new Set(data.services.map((s) => s.name.toLowerCase()));

  let added = 0;
  let updated = 0;
  for (const s of data.services) {
    const fields = {
      name: s.name, category: s.category, description: s.description, price: s.price,
      priceNote: s.priceNote, duration: s.duration, image: s.image, isFeatured: s.isFeatured,
      isPopular: Boolean(s.isPopular),
      isActive: true, order: s.order,
    };
    const current = byName.get(s.name.toLowerCase());
    if (current) {
      updated++;
      if (apply) await Service.updateOne({ _id: current._id }, { $set: fields });
    } else {
      added++;
      if (apply) await Service.create(fields);
    }
  }

  const removed = existing.filter((s) => !wanted.has(s.name.toLowerCase()));
  if (apply && removed.length) await Service.deleteMany({ _id: { $in: removed.map((s) => s._id) } });

  console.log(`on Fresha: ${data.services.length}   added: ${added}   updated: ${updated}   removed: ${removed.length}`);
  removed.forEach((s) => console.log(`  removed (not on Fresha): ${s.name}`));
  console.log(apply ? '\nDone.' : '\nDry run only. Add --apply to write.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
