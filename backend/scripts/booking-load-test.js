/**
 * Booking-submission test — LOCAL ONLY.
 *
 * Submits RUNS test enquiries to POST /api/bookings, records response time
 * and success/failure for each one, prints max/avg/min/std, then deletes
 * every test booking it created so the local database is left clean.
 *
 * Never point this at the production API — it writes data, and the
 * bookingLimiter middleware will also block repeated calls there.
 *
 * Usage: node scripts/booking-load-test.js --runs 20
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('../src/models/Booking');

const args = process.argv.slice(2);
const getArg = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
};
const BASE = getArg('base', 'http://localhost:5000/api');
const RUNS = Number(getArg('runs', 20));
const MARKER = 'PerfTest_' + Date.now();

const round = (v) => Math.round(v * 10) / 10;
function stats(samples) {
  const n = samples.length;
  const max = Math.max(...samples);
  const min = Math.min(...samples);
  const avg = samples.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(samples.reduce((a, b) => a + (b - avg) ** 2, 0) / n);
  return { max: round(max), avg: round(avg), min: round(min), std: round(std) };
}

async function run() {
  console.log(`\nBooking-submission test (LOCAL)`);
  console.log(`Base URL : ${BASE}`);
  console.log(`Runs     : ${RUNS}\n`);

  const samples = [];
  let ok = 0, failed = 0;
  process.stdout.write('Enquiries      ');
  for (let i = 0; i < RUNS; i++) {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${MARKER}_${i}`,
          phone: '0000000000',
          email: `perftest${i}@example.com`,
          service: 'Test enquiry',
          message: 'Automated performance test — safe to ignore/delete.',
        }),
      });
      const ms = Date.now() - start;
      samples.push(ms);
      if (res.ok) { ok++; process.stdout.write('.'); } else { failed++; process.stdout.write('x'); }
    } catch (e) {
      failed++;
      process.stdout.write('x');
    }
  }
  const s = samples.length ? stats(samples) : { max: 0, avg: 0, min: 0, std: 0 };
  console.log(`\n\nResult: ${ok}/${RUNS} succeeded, ${failed} failed`);
  console.log(`Response time (ms):  max ${s.max}  avg ${s.avg}  min ${s.min}  std ${s.std}`);

  // Clean up: remove every booking this test run created.
  await mongoose.connect(process.env.MONGO_URI);
  const del = await Booking.deleteMany({ name: { $regex: `^${MARKER}` } });
  console.log(`\nCleanup: removed ${del.deletedCount} test bookings from the local database.`);
  await mongoose.disconnect();

  const outDir = path.join(__dirname, 'results');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'booking.json'), JSON.stringify({ base: BASE, runs: RUNS, ok, failed, samples, ...s, at: new Date().toISOString() }, null, 2));
}

run().catch((e) => {
  console.error('Booking load test failed:', e.message);
  process.exit(1);
});
