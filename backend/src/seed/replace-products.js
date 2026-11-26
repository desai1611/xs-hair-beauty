// Replaces the sample products with the real products from the salon's shelves
// (src/seed/real-products.json). Prices are left blank - customers enquire for them.
//
//   node src/seed/replace-products.js            -> dry run
//   node src/seed/replace-products.js --apply    -> writes the changes
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const data = require('./real-products.json');

async function main() {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Database: ${mongoose.connection.host}/${mongoose.connection.name}  (${apply ? 'APPLY' : 'dry run'})\n`);

  const current = await Product.find().sort({ order: 1 });
  console.log(`now ${current.length} products -> will have ${data.products.length}`);
  current.forEach((p) => console.log(`  removing: ${p.name}`));

  if (apply) {
    await Product.deleteMany({});
    await Product.insertMany(data.products.map((p, i) => ({ ...p, price: null, inStock: true, isActive: true, order: i + 1 })));
  }
  console.log(apply ? '\nDone.' : '\nDry run only. Add --apply to write.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
