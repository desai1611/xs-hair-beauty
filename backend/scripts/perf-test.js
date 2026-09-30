/**
 * API response-time test.
 *
 * Calls each public GET endpoint RUNS times in a row, times each call in
 * milliseconds, and prints + saves max / average / min / standard deviation
 * per endpoint - the same pattern as the network-speed example in the
 * "Test Results Collection" guide (run 10-30 times, don't trust a single run).
 *
 * Usage:
 *   node scripts/perf-test.js --base http://localhost:5000/api --label local
 *   node scripts/perf-test.js --base https://xs-hair-beauty-production.up.railway.app/api --label production
 *
 * Read-only: every call is a GET. Safe to run against the live production API.
 * Writes results to scripts/results/<label>.json
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const getArg = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
};

const BASE = getArg('base', 'http://localhost:5000/api');
const LABEL = getArg('label', 'local');
const RUNS = Number(getArg('runs', 20));

const ENDPOINTS = [
  { name: 'Services', path: '/services' },
  { name: 'Products', path: '/products' },
  { name: 'Offers', path: '/offers' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Site Content', path: '/site-content' },
];

function stats(samples) {
  const n = samples.length;
  const max = Math.max(...samples);
  const min = Math.min(...samples);
  const avg = samples.reduce((a, b) => a + b, 0) / n;
  const variance = samples.reduce((a, b) => a + (b - avg) ** 2, 0) / n;
  const std = Math.sqrt(variance);
  return { max: round(max), avg: round(avg), min: round(min), std: round(std) };
}
const round = (v) => Math.round(v * 10) / 10;

async function timeOne(url) {
  const start = Date.now();
  const res = await fetch(url);
  await res.text(); // include body download time, not just headers
  const ms = Date.now() - start;
  return { ms, ok: res.ok, status: res.status };
}

async function run() {
  console.log(`\nAPI response-time test`);
  console.log(`Base URL : ${BASE}`);
  console.log(`Runs     : ${RUNS} per endpoint\n`);

  const results = {};
  for (const ep of ENDPOINTS) {
    const url = `${BASE}${ep.path}`;
    const samples = [];
    let failures = 0;
    process.stdout.write(`${ep.name.padEnd(14)} `);
    for (let i = 0; i < RUNS; i++) {
      try {
        const { ms, ok } = await timeOne(url);
        samples.push(ms);
        if (!ok) failures++;
        process.stdout.write('.');
      } catch (e) {
        failures++;
        process.stdout.write('x');
      }
    }
    const s = samples.length ? stats(samples) : { max: 0, avg: 0, min: 0, std: 0 };
    results[ep.name] = { ...s, samples, failures, runs: RUNS };
    console.log(`  max ${s.max}ms  avg ${s.avg}ms  min ${s.min}ms  std ${s.std}${failures ? `  (${failures} failed)` : ''}`);
  }

  console.log('\n--- Summary table (ms) ---');
  console.log('Endpoint'.padEnd(16) + 'Max'.padEnd(8) + 'Avg'.padEnd(8) + 'Min'.padEnd(8) + 'Std');
  for (const [name, r] of Object.entries(results)) {
    console.log(name.padEnd(16) + String(r.max).padEnd(8) + String(r.avg).padEnd(8) + String(r.min).padEnd(8) + String(r.std));
  }

  const outDir = path.join(__dirname, 'results');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${LABEL}.json`);
  fs.writeFileSync(outFile, JSON.stringify({ label: LABEL, base: BASE, runs: RUNS, at: new Date().toISOString(), results }, null, 2));
  console.log(`\nSaved: ${outFile}`);
}

run().catch((e) => {
  console.error('Test run failed:', e.message);
  process.exit(1);
});
