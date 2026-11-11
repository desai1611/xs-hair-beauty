import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const links = [
  { to: '/', label: 'Home' },
  { to: '/hair-services', label: 'Hair Services' },
  { to: '/beauty-services', label: 'Beauty Services' },
  { to: '/products', label: 'Products' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100] px-3 sm:px-5 pt-3">
      <div className="max-w-[1240px] mx-auto relative">
        <div className="bg-white/90 backdrop-blur-md rounded-full border-[1.5px] border-plum-900/10 shadow-soft pl-5 pr-2.5 py-2 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center flex-shrink-0 whitespace-nowrap" aria-label="XS Hair & Beauty — home" onClick={() => setOpen(false)}>
            <img src={logo} alt="XS Hair & Beauty Salon — Your Look, Our Art" className="h-11 lg:h-12 w-auto object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `text-[14px] font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    isActive ? 'bg-plum-900 text-white' : 'text-plum-900 hover:bg-pink-100'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/contact#booking-form" className="btn btn-pink btn-sm">Book Now</Link>
            <button
              className="lg:hidden w-10 h-10 rounded-full bg-plum-900 flex flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={`w-5 h-0.5 bg-white rounded-full transition-transform ${open ? 'translate-y-[4px] rotate-45' : ''}`} />
              <span className={`w-5 h-0.5 bg-white rounded-full transition-transform ${open ? '-translate-y-[4px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden absolute left-0 right-0 top-[calc(100%+8px)] bg-white rounded-[28px] border-[1.5px] border-plum-900/10 shadow-lg p-3 flex flex-col" aria-label="Mobile">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-[16px] font-semibold px-5 py-3 rounded-full ${isActive ? 'bg-plum-900 text-white' : 'text-plum-900 hover:bg-pink-100'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
