import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE = 'XS Hair & Beauty';

// One title + description per public page, so each page shows its own name in the
// browser tab and in Google/Bing results. Add new public pages here.
const PAGES = {
  '/': {
    title: `${SITE} | Hair & Beauty Salon in Glenfield, Auckland`,
    description:
      'XS Hair & Beauty in Glenfield, Auckland: nanoplastia, keratin straightening, haircuts, colour, threading, waxing and facials. Book online or call 022 342 3964.',
  },
  '/hair-services': {
    title: `Hair Services & Prices | ${SITE}, Glenfield`,
    description:
      'Haircuts, colour, balayage, keratin, Brazilian keratin and nanoplastia in Glenfield, Auckland. See every hair service with its price and how long it takes, then book online.',
  },
  '/beauty-services': {
    title: `Beauty Services & Prices | ${SITE}, Glenfield`,
    description:
      'Threading, waxing, facials and more in Glenfield, Auckland. See prices and durations for every beauty service. Bridal and party packages on request.',
  },
  '/products': {
    title: `Hair Care Products | ${SITE}, Glenfield`,
    description:
      'Hair care products available in the salon, including shampoos, conditioners, masks, treatments and a professional straightener. Message us for prices and availability.',
  },
  '/reviews': {
    title: `Client Reviews | ${SITE}, Glenfield`,
    description:
      'Rated 4.8 on Fresha and 4.6 on Google. Read real reviews from XS Hair & Beauty clients in Glenfield, Auckland.',
  },
  '/contact': {
    title: `Contact & Opening Hours | ${SITE}, Glenfield`,
    description:
      'Find us at 25 Chartwell Avenue, Glenfield, Auckland. Open Tuesday to Sunday. Call 022 342 3964, message us on WhatsApp or send an enquiry.',
  },
  '/terms-and-conditions': {
    title: `Terms & Conditions | ${SITE}`,
    description: 'Booking, cancellation and service terms for XS Hair & Beauty, Glenfield, Auckland.',
  },
};

const NOT_FOUND = {
  title: `Page not found | ${SITE}`,
  description: 'This page could not be found. Head back to the XS Hair & Beauty homepage.',
};

function setDescription(text) {
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', 'description');
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', text);
}

export default function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    // the admin area keeps its own simple title and is not meant for search engines
    if (pathname.startsWith('/admin')) {
      document.title = `Admin | ${SITE}`;
      return;
    }
    const key = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    const meta = PAGES[key] || NOT_FOUND;
    document.title = meta.title;
    setDescription(meta.description);
  }, [pathname]);

  return null;
}
