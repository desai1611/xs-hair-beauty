export const SALON = {
  name: 'XS Hair & Beauty',
  phoneDisplay: import.meta.env.VITE_SALON_PHONE_DISPLAY || '0022 342 3964',
  phoneTel: import.meta.env.VITE_SALON_PHONE_TEL || '00223423964',
  whatsapp: import.meta.env.VITE_SALON_WHATSAPP || '223423964',
  address: import.meta.env.VITE_SALON_ADDRESS || '23 Chartwell Avenue, Glenfield, Auckland 0629, New Zealand',
  facebook: import.meta.env.VITE_SALON_FACEBOOK || 'https://www.facebook.com/profile.php?id=61580372792720',
};

export const waLink = (message = '') =>
  `https://wa.me/${SALON.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const telLink = () => `tel:${SALON.phoneTel}`;

export const mapsEmbedSrc = () =>
  `https://maps.google.com/maps?q=${encodeURIComponent(SALON.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

export const mapsDirectionsLink = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SALON.address)}`;
