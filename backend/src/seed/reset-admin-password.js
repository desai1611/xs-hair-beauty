/**
 * Sets a new password for an admin account.
 *
 *   node src/seed/reset-admin-password.js                  -> asks you to type a new password (hidden)
 *   node src/seed/reset-admin-password.js admin@site.com   -> same, for that admin
 *   node src/seed/reset-admin-password.js --random         -> makes a strong random password and prints it once
 *
 * With no email it uses the only admin, or lists them if there are several.
 * The password you type is never shown, stored in a file, or put in the code - only a secure
 * hash of it is saved in the database. Run it where the live database is reachable
 * (Railway service -> Console).
 */
require('dotenv').config({ quiet: true });
const fs = require('fs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const MIN_LENGTH = 10;
// no look-alike characters (0/O, 1/l/I) so a random password is easy to read and type
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

function randomPassword(length = 16) {
  let out = '';
  for (let i = 0; i < length; i++) out += ALPHABET[crypto.randomInt(ALPHABET.length)];
  return out;
}

// Reads a line from the keyboard without showing what is typed (like a normal password prompt).
// If input is piped in (not a keyboard), it reads the next line from that instead.
let pipedLines = null;
function readSecret(label) {
  if (!process.stdin.isTTY) {
    if (pipedLines === null) pipedLines = fs.readFileSync(0, 'utf8').split(/\r?\n/);
    process.stdout.write(`${label}\n`);
    return Promise.resolve(pipedLines.shift() || '');
  }
  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(label);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    let typed = '';
    const finish = () => {
      stdin.removeListener('data', onData);
      stdin.setRawMode(false);
      stdin.pause();
      process.stdout.write('\n');
    };
    function onData(chunk) {
      for (const ch of chunk) {
        if (ch === '\r' || ch === '\n') {
          finish();
          return resolve(typed);
        }
        if (ch === '\u0003') {
          finish();
          process.exit(130); // Ctrl+C
        }
        if (ch === '\u007f' || ch === '\b') typed = typed.slice(0, -1);
        else typed += ch;
      }
    }
    stdin.on('data', onData);
  });
}

async function chooseOwnPassword() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const first = await readSecret(`New password (at least ${MIN_LENGTH} characters): `);
    if (first.length < MIN_LENGTH) {
      console.log(`That is too short - use at least ${MIN_LENGTH} characters (a few words together works well).`);
      continue;
    }
    const second = await readSecret('Type it again to confirm: ');
    if (first !== second) {
      console.log('The two did not match. Try again.');
      continue;
    }
    return first;
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const useRandom = args.includes('--random');
  const wanted = (args.find((a) => !a.startsWith('--')) || '').trim().toLowerCase();

  await mongoose.connect(process.env.MONGO_URI);

  const admins = await Admin.find().select('name email role');
  if (admins.length === 0) {
    console.log('There are no admin accounts in this database. Run the seed script to create one.');
    return;
  }

  let admin;
  if (wanted) {
    admin = admins.find((a) => a.email === wanted);
    if (!admin) console.log(`No admin with the email ${wanted}. Admins in this database:`);
  } else if (admins.length === 1) {
    admin = admins[0];
  } else {
    console.log('There is more than one admin. Run again with the email of the one to change:');
  }
  if (!admin) {
    admins.forEach((a) => console.log(`  ${a.email}  (${a.name}, ${a.role})`));
    return;
  }

  console.log(`Changing the password for ${admin.email}`);
  const password = useRandom ? randomPassword() : await chooseOwnPassword();
  if (!password) {
    console.log('No password was set. Run the command again to retry.');
    process.exitCode = 1;
    return;
  }

  await Admin.updateOne({ _id: admin._id }, { passwordHash: await Admin.hashPassword(password) });

  console.log('');
  console.log('Admin password changed.');
  console.log(`  Login email: ${admin.email}`);
  if (useRandom) {
    console.log(`  New password: ${password}`);
    console.log('Copy it now - it will not be shown again. Then clear this screen.');
  } else {
    console.log('  Use the password you just typed. It was not displayed or saved anywhere except as a secure hash.');
  }
}

main()
  .catch((err) => {
    console.error('Failed to change admin password:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
