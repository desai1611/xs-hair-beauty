// Works out "Open now" / "Closed" from the opening-hours lines the owner edits
// in the admin dashboard (one line per day, e.g. "Tuesday: 9:30 AM – 6:00 PM").
// Times are read in Auckland time, whatever time zone the visitor is in.
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME = String.raw`(\d{1,2})(?::(\d{2}))?\s*(am|pm)`;
const LINE_RE = new RegExp(String.raw`^\s*([a-z]+)\s*:\s*(?:(closed)|${TIME}\s*[–—-]\s*${TIME})\s*$`, 'i');

function toMinutes(h, m, ap) {
  let hour = Number(h) % 12;
  if (ap.toLowerCase() === 'pm') hour += 12;
  return hour * 60 + Number(m || 0);
}

function fmt(mins) {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const ap = h24 >= 12 ? 'PM' : 'AM';
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
}

export function parseHours(lines) {
  const week = {};
  for (const line of lines) {
    const m = LINE_RE.exec(line);
    if (!m) continue;
    const day = DAYS.find((d) => d.toLowerCase() === m[1].toLowerCase());
    if (!day) continue;
    week[day] = m[2] ? null : { open: toMinutes(m[3], m[4], m[5]), close: toMinutes(m[6], m[7], m[8]) };
  }
  return week;
}

function aucklandNow(now) {
  const parts = new Intl.DateTimeFormat('en-NZ', {
    timeZone: 'Pacific/Auckland', weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: false,
  }).formatToParts(now);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return { day: get('weekday'), minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')) };
}

// Returns { open, text } or null when the hours can't be understood.
export function openStatus(lines, now = new Date()) {
  const week = parseHours(lines || []);
  if (Object.keys(week).length === 0) return null;

  const { day, minutes } = aucklandNow(now);
  const today = week[day];
  if (today && minutes >= today.open && minutes < today.close) {
    return { open: true, text: `Open now · until ${fmt(today.close)}` };
  }
  if (today && minutes < today.open) {
    return { open: false, text: `Closed · opens today ${fmt(today.open)}` };
  }
  const start = DAYS.indexOf(day);
  for (let i = 1; i <= 7; i += 1) {
    const next = DAYS[(start + i) % 7];
    if (week[next]) return { open: false, text: `Closed · opens ${next.slice(0, 3)} ${fmt(week[next].open)}` };
  }
  return { open: false, text: 'Closed' };
}
