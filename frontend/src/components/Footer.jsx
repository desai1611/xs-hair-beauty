import { Link } from 'react-router-dom';
import { SALON, waLink, telLink } from '../config/salon';

const linkCls = 'inline-block py-1.5 sm:py-0 hover:text-lime transition-colors';
const iconCls =
  'w-10 h-10 rounded-full border-2 border-white/25 flex items-center justify-center text-white font-bold hover:bg-lime hover:text-plum-900 hover:border-lime transition-colors';

export default function Footer() {
  return (
    <footer className="px-3 sm:px-5 pb-4">
      <div className="tile max-w-[1240px] mx-auto bg-plum-900 text-white/75 px-7 sm:px-12 pt-14 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          <div>
            <img src="/brand/logo-for-dark-sm.png" alt="XS Hair & Beauty Salon — Your Look, Our Art" className="h-24 w-auto mb-4 -ml-2" loading="lazy" />
            <p className="text-white/60 text-sm">
              A modern hair &amp; beauty salon in Glenfield, Auckland — haircuts, colour, threading, waxing, facials, and bridal &amp; party packages.
            </p>
            <div className="flex gap-2.5 mt-5">
              <a href={SALON.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={iconCls}>f</a>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={iconCls}>w</a>
            </div>
          </div>

          <div>
            <h4 className="text-white text-[16px] mb-4">Explore</h4>
            <ul className="space-y-0.5 sm:space-y-2.5 text-sm">
              <li><Link to="/hair-services" className={linkCls}>Hair Services</Link></li>
              <li><Link to="/beauty-services" className={linkCls}>Beauty Services</Link></li>
              <li><Link to="/products" className={linkCls}>Products</Link></li>
              <li><Link to="/reviews" className={linkCls}>Reviews</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-[16px] mb-4">Company</h4>
            <ul className="space-y-0.5 sm:space-y-2.5 text-sm">
              <li><Link to="/" className={linkCls}>Home</Link></li>
              <li><Link to="/contact" className={linkCls}>Contact</Link></li>
              <li><a href={SALON.booking} target="_blank" rel="noopener noreferrer" className={linkCls}>Book Online</a></li>
              <li><Link to="/terms-and-conditions" className={linkCls}>Terms &amp; Conditions</Link></li>
              <li><Link to="/admin/login" className={linkCls}>Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-[16px] mb-4">Contact</h4>
            <ul className="space-y-0.5 sm:space-y-2.5 text-sm">
              <li>{SALON.address}</li>
              <li><a href={telLink()} className={linkCls}>{SALON.phoneDisplay}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 text-[13px]">
          <span>© {new Date().getFullYear()} XS Hair &amp; Beauty. All rights reserved.</span>
          <span>Site by Dhruvraj Desai — <a href="mailto:dhruvraj.d1611@gmail.com" className="text-lime inline-block py-2">Get in touch</a></span>
        </div>
      </div>
    </footer>
  );
}
