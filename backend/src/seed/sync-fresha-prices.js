// Updates the prices of services that clearly match a service on the salon's Fresha
// booking page (checked November 2026), so the website and online booking agree.
// Services without a clear Fresha equivalent are left alone and reported.
//
//   node src/seed/sync-fresha-prices.js            -> dry run
//   node src/seed/sync-fresha-prices.js --apply    -> writes the prices
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Service = require('../models/Service');

// website service -> Fresha price (NZ$) and the Fresha service it was matched to
const MATCHES = {
  "Men's Haircut": { price: 29, priceNote: 'Only', fresha: "Men's haircut NZ$29" },
  Nanoplastia: { price: 159, priceNote: 'From', fresha: 'Nanoplastia NZ$159' },
  'Full Colour': { price: 119, priceNote: 'From', fresha: 'Global Color from NZ$119' },
  'Highlights & Balayage': { price: 199, priceNote: 'From', fresha: 'Full Head Highlights NZ$199 (Balayage from NZ$229)' },
  'Eyebrow Threading': { price: 10, priceNote: 'Only', fresha: 'Eyebrows threading/waxing NZ$10' },
};

async function main() {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Database: ${mongoose.connection.host}/${mongoose.connection.name}  (${apply ? 'APPLY' : 'dry run'})\n`);

  const services = await Service.find().sort({ category: 1, order: 1 });
  const unmatched = [];
  for (const s of services) {
    const m = MATCHES[s.name];
    if (!m) {
      unmatched.push(`${s.name} (${s.priceNote || ''} $${s.price})`);
      continue;
    }
    if (s.price === m.price && s.priceNote === m.priceNote) continue;
    console.log(`${apply ? 'update' : 'would update'}  ${s.name}: ${s.priceNote} $${s.price} -> ${m.priceNote} $${m.price}   [${m.fresha}]`);
    if (apply) {
      s.price = m.price;
      s.priceNote = m.priceNote;
      await s.save();
    }
  }
  console.log('\nNot changed (no clear Fresha match, please check with the owner):');
  for (const u of unmatched) console.log(`  - ${u}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
