import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import Loader from '../../components/Loader';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/bookings'),
      api.get('/services/admin'),
      api.get('/products/admin'),
      api.get('/reviews/admin'),
      api.get('/gallery/admin'),
      api.get('/offers/admin'),
    ])
      .then(([bookings, services, products, reviews, gallery, offers]) => {
        setRecent(bookings.data.slice(0, 6));
        setStats({
          newBookings: bookings.data.filter((b) => b.status === 'new').length,
          totalBookings: bookings.data.length,
          services: services.data.length,
          products: products.data.length,
          reviews: reviews.data.length,
          gallery: gallery.data.length,
          offers: offers.data.length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  const cards = [
    { label: 'New Enquiries', value: stats.newBookings, to: '/admin/bookings', accent: true },
    { label: 'Total Bookings', value: stats.totalBookings, to: '/admin/bookings' },
    { label: 'Services', value: stats.services, to: '/admin/services' },
    { label: 'Products', value: stats.products, to: '/admin/products' },
    { label: 'Gallery Images', value: stats.gallery, to: '/admin/gallery' },
    { label: 'Active Offers', value: stats.offers, to: '/admin/offers' },
  ];

  return (
    <div>
      <h1 className="text-[26px] mb-1">Dashboard Overview</h1>
      <p className="mb-8">Welcome back — here's what's happening at XS Hair &amp; Beauty.</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className={`card px-6 py-6 block ${c.accent ? 'border-pink-500' : ''}`}>
            <span className="text-3xl font-display text-pink-700 block">{c.value}</span>
            <span className="text-sm text-text-light">{c.label}</span>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-[14px] border border-pink-100 shadow-soft">
        <div className="flex justify-between items-center px-6 py-4.5 border-b border-pink-100">
          <h2 className="text-lg mb-0">Recent Enquiries</h2>
          <Link to="/admin/bookings" className="text-xs font-semibold text-pink-700 hover:underline">View all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 py-8 text-center text-text-light">No enquiries yet.</p>
        ) : (
          <div className="divide-y divide-pink-50">
            {recent.map((b) => (
              <div key={b._id} className="px-6 py-4 flex justify-between items-center gap-4">
                <div>
                  <strong className="block text-sm">{b.name}</strong>
                  <span className="text-xs text-text-light">{b.service} · {new Date(b.createdAt).toLocaleDateString('en-NZ')}</span>
                </div>
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${
                  b.status === 'new' ? 'bg-pink-100 text-pink-700' : b.status === 'contacted' ? 'bg-gold-light text-gold' : 'bg-green-100 text-green-700'
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
