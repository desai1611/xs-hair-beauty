import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/offers', label: 'Offers' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/media', label: 'Site Media' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-pink-50">
      <aside className="w-64 bg-plum-900 text-white flex-shrink-0 flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--color-pink-300), var(--color-pink-600))' }}>XS</span>
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-pink-600 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-5 border-t border-white/10">
          <p className="text-xs text-white/50 mb-1">Signed in as</p>
          <p className="text-sm font-semibold mb-3 truncate">{admin?.name || admin?.email}</p>
          <button onClick={logout} className="btn btn-outline btn-sm w-full justify-center" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
            Log Out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
