export const SALON = {
  name: 'XS Hair & Beauty',
  tagline: 'Your Look, Our Art',
  phoneDisplay: import.meta.env.VITE_SALON_PHONE_DISPLAY || '022 435 9610',
  phoneTel: import.meta.env.VITE_SALON_PHONE_TEL || '0224359610',
  whatsapp: import.meta.env.VITE_SALON_WHATSAPP || '64224359610',
  email: import.meta.env.VITE_SALON_EMAIL || 'xshairbeautysalon@gmail.com',
  address: import.meta.env.VITE_SALON_ADDRESS || '25 Chartwell Avenue, Glenfield, Auckland 0629, New Zealand',
  instagram: import.meta.env.VITE_SALON_INSTAGRAM || 'https://www.instagram.com/xs_hair_and_beauty',
  // Online booking with instant confirmation.
  booking: import.meta.env.VITE_SALON_BOOKING_URL || 'https://www.fresha.com/en-GB/a/xs-hair-and-beauty-salon-glenfield-marlborough-25-chartwell-avenue-ph4azzhq',
  facebook: import.meta.env.VITE_SALON_FACEBOOK || 'https://www.facebook.com/profile.php?id=61580372792720',
};

export const waLink = (message = '') =>
  `https://wa.me/${SALON.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const telLink = () => `tel:${SALON.phoneTel}`;

export const mapsEmbedSrc = () =>
  `https://maps.google.com/maps?q=${encodeURIComponent(SALON.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

export const mapsDirectionsLink = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SALON.address)}`;

// Used when the owner hasn't edited opening hours in the admin dashboard.
export const DEFAULT_HOURS = [
  'Monday: Closed',
  'Tuesday: 9:30 AM – 6:00 PM',
  'Wednesday: 9:30 AM – 6:00 PM',
  'Thursday: 9:30 AM – 6:00 PM',
  'Friday: 9:30 AM – 6:00 PM',
  'Saturday: 9:30 AM – 6:00 PM',
  'Sunday: 10:00 AM – 6:00 PM',
];

// Public numbers from the salon's Fresha page (checked November 2026). Update when they change.
// Public figures from the salon's Fresha and Google listings (checked 26 Nov 2026).
export const FRESHA_STATS = {
  rating: '4.8',
  reviews: 138,
  services: 66,
  stars: { 5: 122, 4: 12, 3: 3, 2: 1, 1: 0 },
};
export const GOOGLE_STATS = {
  rating: '4.6',
  reviews: 176,
  url: 'https://www.google.com/maps/search/?api=1&query=Xs+Hair+%26+Beauty-Glenfield+25+Chartwell+Avenue+Glenfield+Auckland',
};
