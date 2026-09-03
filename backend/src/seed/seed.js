/**
 * Populates the database with starter content matching the site's design brief.
 * Run with: npm run seed   (from the backend/ folder, after configuring .env)
 * Safe to re-run — it clears and re-inserts each collection.
 */
require('dotenv').config({ quiet: true });
const connectDB = require('../config/db');
const Service = require('../models/Service');
const Product = require('../models/Product');
const Review = require('../models/Review');
const GalleryImage = require('../models/GalleryImage');
const Offer = require('../models/Offer');
const Admin = require('../models/Admin');

const services = [
  // Hair
  { name: "Women's Haircut & Style", category: 'hair', description: 'Consultation, wash, precision cut and blow-dry finish.', price: 55, priceNote: 'From', order: 1 },
  { name: "Men's Haircut", category: 'hair', description: 'Sharp, tailored cuts with a wash and styling finish.', price: 35, priceNote: 'From', order: 2 },
  { name: 'Full Colour', category: 'hair', description: 'All-over colour using premium, low-damage formulas.', price: 120, priceNote: 'From', order: 3 },
  { name: 'Highlights & Balayage', category: 'hair', description: 'Hand-painted highlights for soft, natural dimension.', price: 150, priceNote: 'From', order: 4 },
  { name: 'Keratin Treatment', category: 'hair', description: 'Frizz-free, smooth hair that lasts for months.', price: 180, priceNote: 'From', order: 5 },
  { name: 'Nanoplastia', category: 'hair', description: 'Gentle, formaldehyde-free smoothing for silky results.', price: 220, priceNote: 'From', order: 6 },
  { name: 'Deep Conditioning Treatment', category: 'hair', description: 'Restorative mask treatment for dry or damaged hair.', price: 45, priceNote: 'From', order: 7 },
  { name: 'Blow Dry & Styling', category: 'hair', description: 'Event-ready styling, curls, or a polished blow-dry.', price: 40, priceNote: 'From', order: 8 },

  // Beauty
  { name: 'Eyebrow Threading', category: 'beauty', description: 'Precise, long-lasting brow shaping using traditional threading.', price: 12, priceNote: 'From', order: 1 },
  { name: 'Full Face Threading', category: 'beauty', description: 'Complete facial threading for a smooth, clean finish.', price: 25, priceNote: 'From', order: 2 },
  { name: 'Upper Lip Threading', category: 'beauty', description: 'Fast and gentle upper lip hair removal.', price: 8, priceNote: 'From', order: 3 },
  { name: 'Arms Waxing', category: 'beauty', description: 'Smooth, long-lasting hair removal for full or half arms.', price: 30, priceNote: 'From', order: 4 },
  { name: 'Legs Waxing', category: 'beauty', description: 'Full or half leg waxing using gentle, salon-grade wax.', price: 40, priceNote: 'From', order: 5 },
  { name: 'Basic Facial', category: 'beauty', description: 'Cleanse, exfoliate and hydrate for refreshed, glowing skin.', price: 55, priceNote: 'From', order: 6 },

  // Advanced
  { name: 'Advanced Anti-Ageing Facial', category: 'advanced', description: 'Targeted treatment to firm, brighten and smooth skin.', price: 110, priceNote: 'From', isFeatured: true, order: 1 },
  { name: 'Skin Glow Treatment', category: 'advanced', description: 'Deep hydration and radiance boost for special occasions.', price: 95, priceNote: 'From', isFeatured: true, order: 2 },
  { name: 'Deep Cleanse & Renewal Facial', category: 'advanced', description: 'Purifying facial designed for congested or dull skin.', price: 100, priceNote: 'From', order: 3 },
];

const products = [
  { name: 'Nourishing Argan Shampoo', category: 'Hair Care', description: 'Sulphate-free shampoo for dry and damaged hair.', price: 28, order: 1 },
  { name: 'Repair Conditioner', category: 'Hair Care', description: 'Deep conditioning treatment for silky, manageable hair.', price: 30, order: 2 },
  { name: 'Keratin Smoothing Serum', category: 'Hair Care', description: 'Lightweight serum for frizz control and shine.', price: 34, order: 3 },
  { name: 'Heat Protectant Spray', category: 'Styling', description: 'Protects hair from heat styling up to 220°C.', price: 24, order: 4 },
  { name: 'Curl Defining Cream', category: 'Styling', description: 'Defines curls while reducing frizz and flyaways.', price: 26, order: 5 },
  { name: 'Hydrating Face Mist', category: 'Skin Care', description: 'Refreshing facial mist for an instant glow.', price: 20, order: 6 },
];

const reviews = [
  { name: 'Priya S.', serviceLabel: 'Hair Colour Client', rating: 5, quote: 'Best salon in Glenfield! The team made me feel so comfortable and my hair has never looked better.', order: 1 },
  { name: 'Aroha M.', serviceLabel: 'Bridal Package', rating: 5, quote: 'Booked my bridal package here and everyone was blown away. So professional and friendly!', order: 2 },
  { name: 'Lily C.', serviceLabel: 'Beauty Services', rating: 5, quote: "Quick, clean, and affordable threading and waxing. It's my go-to spot now.", order: 3 },
  { name: 'Sarah K.', serviceLabel: 'Keratin Treatment', rating: 5, quote: 'Loved the keratin treatment — my hair feels so soft and manageable now. Highly recommend!', order: 4 },
  { name: 'Nisha R.', serviceLabel: 'Advanced Facial', rating: 5, quote: "The advanced facial left my skin glowing for my sister's wedding. Thank you XS Hair & Beauty!", order: 5 },
  { name: 'Mei T.', serviceLabel: 'Haircut & Style', rating: 4, quote: 'Great service and friendly staff. Booking was easy over WhatsApp. Will be back!', order: 6 },
];

const gallery = [
  { title: 'Balayage', page: 'hair', category: 'colour', type: 'single', image: '', order: 1 },
  { title: 'Bob Cut', page: 'hair', category: 'cuts', type: 'single', image: '', order: 2 },
  { title: 'Keratin Result', page: 'hair', category: 'treatments', type: 'single', image: '', order: 3 },
  { title: 'Full Colour', page: 'hair', category: 'colour', type: 'single', image: '', order: 4 },
  { title: 'Bridal Glam', page: 'advanced', category: 'bridal', type: 'single', image: '', order: 1 },
  { title: 'Party Style', page: 'advanced', category: 'party', type: 'single', image: '', order: 2 },
];

const offers = [
  { tag: 'New Client', title: '20% Off First Visit', description: 'Valid on any hair or beauty service for first-time guests.', order: 1 },
  { tag: 'Bridal', title: 'Bridal Party Package', description: 'Hair, makeup & glow treatments for the bride and her party.', order: 2 },
  { tag: 'This Month', title: 'Refer a Friend', description: 'You and your friend each get a discount on your next service.', order: 3 },
];

async function seed() {
  await connectDB();

  console.log('Clearing existing collections...');
  await Promise.all([
    Service.deleteMany({}),
    Product.deleteMany({}),
    Review.deleteMany({}),
    GalleryImage.deleteMany({}),
    Offer.deleteMany({}),
  ]);

  console.log('Inserting starter content...');
  await Service.insertMany(services);
  await Product.insertMany(products);
  await Review.insertMany(reviews);
  await GalleryImage.insertMany(gallery);
  await Offer.insertMany(offers);

  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@xshairandbeauty.co.nz').toLowerCase();
  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await Admin.hashPassword(process.env.SEED_ADMIN_PASSWORD || 'change-this-password');
    await Admin.create({
      name: process.env.SEED_ADMIN_NAME || 'Salon Admin',
      email: adminEmail,
      passwordHash,
      role: 'owner',
    });
    console.log(`Created admin account: ${adminEmail}`);
  } else {
    console.log(`Admin account already exists: ${adminEmail}`);
  }

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
