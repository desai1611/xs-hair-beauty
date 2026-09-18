import { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import ServiceCard from '../components/ServiceCard';
import Loader, { ErrorMessage } from '../components/Loader';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';
import { waLink } from '../config/salon';

export default function BeautyServices() {
  const { data: services, loading, error } = useFetch('/services?category=beauty');
  const { data: premiumServices, loading: premiumLoading, error: premiumError } = useFetch('/services?category=advanced');
  const { data: gallery } = useFetch('/gallery?page=advanced');
  const { data: siteContent } = useFetch('/site-content');
  const bridalImage = siteContent?.advanced_bridal_image?.value;
  const partyImage = siteContent?.advanced_party_image?.value;
  const [search, setSearch] = useState('');

  const filtered = (services || []).filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHeader
        eyebrow="Beauty & Advanced Treatments"
        title="Threading, waxing, facials & premium packages"
        subtitle="Clean, comfortable beauty treatments plus elevated facials, glow treatments, and bespoke bridal & party packages — all in one place."
      />

      {/* EVERYDAY BEAUTY SERVICES */}
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

      {/* CONSULTATION CTA */}
      <section className="pt-20 pb-4 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="rounded-3xl px-9 py-13 text-center text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-plum-900))' }}>
            <h2 className="text-white text-3xl mb-3">Not sure what's right for you?</h2>
            <p className="text-white/85 max-w-lg mx-auto mb-7">Book a free consultation and our specialists will design a treatment or package tailored to your skin and occasion.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/contact#booking-form" className="btn btn-light">Book a Free Consultation</Link>
              <a href={waLink('Hi! Can I book a free consultation?')} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>💬 Ask on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM SERVICES */}
      <section className="py-20 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center mb-11"><span className="eyebrow">Premium Services</span><h2 className="text-3xl">Advanced facials &amp; skin treatments</h2></div>
          {premiumLoading && <Loader label="Loading services..." />}
          {premiumError && <ErrorMessage message={premiumError} />}
          {!premiumLoading && !premiumError && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {(premiumServices || []).map((s) => <ServiceCard key={s._id} service={s} premium />)}
            </div>
          )}
        </div>
      </section>

      {/* BRIDAL */}
      <section className="py-20 bg-pink-50 px-6">
        <div className="max-w-[1180px] mx-auto grid lg:grid-cols-2 gap-11 items-center">
          <div className="rounded-3xl aspect-[4/3] overflow-hidden shadow-mid">
            {bridalImage ? (
              <img src={bridalImage} alt="Bridal package" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center text-white font-display text-xl p-5"
                style={{ background: 'linear-gradient(150deg, var(--color-pink-300), var(--color-pink-700))' }}>
                Bridal Photo<small className="block font-sans text-xs opacity-85 mt-2">Replace with real photography</small>
              </div>
            )}
          </div>
          <div>
            <span className="eyebrow">Bridal</span>
            <h2 className="text-3xl mb-3">Bridal Package</h2>
            <p className="text-text-light mb-6">A complete beauty experience for your big day — trial session, bridal hair styling, makeup, glow facial, and touch-ups for the bridal party.</p>
            <ul className="mb-6">
              {['Bridal hair styling & trial', 'Pre-wedding glow facial', 'Bridal party threading & grooming', 'On-the-day touch-up kit'].map((item, i, arr) => (
                <li key={item} className={`py-2 ${i < arr.length - 1 ? 'border-b border-dashed border-pink-200' : ''}`}>✔ {item}</li>
              ))}
            </ul>
            <a href={waLink('Hi! I would like to enquire about a bridal package.')} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Enquire About Bridal Packages</a>
          </div>
        </div>
      </section>

      {/* PARTY */}
      <section className="py-20 px-6">
        <div className="max-w-[1180px] mx-auto grid lg:grid-cols-2 gap-11 items-center">
          <div className="lg:order-2">
            <span className="eyebrow">Party &amp; Occasion</span>
            <h2 className="text-3xl mb-3">Party Package</h2>
            <p className="text-text-light mb-6">Get glam-ready for birthdays, graduations, and celebrations with a styling, glow facial, and threading combo designed to fit your schedule.</p>
            <ul className="mb-6">
              {['Event hair styling', 'Express glow facial', 'Brow & face threading touch-up'].map((item, i, arr) => (
                <li key={item} className={`py-2 ${i < arr.length - 1 ? 'border-b border-dashed border-pink-200' : ''}`}>✔ {item}</li>
              ))}
            </ul>
            <a href={waLink('Hi! I would like to enquire about a party package.')} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Enquire About Party Packages</a>
          </div>
          <div className="lg:order-1 rounded-3xl aspect-[4/3] overflow-hidden shadow-mid">
            {partyImage ? (
              <img src={partyImage} alt="Party package" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center text-white font-display text-xl p-5"
                style={{ background: 'linear-gradient(150deg, var(--color-gold), var(--color-pink-700))' }}>
                Party Look Photo<small className="block font-sans text-xs opacity-85 mt-2">Replace with real photography</small>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PREMIUM GALLERY */}
      <section className="py-20 bg-pink-50 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center mb-9"><span className="eyebrow">Inspiration</span><h2 className="text-3xl">Premium looks gallery</h2></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4.5">
            {(gallery && gallery.length > 0 ? gallery : [{ _id: 1, title: 'Bridal Glam' }, { _id: 2, title: 'Party Style' }, { _id: 3, title: 'Glow Facial' }, { _id: 4, title: 'Skin Treatment' }]).slice(0, 4).map((g, i) => (
              <div key={g._id || i} className="rounded-[10px] overflow-hidden aspect-square shadow-soft">
                <div className="w-full h-full flex items-center justify-center text-white text-[13px] text-center p-2"
                  style={{ background: 'linear-gradient(150deg, var(--color-gold), var(--color-pink-600))' }}>
                  {g.image ? <img src={g.image} alt={g.title} className="w-full h-full object-cover" /> : g.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand gold title="Plan your treatment" subtitle="Threading, waxing, a facial, or a bridal/party package — send us a message and we'll find a time that works." />
    </>
  );
}
