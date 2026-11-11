import { Link } from 'react-router-dom';
import { waLink, telLink } from '../config/salon';

// Phone-only bar pinned to the bottom: the three things a visitor most wants
// to do (call, WhatsApp, book) are always one tap away.
export default function MobileActionBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="sm:hidden fixed bottom-3 left-3 right-3 z-[190] bg-plum-900 rounded-full p-1.5 flex gap-1.5 shadow-lg"
    >
      <a href={telLink()} className="flex-1 text-center rounded-full bg-lime text-plum-900 font-bold text-[13px] py-3">
        📞 Call
      </a>
      <a
        href={waLink("Hi! I'd like to ask about your services.")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 text-center rounded-full bg-white text-plum-900 font-bold text-[13px] py-3"
      >
        💬 WhatsApp
      </a>
      <Link to="/contact#booking-form" className="flex-1 text-center rounded-full bg-pink-500 text-plum-900 font-bold text-[13px] py-3">
        Book
      </Link>
    </nav>
  );
}
