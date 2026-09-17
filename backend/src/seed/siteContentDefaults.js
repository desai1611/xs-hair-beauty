// The fixed set of editable media slots on the public site that aren't
// tied to a Service/Product/Gallery/Offer list — single hero images & video.
module.exports = [
  { key: 'home_hero_image', label: 'Home Page — Salon Interior Photo', type: 'image' },
  { key: 'hair_promo_video', label: 'Hair Page — Promo Video (YouTube link or direct .mp4 URL)', type: 'video' },
  { key: 'advanced_bridal_image', label: 'Advanced Beauty Page — Bridal Package Photo', type: 'image' },
  { key: 'advanced_party_image', label: 'Advanced Beauty Page — Party Package Photo', type: 'image' },
  {
    key: 'opening_hours',
    label: 'Contact Page — Opening Hours (one line per day)',
    type: 'text',
    defaultValue:
      'Monday: Closed\nTuesday: 9:30 AM – 6:00 PM\nWednesday: 9:30 AM – 6:00 PM\nThursday: 9:30 AM – 6:00 PM\nFriday: 9:30 AM – 6:00 PM\nSaturday: 9:30 AM – 6:00 PM\nSunday: 10:00 AM – 6:00 PM',
  },
];
