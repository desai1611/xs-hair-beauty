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
    <header className="sticky top-0 z-[100] bg-white/92 backdrop-blur-md border-b border-pink-100">
      <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between gap-4 py-4">
        <Link to="/" className="flex items-center flex-shrink-0 whitespace-nowrap" aria-label="XS Hair & Beauty — home">
          <img src={logo} alt="XS Hair & Beauty Salon — Your Look, Our Art" className="h-12 lg:h-14 w-auto object-contain" />
        </Link>

        <nav className={`nav-links ${open ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 flex-shrink-0
          fixed lg:static top-[68px] left-0 right-0 lg:top-auto bg-white lg:bg-transparent px-6 lg:px-0 py-5 lg:py-0 shadow-lg lg:shadow-none z-50`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-[14px] font-medium relative py-1.5 whitespace-nowrap ${isActive ? 'text-pink-700' : 'text-text'} hover:text-pink-700 transition-colors`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link to="/contact#booking-form" className="btn btn-primary btn-sm">Book Now</Link>
          <button
            className="lg:hidden flex flex-col gap-1.5 p-1.5"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="w-6 h-0.5 bg-plum-900 rounded-full" />
            <span className="w-6 h-0.5 bg-plum-900 rounded-full" />
            <span className="w-6 h-0.5 bg-plum-900 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
