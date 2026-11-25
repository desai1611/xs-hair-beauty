// Hides three offers that came from the original project seed and are not
// advertised on the salon's Instagram: no price, and nobody has confirmed the
// salon really runs them. Hidden (isActive: false), not deleted, so the owner can
// switch any of them back on in the admin dashboard (Offers).
//
//   node src/seed/hide-unverified-offers.js            -> dry run
//   node src/seed/hide-unverified-offers.js --apply    -> hides them
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Offer = require('../models/Offer');

const TITLES = ['20% Off First Visit', 'Bridal Party Package', 'Refer a Friend'];

async function main() {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Database: ${mongoose.connection.host}/${mongoose.connection.name}  (${apply ? 'APPLY' : 'dry run'})\n`);

  const offers = await Offer.find({ title: { $in: TITLES }, isActive: true });
  for (const o of offers) console.log(`${apply ? 'hide' : 'would hide'}  ${o.tag} · ${o.title}`);
  if (apply && offers.length) await Offer.updateMany({ _id: { $in: offers.map((o) => o._id) } }, { isActive: false });
  console.log(`\n${offers.length} offer(s) ${apply ? 'hidden' : 'would be hidden'}.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
