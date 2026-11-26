// Replaces the sample testimonials with the real reviews in src/seed/real-reviews.json
// (taken from the salon's Fresha page and Google listing).
//
//   node src/seed/replace-reviews.js            -> dry run
//   node src/seed/replace-reviews.js --apply    -> writes the changes
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Review = require('../models/Review');
const data = require('./real-reviews.json');

async function main() {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Database: ${mongoose.connection.host}/${mongoose.connection.name}  (${apply ? 'APPLY' : 'dry run'})\n`);

  const current = await Review.find().sort({ order: 1 });
  console.log(`now ${current.length} reviews -> will have ${data.reviews.length}`);
  current.forEach((r) => console.log(`  removing: ${r.name} - "${r.quote.slice(0, 50)}..."`));

  if (apply) {
    await Review.deleteMany({});
    await Review.insertMany(data.reviews.map((r, i) => ({ ...r, order: i + 1, isPublished: true })));
  }
  console.log(apply ? '\nDone.' : '\nDry run only. Add --apply to write.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
