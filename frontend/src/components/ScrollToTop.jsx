import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// The browser's own scroll restoration actively fights a manual reset on
// client-side navigations (it tries to preserve/restore per-history-entry
// scroll position), so this has to be disabled once for our own logic below
// to have any effect.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// Scrolls to the top of the page on every route change, so clicking a nav
// link always lands at the top instead of keeping the previous scroll
// position. If the URL has a hash (e.g. /contact#booking-form), scrolls to
// that element instead.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // `scrollIntoView({ behavior: 'smooth' })` was unreliable here for the
      // same reason plain `window.scrollTo` was: it animates, and gets
      // interrupted/fought as the rest of the page finishes laying out — so
      // this uses an instant `window.scrollTo` computed from the element's
      // position instead. By the time this effect runs, React has already
      // committed the destination page's DOM, so the element is present.
      const el = document.getElementById(hash.slice(1));
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 16;
        window.scrollTo({ top, left: 0, behavior: 'instant' });
      }
      return;
    }
    // behavior: 'instant' bypasses the global CSS `scroll-behavior: smooth`
    // so the jump happens in one frame instead of an animation that can get
    // visibly fought/interrupted by scroll-anchoring as the new page's
    // content finishes laying out.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
