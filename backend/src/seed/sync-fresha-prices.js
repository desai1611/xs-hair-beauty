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
  // hair
  "Men's Haircut": { price: 29, priceNote: 'Only', fresha: "Men's haircut NZ$29" },
  "Women's Haircut & Style": { price: 49, priceNote: 'Only', fresha: 'Style cut NZ$49 (Trim hair cut NZ$39, Hair cut and blow dry NZ$79)' },
  Nanoplastia: { price: 159, priceNote: 'From', fresha: 'Nanoplastia NZ$159 (with Trim NZ$199)' },
  'Full Colour': { price: 119, priceNote: 'From', fresha: 'Global Color from NZ$119' },
  'Highlights & Balayage': { price: 179, priceNote: 'From', fresha: 'Half Head Highlights from NZ$179 (Full Head NZ$199, Balayage from NZ$229)' },
  'Keratin Treatment': { price: 159, priceNote: 'From', fresha: 'Brazilian Keratin NZ$159 (Keratin straightening NZ$249)' },
  'Deep Conditioning Treatment': { price: 49, priceNote: 'Only', fresha: 'Hair Protein Treatment with hot towel NZ$49' },
  'Blow Dry & Styling': { price: 45, priceNote: 'Only', fresha: 'Blow Dry NZ$45' },
  // beauty
  'Eyebrow Threading': { price: 10, priceNote: 'Only', fresha: 'Eyebrows threading/waxing NZ$10' },
  'Full Face Threading': { price: 50, priceNote: 'Only', fresha: 'Full Face waxing/Threading NZ$50' },
  'Upper Lip Threading': { price: 10, priceNote: 'Only', fresha: 'Upper lip waxing/threading NZ$10' },
  'Arms Waxing': { price: 30, priceNote: 'From', fresha: 'Half arm wax NZ$30 (Full arms NZ$45)' },
  'Legs Waxing': { price: 30, priceNote: 'From', fresha: 'Half legs NZ$30 (Full legs NZ$50)' },
  'Basic Facial': { price: 70, priceNote: 'Only', fresha: 'Facial NZ$70 (Express facial NZ$39, Hydrating Facial NZ$59)' },
  // Not matched on purpose (no clear Fresha equivalent): Advanced Anti-Ageing Facial,
  // Skin Glow Treatment, Deep Cleanse & Renewal Facial, and the stray "Eye" entry.
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
