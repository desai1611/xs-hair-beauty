// Adds the offers currently posted on the salon's Instagram (xs_hair_and_beauty),
// with the prices exactly as shown on those posters. Photos ship with the website
// (frontend/public/images/services/). Skips any offer whose title already exists.
//
//   node src/seed/add-instagram-offers.js            -> dry run
//   node src/seed/add-instagram-offers.js --apply    -> writes the offers
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Offer = require('../models/Offer');

const OFFERS = [
  {
    tag: 'Hair',
    title: 'Full Head of Highlights',
    description: 'Includes toner & styling. Any hair length. All for only $199.',
    image: '/images/services/balayage.jpg',
  },
  {
    tag: 'Hair',
    title: 'Regrowth (Gray Hair Cover)',
    description: 'Flawless roots, confidence that grows. Quick, effective, natural-looking results. Only $49.',
    image: '/images/services/full-colour.jpg',
  },
  {
    tag: 'Beauty',
    title: 'Express Facial',
    description: 'Refresh, rejuvenate, glow: deep cleansing, hydrating care and a relaxing experience. Only $49.',
    image: '/images/services/basic-facial.jpg',
  },
  {
    tag: 'Beauty',
    title: 'Brazilian Wax',
    description: 'Smooth skin, long-lasting results, professional and hygienic. Only $49.',
    image: '/images/services/legs-waxing.jpg',
  },
  {
    tag: 'Men',
    title: "Men's Haircut",
    description: 'Look good, feel confident: stylish cut, clean and neat finish. Walk-ins welcome. Only $29.',
    image: '/images/services/mens-haircut.jpg',
  },
  {
    tag: 'Limited time',
    title: 'Full Arm + Half Leg + Underarm Waxing',
    description: 'Silky smooth skin, effortlessly. Limited time offer, only $69.',
    image: '/images/services/arms-waxing.jpg',
  },
];

async function main() {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Database: ${mongoose.connection.host}/${mongoose.connection.name}  (${apply ? 'APPLY' : 'dry run'})\n`);

  // New offers go first, ahead of the ones already there.
  const existing = await Offer.find({}, 'title order');
  const lowest = existing.length ? Math.min(...existing.map((o) => o.order || 0)) : 0;
  const titles = new Set(existing.map((o) => o.title));

  let added = 0;
  for (const [i, offer] of OFFERS.entries()) {
    if (titles.has(offer.title)) {
      console.log(`skip  ${offer.title} (already exists)`);
      continue;
    }
    console.log(`${apply ? 'add' : 'would add'}  ${offer.tag} · ${offer.title} · ${offer.description}`);
    if (apply) await Offer.create({ ...offer, isActive: true, order: lowest - OFFERS.length + i });
    added += 1;
  }
  console.log(`\n${added} offer(s) ${apply ? 'added' : 'would be added'}.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
