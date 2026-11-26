/**
 * Resets an admin's password to a NEW RANDOM password and prints it once.
 * Nothing is stored in a file or in the code — copy the password from the screen and keep it safe.
 *
 *   node src/seed/reset-admin-password.js                 -> resets the only admin (or lists them if there are several)
 *   node src/seed/reset-admin-password.js admin@site.com  -> resets that admin
 *
 * Run it where the live database is reachable (Railway service -> Console).
 */
require('dotenv').config({ quiet: true });
const crypto = require('crypto');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

// no look-alike characters (0/O, 1/l/I) so it is easy to read and type
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

function makePassword(length = 16) {
  let out = '';
  for (let i = 0; i < length; i++) out += ALPHABET[crypto.randomInt(ALPHABET.length)];
  return out;
}

async function main() {
  const wanted = (process.argv[2] || '').trim().toLowerCase();
  await mongoose.connect(process.env.MONGO_URI);

  const admins = await Admin.find().select('name email role');
  if (admins.length === 0) {
    console.log('There are no admin accounts in this database. Run the seed script to create one.');
    return;
  }

  let admin;
  if (wanted) {
    admin = admins.find((a) => a.email === wanted);
    if (!admin) {
      console.log(`No admin with the email ${wanted}. Admins in this database:`);
    }
  } else if (admins.length === 1) {
    admin = admins[0];
  } else {
    console.log('There is more than one admin. Run again with the email of the one to reset:');
  }
  if (!admin) {
    admins.forEach((a) => console.log(`  ${a.email}  (${a.name}, ${a.role})`));
    return;
  }

  const password = makePassword();
  const passwordHash = await Admin.hashPassword(password);
  await Admin.updateOne({ _id: admin._id }, { passwordHash });

  console.log('');
  console.log('Admin password reset.');
  console.log(`  Login email:  ${admin.email}`);
  console.log(`  New password: ${password}`);
  console.log('');
  console.log('Copy it now — it will not be shown again. Then clear this screen.');
}

main()
  .catch((err) => {
    console.error('Failed to reset admin password:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
