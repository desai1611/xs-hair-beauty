import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import ServiceCard from '../components/ServiceCard';
import Loader, { ErrorMessage } from '../components/Loader';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';

export default function BeautyServices() {
  const { data: services, loading, error } = useFetch('/services?category=beauty');
  const [search, setSearch] = useState('');

  const filtered = (services || []).filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHeader
        eyebrow="Beauty Services"
        title="Threading, waxing & gentle facials"
        subtitle="Clean, comfortable, and hygienic beauty treatments — quick appointments that fit around your day."
      />

      <section className="py-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="max-w-md mx-auto mb-11">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a service e.g. threading, waxing..."
              className="w-full rounded-full px-4.5 py-3.5 border-[1.5px] border-pink-200 bg-pink-50 text-sm outline-none focus:border-pink-500"
            />
          </div>
          {loading && <Loader label="Loading services..." />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((s) => <ServiceCard key={s._id} service={s} />)}
              {filtered.length === 0 && <p className="col-span-full text-center text-text-light">No services match your search.</p>}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-pink-50 px-6">
        <div className="max-w-[1180px] mx-auto grid sm:grid-cols-3 gap-7">
          {[
            { icon: '🧴', title: 'Fresh Tools, Every Time', desc: 'All threading and waxing tools are sanitised or single-use per client.' },
            { icon: '🌿', title: 'Gentle, Skin-Safe Products', desc: 'We use quality wax and skincare products suited to sensitive skin.' },
            { icon: '🕒', title: 'Quick Appointments', desc: 'Most beauty services take 10–30 minutes — easy to fit into your day.' },
          ].map((c) => (
            <div key={c.title} className="card text-center px-6.5 py-8.5">
              <div className="w-15.5 h-15.5 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-2xl mx-auto mb-4.5">{c.icon}</div>
              <h3 className="text-lg mb-2">{c.title}</h3>
              <p className="text-sm text-text-light mb-0">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBand title="Book your beauty appointment" subtitle="Threading, waxing or a facial — send us a message and we'll find a time that works." />
    </>
  );
}
