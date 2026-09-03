import { useEffect, useState } from 'react';
import api, { extractErrorMessage } from '../../api/client';
import Loader, { ErrorMessage } from '../../components/Loader';

const statusStyles = {
  new: 'bg-pink-100 text-pink-700',
  contacted: 'bg-gold-light text-gold',
  completed: 'bg-green-100 text-green-700',
};

export default function BookingsPanel() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    setUpdatingId(id);
    try {
      const res = await api.patch(`/bookings/${id}`, { status });
      setBookings((prev) => prev.map((b) => (b._id === id ? res.data : b)));
    } catch (err) {
      alert(extractErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(extractErrorMessage(err));
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-7">
        <div>
          <h1 className="text-[26px] mb-1">Bookings &amp; Enquiries</h1>
          <p className="mb-0">Submissions from the website contact form, with email notifications sent automatically.</p>
        </div>
        <div className="flex gap-2">
          {['all', 'new', 'contacted', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold capitalize border ${
                filter === f ? 'bg-pink-600 border-pink-600 text-white' : 'bg-white border-pink-200 text-text'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading && <Loader label="Loading bookings..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="bg-white rounded-[14px] border border-pink-100 px-6 py-10 text-center text-text-light">No enquiries in this filter.</div>
          )}
          {filtered.map((b) => (
            <div key={b._id} className="bg-white rounded-[14px] border border-pink-100 shadow-soft p-6">
              <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                <div>
                  <strong className="block text-base">{b.name}</strong>
                  <span className="text-xs text-text-light">{new Date(b.createdAt).toLocaleString('en-NZ')} {b.emailSent ? '· ✅ email sent' : '· ⚠️ email not sent'}</span>
                </div>
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${statusStyles[b.status]}`}>{b.status}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mb-3">
                <p className="mb-0"><strong>Phone:</strong> <a href={`tel:${b.phone}`} className="text-pink-700">{b.phone}</a></p>
                <p className="mb-0"><strong>Email:</strong> <a href={`mailto:${b.email}`} className="text-pink-700">{b.email}</a></p>
                <p className="mb-0"><strong>Service:</strong> {b.service}</p>
              </div>
              {b.message && <p className="text-sm text-text-light bg-pink-50 rounded-lg px-4 py-3 mb-3">{b.message}</p>}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-text-light mr-1">Mark as:</span>
                {['new', 'contacted', 'completed'].map((s) => (
                  <button
                    key={s}
                    disabled={updatingId === b._id || b.status === s}
                    onClick={() => updateStatus(b._id, s)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border border-pink-200 disabled:opacity-40 hover:border-pink-500 capitalize"
                  >
                    {s}
                  </button>
                ))}
                <button onClick={() => remove(b._id)} className="text-xs font-semibold text-red-500 ml-auto hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
