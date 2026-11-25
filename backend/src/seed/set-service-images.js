// Points each service at a treatment photo that ships with the website
// (frontend/public/images/services/). Because the photos live in the frontend,
// they survive server rebuilds, unlike files uploaded to the server's disk.
//
//   node src/seed/set-service-images.js            -> dry run, shows what would change
//   node src/seed/set-service-images.js --apply    -> writes the changes
//
// The admin dashboard can still replace any of these with an uploaded photo.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Service = require('../models/Service');

const IMAGES = {
  "Women's Haircut & Style": 'womens-haircut',
  "Men's Haircut": 'mens-haircut',
  'Full Colour': 'full-colour',
  'Highlights & Balayage': 'balayage',
  'Keratin Treatment': 'keratin',
  Nanoplastia: 'nanoplastia',
  'Deep Conditioning Treatment': 'deep-conditioning',
  'Blow Dry & Styling': 'blow-dry',
  'Eyebrow Threading': 'eyebrow-threading',
  'Full Face Threading': 'face-threading',
  'Upper Lip Threading': 'lip-threading',
  'Arms Waxing': 'arms-waxing',
  'Legs Waxing': 'legs-waxing',
  'Basic Facial': 'basic-facial',
  'Advanced Anti-Ageing Facial': 'anti-ageing-facial',
  'Skin Glow Treatment': 'skin-glow',
  'Deep Cleanse & Renewal Facial': 'deep-cleanse',
};

async function main() {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Database: ${mongoose.connection.host}/${mongoose.connection.name}  (${apply ? 'APPLY' : 'dry run'})\n`);

  const services = await Service.find();
  let changed = 0;
  for (const s of services) {
    const slug = IMAGES[s.name];
    if (!slug) {
      console.log(`skip   ${s.name} (no photo mapped)`);
      continue;
    }
    const next = `/images/services/${slug}.jpg`;
    if (s.image === next) continue;
    console.log(`${apply ? 'update' : 'would update'}  ${s.name}\n         was: ${s.image || '(none)'}\n         now: ${next}`);
    if (apply) {
      s.image = next;
      await s.save();
    }
    changed += 1;
  }
  console.log(`\n${changed} service(s) ${apply ? 'updated' : 'would change'}.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
