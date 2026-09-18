import { Link } from 'react-router-dom';
import { SALON, waLink, telLink } from '../config/salon';

export default function Footer() {
  return (
    <footer className="bg-plum-900 text-white/75 pt-15 pb-6 mt-0">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="w-9 h-9 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--color-pink-300), var(--color-pink-600))' }}>XS</span>
              <span className="font-display text-xl font-bold text-white">XS Hair &amp; Beauty</span>
            </div>
            <p className="text-[11px] tracking-wide uppercase text-pink-300 font-semibold mb-3.5">{SALON.tagline}</p>
            <p className="text-white/60 text-sm">
              A modern hair &amp; beauty salon in Glenfield, Auckland — haircuts, colour, threading, waxing, facials, and bridal &amp; party packages.
            </p>
            <div className="flex gap-2.5 mt-5">
              <a href={SALON.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-pink-50/10 border border-white/20 flex items-center justify-center text-pink-300 hover:bg-pink-600 hover:text-white transition-colors">f</a>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-10 h-10 rounded-full bg-pink-50/10 border border-white/20 flex items-center justify-center text-pink-300 hover:bg-pink-600 hover:text-white transition-colors">w</a>
            </div>
          </div>

          <div>
            <h4 className="text-white text-[15px] font-semibold mb-4.5">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/hair-services" className="hover:text-pink-300 transition-colors">Hair Services</Link></li>
              <li><Link to="/beauty-services" className="hover:text-pink-300 transition-colors">Beauty Services</Link></li>
              <li><Link to="/products" className="hover:text-pink-300 transition-colors">Products</Link></li>
              <li><Link to="/reviews" className="hover:text-pink-300 transition-colors">Reviews</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-[15px] font-semibold mb-4.5">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-pink-300 transition-colors">Home</Link></li>
              <li><Link to="/contact" className="hover:text-pink-300 transition-colors">Contact</Link></li>
              <li><Link to="/contact#booking-form" className="hover:text-pink-300 transition-colors">Book Now</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-pink-300 transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/admin/login" className="hover:text-pink-300 transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-[15px] font-semibold mb-4.5">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li>{SALON.address}</li>
              <li><a href={telLink()} className="hover:text-pink-300 transition-colors">{SALON.phoneDisplay}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 text-[13px]">
          <span>© {new Date().getFullYear()} XS Hair &amp; Beauty. All rights reserved.</span>
          <span>Site by Dhruvraj Desai — <a href="mailto:dhruvraj.d1611@gmail.com" className="text-pink-300">Get in touch</a></span>
        </div>
      </div>
    </footer>
  );
}
