/**
 * One-off helper: resets the seeded admin's password to SEED_ADMIN_PASSWORD from .env.
 * Usage: node src/seed/reset-admin-password.js
 */
require('dotenv').config({ quiet: true });
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

async function run() {
  await connectDB();
  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@xshairandbeauty.co.nz').toLowerCase();
  const newPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!newPassword) throw new Error('SEED_ADMIN_PASSWORD is not set in .env');

  const passwordHash = await Admin.hashPassword(newPassword);
  const result = await Admin.findOneAndUpdate({ email }, { passwordHash }, { returnDocument: 'after' });

  if (!result) {
    console.log(`No admin found for ${email} — nothing updated.`);
  } else {
    console.log(`Password updated for ${email}.`);
  }
  process.exit(0);
}

run().catch((err) => {
  console.error('Failed to reset admin password:', err);
  process.exit(1);
});
